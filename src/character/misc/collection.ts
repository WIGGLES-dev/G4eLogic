import { mixin } from "@character/general/mixin"
import { Observable } from "@character/general/observable";
import { CharacterElement } from "@character/misc/element";

type target<T> = Set<T>

function map<T>(target: target<T>, callback: (value: T, i: number, target: target<T>) => any, thisArg?: any): Collection<T> {
    if (thisArg) callback = callback.bind(thisArg);
    const transformed = new Collection<T>();
    let i = 0;
    target.forEach((value, key) => {
        transformed.add(callback(value, i, target))
        i++;
    });
    return transformed
}
function filter<T>(target: target<T>, callback: (value: T, i: number, target: target<T>) => Boolean, thisArg?: any) {
    if (thisArg) callback = callback.bind(thisArg);
    const entries = new Collection<T>();
    let i = 0;
    target.forEach(value => {
        if (callback(value, i, target)) {
            entries.add(value);
        }
        i++;
    });
    return entries
}
function reduce<T, A = T>(target: target<T>, callback: (accumulator: A | T, cur: T, i: number, taret: target<T>) => any, initial?: A, thisArg?) {
    if (thisArg) callback = callback.bind(thisArg);
    if (target.size === 0) throw new TypeError("Cannot reduce an empty collection")
    let accumulator = initial || Array.from(target)[0];
    let i = 0;
    target.forEach(value => {
        accumulator = callback(accumulator, value, i, target)
        i++;
    });
    return accumulator
}


function forEach<T>(target: target<T>, callback: (value: T, i: number, target: target<T>) => void, thisArg?) {
    if (thisArg) callback = callback.bind(thisArg);
    const entries = new Collection<T>();
    let i = 0;
    target.forEach(value => {
        callback(value, i, target);
        i++;
    })
    return entries
}

export class Collection<T> extends Observable {
    #set: target<T>

    constructor(iterable: Iterable<T> = []) {
        super();
        this.#set = new Set(iterable);
        this.generateIndexes();
    }

    get arr() { return [...this.#set] }
    set arr(arr) {
        this.#set = new Set(arr);
        this.generateIndexes();
    }

    get length() { return this.#set.size }
    get size() { return this.#set.size }
    [Symbol.iterator]() { return this.#set.values() }

    map(callback: (value: T, i: number, collection: target<T>) => any, thisArg?: any): Collection<T> {
        return map(this.#set, callback, thisArg);
    }
    filter(callback: (element: T, i: number, src: target<T>) => Boolean, thisArg?: any): Collection<T> {
        return filter(this.#set, callback, thisArg)
    }
    reduce<A>(callback: (accumulator: A, cur: T, i: number, src: target<T>) => any, initial: A, thisArg?) {
        return reduce(this.#set, callback, initial, thisArg)
    }
    forEach(callback: (value: T, i: number, target: target<T>) => void, thisArg?) {
        return forEach(this.#set, callback, thisArg)
    }

    splice(start: number, deleteCount?, ...args) {
        let collection = this.arr;
        collection.splice(start, deleteCount, ...args);
        this.#set = new Set(collection);
        this.onChange();
        return this
    }

    access() { }

    move(from: number, to: number) {
        let contents = this.arr;
        console.log([...contents]);
        contents.splice(to, 0, contents.splice(from, 1)[0]);
        console.log(contents);
        this.#set = new Set(contents);
        console.log(this.#set);
        this.onChange();
        return this
    }

    private generateIndexes() {
        Object.defineProperties(this, this.arr.reduce((prev, cur, i) => {
            if (this[i] !== undefined) return prev
            prev[i.toString()] = {
                get() {
                    return this.arr[i] || null
                },
                set(val) {
                    let arr = this.arr;
                    arr[i] = val;
                    this.#set = new Set(arr)
                }
            }
            return prev
        }, {}));
    }

    private onChange() {
        this.dispatch();
        this.generateIndexes();
    }

    add(value: T, index?: number) {
        if (index) {

        } else {
            this.#set.add(value);
        }
        this.onChange();
        return this
    }

    delete(value: T, index?: number) {
        if (index) {

        } else {
            this.#set.delete(value);
        }
        this.onChange();
        return this
    }

    has(value: T) { return this.#set.has(value); }

    clear() {
        this.#set.clear()
        this.onChange();
        return this
    }
}