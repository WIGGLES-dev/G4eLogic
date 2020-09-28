import { Sheet } from "@character/character";

export abstract class Plugin<T extends Sheet<T>> {
    abstract scope: string

    abstract init(sheet: Sheet<T>): Plugin<T>
}