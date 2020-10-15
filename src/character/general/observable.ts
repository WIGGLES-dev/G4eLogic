import { Collection } from "@character/misc/collection";
import { debounce } from "@utils/debounce";

type subscription = (store: any) => void
type derivation = (store: any, set?: (value?: any) => void, initial_value?: any) => any


export abstract class Observable {
    dispatching = true;
    changeCount = 0
    watching: string[];

    subscriptions: Set<subscription> = new Set()
    derivations: Set<subscription> = new Set()
    cleanups: Set<subscription> = new Set()

    #data = {
        local: {},
        roaming: {}
    }

    constructor(...args) {
        this.watching = args.pop() || [];
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

    /**
     * Returns the observable in a state where watched variable changes won't trigger dispatches
     */
    proxy() {
        this.dispatching = false;
        return this
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

    forwardAccessors(accessors: string[], target: any) {
        try {
            this.createAccessors(accessors, target);
        } catch (err) {

        }
    }

    private createAccessors(accessors?: string[], target?) {
        Object.defineProperties(this, (accessors || this.watching).reduce((prev, cur) => {
            if (prev[cur] || this[cur] !== undefined) return prev
            const data = target || this.#data.local;
            prev[cur] = {
                set(val) {
                    const oldV = data[cur];
                    if (data[cur] !== val && data[cur] !== undefined) {
                        this.changeCount++;
                        this.setState(oldV, val, cur);
                        if (this.dispatching) this.dispatch();
                    }
                    data[cur] = val
                },
                get() { return data[cur] || null }
            }
            return prev
        }, {}));
    }
}