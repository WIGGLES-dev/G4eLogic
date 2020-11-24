import Dexie from 'dexie';
import Schema from "validate";
import { EntityStore, EntityState, QueryEntity, EntityStateHistoryPlugin, createEntityStore, createEntityQuery } from "@datorama/akita"
import { from, Observable, PartialObserver, Subscribable, Subscription } from "rxjs"
import { map, takeWhile, pluck, catchError } from "rxjs/operators"
import { v4 as uuidv4 } from "uuid";
import * as jp from "jsonpath";
import deepmerge from "deepmerge";
import { get } from "svelte/store";
import { after, before, Valor } from "@internal";
import produce from "immer";

export interface Repo<T extends string = string, K = any> extends EntityStore<EntityState<EntityData<T, K>, string>> { }
export interface Lookup<T extends string = string, K = any> extends QueryEntity<EntityState<EntityData<T, K>, string>> { }

interface EntityCollectionParams<T, K, E> {
    type: T
    constructor: new (...args) => E
    indexedDbTable?: string
    branches?: string[]
}
class EntityCollection<T extends string, K = any, E extends Entity = Entity> {
    constructor({ type, constructor, indexedDbTable, branches }: EntityCollectionParams<T, K, E>) {
        if (!(constructor instanceof Entity)) return
        const coreStore = createEntityStore({}, { name: type, producerFn: produce });
        const branchStores = branches?.map(branch => createEntityStore({}, { name: `${branch} ${type}`, producerFn: produce })) ?? [];
        const uiStores = [coreStore, ...branchStores].forEach(store => store.createUIStore());
        const coreQuery = createEntityQuery(coreStore);
        const branchQueries = branchStores.map(store => createEntityQuery(store));
        const uiQueries = [coreQuery, ...branchQueries].map(query => query.createUIQuery());
    }

    static sync() { }

    static snapshot() { }
}

export enum ResourceHooks {
    BeforeNewId = "before newId",
    BeforeEdit = "before edit",
    BeforeContextMenu = "before contextmenu",
    BeforeExecuteAction = "before execute action",

    BeforeUpdateEntity = "before update entity",
    AfterUpdateEntity = "after update entity",

    BeforeUpdateEmbeddedEntity = "before update emdbedded entity",
    AfterUpdateEmbeddedEntity = "after update embedded entity",

    BeforeEmbedEntity = "before embed entity",
    AfterEmbedEntity = "after embed entity",

    BeforeDeleteEntity = "before delete enity",
    AfterDeleteEntity = "after delete entity",

    BeforeDeleteEmbeddedEntity = "before delete embedded entity",
    AfterDeleteEmbeddedEntity = "after delete embedded entity",

    BeforeDeleteEmbeddedResource = "before delete embedded resource",
    AfterDeleteEmbeddedResource = "after delete embedded resource"
}

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

export interface ResourceParams {
    id: string
    create?: boolean
    merge?: any
}
abstract class Resource<T extends string = string, K = any> {
    id: string
    abstract readonly type: T

    readonly abstract exists: boolean
    get exists$() { return this.instance$.pipe(map(instance => instance.exists)) }
    protected readonly abstract _sourceData: EntityData<T, K>
    protected readonly abstract _sourceData$: Observable<EntityData<T, K>>
    get data() {
        try {
            if (this.isDataValid(this._sourceData)) { }
            return this._sourceData
        } catch (err) {
            console.log(err)
            this.repairData();
            return this._sourceData
        }
    }
    get data$() {
        try {
            return this._sourceData$.pipe(takeWhile(() => this.exists),)
        } catch (err) {
            console.log(err);
            this.repairData();
            return this._sourceData$
        }
    }

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

    @before(ResourceHooks.BeforeNewId)
    newId() { return uuidv4() }

    static clone<T>(data: T): T { return deepmerge<T>({}, data) }

    wrapData(current = false, merge: Partial<K> = {}) { return entityData(this.type, deepmerge.all([this.defaultData(), current ? this.data || {} : {}, merge]), this.id) }
    abstract defaultData(): K
    get schema() { return entitySchema() }
    isDataValid(data = this._sourceData) {
        const valid = this.schema.validate(Resource.clone(data));
        console.log(valid);
        return valid
    }
    repairData() {
        this.update(data => {
            Object.assign(data, this.wrapData(), { id: this.id })
            return data
        })
    }

    createThis(id: string = this.id) { return new (this.constructor as new (id: string) => this)(id) }

    subscribe(run: (keys: K) => K) { return this.keys$.pipe(map(keys => Resource.clone(keys))).subscribe(run); }

    pathValue(path: string) { return jp.value(this.data, path) }
    pathValue$(path: string) { return this.instance$.pipe(map(instance => instance.pathValue(path))) }

    pathUpdate(path: string, value: any) {
        this.update(data => {
            jp.value(data, path, value);
            return data
        })
    }

    abstract update(fn: (data: EntityData<T, K>) => EntityData<T, K>)
    abstract delete()

    splice(resource: EmbeddedResource) {
        this.update(data => {
            const splice = { ...(resource.data || resource.wrapData()) };
            splice.id = this.newId();
            splice.rootEntityId = this.data.rootEntityId || this.id;
            splice.rootEntityType = this.data.rootEntityType || this.type;
            data.embeddedEntities[splice.id] = splice;
            return data
        });
    }

    set(keys: K) {
        this.update(data => {
            data.keys = deepmerge<K>({}, keys);
            return data
        });
    }

    get<T>(observable: Observable<T> | string) {
        //@ts-ignore
        return get<T>(typeof observable === "string" ? this[observable] : observable)
    }

    toJSON() { return this.data }

    @before(ResourceHooks.BeforeEdit)
    edit() { }

    @before(ResourceHooks.BeforeContextMenu)
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

    @before(ResourceHooks.BeforeExecuteAction)
    executeAction(...args) { }
}
export interface EntityData<T extends string = string, K = any> {
    isEntity
    id: string
    type: T
    keys: K
    embedded: boolean
    embeddedEntities: Record<string, EntityData<string, any>>
    rootEntityId?: string
    rootEntityType?: string
    progenitorId?: string
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
function entityData<T extends string, K>(type: T, keys: K, id: string): EntityData<T, K> {
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


export abstract class Entity<
    T extends string = string,
    K = any,
    S extends Repo<T, K> = Repo<T, K>,
    Q extends Lookup<T, K> = Lookup<T, K>,
    > extends Resource<T, K> {

    abstract store: S
    abstract query: Q

    get exists() { return this.query.hasEntity(this.id) }
    get exists$() { return this.instance$.pipe(pluck("exists")) as Observable<boolean> }
    get _sourceData() { return this.query.getEntity(this.id) }
    get _sourceData$() { return this.query.selectEntity(this.id) }

    constructor(id: string) {
        super(id);
    }

    abstract stateHistory: EntityStateHistoryPlugin<EntityState<EntityData<T, K>>>
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


    @before(ResourceHooks.BeforeUpdateEntity)
    @after(ResourceHooks.AfterUpdateEntity)
    update(fn: (data: EntityData<T, K>) => EntityData<T, K>) {
        try {
            const src = this.data;
            this.store.update(this.id, data => {
                fn(data);
                data.lastEdit = new Date().toJSON();
                data.id = this.id;
                data.type = this.type;
                data.createdOn = src.createdOn;
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    @before(ResourceHooks.BeforeEmbedEntity)
    @after(ResourceHooks.AfterEmbedEntity)
    embed<T extends EmbeddableEntity>(entity: T, keys: { [key: string]: any }) {
        const embed = deepmerge(entity.data || entity.wrapData(), { keys });
        embed.embedded = true;
        embed.rootEntityId = this.id;
        embed.rootEntityType = this.type;
        embed.id = this.newId();
        entity.embeddedStore.add(embed);
        return entity.createThis(embed.id)
    }

    @before(ResourceHooks.BeforeDeleteEntity)
    @after(ResourceHooks.AfterDeleteEntity)
    delete() { this.store.remove(this.id); }
}

/**
 * An entity that is meant to be embedded on other entities but whose source data comes from a global store.
 */
export abstract class EmbeddableEntity<
    T extends string = string,
    K = any,
    E = Entity,
    S extends Repo<T, K> = Repo<T, K>,
    Q extends Lookup<T, K> = Lookup<T, K>
    > extends Entity<T, K, S, Q> {

    abstract embeddedStore: S
    abstract embeddedQuery: Q
    abstract embeddedState: EntityStateHistoryPlugin<EntityState<EntityData<T, K>>>

    abstract parent: E

    get embedded() { return this.embeddedQuery?.hasEntity(this.id) }

    get exists() { return this.embedded ? true : super.exists || super.exists }
    get data() { return this.embedded ? this.embeddedQuery.getEntity(this.id) as EntityData<T, K> : super.data }
    get data$() {
        return this.embedded
            ? this.embeddedQuery.selectEntity(this.id).pipe(
                takeWhile(() => this.exists)
            ) :
            super.data$
    }

    constructor(id: string) {
        super(id);
    }

    update(fn: (data: EntityData<T, K>) => EntityData<T, K>) {
        if (!this.embedded) return super.update(fn);
        this._embeddedUpdate(fn);
    }
    delete() {
        if (!this.embedded) return super.delete();
        this._embeddedDelete();
    }


    @before(ResourceHooks.BeforeUpdateEmbeddedEntity)
    @after(ResourceHooks.AfterUpdateEmbeddedEntity)
    private _embeddedUpdate(fn: (data: EntityData<T, K>) => EntityData<T, K>) {
        const src = this.data;
        return this.embeddedStore.update(this.id, data => {
            fn(data);
            data.lastEdit = new Date().toJSON();
            data.id = this.id;
            data.type = this.type;
            data.createdOn = src.createdOn;
        })
    }



    @before(ResourceHooks.BeforeDeleteEmbeddedEntity)
    @after(ResourceHooks.AfterDeleteEmbeddedEntity)
    private _embeddedDelete() {
        this.embeddedStore.remove(this.id);
    }
}

export abstract class EmbeddedResource<T extends string = string, K = any, E extends Entity = Entity> extends Resource<T, K> {
    parent: E
    embedded = true
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

    @before(ResourceHooks.BeforeDeleteEmbeddedResource)
    @after(ResourceHooks.AfterDeleteEmbeddedResource)
    delete() {
        this.parent.update(data => {
            delete data.embeddedEntities[this.id];
            return data
        });
    }
}