"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = exports.FeatureType = void 0;
const element_1 = require("./element");
const json_utils_1 = require("../../utils/json_utils");
var FeatureType;
(function (FeatureType) {
    FeatureType["attributeBonus"] = "attribute_bonus";
    FeatureType["damageResistanceBonus"] = "dr_bonus";
    FeatureType["skillBonus"] = "skill_bonus";
    FeatureType["weaponDamageBonus"] = "weapon_bonus";
    FeatureType["reactionBonus"] = "reaction_bonus";
    FeatureType["spell_bonus"] = "spell_bonus";
    FeatureType["containedWeightReduction"] = "contained_weight_reduction";
    FeatureType["costReduction"] = "cost_reduction";
})(FeatureType = exports.FeatureType || (exports.FeatureType = {}));
class Feature extends element_1.CharacterElement {
    constructor(owner, type) {
        super();
        this.owner = owner;
        this.type = type;
        this.owner.list.character.featureList.registerFeature(this);
    }
    unregister() {
        this.owner.list.character.featureList.removeFeature(this.uuid);
    }
    ownerOwnedBy(owner) {
        if (this.owner.uuid === owner.uuid) {
            return true;
        }
        if (owner.containedBy && owner.containedBy.uuid === this.owner.uuid) {
        }
        else {
            return false;
        }
    }
    toJSON() {
    }
    loadJSON(object) {
        var _a, _b;
        object = json_utils_1.objectify(object);
        super.loadJSON(object);
        this.amount = object.amount;
        this.leveled = (_a = object === null || object === void 0 ? void 0 : object.per_level) !== null && _a !== void 0 ? _a : false;
        this.limitation = (_b = object === null || object === void 0 ? void 0 : object.limitation) !== null && _b !== void 0 ? _b : false;
    }
}
exports.Feature = Feature;
//# sourceMappingURL=feature.js.map