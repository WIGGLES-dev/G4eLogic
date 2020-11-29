import Dexie from 'dexie';
import Schema from "validate";
import { EntityStore, EntityState, QueryEntity, EntityStateHistoryPlugin, createEntityStore, createEntityQuery, transaction, EntityDirtyCheckPlugin, EntityActions, combineQueries } from "@datorama/akita"
import { from, Observable, PartialObserver, Subscribable, Subscription } from "rxjs"
import { map, takeWhile, pluck, catchError, filter } from "rxjs/operators"
import { v4 as uuidv4 } from "uuid";
import * as jp from "jsonpath";
import deepmerge from "deepmerge";
import { get } from "svelte/store";
import { Valor, debounce } from "@internal";
import produce from "immer";

export interface ResourceState<T extends string = string, K = any> extends EntityState<EntityData<T, K>, string> { }
export interface ResourceStore<T extends string = string, K = any> extends EntityStore<ResourceState<T, K>> { }
export interface ResourceQuery<T extends string = string, K = any> extends QueryEntity<ResourceState<T, K>> { }

interface ResourceStateMethods {
    undo()
    redo()
    jumpToPast(i: number)
    jumpToFuture(i: number)
    clear()
    ignoreNext()
    destroy(clearHistroy: boolean)
    hasPast(): boolean
    hasFuture(): boolean
}

export abstract class Resource<T extends string = string, K = any> {
    id: string
    static readonly type: string
    abstract readonly type: T
    get embedded() { return !!this.data.embedded }

    readonly abstract exists: boolean
    get exists$() { return this.instance$.pipe(map(instance => instance.exists)) }
    protected readonly abstract _sourceData: EntityData<T, K>
    protected readonly abstract _sourceData$: Observable<EntityData<T, K>>
    get data() { return this._sourceData }
    get data$() { return this._sourceData$ }

    get allEmbeddedData() { return Object.values(this.data.embeddedEntities || {}) }
    get instance() { if (this.exists) return this.createThis(this.id) }
    get instance$() { return this.data$.pipe(map(() => this.instance)) }
    get keys(): K { return this.data.keys }
    get keys$() { return this.data$.pipe(map(data => data?.keys)) }
    get createdOn(): Date { return new Date(this.data?.createdOn) }
    get lastEdit(): Date { return new Date(this.data?.lastEdit) }

    constructor(id: string) {
        this.id = id
    }

    static newId() { return uuidv4() }
    static clone<T>(data: T): T { return deepmerge<T>({}, data) }
    static withId(entity: EntityData, key?: string) {
        const alternativeIds: EntityData["alternativeIds"] = entity.alternativeIds || {};
        return alternativeIds[key] || entity.id
    }
    static setAlternativeId(entity: EntityData, source: string, key: string) { }

    static wrapData<D extends EntityData>(merge: Partial<D> = {}): D {
        return deepmerge(entityData(this.type, this.defaultData), merge)
    }
    wrapData(merge = {}) {
        return deepmerge(
            entityData(this.type, this.keys, this.id), merge)
    }

    static readonly defaultData
    abstract readonly defaultData: K
    get schema() { return entitySchema() }

    isDataValid(data = this._sourceData) {
        const valid = this.schema.validate(Resource.clone(data));
        return valid
    }

    createThis(id: string = this.id) { return new (this.constructor as new (id: string) => this)(id) }

    subscribe(run: (keys: K) => K) { return this.keys$.pipe(map(data => Resource.clone(data))).subscribe(run); }
    set(keys: K) {
        const update = Resource.clone(keys);
        this.update(data => {
            data.keys = update;
            return data
        });
    }

    pathValue<V>(path: string): V { return jp.value(this.data, path) as V }
    pathValue$<V>(path: string) { return this.instance$.pipe(map(instance => instance.pathValue<V>(path))) }

    pathUpdate(path: string, value: any) {
        this.update(data => {
            jp.value(data, path, value);
            return data
        })
    }

    abstract update(fn: (data: EntityData<T, K>) => EntityData<T, K>)
    abstract delete()

    splice(entityData: EntityData) {
        const src = this.data;
        this.update(data => {
            const splice = Resource.clone(entityData);
            splice.id = Resource.newId();
            splice.rootEntity = src.rootEntity;
            data.embeddedEntities[splice.id] = splice;
            return data
        });
    }

    get<T>(observable: Observable<T> | string) {
        //@ts-ignore
        return get<T>(typeof observable === "string" ? this[observable] : observable)
    }

    toJSON() { return this.data }

    edit() { }

    renderContextMenu(e: MouseEvent) { Valor.contextMenu(e, this.contextMenuOptions) }

    get contextMenuOptions() {
        return [
            {
                label: "Edit",
                callback: () => this.edit(),
                show: () => this.exists
            },
            {
                label: "Delete",
                callback: () => this.delete(),
                show: () => this.exists,
                classes: [
                    "bg-red-700",
                    "text-white",
                    "hover:bg-red-700",
                    "hover:text-white",
                    "rounded-b",
                ],
            }
        ]
    }

    executeAction(...args) { }
}

export interface Identifiable<T extends string = string> {
    id: string,
    alternativeIds?: Record<string, string>,
    type: T,
    source?: string
    rootEntity?: Identifiable
    progenitor?: Identifiable
}

export interface EntityData<T extends string = string, K = any> extends Identifiable<T> {
    isEntity: boolean
    keys: K
    embedded: boolean
    embeddedEntities: Record<string, EntityData<string, any>>
    createdOn: string
    lastEdit?: string
}
const entitySchema = (maxDepth = 1, currentDepth = 0) =>
    new Schema({
        isEntity: { type: Boolean },
        id: { type: String, required: true },
        type: { type: String, required: true },
        embedded: { type: Boolean },
        //embeddedEntities: { "*": currentDepth === maxDepth ? undefined : entitySchema(maxDepth, ++currentDepth) },
        rootEntityId: { type: String },
        rootEntityType: { type: String },
        progenitorId: { type: String },
        createdOn: { type: String },
        lastEdit: { type: String }
    });
function entityData<T extends string, K>(type?: T, keys = {} as K, id = uuidv4() as string): EntityData<T, K> {
    return {
        isEntity: true,
        id,
        type,
        keys,
        embedded: false,
        embeddedEntities: {},
        createdOn: new Date().toJSON()
    }
}

export interface EntityCollection<T extends string, K, E extends Entity<T, K>> {
    entity: new (id: string) => E
    store: ResourceStore<T, K>,
    query: ResourceQuery<T, K>
    state: EntityStateHistoryPlugin<ResourceState<T, K>>
    dirty: EntityDirtyCheckPlugin<ResourceState<T, K>>
    instances$: (...ids: string[]) => Observable<E[]>
    instances: (...ids: string[]) => E[]
    instance$: (id: string) => Observable<E>
    instance: (id: string) => E
}
export const entityCollection: Record<string, EntityCollection<string, any, Entity>> = {}

export function createEntityCollection<T extends string, K, E extends Entity<T, K>>(type: string, entity: new (id: string) => E) {
    const store = createEntityStore<ResourceState<T, K>>({}, { name: type, producerFn: produce });
    store.akitaPreAddEntity = function (newEntity: EntityData<T, K>) {
        return newEntity
    }
    store.akitaPreUpdateEntity = function (_, nextEntity) {
        const isNewer = new Date(nextEntity.lastEdit).getTime() > new Date(_.lastEdit).getTime()
        if (!isNewer) {
            return _
        }
        return nextEntity
    }

    const query = createEntityQuery<ResourceState<T, K>>(store);
    const state = new EntityStateHistoryPlugin(query);
    const dirty = new EntityDirtyCheckPlugin(query).setHead();
    const instances$ = (...ids: string[]) => (
        (ids.length > 0 ?
            query.selectMany(ids) :
            query.selectAll()
        )
            .pipe(
                map(entities => entities.map(data => new entity(data.id))),
                map(entities => entities.filter(entity => entity.exists))
            )
    );
    const instances = (...ids: string[]) => (
        (ids.length > 0 ?
            ids.map(id => query.getEntity(id)) :
            query.getAll()
        )
            .map(data => new entity(data.id))
            .filter(entity => entity.exists)
    );

    const instance$ = (id: string) => query.selectEntity(id).pipe(
        map(data => new entity(data.id)),
        map(cls => cls.exists ? cls : undefined)
    );
    const instance = (id: string) => { const cls = new entity(query.getEntity(id)?.id); if (cls.exists) return cls };
    return {
        entity,
        store,
        query,
        state,
        dirty,
        instances$,
        instances,
        instance$,
        instance
    }
}
export function getEntityCollection<T extends string, K, E extends Entity<T, K>>(type: T) { return entityCollection[type] as EntityCollection<T, K, E> }
export function entitiesFromIds(type: string, ids: string[]) { return getEntityCollection(type)?.instances(...ids) }
export function entityConfig(type: string) {
    return function (constructor: new (id: string) => Entity,) {
        entityCollection[type] = createEntityCollection<string, any, Entity>(type, constructor)
    }
}

export abstract class Entity<
    T extends string = string,
    K = any,
    > extends Resource<T, K> {
    static collections = entityCollection
    static getCollection = getEntityCollection
    static createCollection = createEntityCollection

    get collection(): EntityCollection<T, K, this> { return getEntityCollection<T, K, this>(this.type) }

    get store() { return this.collection?.store }
    get query() { return this.collection?.query }
    get stateHistory() { return this.collection?.state }
    get dirty() { return this.collection?.dirty }

    get exists() { return this.query.hasEntity(this.id || "") }
    get exists$() { return this.instance$.pipe(pluck("exists")) as Observable<boolean> }
    get _sourceData() { return this.query?.getEntity(this.id) }
    get _sourceData$() { return this.query?.selectEntity(this.id) }

    get parentCollection() { return getEntityCollection(this.data.rootEntity?.type) }
    get parent() { const { rootEntity: { id, type } } = this.data; return getEntityCollection(type)?.instance(id) }

    constructor(id: string) { super(id); }

    pathIsDirty(path: string) { return this.dirty.isPathDirty(this.id, path) }

    get state(): ResourceStateMethods { return this._forwardStateToEntity(this.stateHistory) }
    protected _forwardStateToEntity<S extends EntityStateHistoryPlugin<EntityState<EntityData<T, K>>>>(stateHistory: S) {
        return {
            undo: () => stateHistory.undo(this.id),
            redo: () => stateHistory.redo(this.id),
            jumpToPast: (i) => stateHistory.jumpToPast(this.id, i),
            jumpToFuture: (i) => stateHistory.jumpToFuture(this.id, i),
            clear: () => stateHistory.clear(this.id),
            ignoreNext: () => stateHistory.ignoreNext(),
            destroy: (clearHistroy = false) => this.stateHistory.destroy(this.id, clearHistroy),
            hasPast: () => stateHistory.hasPast(this.id),
            hasFuture: () => stateHistory.hasFuture(this.id)
        }
    }

    update(fn: (data: EntityData<T, K>) => EntityData<T, K>) {
        try {
            const timestamp = new Date().toJSON()
            const src = this.data;
            Valor.updateEntities(this.store.config.name, [
                deepmerge(src, {
                    ...fn(Resource.clone(src)),
                    lastEdit: timestamp,
                    id: this.id,
                    type: this.type,
                    createdOn: src.createdOn
                })
            ])
        }
        catch (err) {
            console.log(err);
        }
    }

    embed(data: EntityData | Entity) {
        const src = this.data;
        const embed = Resource.clone(data instanceof Entity ? data.data : data);
        embed.embedded = true;
        embed.rootEntity = {
            id: src.id,
            type: src.type,
            alternativeIds: src.alternativeIds,
            rootEntity: src.rootEntity,
            progenitor: src.progenitor
        }
        embed.id = Resource.newId();
        return embed
    }

    delete() { return Valor.removeEntities(this.store.config.name, [this.data]) }
}

export abstract class EmbeddedResource<T extends string = string, K = any, E extends Entity = Entity> extends Resource<T, K> {
    parent: E
    get embedded() { return true }
    get parent$() { return this.parent?.instance$ }
    get exists() { return this.parent.exists && (this.parent.data.embeddedEntities || {})[this.id]?.id === this.id }
    get _sourceData() { return (this.parent?.data?.embeddedEntities ?? {})[this.id] as EntityData<T, K> }
    get _sourceData$() { return this.parent.data$.pipe(takeWhile(() => this.exists), map(data => data.embeddedEntities[this.id] as EntityData<T, K>)) }

    get stateHistory() { return this.parent.stateHistory }
    get state() { return this.parent.state }
    protected _forwardStateToEmbeddedResource<S extends EntityStateHistoryPlugin<EntityState<EntityData<T, K>>>>(stateHistory: S) {
        return {
            undo: () => {
                stateHistory.undo();
                const oldData = this.data;
                stateHistory.redo();
                this.update(data => {
                    Object.assign(data, oldData);
                });
            },
            redo: () => {
                if (stateHistory.hasFuture(this.id)) return
            },
            jumpToPast: (i) => stateHistory.jumpToPast(this.id, i),
            jumpToFuture: (i) => stateHistory.jumpToFuture(this.id, i),
            clear: () => stateHistory.clear(this.id),
            ignoreNext: () => stateHistory.ignoreNext(),
            destroy: (clearHistroy = false) => this.stateHistory.destroy(this.id, clearHistroy),
            hasPast: () => stateHistory.hasPast(this.id),
            hasFuture: () => stateHistory.hasFuture(this.id)
        }
    }

    protected _forwardTo

    constructor(entity: E, id: string) {
        super(id);
        this.parent = entity
    }

    update(fn: (data: EntityData<T, K>) => void) {
        const src = this.data;
        this.parent.update(data => {
            const val = data.embeddedEntities[this.id] as EntityData<T, K>;
            fn(val);
            val.lastEdit = new Date().toJSON();
            val.id = this.id;
            val.type = this.type;
            val.createdOn = src.createdOn;
            return data
        });
    }

    createThis(id: string = this.id, parent: E = this.parent) { return new (this.constructor as new (parent: E, id: string) => this)(parent, id) }

    delete() {
        this.parent.update(data => {
            delete data.embeddedEntities[this.id];
            return data
        });
    }
}