import { Collection } from "@character/misc/collection";

type subscription = (store: any) => void
type derivation = (store: any, set?: (value?: any) => void, initial_value?: any) => any

export abstract class Observable {
    changeCount = 0
    watching: any[];

    subscriptions: Set<subscription> = new Set()
    derivations: Set<subscription> = new Set()
    cleanups: Set<subscription> = new Set()

    #data = {
        local: {}
    }

    constructor(watching: string[] = []) {
        this.watching = watching;
        this.createAccessors();
    }

    setState(oldV, val, prop) { }

    subscribe(subscription: (store: any) => void) {
        this.subscriptions.add(subscription);
        subscription(this)
        return {
            unsubscribe: () => this.unsubscribe(subscription),
            update: this.update,
            set: this.set
        }
    }

    unsubscribe(subscription: (store: any) => void) {
        this.subscriptions.delete(subscription);
        if (this.subscriptions.size === 0) this.onUnobserved();
    }

    private onUnobserved() {
        this.cleanups.forEach(callback => callback(this));
    }

    update(updater: (store: any) => any) {
        updater(this);
    }

    derive(callback: derivation = (store) => store) {
        let returnValue = callback(this);
        if (typeof returnValue === "function") { this.cleanups.add(returnValue) } else { returnValue = () => { } }
        this.derivations.add(() => {
            callback(this);
            returnValue(this);
        });
        return {
            unsubscribe: () => this.derivations.delete(callback),
            update: this.update,
            set: this.set
        }
    }

    set(value: any) {
        let constructor = this.constructor;
        if (value instanceof constructor) {
            this.setValue(value);
        }
    }

    setValue(value: any, { update = true } = {}) {
        Object.entries(value).forEach(([key, value]) => {
            if (value === undefined) return
            if (this.watching.includes(key)) {
                this.#data.local[key] = value;
                if (update) this.dispatch();
            } else {
                this[key] = value
            }
        });
    }

    dispatch() {
        this.subscriptions.forEach(callback => callback(this));
        this.derivations.forEach(callback => callback(this));
    }

    private createAccessors() {
        Object.defineProperties(this, this.watching.reduce((prev, cur) => {
            prev[cur] = {
                set(val) {
                    const data = this.#data.local;
                    const oldV = data[cur];
                    if (data[cur] !== val && data[cur] !== undefined) {
                        this.changeCount++;
                        this.setState(oldV, val, cur);
                        this.dispatch();
                    }
                    data[cur] = val
                },
                get() {
                    const val = this.#data.local[cur]
                    return val
                }
            }
            return prev
        }, {}));
    }
}