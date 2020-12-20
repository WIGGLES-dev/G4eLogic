import {
    EntityStore,
    EntityState,
    QueryEntity,
    EntityStateHistoryPlugin,
    createEntityStore,
    createEntityQuery,
    transaction,
    EntityDirtyCheckPlugin,
    snapshotManager,
    combineQueries,
    distinctUntilArrayItemChanged,
    StoreConfigOptions,
    ActiveState,
    MultiActiveState
} from "@datorama/akita"
import { asyncScheduler, combineLatest, concat, EMPTY, from, merge, MonoTypeOperatorFunction, Observable, partition, scheduled, Subject, zip } from "rxjs"
import {
    catchError,
    concatAll,
    defaultIfEmpty,
    expand,
    filter,
    groupBy,
    map,
    mergeAll,
    mergeMap,
    mergeScan,
    pluck,
    reduce,
    scan,
    startWith,
    switchAll,
    switchMap,
    takeWhile,
    tap,
    withLatestFrom
} from "rxjs/operators"
import { v4 as uuidv4 } from "uuid";
import * as jp from "jsonpath";
import * as searchjs from "searchjs";
import deepmerge from "deepmerge";
import {
    OrArray,
    orArray,
    GConstructor,
    total,
    matchArray,
    log,
    mapEach,
    collapse,
    each,
    filterEach
} from "@internal";
import Ajv from "ajv";
import { identity, toArray } from "lodash";

export interface Unique {
    id: string
    type: string
}
interface Embedded {

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
    from: Unique,
    to: Unique
}
interface TransferOptions extends CrudOptions { }

export class Crud {
    static tag(): string { return uuidv4() as string }
    static stamp(): number { return new Date().getTime() }
    static extractIdentity(identifiable: Unique): Unique {
        const { id, type } = identifiable
        return {
            id,
            type
        }
    }
    @transaction()
    static async create<C extends OrArray<{ [key: string]: any, type: string }>>(resources: C, options?: CreateOptions) {
        const created: Resource[] = []
        for (let resource of orArray(resources)) {
            const id: string = resource.id
                ? Registry.check(resource.id) ?
                    false : resource.id
                : this.tag();
            const createdOn = this.stamp();
            const lastEdit: number = undefined;
            Registry.index.store.add({
                type: resource.type,
                id,
                alternativeIds: {},
                createdOn,
                lastEdit,
                enabled: true,
                parent: undefined,
                canContainChildren: false,
                children: undefined,
                tags: [] as string[],
                flags: {}
            });
            Registry.collections.get(resource.type)?.store.add({
                ...resource,
                id
            });
            created.push(new Resource({ id, type: resource.type }))
        }
        return created
    }
    @transaction()
    static async update(updates: OrArray<Record<string, any> & Unique>, options?: UpdateOptions) {
        const lastEdit = new Date().toJSON()
        for (const update of orArray(updates)) {
            if (!Registry.check(update.id)) continue;
            const { store, query } = Registry.collections.get(update.type);
            if (!store) continue
            store.update(update.id, state => {
                const newState = deepmerge.all([state, update, { lastEdit }], {
                    arrayMerge: (t, s) => s
                });
                return newState
            });
        }
    }
    @transaction()
    static async delete(identifiers: OrArray<Unique>, options?: DeleteOptions) {
        for (const { id, type } of orArray(identifiers)) {
            if (!Registry.check(id)) continue;
            const metadata = Registry.index.query.getEntity(id);
            await Registry.index.store.update(metadata.parent?.id, state => {
                const newState = Resource.clone(state);
                delete newState.children[type][id];
                return newState
            })
            const children = Registry.getDescendantsOf(id);
            Registry.index.store.remove(id)
            Registry.collections.get(type)?.store?.remove(id)
            this.delete(children);
        }
    }
    /**
    * Creates @type {Embedded} or @type {Inlined} data in the applications state.
    * @todo batch updates rather than do them in the for loop.
    * @param embeds The new data to embed, must contain a parentIdentity key.
    * @param options Options to change how the embed operation takes place.
    */
    @transaction()
    static async embed(embeds: OrArray<Partial<Data> & { parent: Unique, type: string }>, options?: EmbedOptions) {
        const created: Resource[] = [];
        const { } = options || {};
        for (const embed of orArray(embeds)) {
            const { type } = embed;
            const parent = embed.parent;
            if (!Registry.check(parent.id)) continue
            const id = this.tag();
            this.create({
                type,
                id
            })
            Registry.index.store.update(id, state => deepmerge(state, {
                parent
            }, {
                arrayMerge: (t, s) => s
            }));
            Registry.index.store.update(parent.id, state => deepmerge(state, {
                children: {
                    [type]: {
                        [id]: {
                            type,
                            id
                        }
                    }
                }
            }, {
                arrayMerge: (t, s) => s
            }));
            created.push(new Resource({ id, type }))
        }
        return created
    }
    @transaction()
    static async transfer(transfers: OrArray<Transfer>, options?: TransferOptions) {
        const { } = options || {};
        for (const transfer of orArray(transfers)) {
            const { from, to } = transfer
            if (!from || !Registry.check(from.id) || !to || !Registry.check(to.id)) continue
            const payload = new Resource(from);
            let target = new Resource(to);
            const targetMd = target.getMetadata();
            const payloadMd = payload.getMetadata();
            /**
             * If some resource in the embed chain has the same id as this resource a circular dependency exception is thrown.
             * @todo Actually throw the exception.
             */

            if (target.getTrail().some(resource => resource.id === payload.id)) continue
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
            if (Registry.check(origin.id)) {
                Registry.index.store.update(origin.id, state => {
                    try {
                        const newState = Resource.clone(state);
                        delete newState.children[payload.type][payload.id];
                        return newState
                    } catch (err) {
                        return state
                    }
                })
            }
            /**
             * Update the target with the new identity reference.
             */
            Registry.index.store.update(payload.id, state => deepmerge(state, {
                parent: target.identity
            }, {
                arrayMerge: (t, s) => s
            }));
            Registry.update({
                id: target.id,
                children: {
                    [payload.type]: {
                        [payload.id]: {
                            type: payload.type,
                            id: payload.id
                        }
                    }
                }
            });
        }
    }
    @transaction()
    static async eject(identities: OrArray<Unique>) {
        for (const identity of orArray(identities)) {
            const { id, type } = identity
            const metadata = Registry.index.query.getEntity(id);
            if (!metadata) continue
            const { parent, children } = metadata;
            if (!Registry.check(parent.id)) continue
            const nextLevel = Registry.index.query.getEntity(parent.id);
            if (!nextLevel) continue
            if (!Registry.check(nextLevel.id)) continue
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
    static save() { }
    static load() { }
}
interface CollectionConfig extends StoreConfigOptions {
    schema: any
}
export type GEState<E> = EntityState<E, string> & MultiActiveState
export type GEStore<E> = EntityStore<GEState<E>>
export type GEQuery<E> = QueryEntity<GEState<E>>
export type GEHistory<E> = EntityStateHistoryPlugin<GEState<E>>
export class Collection<Model extends Unique> {
    class: GConstructor<any>
    table?: any
    get name() { return this.store.storeName }
    schema: any
    store: GEStore<Model>
    query: GEQuery<Model>
    state: GEHistory<Model>
    dirty: EntityDirtyCheckPlugin<GEState<Model>>
    constructor(config: CollectionConfig) {
        this.schema = this.schema;
        try {
            Registry.validator.addSchema(config.schema, config.name);
        } catch (err) {
            console.error(config.name, config.schema, err);
        }

        this.store = createEntityStore<GEState<Model>>({}, config);
        this.query = createEntityQuery(this.store);
        this.state = new EntityStateHistoryPlugin(this.query);
        this.dirty = new EntityDirtyCheckPlugin(this.query);
        this.store.akitaPreCheckEntity = this.preCheck.bind(this) as this["preCheck"];
        this.store.akitaPreAddEntity = this.preAdd.bind(this) as this["preAdd"];
        this.store.akitaPreUpdateEntity = this.preUpdate.bind(this) as this["preUpdate"];
    }
    selectInstances(ids?: string[]): Observable<Resource[]> {
        return (ids instanceof Array ?
            this.query.selectMany(ids) : this.query.selectAll()
        )
            .pipe(
                map(
                    entities => entities.filter(v => !!v)
                        .map(data => new Resource(data))
                        .filter(r => r.exists),
                )
            )
    }
    selectActive() {
        return this.query.selectActive().pipe(
            map(r => r && r[0]),
            filter(r => !!r),
            map(r => new Resource(r).cast(
                Registry.classes.get((r.type)) || Resource
            ))
        )
    }
    validate(data: any): data is Model {
        try {
            const result = Registry.validate<Model>(this.name, data)
            return result
        } catch (err) {
            console.error(
                this,
                data,
                err
            )
            return false
        }
    }
    preCheck(data: Model) { return data }
    preAdd(data: Model): Model {
        if (this.validate(data)) {
            return data
        }
    }
    preUpdate(oldData: Readonly<Model>, newData: Model): Model {
        if (this.validate(newData)) return newData
        return oldData
    }
}
type TypeCollection<T extends string = string> = Record<T, Record<string, Unique>>
export interface MetaData extends Unique {
    id: string
    type: string
    alternativeIds: Record<string, string>
    enabled: boolean
    tags: string[]
    flags: Record<string, any>
    parent: Unique
    canContainChildren: boolean
    children: TypeCollection
    createdOn: number
    lastEdit: number
}
const stdObject = {
    type: "object",
    patternProperties: {
        ".": {
            type: "string"
        }
    },
    default: {}
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
interface ResourceRegister {
    type: string
    cast: GConstructor<Resource>
    schema: Record<string, any>
}

const validator = new Ajv({
    useDefaults: true,
    coerceTypes: true,
});
export class Registry {
    static validator = validator
    static index = new Collection<MetaData & Unique>({
        name: "index",
        schema: metaDataSchema,
    })
    static collections: Map<string, Collection<Unique>> = new Map()
    static classes: Map<string, GConstructor<Resource>> = new Map();
    static register(...resources: ResourceRegister[]) {
        for (const { type, cast, schema } of resources) {
            this.classes.set(type, cast);
            this.collections.set(type, new Collection({
                name: type,
                schema
            }));
        }
        return this
    }
    static check(id: string) { return this.index.query.hasEntity(id) }
    static update(value: Partial<MetaData> & { id: string }) {
        this.index.store.update(value.id, state => deepmerge(state, value, {
            arrayMerge: (t, s) => s
        }));
    }
    static validate<D>(type: string, data: D): data is D {
        const isValid = this.validator.validate(type, data)
        if (typeof isValid === "boolean") {
            if (isValid) return isValid
            console.log(this.validator.errorsText());
            return isValid
        }
    }
    static getTrailOf(id: string, trail: Unique[] = []): Unique[] {
        const metadata = this.index.query.getEntity(id);
        if (!metadata) return trail
        const { parent } = metadata || {}
        if (parent) {
            trail.push(parent);
            this.getTrailOf(parent.id, trail)
        }
        return trail
    }
    static getDescendantsOf(id: string, descendants: Unique[] = []): Unique[] {
        const metadata = this.index.query.getEntity(id);
        if (!metadata) return descendants
        const { children } = metadata || {};
        if (children) {
            for (const branch of Object.values(children)) {
                for (const child of Object.values(branch)) {
                    descendants.push({
                        id: child.id,
                        type: child.type
                    });
                    this.getDescendantsOf(child.id, descendants);
                }
            }
        }
        return descendants
    }
    static getList() {

    }
    static selectList() {
        const all$ = this.index.query.select();
        const list$ = all$.pipe(
            pluck('entities'),
            map(hm => Object.values(hm))
        );
    }
    static selectDescendantsOf(id: string) {
        const this$ = this.index.query.selectEntity(id)
        const descendants$ = this$
            .pipe(
                mergeMap(r => this.index.query.selectMany(Registry.getDescendantsOf(r.id).map(({ id }) => id))),
                map(each(i => new Resource(i))),
            );
        return descendants$
    }

    static select(identity: Unique): Observable<Unique> {
        return Registry.collections.get(identity.type).query.selectEntity(identity.id)
    }
    static selectAll({ enabledOnly = false } = {}) {
        return Registry.index.query.selectAll(
            { filterBy: resource => enabledOnly ? resource.enabled === true : true })
            .pipe(
                mapEach(d => new Resource(d))
            )
    }
    static selectAllFeatures() {
        return Registry.selectAll({
            enabledOnly: true
        }).pipe(
            mapEach(r => r.getKeys()?.features ?? []),
            collapse
        )
    }
}

/**
 * Defines a way to operate on external resources 
 */
export interface Feature {
    type: string
    constraint: Record<string, any>
    bonus: number
}

export interface Modifier {

}
interface Note<S = any> {
    plaintext: string
    state: S
}
interface Delta {

}
export interface Cache {
    [path: string]: {
        lastEdit: number
        value: any
    }
}

export interface Data extends Record<string, any>, Unique {
    version: number
    name: string
    modifiers: Modifier[]
    lookups: Record<string, Record<string, any>[]>
    features: Feature[]
    config?: Record<string, any>
}
export interface Deleted {
    deleted: true
    deletedOn: string
}

export class Resource<Model extends Data = Data> {
    static operations$ = new Subject()
    static clone<T>(data: T): T { if (data) return deepmerge<T>({}, data) }

    static mergeResources<R extends Resource[]>(resources: R) {

    }
    combineWith<R>(resources) { }
    stream() { }

    lookup(jssql?: Record<string, any>): Observable<Resource[]> {
        return Registry.selectAll().pipe(
            log("lookup"),
            mapEach(r => r.getKeys()),
            matchArray(jssql),
            mapEach(d => new Resource(d)),
        )
    }
    selectAllFeatures = Registry.selectAllFeatures
    selectFeatures() {
        return combineLatest([
            this.selectKeys(),
            Registry.selectAllFeatures()
        ]).pipe(
            map(([keys, features]) => features.filter(f => searchjs.matchObject(keys, f.constraint))),
        )
    }
    selectBonus(jssql?: Record<string, any>) {
        return this.selectFeatures()
            .pipe(
                matchArray(jssql),
                mapEach(f => f.bonus),
                reduce((t, b) => t + b.reduce((_t, _b) => _t + _b, 0), 0),
                log("bonus")
            )
    }
    validate() { return this.collection.validate(this.getKeys()) }
    get collection() { return Registry.collections.get(this.type) as Collection<Model> }
    get schema() { return this.collection.schema }
    get class() { return this.constructor as new (identity: Unique) => this }
    identity: Unique
    get id(): string { return this.identity.id }
    get type(): string { return this.identity.type }
    get exists() { return this.collection.query.hasEntity(this.id) && Registry.check(this.id) }

    constructor(identity: Unique) {
        this.identity = Crud.extractIdentity(identity);
    }

    getMetadata(): MetaData { return Registry.index.query.getEntity(this.id) }
    selectMetadata(): Observable<MetaData> { return Registry.index.query.selectEntity(this.id) }
    selectFlag(scope: string, key: string) {
        return this.selectMetadata().pipe(
            pluck("flags", scope, key))
    }
    setFlag(scope: string, key: string, value: any) {
        Registry.update({
            id: this.id,
            flags: {
                [scope]: {
                    [key]: value
                }
            }
        });
    }
    selectLastEdit() {
        return this.selectMetadata()
            .pipe(
                pluck("lastEdit")
            )
    }
    selectEnabled() {
        return this.selectMetadata()
            .pipe(
                pluck("enabled")
            )
    }
    selectInstance(): Observable<this> {
        const update$ = combineLatest([this.selectKeys(), this.selectMetadata()]);
        return update$
            .pipe(
                takeWhile(k => this.exists),
                map(k => new this.class(this.identity))
            )
    }
    getKeys(constrain?: Record<string, any>): Model {
        return this.collection.query.getEntity(this.id)
    }
    selectKeys(constrain?: Record<string, any>): Observable<Model> {
        const observable = this.collection.query.selectEntity(this.id);
        return observable.pipe(takeWhile(d => this.exists));
    }
    selectParent() {
        return this.selectMetadata().pipe(
            pluck("parent"),
            map(id => new Resource(id))
        )
    }
    selectNearest<C extends Resource>(type?: string, cast?: GConstructor<C>): Observable<C> {
        return this.selectParent().pipe(
            expand(parent => parent.type === type ? parent.selectInstance() : parent.selectParent()),
            map(resource => resource.cast(cast))
        )
    }
    selectFarthest<C extends Resource>(type?: string, cls?: GConstructor<C>): Observable<C> {
        return this.selectTrail(type, cls).pipe(map(trail => trail.pop()))
    }
    getTrail() { return Registry.getTrailOf(this.id) }
    selectTrail<C extends Resource>(type?: string, cast?: GConstructor<C>): Observable<C[]> {
        return this.selectNearest(type, cast).pipe(
            expand(nearest => nearest.selectNearest(type, cast)),
            reduce((trail, resource) => [...trail, resource], [] as C[])
        )
    }
    getDescendants() { return Registry.getDescendantsOf(this.id) }
    selectDescendants<C extends Resource>(type?: string, cast?: GConstructor<C>): any {
        return Registry.selectDescendantsOf(this.id).pipe(
            map(each(resource => resource.cast(cast))),
            map(ra => type ? ra.filter(r => r.type === type) : ra)
        )
    }
    selectChildren<C extends Resource>(type: string, cast?: GConstructor<C>, { activeOnly = false } = {}): Observable<C[]> {
        const index$ = Registry.index.query.selectAll();
        const children$ = this.selectMetadata()
            .pipe(
                pluck("children", type),
                map(children => Object.values(children || {})),
                map(children => children?.map(child => new (cast || Resource)(child) as C)),
                startWith([] as C[])
            );
        return index$.pipe(
            withLatestFrom(children$),
            map(([i, c]) => c)
        )
    }
    selectSameChildren(): Observable<this[]> {
        return this.selectChildren(this.type, this.class);
    }
    selectAllChildren<C extends Resource>(): Observable<Resource[]> {
        const types$ = this.selectMetadata()
            .pipe(
                pluck("children"),
                switchMap(obj =>
                    Object.keys(obj || {})
                ),
                mergeMap(type => this.selectChildren(type)),
            )
        return types$
    }
    async update(update: Partial<Model>) {
        return await Crud.update({
            ...update,
            ...this.identity
        })
    }
    async updateRegistry(update: Partial<MetaData>) {
        Registry.update({
            id: this.id,
            ...update
        });
    }
    async delete() {
        return await Crud.delete(this.identity)
    }
    async embed(resources: OrArray<Partial<Data> & { type: string }>) {
        const embeds = orArray(resources).map(resource => ({
            ...resource,
            parent: this.identity
        }));
        return await Crud.embed(embeds)
    }
    async transfer(to: Unique) {
        return await Crud.transfer({
            from: this.identity,
            to
        })
    }
    async eject() {
        return await Crud.eject(this.identity)
    }
    /**
     * This is the idea that makes the whole system work. the @type {Resource} describes most of the CRUD functionality and abstract away nesting while casting
     * makes it very simple to define logic that will work anywhere in the application. This simply instantiates a new handle on some resource data and returns it.
     * @param identifier 
     * @param cls 
     */
    static cast<C extends Resource>(identifier: Unique, cls: GConstructor<C>): C {
        return new (cls || this)(identifier) as C
    }
    cast<C extends Resource>(cls: GConstructor<C>): C { return Resource.cast(this.identity, cls || Resource) as C }
    subscribe(run: (keys: Model) => Model) {
        return this.selectKeys()
            .pipe(
                map(data => Resource.clone(data))
            ).subscribe(run)
    }
    set = this.update
    forward<T = any>(...properties: string[]): Observable<T> {
        return this.selectKeys().pipe(
            pluck<Model, T>(...properties),
            observable => {
                observable["set"] = (value) => {
                    const update = properties.reduce((update, property, i) => {
                        if (i === properties.length - 1) {
                            update[property] = value;
                            return update
                        } else {
                            update[property] = {}
                            return update[property]
                        }
                    }, {} as any);
                    this.update(update);
                }
                return observable
            }
        )
    }
    toJSON() {
        return {
            ...this.getMetadata(),
            keys: this.getKeys()
        }
    }
    get<P extends string>(property: P) {

    }
    undo() { this.collection.state.undo() }
    redo() { this.collection.state.redo() }
    /**
     * User interface convenience functions
     */
    edit() { Registry.index.store.setActive([this.id]) }
    context() { }
    do(...args: any[]) { }
}