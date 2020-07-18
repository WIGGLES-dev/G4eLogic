"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterElement = void 0;
const _2R20_1 = require("../../utils/2R20");
const json_utils_1 = require("../../utils/json_utils");
class CharacterElement {
    constructor(foundryID) {
        this.reference = "";
        this.userDescription = "";
        this.notes = "";
        this.foundryID = foundryID;
        this.uuid = _2R20_1.generateUUID().toString();
        this.r20rowID = _2R20_1.generateRowID();
        this.categories = new Set();
    }
    static mapElement(data, element) {
        element.reference = data.reference;
        element.userDescription = data.user_description;
        element.notes = data.notes;
        data.categories.forEach((category) => element.categories.add(category));
    }
    toJSON() {
    }
    loadJSON(object) {
        object = json_utils_1.objectify(object);
        CharacterElement.mapElement(object, this);
    }
    toEntity() { }
    loadEntity(entity) {
        if (!this.foundryID)
            this.foundryID = entity.id;
        CharacterElement.mapElement(entity.data.data, this);
    }
}
exports.CharacterElement = CharacterElement;
//# sourceMappingURL=element.js.map