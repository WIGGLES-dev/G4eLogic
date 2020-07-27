import { Trait } from "../trait"
import { Equipment } from "../equipment"
import { objectify, json } from "@utils/json_utils"
import { CharacterElement } from "./element"
import { Constructor } from "@character/serialization/serializer"

export type Modifiable = Trait | Equipment
export abstract class Modifier<T extends Modifiable> extends CharacterElement<T> {
    abstract version: number
    abstract tag: string

    enabled: boolean = true
    name: string
    owner: T

    constructor(owner: T) {
        super(owner.character);
        this.owner = owner
        this.categories = new Set();
    }
    save() {
        return this.getSerializer().transformers.get(this.constructor as Constructor).save(this)
    }
    load(data: any) {
        return this.getSerializer().transformers.get(this.constructor as Constructor).load(this, data)
    }

    /**
     * Utility function for extract numbers from strings with non numerical characters
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
