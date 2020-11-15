import { EntityStore, EntityState, QueryEntity, UpdateStateCallback, transaction } from "@datorama/akita"
import { asyncScheduler, interval, Observable, Observer, PartialObserver, Subscription, } from "rxjs"
import { map, takeWhile, pluck, finalize, throwIfEmpty, throttle, throttleTime, sampleTime, auditTime, debounceTime } from "rxjs/operators"
import { v4 as uuidv4 } from "uuid";
import * as jp from "jsonpath";
import { KeyList } from "@internal";
import { SvelteComponent } from "svelte";

import Editor from "@ui/editors/Editor.svelte";
import Modal from "@ui/applications/Modal.svelte";

import { Valor } from "./valor";

import { after, before } from "@externals/hooks";
import { AsyncScheduler } from "rxjs/internal/scheduler/AsyncScheduler";

abstract class Resource<T extends string = string, K = any> {
    lastSet: Date
    pendingSet: K

    id: string

    private static readonly _editorInstances: { [key: string]: Editor } = {}
    private get _editor() { return Resource._editorInstances[this.id] }

    abstract readonly type: T
    readonly abstract exists: boolean
    get exists$() { return this.instance$.pipe(pluck("exists")) as Observable<boolean> }
    readonly abstract data: EntityData<T, K>
    readonly abstract data$: Observable<EntityData<T, K>>
    get allEmbeddedData() { return Object.values(this.data.embeddedEntities) }
    get instance() { if (this.exists) return this.createThis(this.id) }
    get instance$() { return this.data$.pipe(takeWhile(data => this.exists), map(data => this.instance)) }
    get keys() { return this.data.keys }
    get keys$() { return this.data$.pipe(pluck("keys")) as Observable<K> }
    get createdOn(): Date { return new Date(this.data.createdOn) }
    get lastEdit(): Date { if (this.data.lastEdit) return new Date(this.data.lastEdit) }

    constructor(id: string) {
        this.id = id;
    }

    wrapData() { return entityData(this.type, this.defaultData()) }
    createThis(id: string = this.id) { return new (this.constructor as new (id: string) => this)(id) }

    abstract defaultData(): K

    hasEmbeddedEntity(id: string) { return this.data.embeddedEntities[id]?.id === id }

    subscribe(observer: PartialObserver<K>) {
        const subscription = this.keys$.pipe(
            map(keys => clone(keys))
        ).subscribe(observer);
        return () => subscription.unsubscribe()
    }

    pathValue(path: string) { return jp.value(this.data, path) }
    pathValue$(path: string) { return this.instance$.pipe(map(instance => instance.pathValue(path))) }

    pathUpdate(path: string, value: any) { this.update(data => { jp.value(data, path, value) }) }
    abstract update(fn: UpdateStateCallback<EntityData<T, K>, Partial<EntityData<T, K>>>)

    set(keys: K) {
        const updateTime = new Date();
        if (this.lastSet?.getMilliseconds() > updateTime.getMilliseconds() - 500) {
            this.pendingSet = keys;
            this.lastSet = updateTime;
        } else {
            this.update(data => { data.keys = clone(this.pendingSet || keys) });
            this.pendingSet = null;
        }
    }

    abstract delete()

    abstract duplicate(): this

    abstract create(): this
    toJSON() { return this.data }

    @before("before edit")
    edit() {
        if (this._editor) return
        if (!document) return
        const editor = new Modal(
            {
                target: document.body,
                props: {
                    component: Editor,
                    entity: this
                }
            }
        )
        Resource._editorInstances[this.id] = editor;
        editor.$on("close", () => {
            editor.$destroy();
            Resource._editorInstances[this.id] = null;
        });
    }

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
    rootEntityId?: string
    progenitorId?: string
    embeddedEntities: { [key: string]: EntityData<string, any> }
    createdOn: string
    lastEdit?: string
}
function entityData<T extends string, K>(type: T, keys: K): EntityData<T, K> {
    return {
        isEntity: true,
        id: uuidv4() as string,
        type,
        keys,
        embedded: false,
        embeddedEntities: {},
        createdOn: new Date().toJSON()
    }
}

interface Repo<T extends string = string, K = any> extends EntityStore<EntityState<EntityData<T, K>, string>> { }
interface Query<T extends string = string, K = any> extends QueryEntity<EntityState<EntityData<T, K>, string>> { }
export abstract class Entity<
    T extends string = string,
    K = any,
    S extends Repo = Repo,
    Q extends Query = Query,
    > extends Resource<T, K> {

    abstract store: S
    abstract query: Q

    get exists() { return this.query.hasEntity(this.id) }
    get exists$() { return this.instance$.pipe(pluck("exists")) as Observable<boolean> }
    get data() { return this.query.getEntity(this.id) as EntityData<T, K> }
    get data$() {
        return this.query.selectEntity(this.id).pipe(
            takeWhile(data => this.exists),
            // throttleTime(500)
        ) as Observable<EntityData<T, K>>
    }

    constructor(id: string) {
        super(id);
    }

    private _updateStore() {

    }

    @before("before update")
    @after("after update")
    update(fn: UpdateStateCallback<EntityData<T, K>, Partial<EntityData<T, K>>>) {
        try {
            const src = this.data;
            this.store.update(this.id, data => {
                fn(data as EntityData<T, K>);
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
    embed<T extends EmbeddableEntity>(entity: T) {
        if (entity.embedded) return
        let embed = entity.data || entity.wrapData();
        embed.embedded = true;
        embed.rootEntityId = this instanceof EmbeddableEntity ? this.root.id : this.id
        this.update(data => {
            data.embeddedEntities[embed.id] = embed;
        });
        return entity.createThis(embed.id, this);
    }

    duplicate() { return this.create(this.data); }

    @before("before create")
    create(data?: EntityData<T, K>) {
        const id = uuidv4() as string
        this.store.add(Object.assign({}, this.wrapData(), data, { id }));
        return this.createThis(id);
    }

    @before("before delete")
    delete() { this.store.remove(this.id); }
}
export function clone<T>(data: T): T { try { return JSON.parse(JSON.stringify(data)) } catch (err) { console.log(err, data); } }

/**
 * An entity that is meant to be embedded on other entities but whose source data comes from a global store.
 */
export abstract class EmbeddableEntity<
    T extends string = string,
    K = any,
    E extends Entity = Entity,
    S extends Repo = Repo,
    Q extends Query = Query
    > extends Entity<T, K, S, Q> {

    root: E
    get embedded() { return this.root?.exists && this.root.hasEmbeddedEntity(this.id) }

    get parent() { return null }
    get exists() { return this.embedded ? true : super.exists }
    get data(): EntityData<T, K> { return this.embedded ? this.root.data.embeddedEntities[this.id] as EntityData<T, K> : super.data }
    get data$(): Observable<EntityData<T, K>> {
        return this.embedded
            ? this.root.data$.pipe(
                takeWhile(data => this.exists),
                map(data => data.embeddedEntities[this.id] as EntityData<T, K>)
            ) :
            super.data$
    }

    constructor(id: string, entity?: E) {
        super(id);
        if (entity instanceof EmbeddableEntity) {
            this.root = entity.root
        } else {
            this.root = entity;
        }
    }

    createThis(id: string = this.id, entity: E = this.root) { return new (this.constructor as new (id: string, entity: E) => this)(id, entity) }

    update(fn: (data: EntityData<T, K>) => void) {
        if (!this.embedded) return super.update(fn);
        this._embeddedUpdate(fn);
    }

    @before("before embedded update")
    @after("after embedded update")
    private _embeddedUpdate(fn: (data: EntityData<T, K>) => void) {
        const src = this.data;
        return this.root.update(data => {
            const val = data.embeddedEntities[this.id] as EntityData<T, K>
            fn(val);
            val.lastEdit = new Date().toJSON();
            val.id = this.id;
            val.type = this.type;
            val.createdOn = src.createdOn;
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
        this.root.update((data) => { delete data.embeddedEntities[this.id] });
    }
}

export abstract class EmbeddedResource<T extends string = string, K = any, E extends Entity = Entity> extends Resource<T, K> {
    parent: E
    get parent$() { return this.parent?.instance$ }
    get exists() { return this.parent?.exists && this.parent.hasEmbeddedEntity(this.id) }
    get data(): EntityData<T, K> { return this.parent?.data?.embeddedEntities[this.id] as EntityData<T, K> }
    get data$(): Observable<EntityData<T, K>> { return this.parent.data$.pipe(takeWhile(data => this.exists), map(data => data.embeddedEntities[this.id] as EntityData<T, K>)) }
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
        });
    }
    create() { return null }
    delete() { this.parent.update((data) => { delete data.embeddedEntities[this.id] }); }
}