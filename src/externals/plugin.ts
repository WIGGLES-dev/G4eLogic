import { Sheet } from "@character/character";

export abstract class Plugin {
    abstract scope: string

    abstract init<T extends Sheet>(sheet: T): Plugin
}