interface ListCell {
    id: string
    attributes: Record<string, any>
    weight?: number
    indent?: number
}
export type RecursiveArray<T = any> = (T & RecursiveArray<T>)[];
export class List<T extends ListCell> {
    source: T[]
    header: any[]
    body: T[]
    currentDepth: number
    constructor(list: T[]) {
        this.source = list
    }
    setHeader(header: any[]) {
        this.header = header;
        return this
    }
    moveToDepth(level: number) {
        this.currentDepth = level;
    }
    sortDepth(...args: Parameters<Array<T>["sort"]>) {

    }
    sortAll(...args: Parameters<Array<T>["sort"]>) {
        return this.body.sort(...args);
    }
    static unNest(array: RecursiveArray, children = 'children') {

    }
}