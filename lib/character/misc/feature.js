import { CharacterElement } from "./element";
import { objectify } from "utils/json_utils";
import { FeatureType } from "gcs";
import { AttributeBonus } from "@character/attribute";
import { stringCompare } from "utils/string_utils";
import * as gcs from "gcs";
export class FeatureList {
    constructor() {
        this.features = new Map();
        this.weapons = new Map();
    }
    registerFeature(feature) {
        this.features.set(feature.uuid, feature);
    }
    removeFeature(uuid) {
        this.features.delete(uuid);
    }
    getFeaturesByUUID(id) {
        return Array.from(this.features.values()).filter(feature => {
            if (feature.owner.uuid = id) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    iter() { return Array.from(this.features.values()); }
    getFeaturesByType(type) {
        return this.iter().filter(feature => feature.type === type);
    }
}
export class Feature extends CharacterElement {
    constructor(owner, type) {
        super();
        this.owner = owner;
        this.type = type;
        this.owner.list.character.featureList.registerFeature(this);
    }
    ownerIsActive() {
        return this.owner.isActive();
    }
    getBonus() { return this.leveled && this.owner.hasLevels ? this.amount * this.owner.getLevel() : this.amount; }
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
        object = objectify(object);
        super.loadJSON(object);
        this.amount = object.amount;
        this.leveled = (_a = object === null || object === void 0 ? void 0 : object.per_level) !== null && _a !== void 0 ? _a : false;
        this.limitation = (_b = object === null || object === void 0 ? void 0 : object.limitation) !== null && _b !== void 0 ? _b : false;
    }
    static loadFeature(owner, featureType) {
        switch (featureType) {
            case FeatureType.attributeBonus:
                return new AttributeBonus(owner);
            case FeatureType.containedWeightReduction:
            case FeatureType.costReduction:
            case FeatureType.damageResistanceBonus:
            case FeatureType.reactionBonus:
            case FeatureType.skillBonus:
                return new SkillBonus(owner);
            case FeatureType.spellBonus:
            case FeatureType.weaponDamageBonus:
            default:
                return null;
        }
    }
}
export class SkillBonus extends Feature {
    constructor(owner) {
        super(owner, gcs.FeatureType.skillBonus);
    }
    isApplicableTo(skill) {
        let nameMatch = stringCompare(this.name, skill.name, this.nameCompareType);
        let specializationMatch = stringCompare(this.specialization, skill.specialization, this.specializationCompareType);
        let categoryMatch = stringCompare(this.category, skill.categories, this.categoryCompareType);
        return nameMatch && specializationMatch && categoryMatch;
    }
    toJSON() {
        return {};
    }
    loadJSON(json) {
        var _a, _b, _c, _d, _e;
        const data = objectify(json);
        super.loadJSON(data);
        this.selectionType = data.selection_type;
        this.name = (_a = data === null || data === void 0 ? void 0 : data.name) === null || _a === void 0 ? void 0 : _a.qualifier;
        this.nameCompareType = (_b = data === null || data === void 0 ? void 0 : data.name) === null || _b === void 0 ? void 0 : _b.compare;
        this.specialization = (_c = data === null || data === void 0 ? void 0 : data.specialization) === null || _c === void 0 ? void 0 : _c.qualifier;
        this.specializationCompareType = (_d = data === null || data === void 0 ? void 0 : data.specialization) === null || _d === void 0 ? void 0 : _d.compare;
        this.categoryCompareType = (_e = data === null || data === void 0 ? void 0 : data.category) === null || _e === void 0 ? void 0 : _e.compare;
        return this;
    }
}
//# sourceMappingURL=feature.js.map