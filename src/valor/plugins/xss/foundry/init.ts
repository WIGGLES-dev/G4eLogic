import { applyTransaction, snapshotManager } from "@datorama/akita"
import { Data, OrArray, reduceToPathRecord, Crud, CrudEvent, CrudEventType, valorConnectionMethods, Resource } from "@internal"
import type JQuery from "jquery";
import { connectToChild, connectToParent } from "penpal"
import { Connection } from "penpal/lib/types"
import { fromEvent, Observable, Subject, Subscription } from "rxjs"

declare const CONFIG: any
declare const game: any
declare const ui: any
declare const Application: any
declare const Entity: any
declare const ActorSheet: any
declare const Actors: any
declare const Actor: any
declare const ItemSheet: any
declare const Items: any
declare const Item: any
declare const Hooks: any

declare function duplicate<T>(data: T): T
declare function mergeObject<T, D>(i: T, merge: D, options?: any): T & D
export interface BaseData<T extends string = string, D = any> {
    data: D,
    effects: any[]
    flags: Record<string, any>
    img: string,
    items: Omit<BaseData, "items">[],
    name: string,
    sort: number,
    token: BaseTokenData
    type: T,
    _id: string
}
interface BaseTokenData { }
export enum FoundryHooks {
    DeleteActor = "deleteActor",
    CreateActor = "createActor",
    UpdateActor = "updateActor",
    DeleteItem = "deleteItem",
    CreateItem = "createItem",
    UpdateItem = "updateItem",
    DeleteOwnedItem = "deleteOwnedItem",
    CreateOwnedItem = "createOwnedItem",
    UpdateOwnedItem = "updateOwnedItem",
    RenderActorSheet = "renderActorSheet",
    RenderItemSheet = "renderItemSheet"
}
export type UpdateEntityHookParams<D extends BaseData = BaseData> = [entity: D, changes: Partial<D> & Pick<BaseData, "_id">, options: any, id: string]
export type DeleteEntityHookParams<D extends BaseData = BaseData> = [entity: D, applications: any, id: string]
export type CreateEntityHookParams<D extends BaseData = BaseData> = [entity: D, options: any, id: string]
export type UpdateEmbeddedEntityHookParams<P extends BaseData = BaseData, I extends BaseData = BaseData> = [parent: P, item: I, changes: Partial<I> & Pick<BaseData, "_id">, options: any, id: string];
export type DeleteEmbeddedEntityHookParams<P extends BaseData = BaseData, I extends BaseData = BaseData> = [parent: P, item: I, applications: any, id: string];
export type CreateEmbeddedEntityHookParams<P extends BaseData = BaseData, I extends BaseData = BaseData> = [parent: P, item: I, options: any, id: string];
export type HookTuples =
    UpdateEntityHookParams |
    DeleteEntityHookParams |
    CreateEntityHookParams |
    UpdateEmbeddedEntityHookParams |
    DeleteEmbeddedEntityHookParams |
    CreateEmbeddedEntityHookParams
export interface FoundryEvent {
    type: FoundryHooks,
    data: HookTuples
}

type createData = Partial<BaseData> & Pick<BaseData, "name" | "type">
type updateData = Partial<BaseData> & Pick<BaseData, "_id" | "data">
interface Options { }
const connections: Set<Connection<typeof valorConnectionMethods>> = new Set();
export const foundryConnectionMethods = {
    getEnvironment() { return "foundry" },
    async createItem(data: OrArray<createData>, options?: Options): Promise<OrArray<BaseData>> {
        try {
            const item = await Item.create(data, options);
            return item.data
        } catch (err) {

        }
    },
    async updateItem(data: OrArray<updateData>, options?: Options): Promise<OrArray<BaseData>> {
        try {
            const item = await Item.update(data, options);
            return item.data
        } catch (err) {

        }
    },
    async deleteItem(data: OrArray<string>, options?: Options): Promise<OrArray<BaseData>> {
        try {
            const item = await Item.delete(data, options);
            return item.data
        } catch (err) {

        }
    },
    async createActor(data: OrArray<createData>, options?: Options): Promise<OrArray<BaseData>> {
        try {
            const actor = await Actor.delete(data, options);
            return actor.data
        } catch (err) {

        }
    },
    async updateActor(data: OrArray<updateData>, options?: Options): Promise<OrArray<BaseData>> {
        try {
            const actor = await Actor.update(data, options);
            return actor.data
        } catch (err) {

        }
    },
    async deleteActor(data: OrArray<string>, options?: Options) {
        try {
            const actor = await Actor.delete(data, options);
            return actor.data
        } catch (err) {

        }
    },
    async createOwnedItem(actorId: string, item: OrArray<createData>, options?: Options): Promise<OrArray<BaseData>> {
        try {
            const ownedItem = await game.actors.get(actorId)?.createOwnedItem(item, options);
            return ownedItem.data
        } catch (err) { }
    },
    async updateOwnedItem(actorId: string, item: OrArray<updateData>, options?: Options): Promise<OrArray<BaseData>> {
        try {
            const ownedItem = await game.actors.get(actorId)?.updateOwnedItem(item, options);
            return ownedItem.data
        } catch (err) {

        }
    },
    async deleteOwnedItem(actorId: string, itemId: OrArray<string>, options?: Options): Promise<OrArray<BaseData>> {
        try {
            const ownedItem = await game.actors.get(actorId)?.deleteOwnedItem(itemId, options);
            return ownedItem.data
        } catch (err) { }
    },
    getGameData() {
        return {
            actors: duplicate([...game.actors]),
            items: duplicate([...game.items])
        }
    },
    getActorData(actorId: string): BaseData { return game.actors.get(actorId) },
    getItemData(itemId: string): BaseData { return game.items.get(itemId)?.data },
    getOwnedItemData(actorId: string, itemId: string) { return game.actors.get(actorId)?.getOwnedItem(itemId)?.data },
    notify() { },
    roll() { },
    openPDF(code: string, options: any) {
        const api = ui.PDFoundry;
        if (!api) return
        try {
            api.openPDFByCode(code, options);
        } catch (err) {
            console.log(err);
        }
    }
}
function parseGURPSRefernce() {
    let ref: string;
    ref = /( )/.test(ref) ? ref.split(" ")[0] : ref;
    ref = /,/.test(ref) ? ref.split(",")[0] : ref;
    ref = /\//.test(ref) ? ref.split("/")[0] : ref;
    const meta = ref.includes(":") ? ref.split(":") : [ref.split(/[0-9]+/)[0], ref.split(/^[^0-9]+/)[1]];
}
export async function handleFoundryEvent(event: FoundryEvent) {
    if (!event || !event.type || !event.data) return
    switch (event.type) {
        case FoundryHooks.CreateActor: {
            const [actor, options, _id] = event.data as CreateEntityHookParams<BaseData<string, Data>>;
            const { type, id } = actor.data
            Crud.create(actor.data, { silent: true })
            break
        }
        case FoundryHooks.DeleteActor: {
            const [actor, applications, _id] = event.data as DeleteEntityHookParams<BaseData<string, Data>>;
            const { type, id } = actor.data
            Crud.delete(actor.data, { silent: true });
            break
        }
        case FoundryHooks.UpdateActor: {
            const [actor, changes, options, _id] = event.data as UpdateEntityHookParams<BaseData<string, Data>>;
            const { type, id } = actor.data;
            Crud.update({ ...changes.data, id, type }, { silent: true });
            break
        }
        case FoundryHooks.CreateItem: {
            const [item, options, _id] = event.data as CreateEntityHookParams<BaseData<string, Data>>;
            const { type, id } = item.data;
            Crud.create(item.data, { silent: true });
            break
        }
        case FoundryHooks.DeleteItem: {
            const [item, applications, _id] = event.data as DeleteEntityHookParams<BaseData<string, Data>>;
            const { type, id } = item.data;
            Crud.delete(item.data, { silent: true });
            break
        }
        case FoundryHooks.UpdateItem: {
            const [item, changes, options, _id] = event.data as UpdateEntityHookParams<BaseData<string, Data>>;
            const { type, id } = item.data;
            Crud.update({ ...changes.data, id, type }, { silent: true });
            break
        }
        case FoundryHooks.CreateOwnedItem: {
            const [parent, item, options, _id] = event.data as CreateEmbeddedEntityHookParams<BaseData<string, Data>>;
            const { type, id } = item.data;
            const entity = Entity.collections[parent.data.type]?.entity;
            let embed: Data
            if (entity instanceof Entity) {
                let wrapper = new entity(id)
                if (wrapper.exists) {
                    embed = wrapper.embed(item.data);
                }
            }
            //if (embed) Crud.embed(embed, { silent: true });
            break
        }
        case FoundryHooks.UpdateOwnedItem: {
            const [parent, item, changes, options, _id] = event.data as UpdateEmbeddedEntityHookParams;
            const { id, type } = item.data;
            Crud.update({ ...changes.data, id, type }, { silent: true });
            break
        }
        case FoundryHooks.DeleteOwnedItem: {
            const [parent, item, applications, _id] = event.data as DeleteEmbeddedEntityHookParams;
            const { id, type } = item.data;
            Crud.delete({ id, type })
            break
        }

        default: {

        }
    }
}

function assignAlternativeIds(data: OrArray<BaseData<string, Data>>) {
    for (const piece of data instanceof Array ? data : [data]) {
        const { type, id } = piece.data
        // Entity.collections[type]?.store.update(id, state => Object.assign({}, state, {
        //     alternativeIds: {
        //         ...state.alternativeIds,
        //         foundry: piece._id
        //     }
        // }));
    }
}

async function applySplitEntityMethods(methods: Record<string, Function>, data: OrArray<Data>, assignIds: boolean = false, map: (d: any) => any, options) {
    data = data instanceof Array ? data : [data];
    const embedded = data.filter(entity => entity.embedded).reduce(reduceToPathRecord("$.rootEntity.alternativeIds.foundry"), {});
    const notEmbedded = data.filter(entity => !entity.embedded);
    for (const parentId in embedded) {
        const embeddedItems = methods.embedded ? await methods.embedded(parentId, embedded[parentId].map(map), options) : [];
        if (assignIds) applyTransaction(() => assignAlternativeIds(embeddedItems));
    }
    const actors = data.filter(entity => entity.type === "character");
    const items = data.filter(entity => entity.type !== "character");

    const newActors = methods.actors ? await methods.actors(actors.map(map), options) : [];
    const newItems = methods.items ? await methods.items(items.map(map), options) : [];

    if (assignIds) applyTransaction(() => assignAlternativeIds([...newActors, ...newItems]));
}

const getPrefferedId = data => data?.rootEntity?.alternativeIds?.foundry ?? data?.alternativeIds?.foundry ?? data.id
export async function handleForwardEventsToFoundry(event: CrudEvent, connection: Connection<typeof foundryConnectionMethods>) {
    const foundryMethods = await connection.promise;
    if (!foundryMethods) return
    const methods = {
        create: {
            embedded: foundryMethods.createOwnedItem,
            items: foundryMethods.createItem,
            actors: foundryMethods.createItem,
            map: data => ({
                name: data?.keys?.profile?.name ?? "???",
                data,
                type: data.type
            })
        },
        delete: {
            embedded: foundryMethods.deleteOwnedItem,
            items: foundryMethods.deleteItem,
            actors: foundryMethods.deleteActor,
            map: data => getPrefferedId(data)
        },
        update: {
            embedded: foundryMethods.updateOwnedItem,
            items: foundryMethods.updateItem,
            actors: foundryMethods.updateActor,
            map: data => ({
                _id: getPrefferedId(data),
                data
            })
        },
    }
    switch (event.type) {
        case CrudEventType.Create: {
            const [entities, options] = event.data
            applySplitEntityMethods(
                methods.create,
                entities,
                true,
                methods.create.map,
                options
            );
            break
        }
        case CrudEventType.Delete: {
            const [entities, options] = event.data
            applySplitEntityMethods(
                methods.delete,
                entities,
                false,
                methods.delete.map,
                options
            );
            break
        }
        case CrudEventType.Update: {
            const [entities, options] = event.data
            applySplitEntityMethods(
                methods.update,
                entities,
                false,
                methods.update.map,
                options
            );
            break
        }
        // case CrudEventType.Roll: {
        //     const [entities, options] = event.data

        //     break
        // }
    }
}

function onFoundryInit() {
    CONFIG.Combat.initiative = {
        decimals: 2,
        formula: "@initiative"
    };
    const classes = makeClasses();
    CONFIG.Actor.entityClass = classes.VActor;
    CONFIG.Item.entityClass;
    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);
    Actors.registerSheet("GURPS", classes.VActorSheet, { makeDefault: true });
    Items.registerSheet("GURPS", classes.VItemSheet, { makeDefault: true });
}

async function mergeEntityInfo(...args: any[]) {
    const [entity, options, id] = args;
    const originalData = entity.data.data;
    entity.update({
        data: {
            id: originalData.id || Crud.tag(),
            alternativeIds: {
                foundry: id
            },
            createdOn: originalData.createdOn || new Date().toJSON()
        }
    });
}
async function mergeEmbeddedEntityInfo(...args: any[]) {
    const [parent, doc, options, id] = args;
    const originalData = doc.data;
    await parent.updateOwnedItem({
        data: {
            id: originalData.id || id,
            alternativeIds: {
                foundry: id
            },
            createdOn: originalData.createdOn || new Date().toJSON()
        }
    });
}

function onFoundryReady() {
    const observables = {} as Record<FoundryHooks, Observable<HookTuples>>;
    const subscriptions = {} as Record<FoundryHooks, Subscription>
    for (const hook of Object.values(FoundryHooks)) {
        observables[hook] = fromEvent<HookTuples>(Hooks, hook);
        subscriptions[hook] = observables[hook].subscribe((args) => sendEventToAllConnections(hook, duplicate(args)))
    }
    Hooks.on(FoundryHooks.CreateActor, mergeEntityInfo);
    Hooks.on(FoundryHooks.CreateItem, mergeEntityInfo);
    Hooks.on(FoundryHooks.CreateOwnedItem, mergeEmbeddedEntityInfo);
}

async function sendEventToAllConnections(type: FoundryHooks, data: HookTuples) {
    console.log(type, data);
    for (const connection of connections) {
        try {
            (await connection.promise).sendEvent({
                type,
                data
            });
        } catch (err) {
            connections.delete(connection);
        }
    }
}

function createCrudConnection() {
    const iframe = document.createElement("iframe")
    Object.assign(iframe, {
        src: "http://localhost:3000/index.html",
        width: "100%",
        height: "100%"
    });
    const connection = connectToChild<typeof valorConnectionMethods>({
        iframe,
        methods: foundryConnectionMethods
    });
    connections.add(connection);
    return {
        iframe,
        connection
    }
}

const vSheetDefaultOptions = {
    classes: ["foundry-Crud"],
    template: "systems/GURPS/assets/templates/holder.html",
    width: 1330,
    height: 700,
    submitOnChange: false
}
function makeClasses() {
    class VActorSheet extends ActorSheet {

        constructor() {
            super(...arguments)
        }
        static get defaultOptions() {
            return mergeObject(ActorSheet.defaultOptions, vSheetDefaultOptions)
        }
        async activateListeners(html: JQuery) {
            super.activateListeners(html);
            const [elem, ...others] = html.get();
            const { iframe, connection } = createCrudConnection();
            html.append(iframe);
            const { setState } = await connection.promise;
            setState({
                currentlyEditing: {
                    id: this.actor.data.data.id,
                    type: this.actor.data.data.type
                }
            });
        }
        render() {
            if (this.rendered) return
            return super.render(...arguments)
        }
    }
    class VActor extends Actor {
        data: any
        constructor() {
            super(...arguments);
        }
        prepareData() {
            super.prepareData();
            const speed = 0;
            const dexterity = 0;
            const health = 0;

            mergeObject(this.data.data, {
                initiative: speed + (dexterity + health) / 4
            });
        }
    }
    class VItemSheet extends ItemSheet {
        constructor() {
            super(...arguments)
        }
        static get defaultOptions() {
            return mergeObject(ItemSheet.defaultOptions, vSheetDefaultOptions)
        }
        activateListeners(html: JQuery) {
            super.activateListeners(html);
        }
        render() {
            if (this.rendered) return
            return super.render(...arguments)
        }
    }
    class VApp extends Application {
        constructor() {
            super(...arguments)
        }
        static get defaultOptions() {
            return mergeObject(Application.defaultOptions, {
                classes: ["foundry-Crud"],
                template: ["systems/GURPS/assets/tempaltes/holder.html"],
                resizable: true,
                width: 1330,
                height: 700
            })
        }
        activateListeners(html: JQuery) {
            super.activateListener(...arguments)
        }
        async close() {

            return super.close(...arguments);
        }
    }
    return {
        VActorSheet,
        VActor,
        VItemSheet,
        VApp,
    }
}

try {
    if (!(game && game.system?.id === "GURPS")) {
        Hooks.on("init", onFoundryInit);
        Hooks.on("ready", onFoundryReady);
        console.log("script successfully executed");
    }
} catch (err) {

}
