import * as Comlink from "comlink";
import SkillWorker from "worker-loader!./gurps/workerscripts/skill.worker";
import { Skill } from "./gurps/workerscripts/skill.worker";
import { State, Change } from 'rxdeep';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Observer, Subject } from 'rxjs';
import { getPath, db, Main, AutoSubscriber } from '@internal';
import $RefParser, { JSONSchema } from '@apidevtools/json-schema-ref-parser';
import Ajv from 'ajv';
import jsonquery from 'json-query';
import { IDatabaseChange, DatabaseChangeType } from 'dexie-observable/api';
import { connectToParent } from "penpal"
import { GResource, Resource } from './resource';
export interface Ident {
    rootId?: string
    id: string
    type: string
}
export type TypeCollection = Record<string, Data[]>
export interface MetaData {
    alternativeIds: Record<string, string>
    source: string
    progenitor?: string
    enabled: boolean
    flags: Record<string, any>
    createdOn: number
    lastEdit: number
}
export interface Data extends Record<string, any>, Ident {
    version: number
    categories: string[]
    name: string
    children: TypeCollection
    features: any[]
    config?: Record<string, any>
    metadata: MetaData
}
export interface ResourceRegister {
    type: string
    caster: GResource
    schema: string | JSONSchema
}
interface System {
    db: typeof db,
    resources: Collection
    changes$: Subject<IDatabaseChange[]>
    casters: Record<string, any>
    validator: Ajv
    $parser: $RefParser
    locals: {
        descendants(this: jsonquery.Options, input: Data, maxDepth?: number): Data[]
        ancestors(this: jsonquery.Options, input: Data): Data[]
        add(this: jsonquery.Options, input: number, ...numbers: number[]): number
        subtract(this: jsonquery.Options, input: number, ...numbers: number[]): number
        multiply(this: jsonquery.Options, input: number, ...numbers: number[]): number
        divide(this: jsonquery.Options, input: number, ...number: number[]): number
        then(this: jsonquery.Options, input, thenValue, elseValue): any
        pluck(this: jsonquery.Options, input, ...properties: string[]): any
        select(this: jsonquery.Options, input, ...properties: string[]): any[]
        path(this: jsonquery.Options, input): string[]
        paths(this: jsonquery.Options, input: any[]): string[][]
        deep(this: jsonquery.Options, input): any[]
        debug(this: jsonquery.Options, input, message?): any
    }
    methods: typeof methods
    check(key: string): boolean
    addSchema(...schema: (string | JSONSchema)[])
    register(...resources: ResourceRegister[])
    init(): Promise<void>
}

const methods = {
    async create(...data: ({
        id?: string,
        type: string
        root?: string
        parent?: string
    })[]) {
        for (const piece of data) {
            const { root, parent = root, id } = piece;
            delete piece.root
            delete piece.parent
            if (root) {
                const target = new Resource(root || id);
                const resource = typeof parent === "string" ? AutoSubscriber.get(target.selectEmbedded(parent)) : target;
                resource.embed(piece as Data)
            } else {
                Resource.create(piece)
            }
        }
    },
    async read(...idents: {
        id: string
        root?: string
    }[]) {
        const data = [];
        for (const ident of idents) {
            const { id, root } = ident;
            const target = new Resource(System.resources.sub(root || id));
            const resource = typeof root === "string" ? AutoSubscriber.get(target.selectEmbedded(id)) : target;
            data.push(resource.value);
        }
        return data
    },
    async update(...data: ({
        id: string
        root?: string
    })[]) {
        for (const piece of data) {
            const { id, root } = piece;
            delete piece.root;
            const target = new Resource(System.resources.sub(root || id));
            const resource = typeof root === "string" ? AutoSubscriber.get(target.selectEmbedded(id)) : target;
            resource.value = piece as Data;
        }
    },
    async delete(...idents: {
        id: string
        root?: string
    }[]) {
        for (const ident of idents) {
            const { id, root } = ident;
            const target = new Resource(System.resources.sub(root || id));
            const resource = typeof root === "string" ? AutoSubscriber.get(target.selectEmbedded(id)) : target;
            resource.delete();
        }
    }
}

export const System: System = {
    db,
    resources: undefined,
    changes$: new Subject(),
    casters: {},
    validator: new Ajv({
        strict: false,
        coerceTypes: true,
        useDefaults: true
    }),
    $parser: new $RefParser(),
    locals: {
        descendants(input, maxDepth) {
            maxDepth = +maxDepth || Number.POSITIVE_INFINITY;
            let currentDepth = 0;
            const descendants: Data[] = [];
            function descend(data: Data) {
                const children = Object
                    .entries(data?.children ?? {})
                    .reduce((a, [type, dataset]) => [...a, ...dataset || []], [] as Data[])
                    .filter(v => !!v)
                descendants.push(...children);
                if (++currentDepth < maxDepth) {
                    for (const child of children) {
                        descend(child);
                    }
                }
            }
            descend(input);
            return descendants
        },
        ancestors(input) {
            const nodes = System.locals.descendants.call(this, this.data)
            return nodes.slice(0, nodes.indexOf(input))
        },
        add(input, ...numbers) {
            return numbers.reduce((a, b) => a + b, input)
        },
        subtract(input, ...numbers) {
            return numbers.reduce((a, b) => a - b, input)
        },
        multiply(input, ...numbers) {
            return numbers.reduce((a, b) => a * b, input)
        },
        divide(input, ...numbers) {
            return numbers.reduce((a, b) => a / b, input)
        },
        then(input, thenValue, elseValue) {
            return input ? thenValue : elseValue
        },
        pluck(input, ...properties) {
            return properties.reduce((a, b) => a[b], input)
        },
        select(input, ...properties) {
            if (Array.isArray(input)) {
                return input.flatMap(value => System.locals.select.call(this, value, ...properties))
            } else {
                return properties.map(prop => input[prop])
            }
        },
        path(input) {
            return getPath(this.data, input)
        },
        paths(input) {
            return input?.map(System.locals.path, this) ?? []
        },
        deep(input) {
            const array = [];
            function descend(input) {
                array.push(input);
                if (Array.isArray(input)) {
                    input.forEach(descend)
                } else if (typeof input === "object") {
                    Object.values(input).map(descend)
                }
            }
            descend(input);
            return array
        },
        debug(input, message) {
            console.group(message, this, input);
            return input
        }
    },
    methods,
    check(key: string) {
        return key && System.resources.value[key]?.id === key
    },
    async addSchema(schema, key?: string) {
        try {
            const dereferenced = await System.$parser.bundle(schema);
            System.validator.addSchema(dereferenced, key);
        } catch (err) {
            console.log(`Failed to add schema ${key || ''}`, schema, err);
        }
    },
    async register(...resources) {
        for (const { type, caster, schema } of resources) {
            System.casters[type] = caster;
            await System.addSchema(schema, type);
        }
    },
    async init() {
        let methods: any;
        try {
            const connection = connectToParent({
                methods: this.methods,
            });
            methods = await connection.promise;
        } catch (err) {

        }
        Object.assign(window, { System });
        System.db.on('changes', changes => {
            System.changes$.next(changes);
            if (
                methods &&
                typeof methods.change === "function"
            ) {
                methods.post(changes);
            }
        });
        const SkillClass = Comlink.wrap<typeof Skill>(new SkillWorker());
        console.log(SkillClass);
        const testSkillClass = new SkillClass({} as any, {} as any);
        (await testSkillClass).test("MY MESSAGE IS STRONG");
        const resources = await System.db.table<Data>("index").toArray();
        const hash = resources.reduce((hash, resource) => Object.assign(hash, { [resource.id]: resource }), {} as Record<string, Data>);
        System.resources = new Collection(hash, 'index');
        new Main({
            target: document.body
        });
    }
}
type KeyMap<T> = Record<string, T>;
export class Collection extends State<KeyMap<Data>> {
    constructor(initial, table: string) {
        super(
            initial
        );
        this.watchTable(table).pipe(
            debounceTime(3000)
        ).subscribe(this.next.bind(this));
        this.downstream.subscribe(Collection.tableObserver(table));
    }
    get(type: string) {
        return this.pipe(
            map(values => Object.values(values).filter(v => v != undefined)),
            map(values => values.filter(value => value.type === type)),
            map(values => values.map(value => value.id)),
            distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
            map(ids => ids.filter(id => this.value[id].id === id)),
            map(ids => ids.map(id => new Resource(this.sub(id))))
        )
    }
    watchTable(table: string) {
        return System.changes$.pipe(
            map(changes => changes
                .filter(change => change.table === table)
                .reduce((cv, change) => {
                    if (change.type === DatabaseChangeType.Create) {
                        cv[change.key] = change.obj;
                    } else if (change.type === DatabaseChangeType.Delete) {
                        delete cv[change.key]
                    } else if (change.type === DatabaseChangeType.Update) {
                        const { oldObj, obj } = change;
                        const stamp = obj?.metadata?.lastEdit;
                        const currentStamp = cv[change.key]?.metadata?.lastEdit
                        if (stamp > currentStamp) {
                            cv[change.key] = change.obj;
                        }
                    }
                    return cv
                }, this.value)
            )
        )
    }
    static tableObserver(table: string): Observer<Change<Record<string, Data>>> {
        return {
            async next(change) {
                const subs = change?.trace['subs'] as Record<string, { from: Data, to: Data }>
                if (!subs) {
                    const from = change.trace['from'] as Record<string, Data>;
                    const to = change.trace['to'] as Record<string, Data>;
                } else {

                }
                const changedKeys = Object.keys(subs || {}).filter(v => v);
                const deletedKeys = changedKeys.filter(key => change.value[key] === undefined);
                const updatedKeys = changedKeys.filter(key => subs[key]);
                const addedKeys = changedKeys.filter(key => subs[key].from === undefined && subs[key].to);
                const updatedValues = updatedKeys
                    .map(key => change.value[key])
                    .filter(value => value && value.type && System.validator.validate(value.type, value));
                const addedValues = addedKeys
                    .map(key => change.value[key])
                    .filter(value => value && value.type && System.validator.validate(value.type, value));
                if (deletedKeys) await System.db.table<Data>(table).bulkDelete(deletedKeys);
                if (addedValues) await System.db.table<Data>(table).bulkAdd(addedValues);
                if (updatedValues) await System.db.table<Data>(table).bulkPut(updatedValues);
            },
            error(err) { },
            complete() {

            }
        }
    }
}