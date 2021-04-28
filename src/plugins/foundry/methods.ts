import type { OrArray } from "@utils/object";
export const foundryMethods = {
    async createItem(data: OrArray<any>, options?: Options): Promise<OrArray<any>> {
        try {
            const item = await Item.create(data, options);
            return item.data
        } catch (err) {

        }
    },
    async updateItem(data: OrArray<any>, options?: Options): Promise<OrArray<any>> {
        try {
            const item = await Item.update(data, options);
            //@ts-ignore
            return item.data
        } catch (err) {

        }
    },
    async deleteItem(data: OrArray<string>, options?: Options): Promise<OrArray<any>> {
        try {
            const item = await Item.delete(data as string, options);
            return item.data
        } catch (err) {

        }
    },
    async createActor(data: OrArray<any>, options?: Options): Promise<OrArray<any>> {
        try {
            const actor = await Actor.delete(data, options);
            return actor.data
        } catch (err) {

        }
    },
    async updateActor(data: OrArray<any>, options?: Options): Promise<OrArray<any>> {
        try {
            const actor = await Actor.update(data, options);
            //@ts-ignore
            return actor.data
        } catch (err) {

        }
    },
    async deleteActor(data: OrArray<string>, options?: Options) {
        try {
            //@ts-ignore
            const actor = await Actor.delete(data, options);
            return actor.data
        } catch (err) {

        }
    },
    async createOwnedItem(actorId: string, item: OrArray<any>, options?: Options): Promise<OrArray<any>> {
        try {
            const ownedItem = await game.actors.get(actorId)?.createOwnedItem(item, options);
            return ownedItem.data
        } catch (err) { }
    },
    async updateOwnedItem(actorId: string, item: OrArray<any>, options?: Options): Promise<OrArray<any>> {
        try {
            const ownedItem = await game.actors.get(actorId)?.updateOwnedItem(item, options);
            return ownedItem.data
        } catch (err) {

        }
    },
    async deleteOwnedItem(actorId: string, itemId: OrArray<string>, options?: Options): Promise<OrArray<any>> {
        try {
            //@ts-ignore
            const ownedItem = await game.actors.get(actorId)?.deleteOwnedItem(itemId, options);
            return ownedItem.data
        } catch (err) { }
    },
    getGameData() {
        return duplicate(game)
    },
    getActorData(actorId: string): any {
        return game.actors.get(actorId)
    },
    getItemData(itemId: string): any {
        return game.items.get(itemId)?.data
    },
    getOwnedItemData(actorId: string, itemId: string) {
        return game.actors.get(actorId)?.getOwnedItem(itemId)?.data
    },
    notify() { },
    roll(formula, data) {
        Roll.create(formula, data).toMessage();
    },
    openPDF(code: string, options: any) {
        //@ts-ignore
        const api = ui.PDFoundry;
        if (!api) return
        try {
            api.openPDFByCode(code, options);
        } catch (err) {
            console.log(err);
        }
    }
}