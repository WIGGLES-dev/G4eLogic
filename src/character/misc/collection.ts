import { mixin } from "@character/general/mixin"
import { Observable } from "@character/general/observable";
import { CharacterElement } from "@character/misc/element";

export class Collection<T> extends Observable {
    #set: Set<T>

    constructor(iterable: Iterable<T> = []) {
        super();
        this.#set = new Set(iterable);
    }

    get arr() { return [...this.#set] }
    set arr(arr) {
        this.#set = new Set(arr);
    }

    get length() { return this.#set.size }
    get size() { return this.#set.size }
    [Symbol.iterator]() { return this.#set.values() }

    map(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any) {
        return this.arr.map(callbackfn, thisArg)
    }
    filter(predicate: (value: T, index: number, array: T[]) => value is T, thisArg?: any) {
        return this.arr.filter(predicate, thisArg)
    }
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U) {
        return this.arr.reduce(callbackfn, initialValue)
    }
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) {
        return this.arr.forEach(callbackfn, thisArg)
    }
    indexOf(searchElement: T, fromIndex?: number) { return this.arr.indexOf(searchElement, fromIndex) }

    splice(start: number, deleteCount?: number, ...items: T[]) {
        let array = this.arr;
        let deleted = array.splice(start, deleteCount, ...items);
        this.arr = array;
        this.dispatch();
        return deleted
    }

    move(from: number, to: number) {
        this.splice(to, 0, this.splice(from, 1)[0]);
        return this
    }
    acquire(collection: Collection<T>) {
        collection.forEach(member => this.#set.add(member));
        return this
    }
    forfeit(collection: Collection<T>) {
        collection.forEach(member => this.#set.delete(member));
        return this
    }
    atIndex(i: number) { return this.arr[i] }

    isEmpty() { return this.size === 0 }

    private onChange() {
        this.dispatch();
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