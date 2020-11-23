import { EntityStore, EntityState, QueryEntity, EntityStateHistoryPlugin } from "@datorama/akita"
import { asyncScheduler, fromEvent, interval, Observable, Observer, PartialObserver, Subscription, } from "rxjs"
import { map, takeWhile, pluck, finalize, throwIfEmpty, throttle, throttleTime, sampleTime, auditTime, debounceTime } from "rxjs/operators"
import { v4 as uuidv4 } from "uuid";
import * as jp from "jsonpath";
import deepmerge from "deepmerge";
import { get } from "svelte/store";
import { after, before, debounce, debounceTimeAfterFirst, Valor } from "@internal";

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
abstract class Resource<T extends string = string, K = any> {
    id: string
    abstract readonly type: T

    readonly abstract exists: boolean
    get exists$() { return this.instance$.pipe(map(instance => instance.exists)) }
    protected readonly abstract _sourceData: EntityData<T, K>
    protected readonly abstract _sourceData$: Observable<EntityData<T, K>>
    get data() {
        try {
            return this._sourceData
        } catch (err) {
            this.repairData();
            return this._sourceData
        }
    }
    get data$() {
        try {
            return this._sourceData$.pipe(takeWhile(data => this.exists))
        } catch (err) {
            this.repairData();
            return this._sourceData$
        }
    }
    get allEmbeddedData() { return Object.values(this.data.embeddedEntities || {}) }
    get instance() { if (this.exists) return this.createThis(this.id) }
    get instance$() { return this.data$.pipe(map(data => this.instance)) }
    get keys(): K { return this.data.keys }
    get keys$() { return this.data$.pipe(map(data => data.keys)) }
    get createdOn(): Date { return new Date(this.data.createdOn) }
    get lastEdit(): Date { return new Date(this.data.lastEdit) }

    constructor(id: string) {
        this.id = id;
    }

    @before("before newId")
    newId() { return uuidv4() }

    wrapData() { return entityData(this.type, this.defaultData(), this.id) }
    abstract defaultData(): K
    isDataValid() { }
    repairData() { }

    createThis(id: string = this.id) { return new (this.constructor as new (id: string) => this)(id) }



    subscribe(observer: PartialObserver<K>) {
        return this.keys$.pipe(map(keys => deepmerge<K>({}, keys))).subscribe(observer);
    }

    pathValue(path: string) { return jp.value(this.data, path) }
    pathValue$(path: string) { return this.instance$.pipe(map(instance => instance.pathValue(path))) }

    pathUpdate(path: string, value: any) {
        this.update(data => {
            jp.value(data, path, value);
            return data
        })
    }

    abstract update(fn: (data: EntityData<T, K>) => EntityData<T, K>)
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

    abstract delete()

    abstract duplicate(): this

    abstract create(): this
    toJSON() { return this.data }

    @before("before edit")
    edit() { }

    @before("before contextmenu")
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

    @before("before execute action")
    executeAction(action: string, ...args) { }
}
export interface EntityData<T extends string = string, K = any> {
    isEntity
    id: string
    type: T
    keys: K
    embedded: boolean
    embeddedEntities: { [key: string]: EntityData<string, any> }
    rootEntityId?: string
    rootEntityType?: string
    progenitorId?: string
    createdOn: string
    lastEdit?: string
}
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

export interface Repo<T extends string = string, K = any> extends EntityStore<EntityState<EntityData<T, K>, string>> { }
export interface Lookup<T extends string = string, K = any> extends QueryEntity<EntityState<EntityData<T, K>, string>> { }
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
    get state() { return this._forwardStateToEntity(this.stateHistory) }
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


    @before("before update")
    @after("after update")
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

    @before("before embed")
    @after("after embed")
    embed<T extends EmbeddableEntity>(entity: T, keys: { [key: string]: any }) {
        const embed = deepmerge(entity.data || entity.wrapData(), { keys });
        embed.embedded = true;
        embed.rootEntityId = this.id;
        embed.rootEntityType = this.type;
        embed.id = this.newId();
        entity.embeddedStore.add(embed);
        return entity.createThis(embed.id)
    }

    duplicate() { return this.create(this.data); }

    @before("before create")
    create(data?: EntityData<T, K>) {
        const id = this.newId() as string
        this.store.add(Object.assign({}, this.wrapData(), data, { id }));
        return this.createThis(id);
    }

    @before("before delete")
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
                takeWhile(data => this.exists)
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


    @before("before embedded update")
    @after("after embedded update")
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

    create() { return null }

    delete() {
        if (!this.embedded) return super.delete();
        this._embeddedDelete();
    }

    @before("before embedded delete")
    @after("after embedded delete")
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
    get _sourceData$() { return this.parent.data$.pipe(takeWhile(data => this.exists), map(data => data.embeddedEntities[this.id] as EntityData<T, K>)) }

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

    constructor(id: string, entity: E) {
        super(id);
        this.parent = entity
    }

    duplicate() { return null }
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

    createThis(id: string = this.id, parent: E = this.parent) { return new (this.constructor as new (id: string, parent: E) => this)(id, this.parent) }
    create() { return null }

    @before("before delete embedded resource")
    @after("after delete embedded resource")
    delete() {
        this.parent.update(data => {
            delete data.embeddedEntities[this.id];
            return data
        });
    }
}