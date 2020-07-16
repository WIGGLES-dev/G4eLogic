"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterElement = void 0;
const _2R20_1 = require("../../utils/2R20");
const json_utils_1 = require("../../utils/json_utils");
class CharacterElement {
    constructor() {
        this.reference = "";
        this.userDescription = "";
        this.notes = "";
        this.uuid = _2R20_1.generateUUID().toString();
        this.r20rowID = _2R20_1.generateRowID();
        this.categories = new Set();
    }
    toJSON() {
    }
    loadJSON(object) {
        var _a;
        object = json_utils_1.objectify(object);
        this.reference = object.reference;
        this.userDescription = object.user_description;
        this.notes = object.notes;
        (_a = object === null || object === void 0 ? void 0 : object.categories) === null || _a === void 0 ? void 0 : _a.forEach((category) => this.categories.add(category));
    }
}
exports.CharacterElement = CharacterElement;
//# sourceMappingURL=element.js.map