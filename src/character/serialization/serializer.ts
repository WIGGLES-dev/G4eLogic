import { Skill } from "../skill/skill";
import { Spell } from "../spell";
import { Equipment } from "../equipment";
import { Trait } from "../trait";
import { Character, Feature, SkillDefault } from "index";
import { List } from "@character/misc/list";
import { Featurable } from "@gcs/gcs";
import { Modifier } from "@character/misc/modifier";
import { Sheet } from "@character/character";
import { GCSJSON } from "./gcs_json";

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
    transformers: Map<Constructor | string, { save: any, load: any }>

    constructor() {
        this.transformers = new Map();
        this.init();
    }

    static purgeObject(object: any) {
        object.keys.forEach(key => {
            const data = object[key];
            if (data === undefined || data === null) delete object[key];
            if (Array.isArray(data)) data.forEach(data => Serializer.purgeObject(data));
            if (Object.keys(data).length > 0) Serializer.purgeObject(data);
        });
        return object
    }

    abstract init(): void

    register(key: Constructor | string, transformer: { save: any, load: any }) {
        this.transformers.set(key, transformer)
        return this
    }

    static reverseMap(input: string) {
        Object.keys(input)
    }

    abstract loadList(list: List<any>, data: any[]): List<any>
    abstract saveList(list: List<any>): any

    abstract load(character: Character, data: any, config?: any): Character
    abstract save(character: Character, target: any): any
}