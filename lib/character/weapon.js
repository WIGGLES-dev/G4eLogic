"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weapon = void 0;
const json_utils_1 = require("../utils/json_utils");
const default_1 = require("./misc/default");
class Weapon {
    constructor(owner) {
        this.owner = owner;
    }
    toJSON() {
    }
    loadJSON(object) {
        var _a;
        object = json_utils_1.objectify(object);
        (_a = object.defaults) === null || _a === void 0 ? void 0 : _a.forEach((weaponDefault) => this.defaults.add(new WeaponDefault(this.owner).loadJSON(weaponDefault)));
    }
}
exports.Weapon = Weapon;
class MeleeWeapon extends Weapon {
}
class RangedWeapon extends Weapon {
}
class WeaponDefault extends default_1.Default {
    constructor(owner) {
        super(owner);
    }
}
var BaseDamage;
(function (BaseDamage) {
    BaseDamage["swing"] = "sw";
    BaseDamage["thrust"] = "thr";
})(BaseDamage || (BaseDamage = {}));
var DamageType;
(function (DamageType) {
    DamageType["impaling"] = "imp";
    DamageType["crushing"] = "cr";
    DamageType["cutting"] = "cut";
    DamageType["fatigue"] = "fat";
    DamageType["toxic"] = "tox";
})(DamageType || (DamageType = {}));
//# sourceMappingURL=weapon.js.map