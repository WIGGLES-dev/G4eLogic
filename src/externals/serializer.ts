import { Sheet, Character } from "@character/character";
import { List } from "@character/misc/list";

export function registerSerializer(serializer: any) {
    Serializer.serializers.set(serializer.scope, new serializer());
    return serializer
}

export abstract class Serializer {
    static serializers: Map<string, Serializer> = new Map()

    static scope: string
    #transformers: Map<Function | string, { save: transformFunction, load: transformFunction }> = new Map()

    constructor() {
        this.init();
    }

    abstract init(): void

    transform(transformer: Function | string, operation: string): transformFunction {
        try {
            return this.#transformers.get(transformer)[operation].bind(this);
        } catch (err) {
            console.log(`Failed to transform ${typeof transformer === "string" ? transformer : transformer.name}`, err);
        }
    }

    /**
     * Access and possibly assign or call methods of objects dynamically based on a JSON path
     * @param data object to access
     * @param path path.to.your.property
     * @param param2 use this to call a function or assign a value to the property you land on
     */
    private static access(data, path, { assignment, args }: { assignment?: string, args?: string[] } = {}) {
        try {
            const accessors = path.split(".");
            if (accessors.length === 1) {
                let temp = data[accessors[0]];
                if (assignment) data[accessors[0]] = assignment;
                if (args) return data[accessors[0]](...args);
                return temp
            }
            return accessors.reduce((data, key, i) => {
                if (data[key] === undefined && i !== accessors.length - 1) data[key] = {};
                if (i === accessors.length - 1) {
                    if (assignment) data[key] = assignment;
                    if (args) return data[key](...args);
                }
                return data[key]
            }, data);
        } catch (err) {
            //console.log(`Failed to access path ${path} on object ${data}`, err);
        }
    }

    /**
     * Reverse the keys of an object 1 level deep, if it encounters an object it will swap the fallbackKey property
     * for that of the key
     * @param config 
     * @param fallbackKey
     */
    private static reverse(config, fallbackKey = "accessor") {
        return Object.entries(config).reduce((output, [targetProp, dataProp]: [string, any]) => {
            if (typeof dataProp === "string") {
                output[dataProp] = targetProp;
            } else if (dataProp !== null) {
                output[dataProp[fallbackKey]] = Object.assign({}, dataProp, { [fallbackKey]: targetProp });
            }
            return output
        }, {});
    }

    /**
     * Iterate over the keys dynamically creating the load functions that the application
     * uses to load data from external sources.
     * @param map Schema of keys from a config file
     */
    private static makeLoadFunction(map) {
        return function (target, data, ...args) {
            try {
                Object.entries(map).forEach(([targetProp, dataProp]: [string, any]) => {
                    if (dataProp?.save_only === true) return;

                    const { accessor, transform, revert, helper, apply, Entity } = dataProp || {}

                    switch (targetProp) {
                        case "__REVERSE":
                            break
                        case "__STATIC__":
                            break
                        default:
                    }
                    if (typeof dataProp === "string") {
                        /**
                         * If the target is simply a string representing the path for the key to access
                         */
                        const assignment = Serializer.access(data, dataProp);
                        if (assignment) Serializer.access(target, targetProp, { assignment });
                    } else if (dataProp === null) {

                    } else if (typeof dataProp === "object") {
                        /**
                         * If the target is an object we need to examine its keys and react accordingly
                         */
                        if (transform) {
                            /**
                             * If we need to access and transform the value from the data we do so here by creating a new function and passing
                             * it the data object
                             */
                            try {
                                target[targetProp] = new Function('data', transform)(data);
                            } catch (err) {
                                console.log(`Failed to transform ${JSON.stringify(dataProp)}`, err);
                            }
                        } else if (helper) {
                            /**
                             * If we need a helper function we can define it in the loader 
                             */
                            const args = (helper?.args ?? []).map(arg => data[arg]);
                            const helperKey = helper?.key;
                            if (helperKey) target[targetProp] = this[helperKey]().load(target, ...args);
                        } else if (apply) {
                            const args = [];
                        } else if (false) {

                        } else if (Entity) {
                            /**
                             * If we encounter a special loading entity we need to call some special methods to create them.
                             */
                            const args = dataProp?.constructor.args
                            try {
                                if (dataProp?.process === "array") {
                                    data[dataProp.accessor]?.forEach((index, i) => {
                                        const output = Serializer.access(target, dataProp?.constructor.key, { args: args?.map(arg => index[arg]) });
                                        output.load(index);
                                    });
                                } else {
                                    const output = Serializer.access(target, dataProp?.constructor.key, { args: args?.map(arg => data[arg]) });
                                    output.load(data[dataProp.accessor]);
                                }
                            } catch (err) {
                                console.log(`Failed to construct sub-item`, err);
                            }
                        }
                    }
                });
                /**
                 * Lastly return anything that uses the child tags
                 */
                const children = data.children;
                if (Array.isArray(children)) return children
            } catch (err) {
                console.log(`Failed to make load function`, err, data);
            }
        }
    }
    private static makeSaveFunction(map) {
        const reverse = Serializer.reverse(map);
        return function (target, data, ...args) {
            const output: any = {}
            try {
                Object.entries(reverse).forEach(([targetProp, dataProp]: [string, any]) => {
                    if (dataProp?.load_only === true) return;
                    const { accessor, transform, revert, helper, apply, Entity, value } = dataProp || {}

                    switch (targetProp) {
                        case "__REVERSE":
                            break
                        case "__STATIC__":
                            break
                        default:
                    }
                    if (typeof dataProp === "string") {
                        /**
                         * If the target is simply a string representing the path for the key to access
                         */
                        const assignment = Serializer.access(target, dataProp);
                        if (assignment) Serializer.access(output, targetProp, { assignment });
                    } else if (dataProp === null) {

                    } else if (typeof dataProp === "object") {
                        /**
                         * If the target is an object we need to examine its keys and react accordingly
                        */
                        if (value) {
                            output[targetProp] = value;
                        } else if (revert) {
                            /**
                             * If we need to access and transform the value from the data we do so here by creating a new function and passing
                             * it the data object
                             */
                            try {
                                output[targetProp] = new Function('data', dataProp?.revert)(target);
                            } catch (err) {
                                console.log(`Failed to transform ${JSON.stringify(dataProp)}`, err);
                            }
                        } else if (helper) {
                            /**
                             * If we need a helper function we can define it in the loader
                             */
                            const args = (helper?.args ?? []).map(arg => Serializer.access(target, arg));
                            const helperKey = helper?.key;
                            if (helperKey) output[targetProp] = this[helperKey]().save(target, ...args);
                        } else if (apply) {
                            const args = [];
                        } else if (false) {

                        } else if (Entity) {
                            /**
                             * If we encounter a special loading entity we need to call some special methods to create them.
                             */
                            //const args = dataProp?.constructor.args;
                            try {
                                if (dataProp?.process === "array") {
                                    target[dataProp.accessor]?.forEach((index, i) => {
                                        //const results = Serializer.access(target, dataProp?.accessor, { args: args?.map(arg => Serializer.access(index, arg)) });
                                        output[targetProp] = [...target[dataProp?.accessor]].map(result => result.save());
                                    });
                                } else {
                                    //const result = Serializer.access(target, dataProp?.accessor, { args: args?.map(arg => Serializer.access(target, arg)) });
                                    output[targetProp] = target[dataProp?.accessor].save();
                                }
                            } catch (err) {
                                console.log(`Failed to construct sub-item`, err);
                            }
                        }
                    }
                });
                /**
                 * Lastly return anything that uses the child tags
                 */
                const children = [...target?.children ?? []];
                if (Array.isArray(children) && target.canContainChildren === true) output.children = children.map(child => child.save());
            } catch (err) {
                console.log(`Failed to make save function`, err, data);
            }
            return output
        }
    }
    private static applyTemplates(templates, map) {
        const final = {};
        templates.forEach(template => {
            Object.assign(final, template);
        })
        return Object.assign(final, map);
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

            this.#transformers.set(Character.Entities[constructor] || constructor, {
                load,
                save
            })
        });
    }

    abstract loadList(list: List<any>, ...args): List<any>
    abstract saveList(list: List<any>, ...args): any

    abstract load(character: Sheet, data: any, ...args: any[]): Sheet
    abstract save(character: Sheet, target: any, ...args: any[]): any
}

type transformFunction = (target: any, data: any, ...args) => any

class Transformer {
    constructor() {

    }
}