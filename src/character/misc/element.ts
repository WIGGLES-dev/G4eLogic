import {
    generateRowID,
    generateUUID
} from "../../utils/2R20";
import { objectify, json } from "../../utils/json_utils";

export abstract class CharacterElement<T extends CharacterElement<T>> {
    uuid: string
    r20rowID: string

    reference: string = ""
    userDescription: string = ""
    notes: string = ""
    categories: Set<string>

    constructor() {
        this.uuid = generateUUID().toString();
        this.r20rowID = generateRowID();
        this.categories = new Set();
    }
    toJSON() {

    }
    loadJSON(object: string | json) {
        object = objectify(object)
        this.reference = object.reference;
        this.userDescription = object.user_description;
        this.notes = object.notes;
        object?.categories?.forEach((category: string) => this.categories.add(category));
    }
}