import { OrArray } from "@internal";
import { Subject } from "rxjs";
export const posts$ = new Subject();
export const foundryConnectionMethods = {
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
        return duplicate(game)
    },
    getActorData(actorId: string): BaseData {
        return game.actors.get(actorId)
    },
    getItemData(itemId: string): BaseData {
        return game.items.get(itemId)?.data
    },
    getOwnedItemData(actorId: string, itemId: string) {
        return game.actors.get(actorId)?.getOwnedItem(itemId)?.data
    },
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
    },
    post(data) {
        posts$.next(data)
    }
}