import { Character } from "index";
import { List } from "@character/misc/list";
//import { SkillDefault, Skill, Technique, Spell, Equipment, Trait, TraitModifier, EquipmentModifier } from "index";

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

const entities = {
    // "SkillDefault": SkillDefault,
    // "Skill": Skill,
    // "Technique": Technique,
    // "Spell": Spell,
    // "Equipment": Equipment,
    // "Trait": Trait,
    // "TraitModifier": TraitModifier,
    // "EquipmentModifier": EquipmentModifier
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

    private static access(data, path) {
        try {
            const accessors = path.split(".");
            return accessors.reduce((data, key) => {
                return data[key]
            }, data);
        } catch (err) {
            console.log(`Failed to access path ${path} on object ${data}`);
        }
    }

    /**
     * Iterate over the keys dynamically creating the load functions that the application
     * uses to load data from external sources.
     * @param map Schema of keys from a config file
     */
    private static makeLoadFunction(map) {
        return function (target, data, ...args) {
            Object.entries(map).reduce((prev, [targetProp, dataProp]: [string, any]) => {
                if (dataProp.constructor) {
                    target[targetProp] = new Function(dataProp.transform).apply(data)
                } else if (dataProp.Entity) {
                    const args = (dataProp.constructor.args || []).map(arg => data[arg]);

                    if (dataProp.process === "array") {
                        const prop = data[dataProp];
                        if (Array.isArray(prop)) {
                            prop.forEach(index => {
                                target[dataProp.constructor.key](...args).load(index)
                            });
                        }
                    } else {
                        target[dataProp.constructor.key](...args).load(data[dataProp]);
                    }
                } else if (data[dataProp]) {
                    const prop = Serializer.access(data, dataProp);
                    if (prop) target[targetProp] = prop;
                }
                return prev
            }, target);
            const children = data.children;
            if (Array.isArray(children)) { return children }
        }
    }
    private static makeSaveFunction(map) {
        return function () {

        }
    }
    private static applyTemplates(templates, map) {
        return { ...templates, ...map }
    }

    parseConfig(config) {
        const templates = Object.entries(config.templates);
        const maps = Object.entries(config.mappings);
        maps.map(([constructor, map]: [string, any]) => {
            const templateNames = map.templates || [];
            const templatesToApply = templates.filter(([template, map]) =>
                templateNames.includes(template)
            ).map(([template, map]) => map);
            const finalMap = Serializer.applyTemplates(templatesToApply, map);
            const load = Serializer.makeLoadFunction(finalMap);
            const save = Serializer.makeSaveFunction(finalMap);
            this.#transformers.set(entities[constructor] || constructor, {
                load,
                save
            })
        });
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