export type json = { [key: string]: any }
export function objectify<T>(object: string | json, reviver?: (this: any, key: string, value: any) => T): T {
    if (typeof object === "string") object = JSON.parse(object, reviver);
    return object as T
}

export function isArray(potentialArray: any): (any | any[])[] {
    return Array.isArray(potentialArray) ? potentialArray : []
}