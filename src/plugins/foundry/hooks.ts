import type { System } from "@internal";
import { keyMap } from "@utils/object";
import type { Remote } from "comlink";
import { DatabaseChangeType, IDatabaseChange } from "dexie-observable/api";
export enum FoundryHooks {
    DeleteActor = "deleteActor",
    PreCreateActor = "preCreateActor",
    CreateActor = "createActor",
    PreUpdateActor = "preUpdateActor",
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
type Connection = Remote<typeof System>;
const settings = {
    types: {
        character: "Actor",
        equipment: "Item",
        skill: "Item",
        trait: "Item"
    }
};
const timestamps: Record<string, number> = {};
function shouldIgnoreUpdate(id, timestamp) {
    return timestamp <= timestamps[id]
}
function makeFoundryDeleteKeys(mods = {}) {
    return keyMap(mods as any, (key, value) => {
        if (value === null && typeof key === "string") {
            const parts = key.split(".");
            const prefix = parts.slice(0, -1);
            const postfix = parts.slice(-1);
            const deleteKey = "data" + prefix.join(".") + "-=" + postfix;
            return [deleteKey, null]
        } else {
            return [key, value]
        }
    })
}
export async function handleValorEvent(changes: IDatabaseChange[]) {
    for (const change of changes.slice(-1)) {
        const { key } = change;
        const isActor = game.actors.get(key)?.id === key;
        const entity = game[isActor ? "actors" : "items"].get(key);
        switch (change.type) {
            case DatabaseChangeType.Create: {
                //(settings.types[change.obj.type] === "Actor" ? Actor : Item).create({ data: change.obj });
                break
            }
            case DatabaseChangeType.Delete: {
                //entity.delete();
                break
            }
            case DatabaseChangeType.Update: {
                const timestamp = change.obj?.__meta__?.lastEdit;
                timestamps[change.key] = timestamp;
                const {
                    name,
                    image = "icons/svg/mystery-man.svg"
                } = change.obj;
                await entity.update({
                    ...makeFoundryDeleteKeys(change.mods),
                    name: name || "???",
                    img: image,
                    data: change.obj,
                }, { diff: false });
                break
            }
        }
    }
}
async function handleCreateEntity(this: Connection, entity, options, userId) {
    const {
        id,
        data
    } = entity;
    const obj = Object.assign(
        {},
        data.data,
        {
            type: data.type,
            id
        }
    );
    await this.add("index", obj, id);
    const sync = await this.get("index", id);
    await entity.update({
        data: sync
    });
}
async function handleUpdateEntity(this: Connection, entity, d, options, userId) {
    const timestamp = d?.data?.__meta__?.lastEdit;
    const {
        id,
        data
    } = entity;
    if (shouldIgnoreUpdate(entity.id, timestamp)) {

    } else {
        const obj = Object.assign(
            {},
            d?.data,
            {
                type: data.type,
            }
        );
        this.update("index", id, obj);
    }
}
export const hookHandlers: Record<string, (this: Connection, ...args) => Promise<void> | false | void> = {
    preCreateActor(data, options, userId) { },
    async createActor(actor, options, userId) {
        await handleCreateEntity.call(this, actor, options, userId);
    },
    preUpdateActor(actor, d, options, userId) {

    },
    async updateActor(actor, d, options, userId) {
        await handleUpdateEntity.call(this, actor, d, options, userId);
    },
    preDeleteActor(actor, options, userId) { },
    async deleteActor(actor, options, userId) {
        this.delete("index", actor.id);
    },
    preCreateItem(data, options, userId) { },
    async createItem(item, options, userId) {
        await handleCreateEntity.call(this, item, options, userId);
    },
    preUpdateItem(item, d, options, userId) { },
    async updateItem(item, d, options, userId) {
        await handleUpdateEntity.call(this, item, d, options, userId);
    },
    preDeleteItem(item, options, userId) { },
    async deleteItem(item, options, userId) { },
    preCreateOwnedItem() { },
    async createOwnedItem() { },
    preUpdateOwnedItem() { },
    async updateOwnedItem() { },
    preDeleteOwnedItem() { },
    async deleteOwnedItem() { },

    async renderActorSheet(sheet, html, data) { },
    async renderItemSheet(item, html, data) { }
};