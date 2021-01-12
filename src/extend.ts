import { State, Change, KeyedState, VerifiedState } from 'rxdeep';
import deepmerge from 'deepmerge'
import searchjs, { AnyObject } from 'searchjs';
declare module 'rxdeep/dist/es6/state' {
    interface State<T> {
        set(value: Partial<T>): void
        sub<K1 extends keyof T>(k1: K1): State<T[K1]>
        sub<K1 extends keyof T, K2 extends keyof T[K1]>(k1: K1, k2: K2): State<T[K1][K2]>
        sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(k1: K1, k2: K2, k3: K3): State<T[K1][K2][K3]>
        sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3]>(k1: K1, k2: K2, k3: K3, k4: K4): State<T[K1][K2][K3][K4]>
        sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): State<T[K1][K2][K3][K4][K5]>
        sub<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5, k6: K6): State<T[K1][K2][K3][K4][K5][K6]>
        sub(...keys: string[]): State<any>
        verified()
        keyed()
    }
}
State.prototype.set = function <T>(this: State<T>, value: Partial<T>) {
    if (typeof value === 'object') {
        const current = this.value;
        const next = deepmerge(current, value, {
            arrayMerge: (t, s) => s
        })
        this.value = next
    } else {
        this.value = value;
    }
}
const sub = State.prototype.sub;
State.prototype.sub = function <T>(this: State<T>, ...keys: string[]) {
    let _sub: State<any> = this
    for (const key of keys) {
        _sub = sub.call(_sub, key);
    }
    return _sub
}
State.prototype.subUpstream = function <T>(this: State<T>, key: string | symbol | number) {
    return {
        next: change => {
            if (this.value) {
                this.value[key] = change.value;
            } else {
                const interpreted = typeof key === 'number' ? [] : {};
                interpreted[key] = change.value;
                this.value = interpreted as T;
            }
            this.upstream.next({
                value: this.value,
                trace: {
                    subs: {
                        [key]: change.trace
                    }
                }
            });
        },
        error: err => this.upstream.error(err),
        complete: () => { },
    };
}