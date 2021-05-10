import {
  State,
  Change,
  keyed,
  KeyedState,
  KeyFunc,
  verified,
  VerifiedState,
  BranchFunc,
  Key,
  ChangeTraceLeaf,
  ChangeTrace,
  ModList,
  persistent,
  PersistentState,
  Storage,
  Upstream,
  Downstream,
  isLeaf,
} from "rxdeep";
import { from, fromEvent, merge, Observable, Observer, Subject } from "rxjs";
import { getPath, updateValueAtPath, Path } from "@utils/path";
import deepmerge from "deepmerge";
import {
  expand,
  filter,
  map,
  multicast,
  pluck,
  reduce,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { Tree, TreeHash } from "@app/utils/tree";
declare module "rxdeep/dist/es6/state" {
  type Key = string | number | symbol;
  type BranchFunc<T> = (state: State<T>) => State<any>[];
  type Downstream<T> = Observable<Change<T>>;
  type Upstream<T> = Observer<Change<T>>;
  type ModList<T> = Record<string, ChangeTraceLeaf<T>>;
  interface State<T> {
    sub<K1 extends keyof T>(k1: K1): State<T[K1]>;
    sub<K1 extends keyof T, K2 extends keyof T[K1]>(
      k1: K1,
      k2: K2
    ): State<T[K1][K2]>;
    sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
      k1: K1,
      k2: K2,
      k3: K3
    ): State<T[K1][K2][K3]>;
    sub<
      K1 extends keyof T,
      K2 extends keyof T[K1],
      K3 extends keyof T[K1][K2],
      K4 extends keyof T[K1][K2][K3]
    >(
      k1: K1,
      k2: K2,
      k3: K3,
      k4: K4
    ): State<T[K1][K2][K3][K4]>;
    sub<
      K1 extends keyof T,
      K2 extends keyof T[K1],
      K3 extends keyof T[K1][K2],
      K4 extends keyof T[K1][K2][K3],
      K5 extends keyof T[K1][K2][K3][K4]
    >(
      k1: K1,
      k2: K2,
      k3: K3,
      k4: K4,
      k5: K5
    ): State<T[K1][K2][K3][K4][K5]>;
    sub<
      K1 extends keyof T,
      K2 extends keyof T[K1],
      K3 extends keyof T[K1][K2],
      K4 extends keyof T[K1][K2][K3],
      K5 extends keyof T[K1][K2][K3][K4],
      K6 extends keyof T[K1][K2][K3][K4][K5]
    >(
      k1: K1,
      k2: K2,
      k3: K3,
      k4: K4,
      k5: K5,
      k6: K6
    ): State<T[K1][K2][K3][K4][K5][K6]>;
    sub(...keys: Key[]): State<any>;
    deepSub<T>(findfunc: ((value) => boolean) | object): Observable<State<T>>;
    verified<K extends keyof T>(
      verifier?: (change: Change<T[K]>) => boolean
    ): VerifiedState<T>;
    keyed(
      keyFunc?: T extends any[] ? KeyFunc<T[number]> : never
    ): T extends any[] ? KeyedState<T[number]> : never;
    persistent(storage: Storage<T>): PersistentState<T>;
    add(number: number): void;
    subtract(number: number): void;
    multiply(number: number): void;
    divide(number: number): void;
    toggle(): void;
    assign(value: Partial<T>): void;
    push(...values: T[]): void;
    filter(...args: Parameters<Array<T>["filter"]>): void;
    splice(...args: Parameters<Array<T>["splice"]>): void;
    merge(value, opts?): void;
    set(value: T): void;
    update(cb: (value) => T): void;
    delete(): void;
    broadcast(name: string): State<T>;
    mods: Observable<ModList<T>>;
  }
}
const sub = State.prototype.sub;
State.prototype.sub = function <T>(this: State<T>, ...keys: Key[]) {
  let _sub: State<any> = this;
  for (const key of keys) {
    const parent = _sub;
    _sub = sub.call(_sub, key);
    _sub.delete = function () {
      if (parent.value instanceof Array) {
        parent.value = parent.value.filter((v, i) => i != key);
      } else if (typeof parent.value === "object") {
        const nv = { ...parent.value };
        delete nv[key];
        parent.value = nv;
      }
    };
  }
  return _sub;
};
State.prototype.deepSub = function <T extends object>(this: State<T>, value) {
  return this.pipe(
    map((data) => getPath(data, value)),
    map((path) => this.sub(...path))
  );
};
State.prototype.verified = function <T>(
  this: State<T>,
  verifier: (change: Change<T>) => boolean = (change) => !!change.value
) {
  return verified(this, verifier);
};
State.prototype.keyed = function <T>(
  this: State<T[]>,
  keyFunc: KeyFunc<T> = (value) => value && value["id"]
) {
  return keyed(this, keyFunc);
};
State.prototype.persistent = function <T>(this: State<T>, storage: Storage<T>) {
  return persistent(this, storage);
};
State.prototype.add = function (this: State<number>, number: number) {
  this.value = this.value + number;
};
State.prototype.subtract = function (this: State<number>, number: number) {
  this.value = this.value - number;
};
State.prototype.multiply = function (this: State<number>, number: number) {
  this.value = this.value * number;
};
State.prototype.divide = function (this: State<number>, number: number) {
  this.value = this.value / number;
};
State.prototype.toggle = function (this: State<boolean>) {
  this.value = !this.value;
};
State.prototype.assign = function <T>(this: State<T>, value: Partial<T>) {
  this.value = Object.assign(this.value, value);
};
State.prototype.push = function <T>(this: State<T[]>, ...values: T[]) {
  this.value = [...this.value, ...values];
};
State.prototype.filter = function <T>(
  this: State<T[]>,
  ...args: Parameters<Array<T>["filter"]>
) {
  this.value = this.value.filter(...args);
};
State.prototype.splice = function <T>(
  this: State<T[]>,
  start: number,
  deleteCount?: number,
  ...items
) {
  const arr = [...this.value];
  arr.splice(start, deleteCount, ...items);
  this.value = arr;
};
State.prototype.merge = function <T>(this: State<T>, value, opts?) {
  this.value = deepmerge(this.value, value, opts);
};
State.prototype.set = function <T>(this: State<T>, value: T) {
  if (typeof this.value === "object") {
    this.value = value;
  } else if (this.value !== value) {
    this.value = value;
  }
};
State.prototype.update = function <T>(this: State<T>, cb: (value: T) => T) {
  this.value = cb(this.value);
};
State.prototype.delete = function <T>(this: State<T>) {
  this["state"]?.delete();
};
export class RemoteState<T> extends State<T> {
  constructor(worker: Worker | SharedWorker) {
    super(null);
  }
}
export function traceToMods<T>(change: Change<T>) {
  const { trace } = change;
  if (!trace) return {};
  const mods: Record<string, ChangeTraceLeaf<T>> = {};
  function getLeafKeys(trace: ChangeTrace<T>, path = []) {
    if ("subs" in trace) {
      Object.entries(trace.subs).forEach(([key, value]) =>
        getLeafKeys(value, [...path, key])
      );
    } else {
      mods[path.join(".")] = trace;
    }
  }
  getLeafKeys(trace);
  return mods;
}
export function traceFromMods<T>(mods: ModList<T>) {
  const trace = {};
  function setTraceValue(mod: [string, ChangeTraceLeaf<T>]) {
    if (!mod) return;
    const [path, leaf] = mod;
    const subs = path.split(".").flatMap((segment, i) => {
      if (i % 2 === 0) {
        return ["subs", segment];
      }
      return [segment];
    });
    updateValueAtPath(trace, subs, leaf);
  }
  Object.entries(mods).forEach(setTraceValue);
  return trace;
}
export function modListToValue<T extends object>(mods: ModList<unknown>): T {
  const value = {} as T;
  Object.entries(mods).forEach(([pathstring, leaf]) => {
    const path = pathstring.split(".");
    updateValueAtPath(value, path, leaf.to);
  });
  return value;
}
Object.defineProperties(State.prototype, {
  mods: {
    get<T>(this: State<T>) {
      return this.downstream.pipe(map(traceToMods));
    },
  },
});

function refcount(): import("rxjs").OperatorFunction<unknown, unknown> {
  throw new Error("Function not implemented.");
}
