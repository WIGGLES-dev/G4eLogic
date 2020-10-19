import { debounce } from "@utils/debounce";

type subscription = (store: any) => void
type derivation = (store: any, set?: (value?: any) => void, initial_value?: any) => any


export abstract class Observable {
    dispatching = true;
    changeCount = 0
    watching: string[];

    subscriptions: Set<subscription> = new Set()
    onUnobservedCallbacks: Set<subscription> = new Set()

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
        this.onUnobservedCallbacks.forEach(callback => callback(this));
    }

    update(updater: (store: any) => any) {
        updater(this);
    }

    derive(callback: derivation = (store) => store, intial: any) {
        const subscription = () => {

        };
        this.subscriptions.add(subscription);
        return {
            unsubscribe: () => this.subscriptions.delete(subscription),
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