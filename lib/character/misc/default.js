import { objectify } from "@utils/json_utils";
var DefaultType;
(function (DefaultType) {
    DefaultType["skill"] = "Skill";
})(DefaultType || (DefaultType = {}));
export class DefaultList {
}
export class Default {
    constructor(owner) {
        this.tag = "default";
        this.owner = owner;
    }
    toJSON() { }
    loadJSON(object) {
        object = objectify(object);
        this.type = object.type;
        this.modifier = object.modifier;
        this.name = object.name;
        this.specialization = object.specialization;
        return this;
    }
}
//# sourceMappingURL=default.js.map