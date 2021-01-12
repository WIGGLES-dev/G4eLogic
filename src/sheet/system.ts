import db from 'dexie';
import { DatabaseChangeType, IDatabaseChange } from 'dexie-observable/api';
import { Collection, GConstructor, Resource, orArray, OrArray, Component, GResource } from "@internal"
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import Ajv from "ajv"
import { State, reverse } from "rxdeep";
import { v4 as uuidv4 } from 'uuid';
import $RefParser from '@apidevtools/json-schema-ref-parser';
export interface Identity {
    type: string
    id: string
}
export enum CrudEventType {
    Create = "create",
    Delete = "delete",
    Update = "update",
    Embed = "embed",
    Transfer = "transfer",
}
export interface CrudEvent {
    type: CrudEventType,
    data: any[]
}
export interface CrudOptions {
    silent?: boolean
}
export interface CreateOptions extends CrudOptions {
    temporary?: boolean
}
export interface UpdateOptions extends CrudOptions { }
export interface DeleteOptions extends CrudOptions { }
export interface EmbedOptions extends CrudOptions { }
interface Transfer extends CrudOptions {
    from: Identity,
    to: Identity
}
interface TransferOptions extends CrudOptions { }

export class Crud {
    static tag(): string { return uuidv4() as string }
    static stamp(): number { return new Date().getTime() }
    static extractIdentity(identifiable: Identity): Identity {
        const { id, type } = identifiable
        return {
            id,
            type
        }
    }
    static async create<C extends OrArray<{ [key: string]: any, type: string }>>(resources: C, options?: CreateOptions) {
        const created: Resource[] = []
        const stamp = this.stamp();
        for (let resource of orArray(resources)) {
            const {
                id = this.tag(),
                type,
                createdOn = stamp
            } = resource;
            const collection = System.collections.get(type);
            if (!collection) continue
            const data = await System.collections.get(resource.type)?.create({
                ...resource,
                type,
                id
            });
            const index = await System.index.create({
                type,
                id,
                alternativeIds: {},
                source: 'Valor',
                createdOn,
                lastEdit: undefined,
                enabled: true,
                parent: undefined,
                canContainChildren: false,
                children: undefined,
                flags: {}
            });
            collection.table.put(data, id);
            System.index.table.put(index, id);
            created.push(new Resource({ id, type: resource.type }));
        }
        return created
    }
    static async read(resources) {

    }
    static async update(updates: OrArray<Record<string, any> & Identity>, options?: UpdateOptions) {
        const lastEdit = this.stamp();
        for (const update of orArray(updates)) {
            const {
                id,
                type
            } = update;
            if (!System.check(id)) continue;
            const collection = System.collections.get(type);
            if (!collection) continue
            const index = await System.index.update({
                id,
                lastEdit
            });
            const data = await collection.update(update);
            System.index.table.update(id, index);
            collection.table.update(id, data);
        }
    }
    static async delete(identifiers: OrArray<Identity>, options?: DeleteOptions) {
        for (const { id, type } of orArray(identifiers)) {
            try {
                const collection = System.collections.get(type);
                if (!collection || !System.check(id)) { console.log('skip delete'); continue; }
                const { parent } = System.index.state.value[id];
                if (parent) {
                    const ci = System.index.state.value[parent.id];
                    if (ci && ci.children && ci.children[type] && ci.children[type][id]) {
                        delete ci?.children[type][id];
                        System.index.update({
                            id: parent.id,
                            type: parent.type,
                            children: {
                                ...ci.children
                            }
                        });
                    }
                }
                const children = System.getDescendantsOf(id);
                await collection.delete(id);
                await collection.table.delete(id);
                await System.index.delete(id);
                await System.index.table.delete(id);
                await this.delete(children);
            } catch (err) {
                console.log(err);
            }
        }
    }
    /**
    * Creates @type {Embedded} or @type {Inlined} data in the applications state.
    * @todo batch updates rather than do them in the for loop.
    * @param embeds The new data to embed, must contain a parentIdentity key.
    * @param options Options to change how the embed operation takes place.
    */
    static async embed(embeds: OrArray<{ parent: Identity, type: string }>, options?: EmbedOptions) {
        const created: Resource[] = [];
        const { } = options || {};
        for (const embed of orArray(embeds)) {
            const { type, parent } = embed;
            delete embed.parent;
            if (!System.check(parent.id)) continue
            const id = this.tag();
            await this.create({
                ...embed,
                type,
                id
            });
            const update1 = {
                id,
                type,
                parent
            };
            const update2 = {
                id: parent.id,
                type: parent.type,
                children: {
                    [type]: {
                        [id]: {
                            id,
                            type
                        }
                    }
                }
            };
            await System.index.update(update1);
            await System.index.update(update2);
            created.push(new Resource({ id, type }))
        }
        return created
    }
    static async transfer(transfers: OrArray<Transfer>, options?: TransferOptions) {
        const { } = options || {};
        for (const transfer of orArray(transfers)) {
            const { from, to } = transfer
            if (!from || !System.check(from.id) || !to || !System.check(to.id)) continue
            const payload = new Resource(from);
            const target = new Resource(to);
            const targetMd = target.getMetadata();
            const payloadMd = payload.getMetadata();
            /**
             * If some resource in the embed chain has the same id as this resource a circular dependency exception is thrown.
             * @todo Actually throw the exception.
             */

            if (System.getTrailOf(target.id).some(resource => resource.id === payload.id)) {
                console.log('circular reference creation attempted');
                continue
            }
            if (targetMd.canContainChildren === false) {
                this.transfer({
                    from,
                    to: targetMd.parent
                });
                continue
            }
            /**
             * Remove the identity reference from the previous origin if any.
             */
            const origin = payloadMd.parent
            if (System.check(origin.id)) {
                System.index.update({
                    ...origin,
                    children: {
                        [payload.type]: {
                            [payload.id]: undefined
                        }
                    }
                })
            }
            /**
             * Update the target with the new identity reference.
             */
            System.index.update({
                ...payload.identity,
                parent: target.identity
            });
            System.index.update({
                ...target.identity,
                children: {
                    [payload.type]: {
                        [payload.id]: payload.identity
                    }
                }
            });
        }
    }
    static async eject(identities: OrArray<Identity>) {
        for (const identity of orArray(identities)) {
            const { id, type } = identity
            const metadata = System.index.read(id)
            if (!metadata) continue
            const { parent, children } = metadata;
            if (!System.check(parent.id)) continue
            const nextLevel = System.index.read(parent.id);
            if (!nextLevel) continue
            if (!System.check(nextLevel.id)) continue
            this.transfer({
                from: identity,
                to: nextLevel
            });
            for (const [type, collection] of Object.entries(children)) {
                for (const [id, resource] of Object.entries(collection)) {
                    this.eject(resource);
                }
            }
        }
    }
}
export type TypeCollection<D extends Identity = Identity> = Record<string, Record<string, D>>
export interface MetaData extends Identity {
    alternativeIds: Record<string, string>
    source: string
    progenitor?: Identity
    enabled: boolean
    flags: Record<string, any>
    parent: Identity
    canContainChildren: boolean
    order?: number
    children: TypeCollection
    createdOn: number
    lastEdit: number
}
interface DataDump<K = any> extends MetaData {
    parent: DataDump
    children: TypeCollection<DataDump>
    keys: K
}
export interface ResourceRegister {
    type: string
    caster: GResource
    schema: Record<string, any> | string
}
export class System {
    static db = new db('valor')
    static crud = Crud
    static validator = new Ajv({
        strict: false,
        coerceTypes: true,
        useDefaults: true,
    })
    static parser = new $RefParser()
    static components: Map<string, Component> = new Map()
    static casters: Map<string, GResource> = new Map()
    static async getCaster(type: string) { }
    static async getComponent(component: string) { }
    static async getSchema(schema: string) { }
    static index = new Collection<MetaData>({
        type: 'index'
    })
    static collections: Map<string, Collection<Identity>> = new Map()
    constructor() {

    }
    static equals(a, b): boolean {
        try {
            return JSON.stringify(a) === JSON.stringify(b)
        } catch (err) {
            return false
        }
    }
    static getDescendantsOf(
        id: string,
        {
            maxDepth = Number.POSITIVE_INFINITY
        } = {},
        currentDepth = 0,
        descendants: Identity[] = []
    ): Identity[] {
        const metadata = this.index.read(id);
        if (!metadata) return descendants
        const { children } = metadata || {};
        if (children && currentDepth < maxDepth) {
            for (const [type, branch] of Object.entries(children)) {
                for (const [cid, identity] of Object.entries(branch)) {
                    if (identity == null) continue
                    descendants.push({
                        id: cid,
                        type
                    });
                    this.getDescendantsOf(cid, { maxDepth }, currentDepth + 1, descendants);
                }
            }
        }
        return descendants
    }
    static getTrailOf(id: string, trail: Identity[] = []): Identity[] {
        const metadata = this.index.read(id);
        if (!metadata) return trail
        const { parent } = metadata || {}
        if (parent) {
            trail.push(parent);
            this.getTrailOf(parent.id, trail)
        }
        return trail
    }
    static async register(...resources: ResourceRegister[]) {
        for (const { type, caster, schema } of resources) {
            this.casters.set(type, caster);
            this.collections.set(type, new Collection({
                type
            }));
            const _schema = await this.parser.dereference(schema);
            this.validator.addSchema(_schema, type);
        }
    }
    static validate<D>(type: string, data: any): data is D {
        return this.validator.validate(type, data)
    }
    static check(id: string) { return this.index.check(id) }
    static dumps(ident: Identity) {
        const { id, type } = ident;
        const collection = this.collections.get(type);
        if (!collection) return
        const root = System.index.read(id);
        const keys = collection.read(id);
        const dump = { ...root, keys };
        const children = root.children;
        for (const type in children) {
            const collection = children[type] || {};
            for (const [_id, identity] of Object.entries(collection)) {
                const _dump = this.dumps(identity);
                dump.children[type][_id] = _dump
            }
        }
        return dump
    }
    static loads(data: DataDump) {
        const { id, type, children } = data;
        const collection = this.collections.get(type);
        if (!collection) return
        const load: MetaData = { ...data }
        for (const type in children) {
            const collection = children[type] || {};
            for (const [_id, resource] of Object.entries(collection)) {
                load.children[type][_id] = System.crud.extractIdentity(resource);
                this.loads(resource);
            }
        }
        System.crud.create(load);
    }
    private static _handleChange(changes: IDatabaseChange[]) {
        for (const change of changes) {
            const collection = this.collections.get(change.table);
            if (!collection) return;
            if (change.type === DatabaseChangeType.Create) {
                collection.create({
                    id: change.key,
                    ...this.db.table(change.table).get(change.key)
                });
            } else if (change.type === DatabaseChangeType.Delete) {
                collection.delete(change.key);
            } else if (change.type === DatabaseChangeType.Update) {
                collection.update({
                    id: change.key,
                    ...change.obj
                });
            }
        }
    }
    private static async _loadTables() {
        const loading = [];
        for (const collection of [...this.collections.values(), this.index]) {
            const table = collection.table;
            if (!table) continue;
            const promise = table.each(collection.create.bind(collection));
            loading.push(promise);
        }
        return Promise.all(loading);
    }
    static async init(fn: () => Promise<void> = async () => { }) {
        await fn();
        const stores = {
            'index': 'id,type'
        };
        for (const [key, collection] of this.collections) {
            stores[key] = 'id,type'
        }
        this.db.version(1).stores(stores);
        //this.db.on('changes', this._handleChange.bind(this));
        await this._loadTables();
        //@ts-ignore
        window.system = this;
    }
}
const metaDataSchema = {
    $id: "http://valorsheet/systems/gurps/resource.json",
    type: "object",
    properties: {
        id: {
            type: "string",
        },
        type: {
            type: "string",
        }
    },
    required: ["id", "type"]
}
System.validator.addSchema(metaDataSchema, 'index');