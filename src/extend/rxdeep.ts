import { State, Change, keyed, KeyedState, KeyFunc, verified, VerifiedState, BranchFunc, Key } from 'rxdeep';
import { Observable, Observer } from 'rxjs';
declare module 'rxdeep/dist/es6/state' {
    type Key = string | number | symbol
    type BranchFunc<T> = (state: State<T>) => State<any>[]
    type Downstream<T> = Observable<Change<T>>
    type Upstream<T> = Observer<Change<T>>
    interface State<T> {
        set(value: Partial<T>): void
        sub<K1 extends keyof T>(k1: K1): State<T[K1]>
        sub<K1 extends keyof T, K2 extends keyof T[K1]>(k1: K1, k2: K2): State<T[K1][K2]>
        sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(k1: K1, k2: K2, k3: K3): State<T[K1][K2][K3]>
        sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3]>(k1: K1, k2: K2, k3: K3, k4: K4): State<T[K1][K2][K3][K4]>
        sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): State<T[K1][K2][K3][K4][K5]>
        sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6): State<T[K1][K2][K3][K4][K5][K6]>
        sub(...keys: Key[]): State<any>
        verified<K extends keyof T>(verifier?: (change: Change<T[K]>) => boolean): VerifiedState<T>
        keyed(keyFunc?: T extends any[] ? KeyFunc<T[number]> : never): T extends any[] ? KeyedState<T[number]> : never
        delete(): void
        assign(value: Partial<T>): void
    }
}
State.prototype.set = function <T>(this: State<T>, value: T) {
    if (this.value === value) {
        if (typeof this.value === "object") {
            //@ts-ignore
            this.value = Array.isArray(this.value) ? [...this.value] : { ...this.value }
        }
    } else {
        this.value = value;
    }
}
const sub = State.prototype.sub;
State.prototype.sub = function <T>(this: State<T>, ...keys: Key[]) {
    let _sub: State<any> = this
    for (const key of keys) {
        const parent = _sub;
        _sub = sub.call(_sub, key);
    }
    return _sub
}
State.prototype.verified = function <T>(this: State<T>, verifier: (change: Change<T>) => boolean = change => !!change.value) {
    return verified(this, verifier)
}
State.prototype.keyed = function <T>(this: State<T[]>, keyFunc: KeyFunc<T> = value => value && value["id"]) {
    return keyed(this, keyFunc)
}
State.prototype.delete = function <T>(this: State<T>) {
    this.value = undefined;
}
State.prototype.assign = function <T>(this: State<T>, value: Partial<T>) {
    this.value = Object.assign({}, this.value, value);
}