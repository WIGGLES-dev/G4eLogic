import { Trait } from "../trait/trait"
import { Equipment } from "../equipment/equipment"
import { CharacterElement } from "./element"

export type Modifiable = Trait | Equipment
export abstract class Modifier<T extends Modifiable> extends CharacterElement<T> {
    static keys = ["enabled", "name"]
    abstract version: number
    abstract tag: string

    enabled: boolean = false
    name: string
    owner: T

    constructor(owner: T, keys: string[]) {
        super(owner.character, [...keys, ...Modifier.keys]);
        this.owner = owner
    }

    dispatch() {
        this.owner.dispatch();
        super.dispatch();
    }

    load(data: any, ...args) {
        return this.getSerializer().transform(this.constructor, "load")(this, data, ...args)
    }
    save(data: any, ...args) {
        return this.getSerializer().transform(this.constructor, "save")(this, data, ...args)
    }

    /**
     * Utility function for extract numbers from strings with non numerical characters
     * @param value String from which a number is to be extracted.
     */
    static extractValue(value: string) {
        if (typeof value === "string") {
            let numArr = value.match(/(\d+)/);
            return +numArr[0]
        } else {
            return null
        }
    }
}
