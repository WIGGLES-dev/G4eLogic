import { Trait } from "../trait/trait"
import { Equipment } from "../equipment/equipment"
import { CharacterElement, OwnedElement } from "./element"
import { ListItem } from "./list"

export abstract class Modifier<T extends Trait | Equipment> extends OwnedElement<T> {
    static keys = ["enabled", "name"]

    enabled: boolean = false
    name: string

    constructor(owner: T, keys: string[]) {
        super(owner, [...keys, ...Modifier.keys]);
        //@ts-ignore
        this.owner.modifiers.add(this);
    }

    delete() {
        //@ts-ignore
        this.owner.modifiers.delete(this);
        super.delete();
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
