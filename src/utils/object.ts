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
export function merge(src: any, ...objects: any[]) {
    function join(obj1, obj2) {
        for (const [key, value] of Object.entries(obj2 || {})) {
            if (typeof value === 'string' || typeof value === 'number') {
                obj1[key] = value;
            } else if (Array.isArray(obj1[key])) {
                obj1[key] = value;
            } else if (obj1[key] === undefined) {
                obj1[key] = value;
            } else if (obj1[key] !== value) {
                join(obj1[key], value);
            }
        }
    }
    for (const object of objects) {
        join(src, object)
    }
    return src
}
export function getPath(obj, value): string[] {
    if (obj.constructor !== Object) {
        throw new TypeError('getPath() can only operate on object with Object as constructor');
    }
    const path = [] as string[];
    let found = false;

    function search(haystack) {
        for (let key of Object.keys(haystack || {})) {
            path.push(key);
            if (haystack[key] === value) {
                found = true;
                break;
            }
            if (typeof haystack[key] === 'object') {
                search(haystack[key]);
                if (found) break;
            }
            path.pop();
        }
    }
    search(obj);
    return path;
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
export function setValueAtPath(src: any, path: string, value: any) {
    const context = {
        reference: undefined,
        parent: undefined,
        objects: []
    }
    path.split(".").reduce((obj, prop, i, arr) => {
        if (i === arr.length - 1) {
            obj[prop] = value;
        }
        if (obj[prop]) {

        } else {
            typeof +prop != undefined ? obj[prop] = [] : obj[prop] = {}
        }
        context.reference = context.objects[context.objects.length - 3] || src;
        context.parent = obj;
        context.objects.push(obj);
        return obj[prop]
    }, src);
}
export function safeCall<
    P extends any[] = any[],
    T = undefined,
    R = any,
    >(
        fn: (this: T, ...args: P) => R,
        args: P = [] as P,
        err: ((this: T, error, ...args: P) => any) = console.log,
        thisarg?: T
    ): R {
    try {
        return fn.apply(thisarg, args)
    } catch (error) {
        return err.apply(thisarg, [error, ...args])
    }
}
export function hook<T, M extends (...args) => any = (...args) => any>(target: T, method: string, hook: (fn: M, args: Parameters<M>) => ReturnType<M>) {

}
export type OrArray<T> = T | T[]
export function orArray<T>(input: OrArray<T>): T[] {
    return input instanceof Array ? input : [input]
}
export type Length<array extends any[]> = array extends { length: infer L } ? L : never;
