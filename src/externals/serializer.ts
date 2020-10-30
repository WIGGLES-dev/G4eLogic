export function registerSerializer(serializer: any, scheme: string) {
    Serializer.serializers.set(scheme, new serializer());
    return serializer
}

type transformFunction = (params: TransformParams) => any
interface TransformParams {
    scheme: string,
    target: { [key: string]: any }
    data: { [key: string]: any }
}
export abstract class Serializer {
    static serializers: Map<string, Serializer> = new Map()

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
    private static access(data, path, { assignment }: { assignment?: string } = {}) {
        try {
            const accessors = path.split(".");
            if (accessors.length === 1) {
                let temp = data[accessors[0]];
                if (assignment) data[accessors[0]] = assignment;

                return temp
            }
            return accessors.reduce((data, key, i) => {
                if (data[key] === undefined && i !== accessors.length - 1) data[key] = {};
                if (i === accessors.length - 1) {
                    if (assignment) data[key] = assignment;
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
    private static reverse(config, fallbackKey = "path") {
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
    private static makeFunction(map: any, type: string): transformFunction {
        const scheme = map.scheme;
        if (!scheme) return
        return function ({ scheme, target, data }) {
            try {
                Object.entries(map).forEach(([targetProp, dataProp]: [string, any]) => {
                    if (typeof dataProp === "string") {
                        const assignment = Serializer.access(target, dataProp);
                        if (assignment) Serializer.access(target, targetProp, { assignment });
                    } else if (dataProp === null) {

                    } else if (typeof dataProp === "object") {
                        const { path, load, save } = dataProp || {}
                        const fBody = dataProp[type];
                        if (!fBody) return
                        let assignment = new Function("data,target,scheme", fBody).bind(this)(data, target, scheme);
                        Serializer.access(target, targetProp, { assignment });
                    }
                });
            } catch (err) {
                console.log(`Failed to make load function`, err, data);
            }
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

            const load = Serializer.makeFunction(finalMap, "load");
            const save = Serializer.makeFunction(Serializer.reverse(finalMap), "save");

            this.#transformers.set(constructor, {
                load,
                save
            })
        });
    }

    abstract load(params: TransformParams): any
    abstract save(params: TransformParams): any
}