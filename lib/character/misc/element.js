import { generateRowID, generateUUID } from "@utils/2R20";
import { objectify } from "@utils/json_utils";
export class CharacterElement {
    constructor(foundryID) {
        this.reference = "";
        this.userDescription = "";
        this.notes = "";
        this.foundryID = foundryID;
        this.uuid = generateUUID().toString();
        this.r20rowID = generateRowID();
        this.categories = new Set();
    }
    static mapElement(data, element) {
        var _a;
        element.reference = data.reference;
        element.userDescription = data.user_description;
        element.notes = data.notes;
        (_a = data.categories) === null || _a === void 0 ? void 0 : _a.forEach((category) => element.categories.add(category));
    }
    toJSON() {
    }
    loadJSON(object) {
        object = objectify(object);
        CharacterElement.mapElement(object, this);
    }
}
//# sourceMappingURL=element.js.map