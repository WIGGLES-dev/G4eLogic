import { db, changes$, Data } from '@internal';
import Main from "@app/main.svelte";
import $RefParser, { JSONSchema } from '@apidevtools/json-schema-ref-parser';
import Ajv from 'ajv';
import { Change } from 'rxdeep';
import { windowEndpoint, expose, proxy, wrap, Remote } from "comlink";
import { Observable, Subject, Subscribable, Subscription } from "rxjs";
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
        console.group(message, this, input);
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
export const System = {
    db,
    changes$,
    bc: wrap<System>(bc),
    origin: window.origin,
    events$: new Subject<Event>(),
    validator: new Ajv({
        strict: false,
        coerceTypes: true,
        useDefaults: true
    }),
    $parser: new $RefParser(),
    workers: {} as Record<string, Remote<any>>,
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
            return await System.db.table(table).add(obj, key);
        }
    },
    async get(table, key) {
        return await System.db.table(table).get(key);
    },
    async update(table, key, data) {
        return await System.db.table(table).update(key, data);
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
    addWorker(name: string, src: string) {
        try {
            this.workers[name] = wrap(new SharedWorker(src).port)
        } catch (err) {
            try {
                this.workers[name] = wrap(new Worker(src))
            } catch (err) {

            }
        }
    },
    getWorker<T>(name: string) {
        return this.workers[name] as Remote<T>
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
            const valid = data && data.type && System.validator.validate(data.type, data)
            const errors = System.validator.getSchema(data.type).errors;
            if (!valid) console.log(errors, data);
            return {
                data,
                valid,
                errors
            }
        } catch (err) {
            return {
                data,
                valid: false,
                errors: err
            }
        }
    },
    expose() {
        if (window.parent !== window) {
            expose(System, bc);
            expose(System, windowEndpoint(window.parent));
        }
    },
    async init() {
        new Main({
            target: document.body
        });
    },
}
export function validateResource(change: Change<Data>) {
    return System.validate(change.value).valid
}