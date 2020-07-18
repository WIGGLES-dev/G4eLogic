"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = exports.DefaultList = void 0;
const json_utils_1 = require("utils/json_utils");
var DefaultType;
(function (DefaultType) {
    DefaultType["skill"] = "Skill";
})(DefaultType || (DefaultType = {}));
class DefaultList {
}
exports.DefaultList = DefaultList;
class Default {
    constructor(owner) {
        this.tag = "default";
        this.owner = owner;
    }
    toJSON() { }
    loadJSON(object) {
        object = json_utils_1.objectify(object);
        this.type = object.type;
        this.modifier = object.modifier;
        this.name = object.name;
        this.specialization = object.specialization;
        return this;
    }
}
exports.Default = Default;
//# sourceMappingURL=default.js.map