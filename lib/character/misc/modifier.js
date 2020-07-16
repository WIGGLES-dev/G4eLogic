"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modifier = void 0;
const json_utils_1 = require("../../utils/json_utils");
const element_1 = require("./element");
class Modifier extends element_1.CharacterElement {
    constructor(owner) {
        super();
        this.enabled = true;
        this.owner = owner;
        this.categories = new Set();
    }
    toJSON() {
    }
    loadJSON(object) {
        object = json_utils_1.objectify(object);
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
exports.Modifier = Modifier;
Modifier.version = 2;
//# sourceMappingURL=modifier.js.map