import type { System } from "@internal";
import type { Remote } from "comlink";
import { IDatabaseChange } from "dexie-observable/api";
export declare enum FoundryHooks {
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
declare type Connection = Remote<typeof System>;
export declare function handleValorEvent(changes: IDatabaseChange[]): Promise<void>;
export declare const hookHandlers: Record<string, (this: Connection, ...args: any[]) => Promise<void> | false | void>;
export {};
