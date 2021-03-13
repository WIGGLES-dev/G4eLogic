import { Data, OrArray, Resource, System, treeFlatten } from "@internal"
import { connectToChild, connectToParent } from "penpal"
import { Connection } from "penpal/lib/types"
import { fromEvent, observable, Observable, Subject, Subscription } from "rxjs"
import { IDatabaseChange, DatabaseChangeType, ICreateChange, IDeleteChange, IUpdateChange } from 'dexie-observable/api';
import { posts$, foundryConnectionMethods } from "./methods";

const settings = {
    types: {
        character: "Actor",
        equipment: "Item",
        skill: "Item",
        trait: "Item"
    }
};
const vSheetDefaultOptions = {
    classes: ["foundry-Crud"],
    template: "systems/GURPS/assets/templates/holder.html",
    width: 1330,
    height: 700,
    submitOnChange: false
}

function connect<T extends Record<string, Function>>({
    slug = "",
    src = "http://localhost:3000/index.html" + slug,
    methods = foundryConnectionMethods
} = {}) {
    const iframe = document.createElement("iframe")
    Object.assign(iframe, {
        src,
        width: "100%",
        height: "100%"
    });
    const connection = connectToChild<T>({
        iframe,
        methods
    });
    return {
        iframe,
        connection
    }
}
const { connection, iframe } = connect<typeof System["methods"]>();
function onFoundryInit() {
    CONFIG.Combat.initiative = {
        decimals: 2,
        formula: "@initiative"
    };
    class VActorSheet extends ActorSheet {
        constructor() {
            super(...arguments)
        }
        static get defaultOptions() {
            return mergeObject(ActorSheet.defaultOptions, vSheetDefaultOptions)
        }
        async activateListeners(html: HTMLElement) {
            super.activateListeners(html);
            const { iframe, connection } = connect({
                slug: `/${this.id}`
            })
            html.append(iframe);
            const { } = await connection.promise;
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
        activateListeners(html: HTMLElement) {
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
        activateListeners(html: HTMLElement) {
            super.activateListener(...arguments)
        }
        async close() {
            return super.close(...arguments);
        }
    }
    CONFIG.Actor.entityClass = VActor;
    CONFIG.Item.entityClass;
    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);
    Actors.registerSheet("GURPS", VActorSheet, { makeDefault: true });
    Items.registerSheet("GURPS", VItemSheet, { makeDefault: true });
}
async function mergeEntityInfo(...args: any[]) {
    const [entity, options, id] = args;
    const originalData = entity.data.data;
    entity.update({
        data: {
            id: originalData.id,
            createdOn: originalData.createdOn || new Date().toJSON()
        }
    });
}
function onFoundryReady() {
    const observables = {} as Record<FoundryHooks, Observable<FoundryEvent>>;
    const subscriptions = {} as Record<FoundryHooks, Subscription>
    for (const hook of Object.values(FoundryHooks)) {
        observables[hook] = fromEvent<FoundryEvent>(Hooks, hook);
        const sub = observables[hook].subscribe(handleFoundryEvent);
        subscriptions[hook] = sub;
    }
    Hooks.on(FoundryHooks.CreateActor, mergeEntityInfo);
    Hooks.on(FoundryHooks.CreateItem, mergeEntityInfo);
    posts$.subscribe(handleValorEvent);
}
export async function handleFoundryEvent(event: FoundryEvent) {
    if (!event || !event.type || !event.data) return
    const methods = await connection.promise
    switch (event.type) {
        case FoundryHooks.CreateActor: {
            const [actor, options, _id] = event.data as CreateEntityHookParams<BaseData<string, Data>>;
            const { type, id } = actor.data
            methods.create({
                id,
                type
            });
            break
        }
        case FoundryHooks.DeleteActor: {
            const [actor, applications, _id] = event.data as DeleteEntityHookParams<BaseData<string, Data>>;
            const { type, id } = actor.data
            methods.delete({ id });
            break
        }
        case FoundryHooks.UpdateActor: {
            const [actor, changes, options, _id] = event.data as UpdateEntityHookParams<BaseData<string, Data>>;
            const { type, id } = actor.data;
            methods.update({
                id
            });
            break
        }
        case FoundryHooks.CreateItem: {
            const [item, options, _id] = event.data as CreateEntityHookParams<BaseData<string, Data>>;
            const { type, id } = item.data;
            methods.create({
                id,
                type,
                ...item.data
            })
            break
        }
        case FoundryHooks.DeleteItem: {
            const [item, applications, _id] = event.data as DeleteEntityHookParams<BaseData<string, Data>>;
            const { type, id } = item.data;
            methods.delete({
                id
            });
            break
        }
        case FoundryHooks.UpdateItem: {
            const [item, changes, options, _id] = event.data as UpdateEntityHookParams<BaseData<string, Data>>;
            const { type, id } = item.data;
            methods.update({
                id,
                ...item.data
            });
            break
        }
        case FoundryHooks.CreateOwnedItem: {
            const [parent, item, options, _id] = event.data as CreateEmbeddedEntityHookParams<BaseData<string, Data>>;
            const { type, id } = item.data;
            methods.create({
                root: _id,
                id,
                type
            });
            break
        }
        case FoundryHooks.UpdateOwnedItem: {
            const [parent, item, changes, options, _id] = event.data as UpdateEmbeddedEntityHookParams;
            const { id, type } = item.data;
            methods.update({
                root: _id,
                id
            })
            break
        }
        case FoundryHooks.DeleteOwnedItem: {
            const [parent, item, applications, _id] = event.data as DeleteEmbeddedEntityHookParams;
            const { id, type } = item.data;
            methods.delete({
                root: _id,
                id
            });
            break
        }
        default: {

        }
    }
}
export async function handleValorEvent(change: IDatabaseChange) {
    const { key } = change;
    const isActor = game.actors.get(key).id === key;
    const entity = game[isActor ? "actors" : "items"].get(key);
    switch (change.type) {
        case DatabaseChangeType.Create: {
            (settings.types[change.obj.type] === "Actor" ? Actor : Item).create(change.obj);
            break
        }
        case DatabaseChangeType.Delete: {
            entity.delete();
            break
        }
        case DatabaseChangeType.Update: {
            const nodes = treeFlatten(change.obj);
            if (isActor) {

            } else {

            }
            entity.update(change.obj);
            break
        }
    }
}
try {
    if (window && window["game"] && window["game"]?.system?.id === "GURPS") {
        Hooks.on("init", onFoundryInit);
        Hooks.on("ready", onFoundryReady);
    }
} catch (err) {

}