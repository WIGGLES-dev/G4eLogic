import { objectify } from "@utils/json_utils";
import { Default } from "./misc/default";
export class Weapon {
    constructor(owner) {
        this.owner = owner;
    }
    toJSON() {
    }
    loadJSON(object) {
        var _a;
        object = objectify(object);
        (_a = object.defaults) === null || _a === void 0 ? void 0 : _a.forEach((weaponDefault) => this.defaults.add(new WeaponDefault(this.owner).loadJSON(weaponDefault)));
    }
}
class MeleeWeapon extends Weapon {
}
class RangedWeapon extends Weapon {
}
class WeaponDefault extends Default {
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