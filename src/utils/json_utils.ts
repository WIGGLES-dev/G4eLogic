export type json = { [key: string]: any }
export function objectify(object: string | json, reviver?: (this: any, key: string, value: any) => any) {
    if (typeof object === "string") object = JSON.parse(object, reviver) as json;
    return object
}