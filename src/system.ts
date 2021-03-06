import { db, changes$, Data, stamp, fetchRecord } from "@internal";
import type { Entity } from "./entity";
import Main from "@app/main.svelte";
import $RefParser, { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import Ajv from "ajv";
import { Change } from "rxdeep";
import { windowEndpoint, expose, proxy, wrap, Remote } from "comlink";
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscribable,
  Subscription,
} from "rxjs";
import { filter } from "rxjs/operators";
import { closestElement } from "./utils/dom";
import { v4 } from "uuid";
import { html, render } from "lit";
interface Event {
  event: string;
  data;
}
const bc = new BroadcastChannel("valor");
export interface SystemInit {
  workers: [worker: Worker | SharedWorker, key: string][];
  schemas: [url: string, key: string][];
}
type GEntity = new (record: Data, embed: Data) => Entity<Data, Data>;
export interface SystemWorker {
  classes: Record<string, Remote<GEntity>>;
  helpers: Record<string, Remote<(...args) => any>>;
}
export abstract class AbstractSystem {
  ui: Main;
  name: string;
  db = db;
  changes$ = changes$;
  ready$ = new BehaviorSubject(false);
  bc = wrap<this>(bc);
  origin = window.origin;
  events$ = new Subject<Event>();
  validator = new Ajv({
    strict: false,
    coerceTypes: true,
    useDefaults: true,
  });
  $parser = new $RefParser();
  workers: Record<string, SystemWorker> = {};
  constructor() { }
  async addSchema(schema, key?: string) {
    try {
      const dereferenced = await this.$parser.bundle(schema);
      this.validator.addSchema(dereferenced, key);
    } catch (err) {
      console.log(`Failed to add schema ${key || ""}`, schema, err);
    }
  }
  async add(table, obj, key) {
    if (this.validate(obj)) {
      if (!obj.__meta__) obj.__meta__ = {};
      obj.__meta__.createdOn = Date.now();
      return await this.db.table(table).add(obj, key);
    }
  }
  async get(table, key) {
    return await this.db.table(table).get(key);
  }
  async update(table, key, data) {
    return await this.db.table(table).update(key, stamp(data));
  }
  async put(table, data, key?) {
    if (this.validate(data)) {
      return await this.db.table(table).put(data, key);
    }
  }
  async delete(table, id) {
    return await this.db.table(table).delete(id);
  }
  async getTable(table) {
    return await this.db.table(table).toArray();
  }
  fetchRecord(tableName: string, key: string) {
    return fetchRecord(tableName, key);
  }
  addWorker(worker: Worker | SharedWorker, name: string) {
    this.workers[name] = (wrap(
      "port" in worker ? worker.port : worker
    ) as unknown) as SystemWorker;
  }
  getWorker(name: string): SystemWorker {
    return this.workers[name];
  }
  dispatch(event, data) {
    this.events$.next({
      event,
      data,
    });
  }
  broadcast(event, data) {
    this.dispatch(event, data);
    this.bc.dispatch(event, data);
  }
  roll(formula, data = {}) {
    this.broadcast("roll", [formula, data]);
  }
  on(event: string, cb) {
    let sub: Subscription;
    if (event === "dbchanges") {
      sub = this.changes$.subscribe((changes) => cb(changes));
    } else if (event === "events") {
      sub = this.events$.subscribe((e) => cb(e));
    } else {
      sub = this.events$
        .pipe(filter((e) => event === e.event))
        .subscribe((e) => cb(e));
    }
    return proxy(sub);
  }
  validate(data) {
    try {
      const type = data && data.type;
      const schema = this.validator.getSchema(type);
      const valid =
        typeof schema === "function"
          ? schema(data) === true
          : typeof type === "string";
      const errors = schema?.errors ?? [];
      if (!valid) console.log(errors, data);
      return {
        data,
        valid,
        errors,
      };
    } catch (err) {
      console.error(err);
      return {
        data,
        valid: false,
        errors: err,
      };
    }
  }
  private _expose() {
    if (window.parent !== window) {
      try {
        expose(this, bc);
        expose(this, windowEndpoint(window.parent));
      } catch (err) { }
    }
  }
  notify(message: string) {
    if (this.ready$.value !== true) {
      throw new Error(
        "You cannot post notification until a call to System.init() has been made"
      );
    }
    this.ui?.toast?.notify(message);
  }
  async init(params?: SystemInit) {
    this.ui = new Main({
      target: document.body,
      props: {
        system: this,
      },
    });
    this.on("roll", (e: Event) => this.notify(e.data[0]));
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        const registration = await navigator.serviceWorker.register(
          "./service-worker.js"
        );
      });
    }
    this._expose();
    const actionEvents = ["click", "input"];
    for (const event of actionEvents) {
      window.addEventListener(event, handleAction.bind(this), { capture: true })
    }
    for (const [url, key] of params?.schemas ?? []) {
      await this.addSchema(url, key);
    }
    for (const [worker, key] of params?.workers ?? []) {
      this.addWorker(worker, key);
    }
    this.ready$.next(true);
    window["system"] = this;
  }
  stateVerifier() {
    return (change: Change<Data>) => {
      const { valid, errors } = this.validate(change.value);
      if (valid) {
        change.value = stamp(change.value);
      } else {
        console.log(errors);
      }
      return valid;
    };
  }
}

export enum Action {
  CREATE = "CREATE",
  DELETE = "DELETE",
  UPDATE = "UPDATE",
  EMBED = "EMBED",
  EDIT = "EDIT",
  CONTEXT = "CONTEXT",
  ROLL = "ROLL"
}

function coerceValue(e: Event) {
  if (e instanceof InputEvent) {
    const path = e.composedPath();
    const [target] = path;
  }
}

function hasDataset<T>(target: T): target is T & { dataset: object } {
  return "dataset" in target && typeof target["dataset"] === "object"
}

function allData(elems: EventTarget[]) {
  return elems.reduce((data, elem) => {
    if (hasDataset(elem)) {
      return { ...data, ...elem.dataset }
    } else {
      return data
    }
  }, {} as any);
}

async function handleAction(this: AbstractSystem, e: Event) {
  if (e instanceof MouseEvent || e instanceof InputEvent) {
    const path = e.composedPath();
    const [target] = path;
    if (target instanceof HTMLElement) {
      const {
        action,
        id,
        type,
        relpath,
        path:
        propPath,
        eventModifiers,
        event,
        rootId,
        contextActions,
        parameters
      } = allData(path);
      eventModifiers?.split(" ")?.forEach(modifier => e[modifier]?.());
      if (event && e.type !== event) return;
      let value = coerceValue(e);
      switch (action) {
        case Action.CREATE: {
          const { data, valid } = this.validate({ type, id: v4() });
          if (valid) {
            this.add("index", data, id)
          }
          break;
        }
        case Action.EMBED: {
          let state = await this.fetchRecord("index", id);
          if (rootId) {
            const pathToRoot = state.findPath((v) => v?.id === rootId);
            state = state.sub(...pathToRoot);
          }
          state = state.sub("children");
          const { data, valid } = this.validate({ type, id: v4() });
          if (valid) {
            state.push(data);
          }
          break;
        }
        case Action.DELETE: {
          this.delete("index", id);
          break;
        }
        case Action.UPDATE: {
          const state = await this.fetchRecord("index", id);
          state.sub(...propPath.split(".")).set(value);
          break;
        }
        case Action.EDIT: {

          break;
        }
        case Action.CONTEXT: {

        }
        case Action.ROLL: {

          break;
        }
        default:
      }
    }
  }
}