import {
    generateRowID,
    generateUUID
} from "../../utils/2R20";
import { objectify, json } from "../../utils/json_utils";

export abstract class CharacterElement<T extends CharacterElement<T>> {
    uuid: string
    r20rowID: string
    foundryID: string

    reference: string = ""
    userDescription: string = ""
    notes: string = ""
    categories: Set<string>

    constructor(foundryID?: string) {
        this.foundryID = foundryID;
        this.uuid = generateUUID().toString();
        this.r20rowID = generateRowID();
        this.categories = new Set();
    }
    static mapElement(data: json, element: CharacterElement<any>) {
        element.reference = data.reference;
        element.userDescription = data.user_description;
        element.notes = data.notes;
        data.categories.forEach((category: string) => element.categories.add(category));
    }
    toJSON() {

    }
    loadJSON(object: string | json) {
        object = objectify<json>(object)
        CharacterElement.mapElement(object, this);
    }
    toEntity() { }
    loadEntity(entity: Entity) {
        if (!this.foundryID) this.foundryID = entity.id;
        CharacterElement.mapElement(entity.data.data, this)
    }
}