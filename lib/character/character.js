"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _contents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.signatures = exports.Character = void 0;
const attribute_1 = require("./attribute");
const skill_1 = require("./skill");
const trait_1 = require("./trait");
const equipment_1 = require("./equipment");
const profile_1 = require("./profile");
const spell_1 = require("./spell");
const _2R20_1 = require("../utils/2R20");
const json_utils_1 = require("../utils/json_utils");
class Sheet {
    constructor(configuration) {
        this.configuration = configuration;
    }
}
class FeatureList {
    constructor() {
        _contents.set(this, void 0);
        __classPrivateFieldSet(this, _contents, new Map());
    }
    get table() { return __classPrivateFieldGet(this, _contents); }
    registerFeature(feature) {
        __classPrivateFieldGet(this, _contents).set(feature.uuid, feature);
    }
    removeFeature(uuid) {
        __classPrivateFieldGet(this, _contents).delete(uuid);
    }
    getFeaturesByUUID(id) {
        return Array.from(__classPrivateFieldGet(this, _contents).values()).filter(feature => {
            if (feature.owner.uuid = id) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    iter() { return Array.from(__classPrivateFieldGet(this, _contents).values()); }
}
_contents = new WeakMap();
class Character extends Sheet {
    constructor() {
        super({});
        this.profile = new profile_1.Profile();
        this.equipmentList = new equipment_1.ItemList(this);
        this.otherEquipmentList = new equipment_1.ItemList(this);
        this.skillList = new skill_1.SkillList(this);
        this.traitList = new trait_1.TraitList(this);
        this.spellList = new spell_1.SpellList(this);
        this.ST = new attribute_1.Attribute(this, 10, { defaultLevel: 10 });
        this.DX = new attribute_1.Attribute(this, 20, { defaultLevel: 10 });
        this.IQ = new attribute_1.Attribute(this, 20, { defaultLevel: 10 });
        this.HT = new attribute_1.Attribute(this, 10, { defaultLevel: 10 });
        this.Will = new attribute_1.Attribute(this, 5, { basedOn: () => this.IQ.calculateLevel() });
        this.Speed = new attribute_1.Attribute(this, 20, { basedOn: () => (this.DX.calculateLevel() + this.HT.calculateLevel()) / 4 });
        this.Move = new attribute_1.Attribute(this, 5, { basedOn: () => Math.floor(this.Speed.calculateLevel()) });
        this.Per = new attribute_1.Attribute(this, 5, { basedOn: () => this.IQ.calculateLevel() });
        this.HP = new attribute_1.Attribute(this, 2, { basedOn: () => this.ST.calculateLevel() });
        this.FP = new attribute_1.Attribute(this, 3, { basedOn: () => this.HT.calculateLevel() });
        this.featureList = new FeatureList();
    }
    totalAttributesCost() {
        return Object.values(this).reduce((prev, cur) => {
            if (cur instanceof attribute_1.Attribute) {
                return prev + cur.pointsSpent();
            }
            else {
                return prev;
            }
        }, 0);
    }
    attributes(attribute) {
        switch (attribute) {
            case signatures.HP: return this.HP.calculateLevel();
            case signatures.FP: return this.FP.calculateLevel();
            case signatures.ST: return this.ST.calculateLevel();
            case signatures.DX: return this.DX.calculateLevel();
            case signatures.IQ: return this.IQ.calculateLevel();
            case signatures.HT: return this.HT.calculateLevel();
            case signatures.Per: return this.Per.calculateLevel();
            case signatures.Will: return this.Will.calculateLevel();
            case signatures.Base: return 10;
            case signatures.Speed: return this.Speed.calculateLevel();
            case signatures.Move: return this.Move.calculateLevel();
        }
    }
    pointTotals() {
        const racialPoints = this.traitList.sumRacials();
        const attributePoints = this.totalAttributesCost();
        const advantages = this.traitList.sumAdvantages();
        const disadvantages = this.traitList.sumDisadvantages();
        const quirks = this.traitList.sumQuirks();
        const skills = this.traitList.sumQuirks();
        const spells = 0;
        return {
            racialPoints,
            attributePoints,
            advantages,
            disadvantages,
            quirks,
            skills,
            spells,
            total: racialPoints + attributePoints + advantages + disadvantages + quirks + skills + spells
        };
    }
    allItems() {
        return [].concat.apply([], [
            this.equipmentList.iter(),
            this.otherEquipmentList.iter()
        ]);
    }
    basicLift() {
        const ST = this.ST.calculateLevel();
        return Math.round(ST * ST / 5);
    }
    encumbranceLevel() {
        const basicLift = this.basicLift();
        const carriedWeight = this.carriedWeight(this.equipmentList);
        if (carriedWeight < basicLift) {
            return 0;
        }
        else if (carriedWeight < basicLift * 2) {
            return 1;
        }
        else if (carriedWeight < basicLift * 3) {
            return 2;
        }
        else if (carriedWeight < basicLift * 6) {
            return 3;
        }
        else if (carriedWeight < basicLift * 10) {
            return 4;
        }
    }
    encumberedMove() {
        return this.Move.calculateLevel() + this.encumbranceLevel() + 1;
    }
    carriedWeight(list) {
        return list.iterTop().reduce((prev, cur) => {
            return prev + cur.extendedWeight();
        }, 0);
    }
    carriedValue(list) {
        return list.iterTop().reduce((prev, cur) => {
            return prev + cur.extendedValue();
        }, 0);
    }
    dodgeScore() { return Math.floor(this.Speed.calculateLevel() + attribute_1.Attribute.bonusReducer(this, "dodge") + 3); }
    encumberedDodgeScore() {
        switch (this.encumbranceLevel()) {
            case 0:
                return this.dodgeScore();
            case 1:
                return Math.floor(this.dodgeScore() * .8);
            case 2:
                return Math.floor(this.dodgeScore() * .6);
            case 3:
                return Math.floor(this.dodgeScore() * .4);
            case 4:
                return Math.floor(this.dodgeScore() * .2);
        }
    }
    toJSON() {
    }
    loadJSON(json) {
        var _a, _b;
        json = json_utils_1.objectify(json);
        this.gCalcID = json.id;
        this.profile.loadJSON(json.profile);
        this.equipmentList.loadJSON(json.equipment);
        this.otherEquipmentList.loadJSON(json.otherEquipmentList);
        this.skillList.loadJSON(json.skills);
        this.traitList.loadJSON(json.advantages);
        this.spellList.loadJSON(json.spells);
        this.missingHP = (_a = json === null || json === void 0 ? void 0 : json.hp_damage) !== null && _a !== void 0 ? _a : 0;
        this.missingFP = (_b = json === null || json === void 0 ? void 0 : json.fp_damage) !== null && _b !== void 0 ? _b : 0;
        this.DX.setLevel(json.DX);
        this.FP.setLevel(json.fp_adj);
        this.HP.setLevel(json.hp_adj);
        this.HT.setLevel(json.HT);
        this.IQ.setLevel(json.IQ);
        this.Move.setLevel(json.move_adj);
        this.Per.setLevel(json.per_adj);
        this.ST.setLevel(json.ST);
        this.Speed.setLevel(json.speed_adj);
        this.Will.setLevel(json.will_adj);
        return this;
    }
    toR20() {
        return _2R20_1.exportR20(this);
    }
    loadFromActor(actor) {
    }
}
exports.Character = Character;
var signatures;
(function (signatures) {
    signatures["ST"] = "ST";
    signatures["DX"] = "DX";
    signatures["IQ"] = "IQ";
    signatures["HT"] = "HT";
    signatures["FP"] = "FP";
    signatures["HP"] = "HP";
    signatures["Per"] = "Per";
    signatures["Will"] = "Will";
    signatures[signatures["Base"] = 10] = "Base";
    signatures["Quint"] = "QT";
    signatures["Speed"] = "Speed";
    signatures["Move"] = "Move";
    signatures["Vision"] = "Vision";
    signatures["Hearing"] = "Hearing";
    signatures["Taste_Smell"] = "Taste Smell";
    signatures["Touch"] = "Touch";
})(signatures = exports.signatures || (exports.signatures = {}));
//# sourceMappingURL=character.js.map