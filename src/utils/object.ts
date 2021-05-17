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
export function isNumber(string: string) {
    const asFloat = Number.parseFloat(string);
    const isNaN = Number.isNaN(asFloat);
    return !isNaN;
}
export function arrayMove<T>(arr: T[], from: number, to: number) {
    const elm = arr.splice(from, 1)[0];
    arr.splice(to, 0, elm)
    return arr
}
export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}
export type OrArray<T> = T | T[]
export function orArray<T>(input: OrArray<T>): T[] {
    return input instanceof Array ? input : [input]
}
export type Length<array extends any[]> = array extends { length: infer L } ? L : never;
