import { objectify } from "@utils/json_utils";
import { CharacterElement } from "./element";
export class Modifier extends CharacterElement {
    constructor(owner) {
        super();
        this.enabled = true;
        this.owner = owner;
        this.categories = new Set();
    }
    toJSON() {
    }
    loadJSON(object) {
        object = objectify(object);
        super.loadJSON(object);
        function mapModifier(object, modifier) {
            modifier.name = object.name;
            modifier.reference = object.reference;
            modifier.notes = object.notes;
            modifier.enabled = !object.disabled;
            return modifier;
        }
        mapModifier(object, this);
    }
    static extractValue(value) {
        if (typeof value === "string") {
            let numArr = value.match(/(\d+)/);
            return parseFloat(numArr[0]);
        }
        else {
            return null;
        }
    }
}
Modifier.version = 2;
//# sourceMappingURL=modifier.js.map