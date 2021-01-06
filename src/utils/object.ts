import * as jp from "jsonpath";
import searchjs from 'searchjs';
type AnyObject = Record<string | number | symbol, any>
export function filterKeys<T extends AnyObject>(object: T, predicate: (key: string, value: any, src: T) => boolean): T {
    const filteredEntires =
        Object.entries(object)
            .filter(([key, value]) => predicate(key, value, object));
    return Object.fromEntries(filteredEntires) as T;
}
export function keyMap<T extends AnyObject, U>(object: T, map: <P extends keyof T>(key: P, value: T[P], i: number, src: T) => [key: string | number | symbol, value: U]) {
    const entries = Object.entries(object);
    const mapped = entries.map(([key, value], i) => map(key, value, i, object))
    return Object.fromEntries(mapped);
}
export function flatFilter() { }
export function reduceToPathRecord(path: string) {
    return function (record, target) {
        const key = jp.value(target, path);
        const arr = record[key] || [];
        return {
            ...record,
            [key]: [...arr, target]
        }
    }
}
export function each<T, U>(project: (value: T) => U): (array: T[]) => U[] {
    return function (array: T[]): U[] {
        try {
            return array?.map(project) ?? []
        } catch (err) {
            return []
        }
    }
}
export function filterEach<T>(project: (value: T) => boolean): (array: T[]) => T[] {
    return function (array: T[]) {
        try {
            return array.filter(project)
        } catch (err) {
            console.warn(err);
        }
    }
}
export function reduceEach() {

}
export function safeCall<V>(fn: () => V, fallback?: any): V {
    try {
        return fn()
    } catch (err) {
        console.log(err);
        return fallback
    }
}
export function hook<T, M extends (...args) => any = (...args) => any>(target: T, method: string, hook: (fn: M, args: Parameters<M>) => ReturnType<M>) {
    const fn: M = jp.value(target, method);
    if (typeof fn !== "function") return
    jp.value(target, method, function (...args: Parameters<M>) {
        const original = fn.bind(this) as M
        return hook(original, args);
    });

}
export type OrArray<T> = T | T[]
export function orArray<T>(input: OrArray<T>): T[] {
    return input instanceof Array ? input : [input]
}
export type Length<array extends any[]> = array extends { length: infer L } ? L : never;