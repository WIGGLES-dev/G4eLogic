import { State, Change, keyed, KeyedState, KeyFunc, verified, VerifiedState, BranchFunc, Key } from 'rxdeep';
import { from, Observable, Observer } from 'rxjs';
import { getPath } from "@utils/object";
import deepmerge from "deepmerge";
import { expand, map, reduce, switchMap } from 'rxjs/operators';
declare module 'rxdeep/dist/es6/state' {
    type Key = string | number | symbol
    type BranchFunc<T> = (state: State<T>) => State<any>[]
    type Downstream<T> = Observable<Change<T>>
    type Upstream<T> = Observer<Change<T>>
    interface State<T> {
        sub<K1 extends keyof T>(k1: K1): State<T[K1]>
        sub<K1 extends keyof T, K2 extends keyof T[K1]>(k1: K1, k2: K2): State<T[K1][K2]>
        sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(k1: K1, k2: K2, k3: K3): State<T[K1][K2][K3]>
        sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3]>(k1: K1, k2: K2, k3: K3, k4: K4): State<T[K1][K2][K3][K4]>
        sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): State<T[K1][K2][K3][K4][K5]>
        sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6): State<T[K1][K2][K3][K4][K5][K6]>
        sub(...keys: Key[]): State<any>
        deepSub<T>(findfunc: ((value) => boolean) | object): Observable<State<T>>
        verified<K extends keyof T>(verifier?: (change: Change<T[K]>) => boolean): VerifiedState<T>
        keyed(keyFunc?: T extends any[] ? KeyFunc<T[number]> : never): T extends any[] ? KeyedState<T[number]> : never
        add(number: T extends number ? number : never): void
        subtract(number: T extends number ? number : never): void
        multiply(number: T extends number ? number : never): void
        divide(number: T extends number ? number : never): void
        toggle(): T extends boolean ? void : never
        assign(value: Partial<T>): void
        merge(value, opts?): void
        set(value: T): void
        update(cb: (value) => T): void
        delete(): void
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
                parent.value = parent.value.filter((v, i) => i != key)
            } else if (typeof parent.value === "object") {
                const nv = { ...parent.value };
                delete nv[key];
                parent.value = nv;
            }
        }
    }
    return _sub
}
State.prototype.deepSub = function <T>(this: State<T>, value) {
    return this.pipe(
        map(data => getPath(data, value)),
        map(path => this.sub(...path))
    )
}
State.prototype.verified = function <T>(this: State<T>, verifier: (change: Change<T>) => boolean = change => !!change.value) {
    return verified(this, verifier)
}
State.prototype.keyed = function <T>(this: State<T[]>, keyFunc: KeyFunc<T> = value => value && value["id"]) {
    return keyed(this, keyFunc)
}
State.prototype.add = function (this: State<number>, number: number) {
    this.value = this.value + number;
}
State.prototype.subtract = function (this: State<number>, number: number) {
    this.value = this.value - number;
}
State.prototype.multiply = function (this: State<number>, number: number) {
    this.value = this.value * number
}
State.prototype.divide = function (this: State<number>, number: number) {
    this.value = this.value / number
}
State.prototype.toggle = function (this: State<boolean>) {
    this.value = !this.value;
}
State.prototype.assign = function <T>(this: State<T>, value: Partial<T>) {
    this.value = Object.assign(this.value, value);
}
State.prototype.merge = function <T>(this: State<T>, value, opts?) {
    this.value = deepmerge(this.value, value, opts);
}
State.prototype.set = function <T>(this: State<T>, value: T) {
    this.value = value;
}
State.prototype.update = function <T>(this: State<T>, cb: (value: T) => T) {
    this.value = cb(this.value)
}
State.prototype.delete = function <T>(this: State<T>) {
    this["state"]?.delete();
}