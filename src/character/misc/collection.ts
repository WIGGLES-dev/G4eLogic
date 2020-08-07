export class Collection<T, U> extends Map<T, U> {
    subscriptions: Set<(store: any) => void> = new Set()

    constructor(entries?: Iterable<readonly [T, U]>) {
        super(entries);
    }

    get length() { return this.size }

    //@ts-ignore
    [Symbol.iterator]() { return this.values() }

    iter() { return Array.from(this.values()) }

    filter(callback: (element: U, i: number, src: Collection<T, U>) => Boolean, thisArg?: any): U[] {
        if (thisArg) callback = callback.bind(thisArg);
        const collection = this;
        const entries = [];
        let i = 0;
        this.forEach((value, key) => {
            if (callback(value, i, collection)) {
                entries.push(value);
            }
            i++;
        });
        return entries
    }

    reduce(callback: (acc: any, cur: U, i: number, src: Collection<T, U>) => any, initial: any) {
        if (this.size === 0) throw new TypeError("Cannot reduce an empty collection")
        const collection = this;
        let accumulator = initial;
        let i = 0;
        this.forEach((value, key) => {
            accumulator = callback(accumulator, value, i, collection)
            i++;
        });
        return accumulator
    }

    map(callback: (value: U, key: T, i: number, collection: Collection<T, U>) => any, thisArg?: any): U[] {
        if (thisArg) callback = callback.bind(thisArg);
        const collection = this;
        const transformed = [];
        let i = 0;
        this.forEach((value, key) => {
            transformed.push(callback(value, key, i, collection))
            i++;
        });
        return transformed
    }

    add(value: U) {
        //@ts-ignore
        return this.set(value, value)
    }

    set(key: T, value: U) {
        super.set(key, value)
        this.dispatch();
        return this
    }

    delete(key: T | U) {
        //@ts-ignore
        if (super.delete(key)) {
            this.dispatch();
            return true
        } else {
            return false
        }
    }

    dispatch() {
        this.subscriptions.forEach(subscription => {
            subscription(this);
        });
    }

    unsubscribe(subscription: (store: any) => void) {
        this.subscriptions.delete(subscription)
    }

    subscribe(subscription: (store: any) => void) {
        this.subscriptions.add(subscription);
        subscription(this);
        return () => this.unsubscribe(subscription)
    }

    update(updater: (store: any) => any) {

    }
}