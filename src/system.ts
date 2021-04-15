import { db, changes$, Data, stamp } from '@internal';
import type { Entity } from "./entity";
import Main from "@app/main.svelte";
import $RefParser, { JSONSchema } from '@apidevtools/json-schema-ref-parser';
import Ajv from 'ajv';
import { Change } from 'rxdeep';
import { windowEndpoint, expose, proxy, wrap, Remote } from "comlink";
import { BehaviorSubject, Observable, Subject, Subscribable, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
const locals = {
    add(input, ...numbers) {
        return numbers.reduce((a, b) => a + b, input)
    },
    subtract(input, ...numbers) {
        return numbers.reduce((a, b) => a - b, input)
    },
    multiply(input, ...numbers) {
        return numbers.reduce((a, b) => a * b, input)
    },
    divide(input, ...numbers) {
        return numbers.reduce((a, b) => a / b, input)
    },
    then(input, thenValue, elseValue) {
        return input ? thenValue : elseValue
    },
    pluck(input, ...properties) {
        return properties.reduce((a, b) => a[b], input)
    },
    select(input, ...properties) {
        if (Array.isArray(input)) {
            return input.flatMap(value => locals.select.call(this, value, ...properties))
        } else {
            return properties.map(prop => input[prop])
        }
    },
    call(input, method: string, ...args: any[]) {
        input[method].call(input, ...args);
    },
    apply(input, method: string, args: any[]) {
        input[method].apply(input, args)
    },
    debug(input, message) {
        console.group(message, this, System, input);
        return input
    }
}
interface Event {
    event: string
    data
}
interface System {
    dispatch(event, data)
    broadcast(event, data)
}
const bc = new BroadcastChannel("valor");
export interface SystemInit {
    workers: [worker: (Worker | SharedWorker), key: string][]
    schemas: [url: string, key: string][]
}
type GEntity = new (record: Data, embed: Data) => Entity<Data, Data>
export interface SystemWorker {
    classes: Record<string, Remote<GEntity>>
    helpers: Record<string, Remote<(...args) => any>>
}
interface System { }
export const System = {
    db,
    changes$,
    ready$: new BehaviorSubject(false),
    bc: wrap<System>(bc),
    origin: window.origin,
    events$: new Subject<Event>(),
    validator: new Ajv({
        strict: false,
        coerceTypes: true,
        useDefaults: true
    }),
    $parser: new $RefParser(),
    workers: {} as Record<string, SystemWorker>,
    async addSchema(schema, key?: string) {
        try {
            const dereferenced = await System.$parser.bundle(schema);
            System.validator.addSchema(dereferenced, key);
        } catch (err) {
            console.log(`Failed to add schema ${key || ''}`, schema, err);
        }
    },
    async add(table, obj, key) {
        if (System.validate(obj)) {
            if (!obj.__meta__) obj.__meta__ = {};
            obj.__meta__.createdOn = Date.now();
            return await System.db.table(table).add(obj, key);
        }
    },
    async get(table, key) {
        return await System.db.table(table).get(key);
    },
    async update(table, key, data) {
        return await System.db.table(table).update(key, stamp(data));
    },
    async put(table, data, key?) {
        if (System.validate(data)) {
            return await System.db.table(table).put(data, key)
        }
    },
    async delete(table, id) {
        return await System.db.table(table).delete(id);
    },
    async getTable(table) {
        return await System.db.table(table).toArray();
    },
    addWorker(worker: Worker | SharedWorker, name: string,) {
        System.workers[name] = wrap(worker instanceof SharedWorker ? worker.port : worker) as unknown as SystemWorker;
    },
    getWorker(name: string): SystemWorker {
        return System.workers[name]
    },
    dispatch(event, data) {
        System.events$.next({
            event,
            data
        });
    },
    broadcast(event, data) {
        System.dispatch(event, data);
        System.bc.dispatch(event, data);
    },
    roll(formula, data = {}) {
        System.broadcast("roll", [formula, data]);
    },
    on(event: string, cb) {
        let sub: Subscription;
        if (event === "dbchanges") {
            sub = System.changes$.subscribe(changes => cb(changes));
        } else if (event === "events") {
            sub = System.events$.subscribe(e => cb(e));
        } else {
            sub = System.events$.pipe(
                filter(e => event === e.event),
            ).subscribe(e => cb(e));
        }
        return proxy(sub);
    },
    validate(data) {
        try {
            const type = data && data.type;
            const schema = this.validator.getSchema(type);
            const valid = typeof schema === "function" ? schema(data) === true : typeof type === "string";
            const errors = schema?.errors ?? [];
            if (!valid) console.log(errors, data);
            return {
                data,
                valid,
                errors
            }
        } catch (err) {
            console.error(err);
            return {
                data,
                valid: false,
                errors: err
            }
        }
    },
    expose() {
        if (window.parent !== window) {
            try {
                expose(System, bc);
                expose(System, windowEndpoint(window.parent));
            } catch (err) {

            }
        }
    },
    async init(params?: SystemInit) {
        new Main({
            target: document.body
        });
        if ('serviceWorker' in navigator) {
            window.addEventListener("load", async () => {
                const registration = await navigator.serviceWorker.register("./service-worker.js");
                console.log(registration);
            });
        }
        System.expose();
        for (const [url, key] of params?.schemas ?? []) {
            await System.addSchema(url, key)
        }
        for (const [worker, key] of params?.workers ?? []) {
            System.addWorker(worker, key)
        }
        System.ready$.next(true);
        window["system"] = System
    },
}
export function validateResource(change: Change<Data>) {
    const { valid, errors } = System.validate(change.value);
    if (valid) {
        change.value = stamp(change.value);
    } else {
        console.log(errors);
    };
    return valid
}