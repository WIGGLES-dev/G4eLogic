import { Character } from "index";
import { List } from "@character/misc/list";

/**
 * Abstract class from which all serializers draw functionality. It covers loading and saving functionality
 * by allowing a function to write data from an arbitrary external source. A loader is defined as the 
 * following: A function that exposes the interal object you load into which will return the children that need to 
 * be loaded next. The loader will stop loading when your function does not return a non-zero length array.
 */

export type Constructor<T = {}> = new (...arger: any[]) => T;

export function registerSerializer(serializer: any) {
    Serializer.serializers.set(serializer.scope, new serializer());
    return serializer
}

export abstract class Serializer {
    static serializers: Map<string, Serializer> = new Map()

    static scope: string
    #transformers: Map<Function | string, { save: transformFunction, load: transformFunction }>

    constructor() {
        this.#transformers = new Map();
        this.init();
    }

    abstract init(): void

    register(key: Function | string, transformer: { save: transformFunction, load: transformFunction }) {
        this.#transformers.set(key, transformer)
        return this
    }

    transform(transformer: Function | string, operation: string): transformFunction {
        return this.#transformers.get(transformer)[operation].bind(this);
    }

    abstract loadList(list: List<any>, ...args): List<any>
    abstract saveList(list: List<any>, ...args): any

    abstract load(character: Character, data: any, ...args: any[]): Character
    abstract save(character: Character, target: any, ...args: any[]): any
}

type transformFunction = (target: any, data: any, ...args) => any

class Transformer {
    constructor() {

    }
}