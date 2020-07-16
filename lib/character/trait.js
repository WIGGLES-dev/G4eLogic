"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trait = exports.TraitList = void 0;
const modifier_1 = require("./misc/modifier");
const list_1 = require("./misc/list");
const json_utils_1 = require("../utils/json_utils");
const feature_1 = require("./misc/feature");
const skill_1 = require("./skill");
class TraitList extends list_1.List {
    constructor(character) {
        super(character);
        this.class = Trait;
    }
    sumRacials() {
        return this.iter().reduce((prev, cur) => {
            if (cur.isRacial()) {
                return prev + cur.adjustedPoints();
            }
            else {
                return prev;
            }
        }, 0);
    }
    sumAdvantages() {
        return this.iter().reduce((prev, cur) => {
            if (cur.isRacial())
                return prev;
            if (cur.categories.has("Advantage") || cur.categories.has("Perk") || cur.adjustedPoints() >= 1) {
                return prev + cur.adjustedPoints();
            }
            else {
                return prev;
            }
        }, 0);
    }
    sumDisadvantages() {
        return this.iter().reduce((prev, cur) => {
            if (cur.isRacial())
                return prev;
            if (cur.categories.has("Disadvantage") || cur.adjustedPoints() < -1) {
                return prev + cur.adjustedPoints();
            }
            else {
                return prev;
            }
        }, 0);
    }
    sumQuirks() {
        return this.iter().reduce((prev, cur) => {
            if (cur.isRacial())
                return prev;
            if (cur.categories.has("Quirk") || cur.adjustedPoints() === -1) {
                return prev + cur.adjustedPoints();
            }
            else {
                return prev;
            }
        }, 0);
    }
}
exports.TraitList = TraitList;
var ContainerType;
(function (ContainerType) {
    ContainerType["group"] = "";
    ContainerType["metaTrait"] = "meta trait";
    ContainerType["race"] = "race";
    ContainerType["alternativeAbilities"] = "alternative abilities";
})(ContainerType || (ContainerType = {}));
class Trait extends list_1.ListItem {
    constructor(list) {
        super(list);
        this.tag = "advantage";
        this.types = new Set();
        this.modifiers = new Set();
    }
    isRacial() {
        if (!this.containedBy) {
            return false;
        }
        if (this.containedBy.containerType === ContainerType.race) {
            return true;
        }
        else {
            return this.containedBy.isRacial();
        }
    }
    childrenPoints() {
        return this.iterChildren().reduce((prev, cur) => {
            if (cur.canContainChildren) {
                prev += cur.childrenPoints();
            }
            else {
                prev += cur.adjustedPoints();
            }
            return prev;
        }, 0);
    }
    static getCRMultipland(cr) {
        switch (cr) {
            case ControlRollMultiplier.cannotResist: return 2.5;
            case ControlRollMultiplier.resistRarely: return 2;
            case ControlRollMultiplier.resistFairlyOften: return 1.5;
            case ControlRollMultiplier.resistQuiteOften: return 1;
            case ControlRollMultiplier.resistAlmostAlway: return 0.5;
            default: return 1;
        }
    }
    adjustedPoints() {
        if (this.isContainer()) {
            return 0;
        }
        else {
            return Trait.getAdjustedPoints(this.modifiers, this);
        }
    }
    disable() { this.enabled = false; }
    enable() { this.enabled = true; }
    static getAdjustedPoints(modifiers, trait) {
        let basePoints = trait.basePoints;
        let pointsPerLevel = trait.pointsPerLevel;
        let baseEnh = 0;
        let levelEnh = 0;
        let baseLim = 0;
        let levelLim = 0;
        let multiplier = 1;
        modifiers === null || modifiers === void 0 ? void 0 : modifiers.forEach(modifier => {
            if (modifier.enabled) {
                let mod = modifier.costModifier();
                switch (modifier.type) {
                    case TraitModifierType.percentage:
                    default:
                        switch (modifier.affects) {
                            case TraitModifierAffects.total:
                            default:
                                if (mod < 0) {
                                    baseLim += mod;
                                    levelLim += mod;
                                }
                                else {
                                    baseEnh += mod;
                                    levelEnh += mod;
                                }
                                break;
                            case TraitModifierAffects.base:
                                if (mod < 0) {
                                    baseLim += mod;
                                }
                                else {
                                    baseEnh += mod;
                                }
                                break;
                            case TraitModifierAffects.levels:
                                if (mod < 0) {
                                    levelLim += mod;
                                }
                                else {
                                    levelEnh += mod;
                                }
                                break;
                        }
                        break;
                    case TraitModifierType.points:
                        switch (modifier.affects) {
                            case TraitModifierAffects.total:
                            case TraitModifierAffects.base:
                            default:
                                basePoints += mod;
                                break;
                            case TraitModifierAffects.levels:
                                pointsPerLevel += mod;
                                break;
                        }
                        break;
                    case TraitModifierType.multiplier:
                        multiplier *= mod;
                        break;
                }
            }
        });
        let modifiedBasePoints = basePoints;
        let leveledPoints = pointsPerLevel * (trait.levels + (trait.hasHalfLevel ? .5 : 0));
        if (baseEnh != 0 || baseLim != 0 || levelEnh != 0 || levelLim != 0) {
            if (false) {
            }
            else {
                let baseMod = Math.max(baseEnh + baseLim, -80);
                let levelMod = Math.max(levelEnh + levelLim, -80);
                modifiedBasePoints = baseMod === levelMod ?
                    TraitModifier.modifyPoints((modifiedBasePoints + leveledPoints), baseMod) :
                    TraitModifier.modifyPoints(modifiedBasePoints, baseMod) + TraitModifier.modifyPoints(leveledPoints, levelMod);
            }
        }
        else {
            modifiedBasePoints += leveledPoints;
        }
        return TraitModifier.applyRounding((modifiedBasePoints * multiplier), Boolean(trait.roundDown));
    }
    toJSON() {
        return {};
    }
    loadJSON(object) {
        object = json_utils_1.objectify(object);
        super.loadJSON(object);
        function mapTrait(object, trait) {
            var _a, _b, _c;
            trait.name = object.name;
            (_a = object.modifiers) === null || _a === void 0 ? void 0 : _a.forEach((modifier) => trait.modifiers.add(new TraitModifier(trait).loadJSON(modifier)));
            trait.basePoints = object.base_points;
            trait.levels = object.levels;
            trait.allowHalfLevels = object.allow_half_levels;
            trait.hasHalfLevel = object.has_half_level;
            trait.roundDown = object.round_down;
            trait.controlRating = object.cr;
            (_b = object.types) === null || _b === void 0 ? void 0 : _b.forEach((type) => trait.types.add(type));
            trait.pointsPerLevel = object.points_per_level;
            trait.enabled = !object.disabled;
            (_c = object.features) === null || _c === void 0 ? void 0 : _c.forEach((feature) => {
                switch (feature.type) {
                    case feature_1.FeatureType.skillBonus:
                        trait.features.add(new skill_1.SkillBonus(trait).loadJSON(feature));
                }
            });
        }
        function loadSubElements(object, parent) {
            object.children.forEach((object) => {
                const subElement = parent.list.addListItem().loadJSON(object);
                subElement.containedBy = parent;
                parent.children.add(subElement);
            });
            return parent;
        }
        mapTrait(object, this);
        if (object.type.includes("_container")) {
            this.canContainChildren = true;
            loadSubElements(object, this);
        }
        return this;
    }
    toR20() {
        let key;
        const traitTemplate = {
            name: this.name,
            points: this.adjustedPoints(),
            ref: this.reference,
            notes: this.notes
        };
        const categories = this.categories;
        const activeModifiers = Array.from(this.modifiers);
        const perkFlag = categories.has("Perk") || this.adjustedPoints() === 1;
        const quirkFlag = categories.has("Quirk") || this.adjustedPoints() === -1;
        const advantageFlag = categories.has("Advantage") || this.adjustedPoints() >= 0;
        const disadvantageFlag = categories.has("Disadvantage") || this.adjustedPoints() < 0;
        const languageFlag = categories.has("Language");
        const nativeLanguageFlag = categories.has("Language") && activeModifiers.some(modifier => modifier.name === "Native");
        const racialFlag = this.isRacial();
        const cultureFlag = this.name.includes("Cultural Familiarity");
        if (nativeLanguageFlag) {
        }
        else if (languageFlag) {
        }
        else if (cultureFlag) {
        }
        else if (racialFlag) {
            key = "repeating_racial";
            Object.assign(traitTemplate, {
                cr: this.controlRating
            });
        }
        else if (quirkFlag) {
            key = "repeating_quirks";
            Object.assign(traitTemplate, {
                cr: this.controlRating
            });
        }
        else if (disadvantageFlag) {
            key = "repeating_disadvantages";
            Object.assign(traitTemplate, {
                cr: this.controlRating
            });
        }
        else if (perkFlag) {
            key = "repeating_perk";
            Object.assign(traitTemplate, {
                foa: this.controlRating
            });
        }
        else if (advantageFlag) {
            key = "repeating_traits";
            Object.assign(traitTemplate, {
                foa: this.controlRating
            });
        }
        return {
            key,
            row_id: this.r20rowID,
            data: traitTemplate
        };
    }
}
exports.Trait = Trait;
Trait.version = 4;
class TraitModifier extends modifier_1.Modifier {
    constructor(owner) {
        super(owner);
        this.hasLevels = false;
    }
    costModifier() { return this.levels > 0 ? this.cost * this.levels : this.cost; }
    static modifyPoints(points, modifier) {
        return points + TraitModifier.calculateModifierPoints(points, modifier);
    }
    static calculateModifierPoints(points, modifier) {
        return points * (modifier / 100);
    }
    static applyRounding(value, roundCostDown) {
        return roundCostDown ? Math.floor(value) : Math.ceil(value);
    }
    toJSON() {
    }
    loadJSON(object) {
        object = json_utils_1.objectify(object);
        super.loadJSON(object);
        function mapModifier(object, modifier) {
            modifier.cost = object.cost;
            modifier.type = object.cost_type;
            modifier.affects = object.affects;
            modifier.levels = object.levels;
            return modifier;
        }
        return mapModifier(object, this);
    }
}
TraitModifier.nodeName = "modifier";
var TraitModifierType;
(function (TraitModifierType) {
    TraitModifierType["percentage"] = "percentage";
    TraitModifierType["points"] = "points";
    TraitModifierType["multiplier"] = "multiplier";
})(TraitModifierType || (TraitModifierType = {}));
var TraitModifierAffects;
(function (TraitModifierAffects) {
    TraitModifierAffects["base"] = "base only";
    TraitModifierAffects["levels"] = "levels only";
    TraitModifierAffects["total"] = "total";
})(TraitModifierAffects || (TraitModifierAffects = {}));
var TraitType;
(function (TraitType) {
    TraitType["mental"] = "Mental";
    TraitType["physical"] = "Physical";
    TraitType["social"] = "Social";
    TraitType["exotic"] = "Exotic";
})(TraitType || (TraitType = {}));
var ControlRollMultiplier;
(function (ControlRollMultiplier) {
    ControlRollMultiplier["cannotResist"] = "0";
    ControlRollMultiplier["resistRarely"] = "6";
    ControlRollMultiplier["resistFairlyOften"] = "9";
    ControlRollMultiplier["resistQuiteOften"] = "12";
    ControlRollMultiplier["resistAlmostAlway"] = "15";
    ControlRollMultiplier["noneRequired"] = "";
})(ControlRollMultiplier || (ControlRollMultiplier = {}));
//# sourceMappingURL=trait.js.map