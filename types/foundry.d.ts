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
declare interface BaseData<T extends string = string, D = any> {
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
declare interface BaseTokenData { }
declare enum FoundryHooks {
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
declare type UpdateEntityHookParams<D extends BaseData = BaseData> = [entity: D, changes: Partial<D> & Pick<BaseData, "_id">, options: any, id: string]
declare type DeleteEntityHookParams<D extends BaseData = BaseData> = [entity: D, applications: any, id: string]
declare type CreateEntityHookParams<D extends BaseData = BaseData> = [entity: D, options: any, id: string]
declare type UpdateEmbeddedEntityHookParams<P extends BaseData = BaseData, I extends BaseData = BaseData> = [parent: P, item: I, changes: Partial<I> & Pick<BaseData, "_id">, options: any, id: string];
declare type DeleteEmbeddedEntityHookParams<P extends BaseData = BaseData, I extends BaseData = BaseData> = [parent: P, item: I, applications: any, id: string];
declare type CreateEmbeddedEntityHookParams<P extends BaseData = BaseData, I extends BaseData = BaseData> = [parent: P, item: I, options: any, id: string];
declare type HookTuples =
    UpdateEntityHookParams |
    DeleteEntityHookParams |
    CreateEntityHookParams |
    UpdateEmbeddedEntityHookParams |
    DeleteEmbeddedEntityHookParams |
    CreateEmbeddedEntityHookParams
declare interface FoundryEvent {
    type: FoundryHooks,
    data: HookTuples
}

declare type createData = Partial<BaseData> & Pick<BaseData, "name" | "type">
declare type updateData = Partial<BaseData> & Pick<BaseData, "_id" | "data">
declare interface Options { }
