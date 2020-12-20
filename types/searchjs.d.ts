declare module 'searchjs' {
    type AnyObject = Record<string, any>
    interface JsqlObject extends AnyObject {

    }

    export function matchObject(object: AnyObject, jsqlObject: JsqlObject): boolean
    export function matchArray<I>(array: I[], jsqlObject: JsqlObject): I[]
    export function matchField(value: any, comporator, text: boolean, word: boolean): boolean
}
