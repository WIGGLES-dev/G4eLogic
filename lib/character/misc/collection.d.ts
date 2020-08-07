export declare class Collection<T, U> extends Map<T, U> {
    subscriptions: Set<(store: any) => void>;
    constructor(entries?: Iterable<readonly [T, U]>);
    get length(): number;
    [Symbol.iterator](): IterableIterator<U>;
    iter(): U[];
    filter(callback: (element: U, i: number, src: Collection<T, U>) => Boolean, thisArg?: any): U[];
    reduce(callback: (acc: any, cur: U, i: number, src: Collection<T, U>) => any, initial: any): any;
    map(callback: (value: U, key: T, i: number, collection: Collection<T, U>) => any, thisArg?: any): U[];
    add(value: U): this;
    set(key: T, value: U): this;
    delete(key: T | U): boolean;
    dispatch(): void;
    unsubscribe(subscription: (store: any) => void): void;
    subscribe(subscription: (store: any) => void): () => void;
    update(updater: (store: any) => any): void;
}
