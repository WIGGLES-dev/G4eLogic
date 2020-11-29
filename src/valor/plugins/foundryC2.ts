import { Valor, EntityData } from "@internal";
import { Connection } from "penpal/lib/types";
import { fromEvent } from "rxjs";

declare const CONFIG: any
declare const Entity: any
declare const Actor: any
declare const Item: any
declare const Hooks: any
declare const game: any
interface FoundryData<T extends string = string, D extends EntityData = EntityData<T>> {
    data: D
    effects?: any[],
    flags?: Record<string, any>,
    _id: string,
    type: T
    img?: string
    name: string
    sort?: number
}
/**
 * Methods exposed to the Valor session allowing valor to control the state of foundry.
 */
export const foundryConnectionMethods = {
    async createItem(data: FoundryData | FoundryData[], options = {}) { return await Item.create(data, options) },
    async updateItem(data: FoundryData | FoundryData[], options = {}) { return await Item.update(data, options) },
    async deleteItem(data: string | string[], options) { return await Item.delete(data, options) },
    async createActor(data: FoundryData | FoundryData[], options?) { return await Actor.create(data, options) },
    async updateActor(data: FoundryData | FoundryData[], options?) { return await Actor.update(data, options) },
    async deleteActor(data: string | string[], options) { return await Actor.delete(data, options) },
    async createOwnedItem(actorId: string, item: FoundryData, options = {}) {
        return await game.actors.get(actorId)?.createOwnedItem(item, options)
    },
    async updateOwnedItem(actorId: string, item: FoundryData, options = {}) {
        return await game.actors.get(actorId)?.updateOwnedItem(item, options = {});
    },
    async deleteOwnedItem(actorId: string, itemId: string, options = {}) {
        return await game.actors.get(actorId)?.deleteOwnedItem(itemId, options)
    },
    getGameData() { return game.data },
    getActorData(actorId: string): FoundryData { return game.actors.get(actorId)?.data },
    getItemData(itemId: string): FoundryData { return game.items.get(itemId)?.data },
    getOwnedItemData(actorId: string, itemId: string) { return game.actors.get(actorId)?.getOwnedItem(itemId)?.data },
    notify() { },
    roll() { },
}

const deleteActor$ = fromEvent<any>(Hooks, "deleteActor");
const createActor$ = fromEvent<any>(Hooks, "createActor");
const updateActor$ = fromEvent<any>(Hooks, "updateActor");
const deleteItem$ = fromEvent<any>(Hooks, "deleteItem");
const createItem$ = fromEvent<any>(Hooks, "createItem");
const updateItem$ = fromEvent<any>(Hooks, "updateItem");
const deleteOwnedItem$ = fromEvent<any>(Hooks, "deleteOwnedItem");
const createOwnedItem$ = fromEvent<any>(Hooks, "createOwnedItem");
const updateOwnedItem$ = fromEvent<any>(Hooks, "updateOwnedItem");

const renderActorSheet$ = fromEvent<any>(Hooks, "renderActorSheet");
const renderItemSheet$ = fromEvent<any>(Hooks, "renderItemSheet");

class FoundryC2 {
    activeConnections: Map<string, Connection<typeof Valor["methods"]>>

    static connect() {

    }
}