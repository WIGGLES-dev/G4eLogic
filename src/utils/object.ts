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
type SearchObj = AnyObject | ((value: AnyObject) => boolean)
export type PathSegment = (string | number)
export type Path = PathSegment[]
export function getPath(obj: AnyObject, value: SearchObj): Path {
    if (obj.constructor !== Object) {
        throw new TypeError('getPath() can only operate on object with Object as constructor');
    }
    const path = [] as string[];
    let found = false;
    function search(haystack) {
        for (let key of Object.keys(haystack || {})) {
            path.push(key);
            if (typeof value === 'function') {
                if (value(haystack[key])) {
                    found = true;
                    break;
                }
            } else if (haystack[key] === value) {
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
export function getValue(object: AnyObject, key: PathSegment) {
    return object[key]
}
export function setValue(object: AnyObject, key: PathSegment, value: any) {
    object[key] = value;
}
export function getValueAtPath(object: AnyObject, path: Path) {
    return path.reduce(getValue, object);
}
export function getValuesFromPath(object: AnyObject, path: Path) {
    const values = [object];
    path.forEach((key, i) => {
        const v = getValueAtPath(object, path.slice(0, i + 1))
        values.push(v);
    });
    return values
}
export function deleteValueAtPath(object: AnyObject, path: Path) {
    const [key] = path.slice(-1);
    const value = getValueAtPath(object, path.slice(0, -1));
    try {
        delete value[key]
    } catch (err) {

    }
}
export function updateValueAtPath(object: AnyObject, path, update: any | ((value: any) => any)) {
    const key = path.pop();
    let value = object;
    for (const key of path) {
        if (value && value[key]) {
            value = value[key];
        } else if (value) {
            value[key] = {}
        } else {

        }
    }
    value[key] = typeof update === "function" ? update(value[key]) : update;
}
export function move(src: AnyObject, from: SearchObj, to: SearchObj, { lift = undefined, nest = [] } = {}) {
    const object = JSON.parse(JSON.stringify(src))
    const fromPath = getPath(object, from);
    const toPath = getPath(object, to).slice(0, lift > 0 ? lift * -1 : lift).concat(nest);
    const fromValues = getValuesFromPath(object, fromPath);
    const toValues = getValuesFromPath(object, toPath);
    const [fromParent, fromValue] = fromValues.slice(-2);
    const [toParent, toValue] = toValues.slice(-2);
    const [fromKey] = fromPath.slice(-1);
    const [toKey] = toPath.slice(-1);
    if (toValue instanceof Array) {
        if (fromParent instanceof Array) {
            fromParent.splice(+fromKey, 1)
        } else {
            delete fromParent[fromKey];
        }
        toValue.unshift(fromValue);
    } else if (toParent instanceof Array) {
        if (fromParent === toParent) {
            arrayMove(toParent, +fromKey, +toKey);
        } else {
            if (fromParent instanceof Array) {
                fromParent.splice(+fromKey, 1);
            } else {
                delete fromParent[fromKey]
            }
            toParent.splice(+toKey, 0, fromValue);
        }
    } else {
        toParent[toKey] = fromValue;
        delete fromParent[fromKey]
    }
    return object
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
export function enumeratePrototype(obj) {
    const prototype = Object.getPrototypeOf(obj);
    const descriptors = Object.getOwnPropertyDescriptors(prototype);
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
