import {
    generateRowID,
    generateUUID
} from "@utils/2R20";
import { objectify, json } from "@utils/json_utils";
import { Character } from "@character/character";

export abstract class CharacterElement<T extends CharacterElement<T>> {
    uuid: string
    r20rowID: string
    foundryID: string

    reference: string = ""
    userDescription: string = ""
    notes: string = ""
    categories: Set<string>

    character: Character

    constructor(character: Character) {
        this.character = character;
        this.uuid = generateUUID().toString();
        this.r20rowID = generateRowID();
        this.categories = new Set();
        this.character.registerElement(this);
    }
    delete() {
        this.character.removeElement(this);
    }
    static mapElement(data: json, element: CharacterElement<any>) {
        element.reference = data.reference;
        element.userDescription = data.user_description;
        element.notes = data.notes;
        data.categories?.forEach((category: string) => element.categories.add(category));
    }
    getSerializer() { return this.character.serializer }
}