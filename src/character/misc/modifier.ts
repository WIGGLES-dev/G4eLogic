import { Trait } from "../trait"
import { Equipment } from "../equipment"
import { objectify, json } from "@utils/json_utils"
import { CharacterElement } from "./element"

export type Modifiable = Trait | Equipment
export abstract class Modifier<T extends Modifiable> extends CharacterElement<T> {
    static version = 2

    enabled: boolean = true
    name: string
    owner: T

    constructor(owner: T) {
        super();
        this.owner = owner
        this.categories = new Set();
    }
    toJSON() {

    }
    loadJSON(object: string | json) {
        object = objectify(object);
        super.loadJSON(object);
        function mapModifier(object: any, modifier: Modifier<T>): Modifier<T> {
            modifier.name = object.name;
            modifier.reference = object.reference;
            modifier.notes = object.notes;
            modifier.enabled = !object.disabled;
            return modifier
        }
        mapModifier(object, this);
    }

    /**
     * Utility statement for extract numbers from strings with non numerical characters
     * @param value String from which a number is to be extracted.
     */

    static extractValue(value: string) {
        if (typeof value === "string") {
            let numArr = value.match(/(\d+)/);
            return parseFloat(numArr[0])
        } else {
            return null
        }
    }
}
