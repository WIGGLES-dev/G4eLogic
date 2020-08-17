import { Character } from "@character/character";
import { Collection } from "./collection";
export declare abstract class CharacterElement<T extends CharacterElement<T>> {
    static keys: string[];
    subscriptions: Set<(store: any) => void>;
    data: any;
    uuid: string;
    r20rowID: string;
    foundryID: string;
    reference: string;
    userDescription: string;
    notes: string;
    categories: Collection<string, string>;
    character: Character;
    constructor(character: Character, keys: string[]);
    private proxy;
    private createDataAccessors;
    getClass(): Function;
    delete(): void;
    getSerializer(scope?: string): import("../..").Serializer;
    private dispatch;
    private unsubscribe;
    subscribe(subscription: (store: any) => void): () => void;
    update(updater: (store: any) => any): void;
}
