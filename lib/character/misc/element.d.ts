import { json } from "@utils/json_utils";
import { Character } from "@character/character";
export declare abstract class CharacterElement<T extends CharacterElement<T>> {
    uuid: string;
    r20rowID: string;
    foundryID: string;
    reference: string;
    userDescription: string;
    notes: string;
    categories: Set<string>;
    character: Character;
    constructor(character: Character, foundryID?: string);
    static mapElement(data: json, element: CharacterElement<any>): void;
    getSerializer(): import("../..").Serializer;
}
