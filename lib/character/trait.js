import { Modifier } from "./misc/modifier";
import { List, ListItem } from "./misc/list";
import { objectify } from "@utils/json_utils";
import { Feature } from "./misc/feature";
export class TraitList extends List {
    constructor(character) {
        super(character);
        this.populator = Trait;
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
var ContainerType;
(function (ContainerType) {
    ContainerType["group"] = "";
    ContainerType["metaTrait"] = "meta trait";
    ContainerType["race"] = "race";
    ContainerType["alternativeAbilities"] = "alternative abilities";
})(ContainerType || (ContainerType = {}));
export class Trait extends ListItem {
    constructor(list) {
        super(list);
        this.version = 1;
        this.tag = "advantage";
        this.disabled = false;
        this.types = new Set();
        this.modifiers = new Set();
    }
    isActive() { return !this.disabled; }
    getLevel() { return this.levels; }
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
                prev += cur.findSelf().childrenPoints();
            }
            else {
                prev += cur.findSelf().adjustedPoints();
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
    disable() { this.disabled = true; }
    enable() { this.disabled = false; }
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
        object = objectify(object);
        super.loadJSON(object);
        function mapTrait(object, trait) {
            var _a, _b, _c, _d;
            trait.name = object.name;
            (_a = object.modifiers) === null || _a === void 0 ? void 0 : _a.forEach((modifier) => trait.modifiers.add(new TraitModifier(trait).loadJSON(modifier)));
            trait.basePoints = object.base_points;
            trait.levels = (_b = parseInt(object === null || object === void 0 ? void 0 : object.levels)) !== null && _b !== void 0 ? _b : null;
            trait.allowHalfLevels = object.allow_half_levels;
            trait.hasHalfLevel = object.has_half_level;
            trait.roundDown = object.round_down;
            trait.controlRating = object.cr;
            (_c = object.types) === null || _c === void 0 ? void 0 : _c.forEach((type) => trait.types.add(type));
            trait.pointsPerLevel = object.points_per_level;
            trait.disabled = object.disabled;
            trait.hasLevels = trait.levels ? true : false;
            (_d = object.features) === null || _d === void 0 ? void 0 : _d.forEach((feature) => {
                var _a;
                (_a = Feature.loadFeature(trait, feature.type)) === null || _a === void 0 ? void 0 : _a.loadJSON(feature);
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
class TraitModifier extends Modifier {
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
        object = objectify(object);
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