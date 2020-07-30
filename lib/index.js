(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("lib", [], factory);
	else if(typeof exports === 'object')
		exports["lib"] = factory();
	else
		root["lib"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/character/attribute.ts":
/*!************************************!*\
  !*** ./src/character/attribute.ts ***!
  \************************************/
/*! exports provided: Attribute, AttributeBonus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Attribute", function() { return Attribute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AttributeBonus", function() { return AttributeBonus; });
/* harmony import */ var _misc_feature__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./misc/feature */ "./src/character/misc/feature.ts");
/* harmony import */ var _gcs_gcs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @gcs/gcs */ "./src/gcs/gcs.ts");


class Attribute {
    constructor(name, character, costPerLevel, { defaultLevel = 0, basedOn = () => 0 }) {
        this.name = name;
        this.character = character;
        this.level = defaultLevel;
        this.costPerLevel = costPerLevel;
        this.defaultLevel = defaultLevel;
        this.basedOn = basedOn;
    }
    setLevel(level) { if (level)
        this.level = level; }
    setLevelDelta() { }
    getMod() { return Attribute.bonusReducer(this.character, this.name); }
    pointsSpent() { return this.levelsIncreased() * this.costPerLevel; }
    levelsIncreased() { return this.level - this.defaultLevel; }
    calculateLevel() { return this.level + this.getMod() + this.basedOn(); }
    get displayLevel() { return this.calculateLevel(); }
    set displayLevel(level) {
        const mod = this.getMod();
        if (this.defaultLevel) {
            this.level = level - mod;
        }
        else if (!this.defaultLevel && this.basedOn) {
            this.level = level - this.basedOn() - mod;
        }
    }
    static bonusReducer(sheet, attribute) {
        return sheet.featureList.getFeaturesByType(_gcs_gcs__WEBPACK_IMPORTED_MODULE_1__["FeatureType"].attributeBonus).reduce((prev, cur) => {
            var _a, _b, _c;
            if (cur instanceof AttributeBonus) {
                if (cur.ownerIsActive() && ((_b = (_a = cur.attribute) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === ((_c = attribute === null || attribute === void 0 ? void 0 : attribute.toString()) === null || _c === void 0 ? void 0 : _c.toLowerCase()) && !cur.limitation) {
                    prev += cur.getBonus();
                }
            }
            return prev;
        }, 0);
    }
}
class AttributeBonus extends _misc_feature__WEBPACK_IMPORTED_MODULE_0__["Feature"] {
    constructor(owner) {
        super(owner, _gcs_gcs__WEBPACK_IMPORTED_MODULE_1__["FeatureType"].attributeBonus);
    }
}


/***/ }),

/***/ "./src/character/character.ts":
/*!************************************!*\
  !*** ./src/character/character.ts ***!
  \************************************/
/*! exports provided: Character, Signature */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Character", function() { return Character; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Signature", function() { return Signature; });
/* harmony import */ var _attribute__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attribute */ "./src/character/attribute.ts");
/* harmony import */ var _skill_skill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./skill/skill */ "./src/character/skill/skill.ts");
/* harmony import */ var _trait__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./trait */ "./src/character/trait.ts");
/* harmony import */ var _equipment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./equipment */ "./src/character/equipment.ts");
/* harmony import */ var _misc_feature__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./misc/feature */ "./src/character/misc/feature.ts");
/* harmony import */ var _profile__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./profile */ "./src/character/profile.ts");
/* harmony import */ var _spell__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./spell */ "./src/character/spell.ts");
/* harmony import */ var _utils_2R20__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @utils/2R20 */ "./src/utils/2R20.ts");
/* harmony import */ var _serialization_gcs_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./serialization/gcs_json */ "./src/character/serialization/gcs_json.ts");









class Sheet {
    constructor(serializer) {
        this.serializer = serializer;
    }
}
class Character extends Sheet {
    constructor(serializer = new _serialization_gcs_json__WEBPACK_IMPORTED_MODULE_8__["GCSJSON"]()) {
        super(serializer);
        this.profile = new _profile__WEBPACK_IMPORTED_MODULE_5__["Profile"]();
        this.equipmentList = new _equipment__WEBPACK_IMPORTED_MODULE_3__["EquipmentList"](this);
        this.otherEquipmentList = new _equipment__WEBPACK_IMPORTED_MODULE_3__["EquipmentList"](this);
        this.skillList = new _skill_skill__WEBPACK_IMPORTED_MODULE_1__["SkillList"](this);
        this.traitList = new _trait__WEBPACK_IMPORTED_MODULE_2__["TraitList"](this);
        this.spellList = new _spell__WEBPACK_IMPORTED_MODULE_6__["SpellList"](this);
        this.attributes = new Map();
        this.attributes.set(Signature.ST, new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.ST, this, 10, { defaultLevel: 10 }));
        this.attributes.set(Signature.DX, new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.DX, this, 20, { defaultLevel: 10 }));
        this.attributes.set(Signature.IQ, new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.IQ, this, 20, { defaultLevel: 10 }));
        this.attributes.set(Signature.HT, new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.HT, this, 10, { defaultLevel: 10 }));
        this.attributes.set(Signature.Will, new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.Will, this, 5, { basedOn: () => this.getAttribute(Signature.IQ).calculateLevel() }));
        this.attributes.set(Signature.Speed, new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.Speed, this, 20, { basedOn: () => (this.getAttribute(Signature.DX).calculateLevel() + this.getAttribute(Signature.HT).calculateLevel()) / 4 }));
        this.attributes.set(Signature.Move, new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.Move, this, 5, { basedOn: () => Math.floor(this.getAttribute(Signature.Speed).calculateLevel()) }));
        this.attributes.set(Signature.Per, new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.Per, this, 5, { basedOn: () => this.getAttribute(Signature.IQ).calculateLevel() }));
        this.attributes.set(Signature.HP, new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.HP, this, 2, { basedOn: () => this.getAttribute(Signature.ST).calculateLevel() }));
        this.attributes.set(Signature.FP, new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.FP, this, 3, { basedOn: () => this.getAttribute(Signature.HT).calculateLevel() }));
        this.featureList = new _misc_feature__WEBPACK_IMPORTED_MODULE_4__["FeatureList"]();
    }
    totalAttributesCost() {
        return Array.from(this.attributes.values()).reduce((prev, cur) => {
            if (cur instanceof _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"]) {
                return prev + cur.pointsSpent();
            }
            else {
                return prev;
            }
        }, 0);
    }
    getAttribute(attribute) {
        return this.attributes.get(attribute);
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
        const ST = this.getAttribute(Signature.ST).calculateLevel();
        return Math.round(ST * ST / 5);
    }
    encumbranceLevel() {
        const basicLift = this.basicLift();
        const carriedWeight = this.carriedWeight(this.equipmentList);
        if (carriedWeight < basicLift) {
            return 0;
        }
        else if (carriedWeight < basicLift * 2) {
            return -1;
        }
        else if (carriedWeight < basicLift * 3) {
            return -2;
        }
        else if (carriedWeight < basicLift * 6) {
            return -3;
        }
        else if (carriedWeight < basicLift * 10) {
            return -4;
        }
    }
    encumberedMove() {
        return this.getAttribute(Signature.Move).calculateLevel() + this.encumbranceLevel();
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
    dodgeScore() { return Math.floor(this.getAttribute(Signature.Speed).calculateLevel() + _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"].bonusReducer(this, Signature.Dodge) + 3); }
    encumberedDodgeScore() {
        switch (this.encumbranceLevel()) {
            case 0:
                return this.dodgeScore();
            case -1:
                return Math.floor(this.dodgeScore() * .8);
            case -2:
                return Math.floor(this.dodgeScore() * .6);
            case -3:
                return Math.floor(this.dodgeScore() * .4);
            case -4:
                return Math.floor(this.dodgeScore() * .2);
        }
    }
    load(data) {
        this.void();
        return this.serializer.load(this, data);
    }
    void() {
        this.traitList.empty();
        this.skillList.empty();
        this.equipmentList.empty();
        this.otherEquipmentList.empty();
    }
    toR20() {
        return Object(_utils_2R20__WEBPACK_IMPORTED_MODULE_7__["exportR20"])(this);
    }
}
var Signature;
(function (Signature) {
    Signature["ST"] = "ST";
    Signature["DX"] = "DX";
    Signature["IQ"] = "IQ";
    Signature["HT"] = "HT";
    Signature["FP"] = "FP";
    Signature["HP"] = "HP";
    Signature["Per"] = "Per";
    Signature["Will"] = "Will";
    Signature[Signature["Base"] = 10] = "Base";
    Signature["Quint"] = "QT";
    Signature["Speed"] = "Speed";
    Signature["Move"] = "Move";
    Signature["Vision"] = "Vision";
    Signature["Hearing"] = "Hearing";
    Signature["TasteSmell"] = "Taste Smell";
    Signature["Touch"] = "Touch";
    Signature["Dodge"] = "dodge";
})(Signature || (Signature = {}));


/***/ }),

/***/ "./src/character/equipment.ts":
/*!************************************!*\
  !*** ./src/character/equipment.ts ***!
  \************************************/
/*! exports provided: EquipmentList, Equipment, EquipmentModifier */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EquipmentList", function() { return EquipmentList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Equipment", function() { return Equipment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EquipmentModifier", function() { return EquipmentModifier; });
/* harmony import */ var _misc_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./misc/list */ "./src/character/misc/list.ts");
/* harmony import */ var _misc_modifier__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc/modifier */ "./src/character/misc/modifier.ts");


class EquipmentList extends _misc_list__WEBPACK_IMPORTED_MODULE_0__["List"] {
    constructor(character) {
        super(character);
        this.populator = Equipment;
    }
}
class Equipment extends _misc_list__WEBPACK_IMPORTED_MODULE_0__["ListItem"] {
    constructor(list) {
        super(list);
        this.version = 1;
        this.tag = "equipment";
        this.hasLevels = false;
        this.modifiers = new Set();
    }
    addModifier() {
        const modifier = new EquipmentModifier(this);
        this.modifiers.add(modifier);
        return modifier;
    }
    get name() { return this.description; }
    isActive() { return this.equipped; }
    getLevel() { return null; }
    childrenWeight() {
        return Array.from(this.children).reduce((prev, cur) => {
            return prev += cur.findSelf().extendedWeight();
        }, 0);
    }
    childrenValue() {
        return 0;
    }
    reduceContainedWeight(weight) {
        var _a;
        const weightReduction = (_a = this === null || this === void 0 ? void 0 : this.containedBy) === null || _a === void 0 ? void 0 : _a.containedWeightReduction;
        if (weightReduction === null || weightReduction === void 0 ? void 0 : weightReduction.endsWith("%")) {
            let multiplyBy = _misc_modifier__WEBPACK_IMPORTED_MODULE_1__["Modifier"].extractValue(weightReduction) / 100;
            return weight * multiplyBy;
        }
        else if (weightReduction) {
            let subtract = parseFloat(weightReduction.split(" ")[0]);
            return weight - subtract;
        }
        else {
            return weight;
        }
    }
    extendedWeight() {
        const adjustedWeight = this.adjustedWeight();
        if (this.isContainer()) {
            return this.reduceContainedWeight((this.childrenWeight() + adjustedWeight));
        }
        else {
            return adjustedWeight * this.quantity;
        }
    }
    extendedValue() {
        const adjustedValue = this.adjustedValue();
        if (this.isContainer()) {
            return this.childrenValue() + adjustedValue;
        }
        else {
            return adjustedValue * this.quantity;
        }
    }
    getModifiers() { }
    adjustedValue() {
        let modifiers = this.modifiers;
        let value = this.value;
        let cost = Equipment.processNonCFStep(EquipmentModifierValueType.originalCost, value, modifiers);
        let cf = 0;
        let count = 0;
        this.modifiers.forEach(modifier => {
            if (modifier.enabled && modifier.costType === EquipmentModifierValueType.baseCost) {
                let adj = modifier.cost;
                let mvt = EquipmentModifier.determineCostType(modifier.cost);
                let amt = _misc_modifier__WEBPACK_IMPORTED_MODULE_1__["Modifier"].extractValue(adj);
                if (mvt === EquipmentModifierCostValueType.multiplier) {
                    amt -= 1;
                }
                cf += amt;
                count++;
            }
        });
        if (cf !== 0) {
            if (cf < EquipmentModifier.minCF) {
                cf = EquipmentModifier.minCF;
            }
            cost *= (cf + 1);
        }
        cost = Equipment.processNonCFStep(EquipmentModifierValueType.finalBaseCost, cost, modifiers);
        cost = Equipment.processNonCFStep(EquipmentModifierValueType.finalCost, cost, modifiers);
        return cost > 0 ? cost : 0;
    }
    static processNonCFStep(costType, value, modifiers) {
        let percentages = 0;
        let additions = 0;
        let cost = value;
        modifiers.forEach(modifier => {
            if (modifier.enabled && modifier.costType === costType) {
                let adj = modifier.cost;
                let mvt = EquipmentModifier.determineCostType(modifier.cost);
                let amt = _misc_modifier__WEBPACK_IMPORTED_MODULE_1__["Modifier"].extractValue(adj);
                console.log(amt, modifier.name, mvt);
                switch (mvt) {
                    case EquipmentModifierCostValueType.addition:
                        additions += amt;
                        break;
                    case EquipmentModifierCostValueType.percentage:
                        percentages += amt;
                        break;
                    case EquipmentModifierCostValueType.multiplier:
                        cost *= amt;
                        break;
                }
            }
        });
        cost += additions;
        if (percentages !== 0) {
            cost += (value * (percentages / 100));
        }
        return cost;
    }
    adjustedWeight() {
        let modifiers = this.modifiers;
        let weight = this.weight;
        let percentages = 0;
        let original = this.weight;
        modifiers.forEach(modifier => {
            if (modifier.enabled && modifier.weightType === EquipmentModifierWeightType.originalWeight) {
                let adj = modifier.weight;
                let mvt = EquipmentModifier.determineWeightType(modifier.weight);
                let amt = _misc_modifier__WEBPACK_IMPORTED_MODULE_1__["Modifier"].extractValue(adj);
                if (mvt === EquipmentModifierWeightValueType.addition) {
                    weight += amt;
                }
                else {
                    percentages += amt;
                }
            }
        });
        if (percentages !== 0) {
            original = original *= (percentages / 100);
        }
        weight = Equipment.processMultiplyAddWeightStep(EquipmentModifierWeightType.baseWeight, weight, modifiers);
        weight = Equipment.processMultiplyAddWeightStep(EquipmentModifierWeightType.finalBaseWeight, weight, modifiers);
        weight = Equipment.processMultiplyAddWeightStep(EquipmentModifierWeightType.finalWeight, weight, modifiers);
        if (weight < 0) {
            weight = 0;
        }
        return weight;
    }
    static processMultiplyAddWeightStep(weightType, weight, modifiers) {
        let sum = 0;
        modifiers.forEach(modifier => {
            if (modifier.enabled && modifier.weightType === weightType) {
                let adj = modifier.weight;
                let mvt = EquipmentModifier.determineWeightType(adj);
                let fraction = 0;
                switch (mvt) {
                    case EquipmentModifierWeightValueType.multiplier:
                        weight = weight * fraction;
                        break;
                    case EquipmentModifierWeightValueType.percentageMultiplier:
                        weight = weight * (fraction / 100);
                        break;
                    case EquipmentModifierWeightValueType.addition:
                        weight += fraction;
                    default:
                }
            }
        });
        weight += sum;
        return weight;
    }
    toR20() {
        return {
            key: "repeating_item",
            row_id: this.r20rowID,
            data: {
                name: this.description,
                tl: this.techLevel,
                ref: this.reference,
                legality_class: this.legalityClass,
                count: this.quantity,
                cost: this.value,
                weight: this.weight,
                costtotal: this.extendedValue(),
                weighttotal: this.extendedWeight(),
                notes: this.notes
            }
        };
    }
}
class EquipmentModifier extends _misc_modifier__WEBPACK_IMPORTED_MODULE_1__["Modifier"] {
    constructor(equipment) {
        super(equipment);
        this.tag = "eqp_modifier";
        this.version = 1;
    }
    static determineWeightType(type) {
        type = type.trim();
        if (type.endsWith("%")) {
            if (type.startsWith("x")) {
                return EquipmentModifierWeightValueType.percentageMultiplier;
            }
            return EquipmentModifierWeightValueType.percentageAdder;
        }
        if (type.startsWith("x") || type.endsWith("x")) {
            return EquipmentModifierWeightValueType.multiplier;
        }
        return EquipmentModifierWeightValueType.addition;
    }
    static determineCostType(type) {
        type = type.trim();
        if (type.endsWith("cf")) {
            return EquipmentModifierCostValueType.cf;
        }
        if (type.endsWith("%")) {
            return EquipmentModifierCostValueType.percentage;
        }
        if (type.startsWith("x") || type.endsWith("x")) {
            return EquipmentModifierCostValueType.multiplier;
        }
        return EquipmentModifierCostValueType.addition;
    }
}
EquipmentModifier.minCF = -0.8;
var EquipmentModifierWeightType;
(function (EquipmentModifierWeightType) {
    EquipmentModifierWeightType["originalWeight"] = "to_original_weight";
    EquipmentModifierWeightType["baseWeight"] = "to_base_weight";
    EquipmentModifierWeightType["finalBaseWeight"] = "to_final_base_weight";
    EquipmentModifierWeightType["finalWeight"] = "to_final_weight";
})(EquipmentModifierWeightType || (EquipmentModifierWeightType = {}));
var EquipmentModifierWeightValueType;
(function (EquipmentModifierWeightValueType) {
    EquipmentModifierWeightValueType["addition"] = "+";
    EquipmentModifierWeightValueType["percentageAdder"] = "%";
    EquipmentModifierWeightValueType[EquipmentModifierWeightValueType["percentageMultiplier"] = 1] = "percentageMultiplier";
    EquipmentModifierWeightValueType[EquipmentModifierWeightValueType["multiplier"] = 0] = "multiplier";
})(EquipmentModifierWeightValueType || (EquipmentModifierWeightValueType = {}));
var EquipmentModifierValueType;
(function (EquipmentModifierValueType) {
    EquipmentModifierValueType["originalCost"] = "to_original_cost";
    EquipmentModifierValueType["baseCost"] = "to_base_cost";
    EquipmentModifierValueType["finalBaseCost"] = "to_final_base_cost";
    EquipmentModifierValueType["finalCost"] = "to_final_cost";
})(EquipmentModifierValueType || (EquipmentModifierValueType = {}));
var EquipmentModifierCostValueType;
(function (EquipmentModifierCostValueType) {
    EquipmentModifierCostValueType["addition"] = "+";
    EquipmentModifierCostValueType["percentage"] = "%";
    EquipmentModifierCostValueType["multiplier"] = "x";
    EquipmentModifierCostValueType["cf"] = "cf";
})(EquipmentModifierCostValueType || (EquipmentModifierCostValueType = {}));


/***/ }),

/***/ "./src/character/misc/default.ts":
/*!***************************************!*\
  !*** ./src/character/misc/default.ts ***!
  \***************************************/
/*! exports provided: DefaultList, Default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultList", function() { return DefaultList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Default", function() { return Default; });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/character/misc/element.ts");

var DefaultType;
(function (DefaultType) {
    DefaultType["skill"] = "Skill";
})(DefaultType || (DefaultType = {}));
class DefaultList {
}
class Default extends _element__WEBPACK_IMPORTED_MODULE_0__["CharacterElement"] {
    constructor(owner) {
        super(owner.character);
        this.tag = "default";
        this.owner = owner;
    }
}


/***/ }),

/***/ "./src/character/misc/element.ts":
/*!***************************************!*\
  !*** ./src/character/misc/element.ts ***!
  \***************************************/
/*! exports provided: CharacterElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CharacterElement", function() { return CharacterElement; });
/* harmony import */ var _utils_2R20__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @utils/2R20 */ "./src/utils/2R20.ts");

class CharacterElement {
    constructor(character, foundryID) {
        this.reference = "";
        this.userDescription = "";
        this.notes = "";
        this.character = character;
        this.foundryID = foundryID;
        this.uuid = Object(_utils_2R20__WEBPACK_IMPORTED_MODULE_0__["generateUUID"])().toString();
        this.r20rowID = Object(_utils_2R20__WEBPACK_IMPORTED_MODULE_0__["generateRowID"])();
        this.categories = new Set();
    }
    static mapElement(data, element) {
        var _a;
        element.reference = data.reference;
        element.userDescription = data.user_description;
        element.notes = data.notes;
        (_a = data.categories) === null || _a === void 0 ? void 0 : _a.forEach((category) => element.categories.add(category));
    }
    getSerializer() { return this.character.serializer; }
}


/***/ }),

/***/ "./src/character/misc/feature.ts":
/*!***************************************!*\
  !*** ./src/character/misc/feature.ts ***!
  \***************************************/
/*! exports provided: FeatureList, Feature, SkillBonus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureList", function() { return FeatureList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Feature", function() { return Feature; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkillBonus", function() { return SkillBonus; });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/character/misc/element.ts");
/* harmony import */ var _gcs_gcs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @gcs/gcs */ "./src/gcs/gcs.ts");
/* harmony import */ var _character_attribute__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @character/attribute */ "./src/character/attribute.ts");
/* harmony import */ var _utils_string_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @utils/string_utils */ "./src/utils/string_utils.ts");





class FeatureList {
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
class Feature extends _element__WEBPACK_IMPORTED_MODULE_0__["CharacterElement"] {
    constructor(owner, type) {
        super(owner.character);
        this.tag = "feature";
        this.owner = owner;
        owner.features.add(this);
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
    save() {
        return this.getSerializer().transformers.get(this.tag).save(this);
    }
    load(data) {
        return this.getSerializer().transformers.get(this.tag).load(this, data);
    }
    static loadFeature(owner, featureType) {
        switch (featureType) {
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_1__["FeatureType"].attributeBonus:
                return new _character_attribute__WEBPACK_IMPORTED_MODULE_2__["AttributeBonus"](owner);
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_1__["FeatureType"].containedWeightReduction:
                break;
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_1__["FeatureType"].costReduction:
                break;
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_1__["FeatureType"].damageResistanceBonus:
                break;
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_1__["FeatureType"].reactionBonus:
                break;
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_1__["FeatureType"].skillBonus:
                return new SkillBonus(owner);
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_1__["FeatureType"].spellBonus:
                break;
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_1__["FeatureType"].weaponDamageBonus:
                break;
            default:
                return null;
        }
    }
}
class SkillBonus extends Feature {
    constructor(owner) {
        super(owner, _gcs_gcs__WEBPACK_IMPORTED_MODULE_1__["FeatureType"].skillBonus);
    }
    isApplicableTo(skill) {
        let result = false;
        if (this.nameCompareType)
            result = Object(_utils_string_utils__WEBPACK_IMPORTED_MODULE_3__["stringCompare"])(this.name, skill.name, this.nameCompareType);
        if (this.specializationCompareType)
            result = Object(_utils_string_utils__WEBPACK_IMPORTED_MODULE_3__["stringCompare"])(this.specialization, skill.specialization, this.specializationCompareType);
        return result;
    }
}


/***/ }),

/***/ "./src/character/misc/list.ts":
/*!************************************!*\
  !*** ./src/character/misc/list.ts ***!
  \************************************/
/*! exports provided: ListItem, List */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ListItem", function() { return ListItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "List", function() { return List; });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/character/misc/element.ts");
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _childIDs, _containedByID, _contents;


class ListItem extends _element__WEBPACK_IMPORTED_MODULE_0__["CharacterElement"] {
    constructor(list) {
        super(list.character);
        this.open = true;
        _childIDs.set(this, void 0);
        _containedByID.set(this, void 0);
        this.list = list;
        this.list.addListItem(this);
        this.features = new Set();
        this.children = new Set();
        this.canContainChildren = false;
        this.listIndex = this.list.iter().length + 1;
    }
    getListDepth() {
        let x = 0;
        let listItem = this.findSelf();
        while (listItem = listItem.containedBy) {
            x++;
        }
        return x;
    }
    getCharacter() { return this.list.character; }
    isContainer() { return this.canContainChildren; }
    isContainerOpen() { return this.canContainChildren && this.open ? true : false; }
    isVisible() {
        if (this.containedBy.isContainerOpen()) {
            return false;
        }
        else {
            return true;
        }
    }
    previousVisibleSibling() { }
    nextVisibleSibling() { }
    toggle() { if (this.isContainer())
        this.open = !this.open; }
    openContainer() { if (this.isContainer())
        this.open = true; }
    closeContainer() { if (this.isContainer())
        this.open = false; }
    depth() { }
    index() { }
    iterChildren() { return Array.from(this.children); }
    addChild(child) {
        if (this.isContainer()) {
            if (child) {
                child.containedBy.children.delete(child);
                child.containedBy = this.findSelf();
            }
            else {
                child = this.list.addListItem();
                child.containedBy = this.findSelf();
            }
        }
        return child;
    }
    removeChild(child) {
        if (typeof child === "string") {
            child = this.list.getByUUID(child);
        }
        child.containedBy.children.delete(child);
        this.list.removeListItem(child);
    }
    getRecursiveChildren() {
        if (this.canContainChildren) {
        }
        else {
        }
    }
    findSelf() {
        return this.list.getByUUID(this.uuid);
    }
    loadChildren(children, parent, loader) {
        children.forEach(child => {
            const subElement = parent.list.addListItem();
            const children = loader(subElement, child);
            subElement.containedBy = parent;
            parent.children.add(subElement);
            subElement.loadChildren(Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_1__["isArray"])(children), subElement, loader);
        });
    }
    load(data) {
        const loader = this.getSerializer().transformers.get(this.constructor).load;
        const children = loader(this.findSelf(), data);
        if (children && children.length > 0) {
            this.canContainChildren = true;
            this.loadChildren(children, this.findSelf(), loader);
        }
        return this.findSelf();
    }
    save() {
        return this.getSerializer().transformers.get(this.constructor).save(this);
    }
}
_childIDs = new WeakMap(), _containedByID = new WeakMap();
class List {
    constructor(character) {
        _contents.set(this, void 0);
        this.character = character;
        __classPrivateFieldSet(this, _contents, new Map());
        this.contents = new Set();
        this.loader = character.serializer.loadList;
        this.serializer = character.serializer.saveList;
    }
    generate() {
        this.contents.clear();
        this.iter().reduce((prev, cur) => {
            if (!cur.containedBy)
                prev.add(cur);
            return prev;
        }, this.contents);
    }
    addListItem(item) {
        let listItem;
        if (item) {
            __classPrivateFieldGet(this, _contents).set(item.uuid, item);
            listItem = item.findSelf();
        }
        else {
            listItem = new this.populator(this);
        }
        this.generate();
        return listItem;
    }
    removeListItem(item) {
        __classPrivateFieldGet(this, _contents).delete(item.uuid);
        this.generate();
    }
    getByIndex(index) {
        return Array.from(this.contents.values())[index];
    }
    getByUUID(uuid) {
        return __classPrivateFieldGet(this, _contents).get(uuid);
    }
    iter() {
        const contents = Array.from(__classPrivateFieldGet(this, _contents).values());
        return contents.sort((a, b) => a.listIndex - b.listIndex);
    }
    iterTop() {
        this.generate();
        return Array.from(this.contents);
    }
    keys() {
        return Array.from(this.contents.keys());
    }
    save() {
        return this.serializer(this);
    }
    load(data) {
        return this.character.serializer.loadList(this, data);
    }
    empty() {
        __classPrivateFieldGet(this, _contents).clear();
        this.generate();
    }
}
_contents = new WeakMap();


/***/ }),

/***/ "./src/character/misc/modifier.ts":
/*!****************************************!*\
  !*** ./src/character/misc/modifier.ts ***!
  \****************************************/
/*! exports provided: Modifier */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Modifier", function() { return Modifier; });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/character/misc/element.ts");

class Modifier extends _element__WEBPACK_IMPORTED_MODULE_0__["CharacterElement"] {
    constructor(owner) {
        super(owner.character);
        this.enabled = true;
        this.owner = owner;
        this.categories = new Set();
    }
    save() {
        return this.getSerializer().transformers.get(this.constructor).save(this);
    }
    load(data) {
        return this.getSerializer().transformers.get(this.constructor).load(this, data);
    }
    static extractValue(value) {
        if (typeof value === "string") {
            let numArr = value.match(/(\d+)/);
            return parseFloat(numArr[0]);
        }
        else {
            return null;
        }
    }
}


/***/ }),

/***/ "./src/character/profile.ts":
/*!**********************************!*\
  !*** ./src/character/profile.ts ***!
  \**********************************/
/*! exports provided: Profile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Profile", function() { return Profile; });
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");

class Profile {
    constructor() {
        this.tag = "profile";
        this.sizeModifier = "";
        this.techLevel = "";
        this.birthday = "";
        this.name = "";
        this.eyes = "";
        this.skin = "";
        this.hair = "";
        this.handedness = "";
        this.weight = "";
        this.height = "";
        this.gender = "";
        this.race = "";
        this.bodyType = "";
        this.age = "";
        this.portrait = "";
    }
    save() {
        let data = {
            size_modifier: this.sizeModifier,
            tech_level: this.techLevel,
            birthday: this.birthday,
            name: this.name,
            eyes: this.eyes,
            skin: this.skin,
            hair: this.hair,
            handedness: this.handedness,
            weight: this.weight,
            height: this.height,
            gender: this.gender,
            body_type: this.bodyType,
            age: this.age,
            portrait: this.portrait
        };
        return data;
    }
    load(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        object = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_0__["objectify"])(object);
        this.sizeModifier = (_a = object === null || object === void 0 ? void 0 : object.size_modifier) !== null && _a !== void 0 ? _a : "";
        this.techLevel = (_b = object === null || object === void 0 ? void 0 : object.tech_level) !== null && _b !== void 0 ? _b : "";
        this.birthday = (_c = object === null || object === void 0 ? void 0 : object.birthday) !== null && _c !== void 0 ? _c : "";
        this.name = (_d = object === null || object === void 0 ? void 0 : object.name) !== null && _d !== void 0 ? _d : "";
        this.eyes = (_e = object === null || object === void 0 ? void 0 : object.eyes) !== null && _e !== void 0 ? _e : "";
        this.skin = (_f = object === null || object === void 0 ? void 0 : object.skin) !== null && _f !== void 0 ? _f : "";
        this.hair = (_g = object === null || object === void 0 ? void 0 : object.hair) !== null && _g !== void 0 ? _g : "";
        this.handedness = (_h = object === null || object === void 0 ? void 0 : object.handedness) !== null && _h !== void 0 ? _h : "";
        this.weight = (_j = object === null || object === void 0 ? void 0 : object.weight) !== null && _j !== void 0 ? _j : "";
        this.height = (_k = object === null || object === void 0 ? void 0 : object.height) !== null && _k !== void 0 ? _k : "";
        this.gender = (_l = object === null || object === void 0 ? void 0 : object.gender) !== null && _l !== void 0 ? _l : "";
        this.race = (_m = object === null || object === void 0 ? void 0 : object.race) !== null && _m !== void 0 ? _m : "";
        this.bodyType = (_o = object === null || object === void 0 ? void 0 : object.bodyType) !== null && _o !== void 0 ? _o : "";
        this.age = (_p = object === null || object === void 0 ? void 0 : object.age) !== null && _p !== void 0 ? _p : "";
        this.portrait = (_q = object === null || object === void 0 ? void 0 : object.portait) !== null && _q !== void 0 ? _q : "";
        return this;
    }
}


/***/ }),

/***/ "./src/character/serialization/gcs_json.ts":
/*!*************************************************!*\
  !*** ./src/character/serialization/gcs_json.ts ***!
  \*************************************************/
/*! exports provided: GCSJSON */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GCSJSON", function() { return GCSJSON; });
/* harmony import */ var _serializer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./serializer */ "./src/character/serialization/serializer.ts");
/* harmony import */ var _character_skill_skill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../character/skill/skill */ "./src/character/skill/skill.ts");
/* harmony import */ var _character_technique__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../character/technique */ "./src/character/technique.ts");
/* harmony import */ var _character_spell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../character/spell */ "./src/character/spell.ts");
/* harmony import */ var _character_equipment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../character/equipment */ "./src/character/equipment.ts");
/* harmony import */ var _character_trait__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../character/trait */ "./src/character/trait.ts");
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");
/* harmony import */ var _character_character__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @character/character */ "./src/character/character.ts");
/* harmony import */ var _character_misc_feature__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @character/misc/feature */ "./src/character/misc/feature.ts");









class GCSJSON extends _serializer__WEBPACK_IMPORTED_MODULE_0__["Serializer"] {
    constructor() {
        super();
        this.scope = "GCSJSON";
    }
    init() {
        this.
            register(_character_skill_skill__WEBPACK_IMPORTED_MODULE_1__["SkillDefault"], {
            save: this.saveSkillDefault,
            load: this.mapSkillDefault
        })
            .register(_character_skill_skill__WEBPACK_IMPORTED_MODULE_1__["Skill"], {
            save: this.saveSkill,
            load: this.mapSkill
        })
            .register(_character_technique__WEBPACK_IMPORTED_MODULE_2__["Technique"], {
            save: this.saveTechnique,
            load: this.mapTechnique
        })
            .register(_character_spell__WEBPACK_IMPORTED_MODULE_3__["Spell"], {
            save: this.saveSpell,
            load: this.mapSpell
        })
            .register(_character_equipment__WEBPACK_IMPORTED_MODULE_4__["Equipment"], {
            save: this.saveEquipment,
            load: this.mapEquipment
        })
            .register(_character_trait__WEBPACK_IMPORTED_MODULE_5__["Trait"], {
            save: this.saveTrait,
            load: this.mapTrait
        })
            .register("feature", {
            save: this.saveFeature,
            load: this.mapFeature
        })
            .register(_character_trait__WEBPACK_IMPORTED_MODULE_5__["TraitModifier"], {
            save: this.saveModifier,
            load: this.mapModifier
        })
            .register(_character_equipment__WEBPACK_IMPORTED_MODULE_4__["EquipmentModifier"], {
            save: this.saveModifier,
            load: this.mapModifier
        });
    }
    static saveListLike(listLike, data) {
        data.children = Array.from(listLike.children).map(listLike => listLike.save());
        data.categories = Array.from(listLike.categories);
        data.reference = listLike.reference;
        data.notes = listLike.notes;
        return data;
    }
    static mapSkillLike(skillLike, data) {
        skillLike.name = data.name;
        skillLike.difficulty = data.difficulty;
        skillLike.points = data.points;
    }
    mapSkillDefault(skillDefault, data) {
        return skillDefault;
    }
    saveSkillDefault(skillDefault) {
        let data = {};
        return data;
    }
    mapSkill(skill, data) {
        var _a, _b, _c, _d, _e;
        GCSJSON.mapSkillLike(skill, data);
        skill.difficulty = (_a = data.difficulty) === null || _a === void 0 ? void 0 : _a.split("/")[1];
        skill.signature = (_b = data.difficulty) === null || _b === void 0 ? void 0 : _b.split("/")[0];
        skill.techLevel = (_c = data.tech_level) !== null && _c !== void 0 ? _c : "";
        if (data.encumbrance_penalty_multiplier)
            skill.encumbrancePenaltyMultiple = data.encumbrance_penalty_multiplier;
        if (data.defaulted_from)
            skill.defaultedFrom = new _character_skill_skill__WEBPACK_IMPORTED_MODULE_1__["SkillDefault"](skill).load(data.defaulted_from);
        (_d = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_6__["isArray"])(data.defaults)) === null || _d === void 0 ? void 0 : _d.forEach((skillDefault) => skill.addDefault().load(skillDefault));
        if (data && ((_e = data.type) === null || _e === void 0 ? void 0 : _e.includes("_container"))) {
            return data.children;
        }
    }
    saveSkill(skill) {
        let data = {
            type: "skill",
            version: 1,
            name: skill.name,
            difficulty: skill.difficulty,
            points: skill.points,
        };
        GCSJSON.saveListLike(skill, data);
        return data;
    }
    mapTechnique(technique, data) {
        this.mapSkill(technique, data);
        technique.limit = data.limit;
        technique.difficulty = data.difficulty;
        technique.default = new _character_skill_skill__WEBPACK_IMPORTED_MODULE_1__["SkillDefault"](technique).load(data.default);
        return null;
    }
    saveTechnique(technique) {
    }
    mapSpell(spell, data) {
        var _a;
        GCSJSON.mapSkillLike(spell, data);
        spell.college = data.college;
        spell.powerSource = data.power_source;
        spell.spellClass = data.spell_class;
        spell.castingCost = data.casting_cost;
        spell.maintenanceCost = data.maintenance_cost;
        spell.castingTime = data.casting_time;
        spell.duration = data.duration;
        if (data && ((_a = data.type) === null || _a === void 0 ? void 0 : _a.includes("_container"))) {
            return data.children;
        }
    }
    saveSpell(spell) {
    }
    mapEquipment(equipment, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        (_a = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_6__["isArray"])(data === null || data === void 0 ? void 0 : data.modifiers)) === null || _a === void 0 ? void 0 : _a.forEach((modifier) => equipment.addModifier().load(modifier));
        equipment.description = data.description;
        equipment.equipped = data.equipped;
        equipment.quantity = data.quantity;
        equipment.value = parseFloat(data === null || data === void 0 ? void 0 : data.value);
        equipment.weight = parseFloat((_c = (_b = data === null || data === void 0 ? void 0 : data.weight) === null || _b === void 0 ? void 0 : _b.split(" ")[0]) !== null && _c !== void 0 ? _c : "0");
        equipment.techLevel = data.tech_level;
        equipment.legalityClass = data.legality_class;
        equipment.containedWeightReduction = (_f = (_e = (_d = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_6__["isArray"])(data === null || data === void 0 ? void 0 : data.features)) === null || _d === void 0 ? void 0 : _d.find(feature => feature.type === "contained_weight_reduction")) === null || _e === void 0 ? void 0 : _e.reduction) !== null && _f !== void 0 ? _f : null;
        (_g = data.features) === null || _g === void 0 ? void 0 : _g.forEach((feature) => {
            var _a;
            (_a = _character_misc_feature__WEBPACK_IMPORTED_MODULE_8__["Feature"].loadFeature(equipment, feature.type)) === null || _a === void 0 ? void 0 : _a.load(feature);
        });
        if (data && ((_h = data.type) === null || _h === void 0 ? void 0 : _h.includes("_container"))) {
            return (data === null || data === void 0 ? void 0 : data.children) || null;
        }
    }
    saveEquipment(equipment) {
        let data = {
            type: "equipment",
            version: 1,
            equipped: equipment.equipped,
            quantity: equipment.quantity,
            description: equipment.description,
            value: equipment.toString(),
            weight: `${equipment.weight} lb`,
            reference: equipment.reference,
            notes: equipment.notes,
            categories: Array.from(equipment.categories)
        };
        GCSJSON.saveListLike(equipment, data);
        return data;
    }
    mapTrait(trait, data) {
        var _a, _b, _c, _d, _e;
        trait.name = data.name;
        (_a = data.modifiers) === null || _a === void 0 ? void 0 : _a.forEach((modifier) => trait.addModifier().load(modifier));
        trait.basePoints = data.base_points;
        trait.levels = (_b = parseInt(data === null || data === void 0 ? void 0 : data.levels)) !== null && _b !== void 0 ? _b : null;
        trait.allowHalfLevels = data.allow_half_levels;
        trait.hasHalfLevel = data.has_half_level;
        trait.roundDown = data.round_down;
        trait.controlRating = data.cr;
        (_c = data.types) === null || _c === void 0 ? void 0 : _c.forEach((type) => trait.types.add(type));
        trait.pointsPerLevel = data.points_per_level;
        trait.disabled = data.disabled;
        trait.hasLevels = trait.levels ? true : false;
        (_d = data.features) === null || _d === void 0 ? void 0 : _d.forEach((feature) => {
            var _a;
            (_a = _character_misc_feature__WEBPACK_IMPORTED_MODULE_8__["Feature"].loadFeature(trait, feature.type)) === null || _a === void 0 ? void 0 : _a.load(feature);
        });
        if (data && ((_e = data.type) === null || _e === void 0 ? void 0 : _e.includes("_container"))) {
            return data.children;
        }
    }
    saveTrait(trait) {
        let data = {
            type: "advantage",
            version: 1,
            name: trait.name,
            base_points: trait.basePoints,
            reference: trait.reference,
            categories: Array.from(trait.categories),
            modifiers: Array.from(trait.modifiers).map(trait => trait.save())
        };
        GCSJSON.saveListLike(trait, data);
        return data;
    }
    mapFeature(feature, data) {
        feature.leveled = data.levels;
        feature.limitation = data.limitation;
        feature.type = data.type;
        switch (data.type) {
        }
        return feature;
    }
    saveFeature(feature) {
        let data = {};
        switch (feature.type) {
        }
        return data;
    }
    mapModifier(modifier, data) {
        modifier.enabled = data.enabled;
        modifier.name = data.name;
        modifier.notes = data.notes;
        modifier.reference = data.reference;
        switch (modifier.tag) {
            case "modifier":
                if (modifier instanceof _character_trait__WEBPACK_IMPORTED_MODULE_5__["TraitModifier"]) {
                    modifier.cost = data.cost;
                    modifier.type = data.type;
                    modifier.affects = data.affects;
                    modifier.levels = data.levels;
                }
            case "eqp_modifier":
                if (modifier instanceof _character_equipment__WEBPACK_IMPORTED_MODULE_4__["EquipmentModifier"]) {
                    modifier.cost = data.cost;
                    modifier.weight = data.weight;
                    modifier.costType = data.cost_type;
                    modifier.weightType = data.weight_type;
                }
        }
        return modifier;
    }
    saveModifier(modifier) {
        let data = {
            enabled: modifier.enabled,
            name: modifier.name
        };
        switch (modifier.tag) {
            case "modifier":
                if (modifier instanceof _character_trait__WEBPACK_IMPORTED_MODULE_5__["TraitModifier"]) {
                    Object.assign(data, {
                        cost: modifier.cost,
                        type: modifier.type,
                        affects: modifier.affects,
                        levels: modifier.levels
                    });
                }
            case "eqp_modifier":
                if (modifier instanceof _character_equipment__WEBPACK_IMPORTED_MODULE_4__["EquipmentModifier"]) {
                    Object.assign(data, {
                        cost: modifier.cost,
                        weight: modifier.weight,
                        cost_type: modifier.costType,
                        weight_type: modifier.weightType
                    });
                }
        }
        return data;
    }
    loadList(list, data) {
        data = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_6__["objectify"])(data);
        if (data) {
            data.forEach(listItem => {
                const item = new list.populator(list);
                item.load(listItem);
            });
        }
        list.generate();
        return list;
    }
    saveList(list) {
        return list.iterTop().map(root => root.save());
    }
    load(character, data) {
        var _a, _b;
        data = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_6__["objectify"])(data);
        character.gCalcID = data.id;
        character.profile.load(data.profile);
        character.equipmentList.load(data.equipment);
        character.otherEquipmentList.load(data.other_equipment);
        character.skillList.load(data.skills);
        character.traitList.load(data.advantages);
        character.spellList.load(data.spells);
        character.missingHP = (_a = data === null || data === void 0 ? void 0 : data.hp_damage) !== null && _a !== void 0 ? _a : 0;
        character.missingFP = (_b = data === null || data === void 0 ? void 0 : data.fp_damage) !== null && _b !== void 0 ? _b : 0;
        character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].DX).setLevel(data.DX);
        character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].FP).setLevel(data.fp_adj);
        character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].HP).setLevel(data.hp_adj);
        character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].HT).setLevel(data.HT);
        character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].IQ).setLevel(data.IQ);
        character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].Move).setLevel(data.move_adj);
        character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].Per).setLevel(data.per_adj);
        character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].ST).setLevel(data.ST);
        character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].Speed).setLevel(data.speed_adj);
        character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].Will).setLevel(data.will_adj);
        return character;
    }
    save(character) {
        let output = {
            DX: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].DX).level,
            fp_adj: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].FP).level,
            hp_adj: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].HP).level,
            HT: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].HT).level,
            IQ: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].IQ).level,
            move_adj: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].Move).level,
            per_adj: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].Per).level,
            ST: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].ST).level,
            speed_adj: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].Speed).level,
            will_adj: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_7__["Signature"].Will).level,
            hp_damage: character.missingHP,
            fp_damage: character.missingFP,
            profile: character.profile.save(),
            equipment: character.equipmentList.save(),
            other_equipment: character.otherEquipmentList.save(),
            skills: character.skillList.save(),
            advantages: character.traitList.save()
        };
        GCSJSON.purgeObject(output);
        return JSON.stringify(output);
    }
}


/***/ }),

/***/ "./src/character/serialization/serializer.ts":
/*!***************************************************!*\
  !*** ./src/character/serialization/serializer.ts ***!
  \***************************************************/
/*! exports provided: Serializer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Serializer", function() { return Serializer; });
class Serializer {
    constructor() {
        this.transformers = new Map();
        this.init();
    }
    static purgeObject(object) {
        object.keys.forEach(key => {
            const data = object[key];
            if (data === undefined || data === null)
                delete object[key];
            if (Array.isArray(data))
                data.forEach(data => Serializer.purgeObject(data));
            if (Object.keys(data).length > 0)
                Serializer.purgeObject(data);
        });
        return object;
    }
    register(key, transformer) {
        this.transformers.set(key, transformer);
        return this;
    }
    static reverseMap(input) {
        Object.keys(input);
    }
}


/***/ }),

/***/ "./src/character/skill/logic.ts":
/*!**************************************!*\
  !*** ./src/character/skill/logic.ts ***!
  \**************************************/
/*! exports provided: calculateSkillLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculateSkillLevel", function() { return calculateSkillLevel; });
/* harmony import */ var _skill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./skill */ "./src/character/skill/skill.ts");

function calculateSkillLevel(difficulty, points, base = 10, defaultedFrom, bonus = 0, encumbranceLevel = 0, encPenaltyMult = 1) {
    let relativeLevel = _skill__WEBPACK_IMPORTED_MODULE_0__["SkillLike"].getBaseRelativeLevel(difficulty);
    let level = base;
    if (level !== Number.NEGATIVE_INFINITY) {
        if (difficulty === _skill__WEBPACK_IMPORTED_MODULE_0__["Difficulty"].wildcard) {
            points /= 3;
        }
        else {
            if (defaultedFrom && defaultedFrom.points > 0) {
                points += defaultedFrom.points;
            }
        }
        if (points > 0) {
            relativeLevel = _skill__WEBPACK_IMPORTED_MODULE_0__["SkillLike"].calculateRelativeLevel(points, relativeLevel);
        }
        else if (defaultedFrom && defaultedFrom.points < 0) {
            relativeLevel = defaultedFrom.adjustedLevel - level;
        }
        else {
            level = Number.NEGATIVE_INFINITY;
            relativeLevel = 0;
        }
        if (level !== Number.NEGATIVE_INFINITY) {
            level += relativeLevel;
            if (defaultedFrom) {
                if (level < defaultedFrom.adjustedLevel) {
                    level = defaultedFrom.adjustedLevel;
                }
            }
            const encumbrancePenalty = encumbranceLevel * encPenaltyMult;
            level += bonus + encumbrancePenalty;
            relativeLevel += bonus + encumbrancePenalty;
        }
    }
    return level;
}


/***/ }),

/***/ "./src/character/skill/skill.ts":
/*!**************************************!*\
  !*** ./src/character/skill/skill.ts ***!
  \**************************************/
/*! exports provided: SkillList, SkillLike, Skill, SkillDefault, Difficulty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkillList", function() { return SkillList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkillLike", function() { return SkillLike; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Skill", function() { return Skill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkillDefault", function() { return SkillDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Difficulty", function() { return Difficulty; });
/* harmony import */ var _character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../character */ "./src/character/character.ts");
/* harmony import */ var _misc_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../misc/list */ "./src/character/misc/list.ts");
/* harmony import */ var _misc_feature__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../misc/feature */ "./src/character/misc/feature.ts");
/* harmony import */ var _misc_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../misc/default */ "./src/character/misc/default.ts");
/* harmony import */ var _gcs_gcs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @gcs/gcs */ "./src/gcs/gcs.ts");
/* harmony import */ var _logic__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./logic */ "./src/character/skill/logic.ts");






class SkillList extends _misc_list__WEBPACK_IMPORTED_MODULE_1__["List"] {
    constructor(character) {
        super(character);
        this.populator = Skill;
    }
}
class SkillLike extends _misc_list__WEBPACK_IMPORTED_MODULE_1__["ListItem"] {
    constructor(list) {
        super(list);
        this.hasLevels = false;
    }
    getLevel() { return null; }
    getBaseRelativeLevel() { return SkillLike.getBaseRelativeLevel(this.difficulty); }
    static getBaseRelativeLevel(difficulty) {
        switch (difficulty) {
            case Difficulty.easy:
                return 0;
            case Difficulty.average:
                return -1;
            case Difficulty.hard:
                return -2;
            case Difficulty.very_hard:
                return -3;
            case Difficulty.wildcard:
                return -3;
        }
    }
    static calculateRelativeLevel(points, relativeLevel) {
        if (points === 1) {
        }
        else if (points < 4) {
            relativeLevel++;
        }
        else {
            relativeLevel += 1 + points / 4;
        }
        return relativeLevel;
    }
    calculateLevel() {
        var _a;
        return Object(_logic__WEBPACK_IMPORTED_MODULE_5__["calculateSkillLevel"])(this.difficulty, this.points, (_a = this.list.character.getAttribute(this.signature)) === null || _a === void 0 ? void 0 : _a.calculateLevel(), this.defaultedFrom, this.getBonus(), this.list.character.encumbranceLevel(), this.encumbrancePenaltyMultiple);
    }
    static getBestDefaultWithPoints(character, skill, defaults) {
        let best = SkillLike.getBestDefault(character, defaults);
        if (best !== null) {
            let baseLine = character.getAttribute(skill.signature).calculateLevel() + SkillLike.getBaseRelativeLevel(skill.difficulty);
            let level = best.level;
            best.adjustedLevel = level;
            if (level === baseLine) {
                best.points = 1;
            }
            else if (level === baseLine + 1) {
                best.points = 2;
            }
            else if (level > baseLine + 1) {
                best.points = 4 * (level - (baseLine + 1));
            }
            else {
                level = best.level;
                if (level < 0) {
                    level = 0;
                }
                best.points = -level;
            }
        }
        return best;
    }
    static getBestDefault(character, defaults) {
        if (character) {
            if (defaults.size > 0) {
                let best = Number.NEGATIVE_INFINITY;
                let bestSkill;
                defaults.forEach(skillDefault => {
                    if (true) {
                        if (skillDefault.isSkillBased()) {
                            var skill = skillDefault.getSkillsNamedFrom(skillDefault.owner.list).highest;
                            var level = SkillLike.calculateRelativeLevel(skill.points, skill.getBaseRelativeLevel());
                        }
                        if (level > best) {
                            best = level;
                            bestSkill = skillDefault;
                            bestSkill.level = level;
                        }
                    }
                });
                return bestSkill;
            }
        }
        return null;
    }
    canSwapDefaults(skill, defaults) {
        let result = false;
        if (this.defaultedFrom !== null && this.points > 0) {
            if (skill !== null && skill.hasDefaultTo(this, defaults)) {
                result = true;
            }
        }
        return result;
    }
    hasDefaultTo(skill, defaults) {
        let result = false;
        defaults.forEach(skillDefault => {
            let skillBased = skillDefault.isSkillBased();
            let nameMatches = skillDefault.name === skill.name;
            let specializationMatches = skillDefault.specialization === skill.specialization;
            if (skillBased && nameMatches && specializationMatches) {
                result = true;
            }
        });
        return result;
    }
    swapDefault(skill, defaults) {
        let extraPointsSpent = 0;
        let baseSkill = this.defaultedFrom.getSkillsNamedFrom(this.list);
        if (baseSkill !== null) {
            this.defaultedFrom = SkillLike.getBestDefaultWithPoints(this.list.character, skill.findSelf(), defaults);
        }
        return extraPointsSpent;
    }
}
class Skill extends SkillLike {
    constructor(list, isTechnique = false) {
        super(list);
        this.version = 1;
        this.tag = "skill";
        this.encumbrancePenaltyMultiple = 0;
        this.isTechnique = false;
        this.isTechnique = false;
        this.defaults = new Set();
    }
    isActive() { return true; }
    childrenPoints() {
        return this.iterChildren().reduce((prev, cur) => {
            if (cur.canContainChildren) {
                prev += cur.findSelf().childrenPoints();
            }
            else {
                prev += cur.findSelf().points;
            }
            return prev;
        }, 0);
    }
    getBonus() {
        return this.list.character.featureList.getFeaturesByType(_gcs_gcs__WEBPACK_IMPORTED_MODULE_4__["FeatureType"].skillBonus).reduce((prev, cur) => {
            if (cur instanceof _misc_feature__WEBPACK_IMPORTED_MODULE_2__["SkillBonus"] && cur.type === _gcs_gcs__WEBPACK_IMPORTED_MODULE_4__["FeatureType"].skillBonus && cur.isApplicableTo(this) && cur.ownerIsActive()) {
                prev += cur.getBonus();
            }
            return prev;
        }, 0);
    }
    toString() {
        let string = "";
        string += this.name;
        if (!this.isContainer()) {
            if (Boolean(this.techLevel)) {
                string += "/TL";
                string += this.techLevel;
            }
            if (Boolean(this.specialization)) {
                string += ` (${this.specialization})`;
            }
        }
        return string;
    }
    addDefault() {
        const newDefault = new SkillDefault(this);
        this.defaults.add(newDefault);
        return newDefault;
    }
    toR20() {
        return {
            key: "repeating_skills",
            row_id: this.r20rowID,
            data: {
                name: this.toString(),
                base: (() => {
                    switch (this.signature) {
                        case _character__WEBPACK_IMPORTED_MODULE_0__["Signature"].ST: return "@{strength}";
                        case _character__WEBPACK_IMPORTED_MODULE_0__["Signature"].DX: return "@{dexterity}";
                        case _character__WEBPACK_IMPORTED_MODULE_0__["Signature"].IQ: return "@{intelligence}";
                        case _character__WEBPACK_IMPORTED_MODULE_0__["Signature"].HT: return "@{health}";
                        case _character__WEBPACK_IMPORTED_MODULE_0__["Signature"].Per: return "@{perception}";
                        case _character__WEBPACK_IMPORTED_MODULE_0__["Signature"].Will: return "@{willpower}";
                        case _character__WEBPACK_IMPORTED_MODULE_0__["Signature"].Base: return 10;
                    }
                })(),
                difficulty: (() => {
                    switch (this.difficulty) {
                        case Difficulty.easy: return -1;
                        case Difficulty.average: return -2;
                        case Difficulty.hard: return -3;
                        case Difficulty.very_hard: return -4;
                        case Difficulty.wildcard: return "-5 + 1";
                    }
                })(),
                bonus: this.getBonus(),
                points: this.points,
                wildcard_skill_points: this.points / 3,
                use_wildcard_points: this.difficulty === Difficulty.wildcard ? 1 : 0,
                use_normal_points: this.difficulty !== Difficulty.wildcard ? 0 : 1,
                skill_points: this.points,
                ref: this.reference,
                notes: this.notes
            }
        };
    }
}
class SkillDefault extends _misc_default__WEBPACK_IMPORTED_MODULE_3__["Default"] {
    constructor(skill) {
        super(skill);
        this.tag = "default";
    }
    isSkillBased() {
        return this.type === _character__WEBPACK_IMPORTED_MODULE_0__["Signature"].Base.toString();
    }
    getSkillsNamedFrom(list) {
        const skills = list.iter().filter(skill => {
            return this.name === skill.name && this.specialization === skill.specialization;
        });
        const highest = skills.reduce((prev, cur) => {
            if (SkillLike.calculateRelativeLevel(prev.points, 10) > SkillLike.calculateRelativeLevel(cur.points, 10)) {
                return prev;
            }
            else {
                return cur;
            }
        });
        return {
            skills,
            highest
        };
    }
    save() { return this.getSerializer().transformers.get(this.constructor).save(this); }
    load(data) { return this.getSerializer().transformers.get(this.constructor).load(this, data); }
}
var Difficulty;
(function (Difficulty) {
    Difficulty["easy"] = "E";
    Difficulty["average"] = "A";
    Difficulty["hard"] = "H";
    Difficulty["very_hard"] = "VH";
    Difficulty["wildcard"] = "W";
})(Difficulty || (Difficulty = {}));


/***/ }),

/***/ "./src/character/spell.ts":
/*!********************************!*\
  !*** ./src/character/spell.ts ***!
  \********************************/
/*! exports provided: SpellList, Spell */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpellList", function() { return SpellList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Spell", function() { return Spell; });
/* harmony import */ var _skill_skill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./skill/skill */ "./src/character/skill/skill.ts");
/* harmony import */ var _misc_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc/list */ "./src/character/misc/list.ts");
/* harmony import */ var _character__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./character */ "./src/character/character.ts");



class SpellList extends _misc_list__WEBPACK_IMPORTED_MODULE_1__["List"] {
    constructor(character) {
        super(character);
        this.populator = Spell;
    }
}
class Spell extends _skill_skill__WEBPACK_IMPORTED_MODULE_0__["SkillLike"] {
    constructor(list) {
        super(list);
        this.version = 1;
        this.tag = "spell";
        this.difficulty = _skill_skill__WEBPACK_IMPORTED_MODULE_0__["Difficulty"].hard;
        this.signature = _character__WEBPACK_IMPORTED_MODULE_2__["Signature"].IQ;
        this.defaultedFrom = null;
        this.encumbrancePenaltyMultiple = null;
    }
    isActive() { return true; }
    getBonus() {
        return 0;
    }
}


/***/ }),

/***/ "./src/character/technique.ts":
/*!************************************!*\
  !*** ./src/character/technique.ts ***!
  \************************************/
/*! exports provided: Technique */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Technique", function() { return Technique; });
/* harmony import */ var _skill_skill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./skill/skill */ "./src/character/skill/skill.ts");

class Technique extends _skill_skill__WEBPACK_IMPORTED_MODULE_0__["Skill"] {
    constructor(list) {
        super(list);
        this.tag = "technique";
        this.difficulty = _skill_skill__WEBPACK_IMPORTED_MODULE_0__["Difficulty"].average;
        this.defaults = null;
        this.defaultedFrom = null;
        this.isTechnique = true;
    }
    get signature() { return null; }
    getBonus() {
        return 0;
    }
    calculateLevel() {
        const techniqueDefault = this.default;
        const character = this.list.character;
        let relativeLevel = 0;
        let points = this.points;
        let level = Number.NEGATIVE_INFINITY;
        if (character != null) {
            level = this.getBaseLevel(techniqueDefault, null);
            if (level !== Number.NEGATIVE_INFINITY) {
                let baseLevel = level;
                level += techniqueDefault.modifier;
                if (this.difficulty === _skill_skill__WEBPACK_IMPORTED_MODULE_0__["Difficulty"].hard) {
                    points--;
                }
                if (points > 0) {
                    relativeLevel = points;
                }
                if (level !== Number.NEGATIVE_INFINITY) {
                    level += relativeLevel;
                }
                if (Boolean(this.limit)) {
                    let max = baseLevel + this.limit;
                    if (level > max) {
                        relativeLevel -= level - max;
                        level = max;
                    }
                }
            }
        }
        return level;
    }
    getBaseLevel(def, requirePoints) {
        const character = this.list.character;
        if (def.type === "Skill") {
            let skill = def.getSkillsNamedFrom(this.list).highest;
            return skill !== null ? skill.calculateLevel() : Number.NEGATIVE_INFINITY;
        }
    }
    getRelativeLevel() {
        const relativeTo = this.default.getSkillsNamedFrom(this.list).highest;
        console.log(this.name, relativeTo.name, relativeTo.calculateLevel());
        return this.calculateLevel() - relativeTo.calculateLevel();
    }
    toR20() {
        const link = this.default.isSkillBased() ? this.default.getSkillsNamedFrom(this.list).highest : null;
        return {
            key: "repeating_techniquesrevised",
            row_id: this.r20rowID,
            data: {
                name: this.name,
                parent: this.default.name,
                default: this.default.modifier,
                skill_modifier: 0,
                points: this.points,
                ref: this.reference,
                notes: this.notes,
                technique_row_type: link ? "Skill" : "10",
                technique_skill_row_id: link ? link.uuid : "",
            }
        };
    }
}


/***/ }),

/***/ "./src/character/trait.ts":
/*!********************************!*\
  !*** ./src/character/trait.ts ***!
  \********************************/
/*! exports provided: TraitList, Trait, TraitModifier, TraitType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TraitList", function() { return TraitList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Trait", function() { return Trait; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TraitModifier", function() { return TraitModifier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TraitType", function() { return TraitType; });
/* harmony import */ var _misc_modifier__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./misc/modifier */ "./src/character/misc/modifier.ts");
/* harmony import */ var _misc_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc/list */ "./src/character/misc/list.ts");


class TraitList extends _misc_list__WEBPACK_IMPORTED_MODULE_1__["List"] {
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
class Trait extends _misc_list__WEBPACK_IMPORTED_MODULE_1__["ListItem"] {
    constructor(list) {
        super(list);
        this.version = 1;
        this.tag = "trait";
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
        let basePoints = trait.basePoints || 0;
        let pointsPerLevel = trait.pointsPerLevel || 0;
        let levels = trait.levels || 0;
        let baseEnh = 0;
        let levelEnh = 0;
        let baseLim = 0;
        let levelLim = 0;
        let multiplier = 1;
        modifiers === null || modifiers === void 0 ? void 0 : modifiers.forEach(modifier => {
            if (modifier.enabled) {
                let mod = modifier.costModifier();
                console.log(mod);
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
        let leveledPoints = pointsPerLevel * (levels + (trait.hasHalfLevel ? .5 : 0)) || 0;
        if (baseEnh !== 0 || baseLim !== 0 || levelEnh !== 0 || levelLim !== 0) {
            if (false) {}
            else {
                let baseMod = Math.max(baseEnh + baseLim, -80);
                let levelMod = Math.max(levelEnh + levelLim, -80);
                modifiedBasePoints = baseMod === levelMod ?
                    TraitModifier.modifyPoints((modifiedBasePoints + leveledPoints), baseMod) :
                    TraitModifier.modifyPoints(modifiedBasePoints, baseMod) + TraitModifier.modifyPoints(leveledPoints, levelMod);
            }
        }
        else {
            modifiedBasePoints += (leveledPoints);
        }
        return TraitModifier.applyRounding((modifiedBasePoints * multiplier), Boolean(trait.roundDown));
    }
    addModifier() {
        const modifier = new TraitModifier(this);
        this.modifiers.add(modifier);
        return modifier;
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
class TraitModifier extends _misc_modifier__WEBPACK_IMPORTED_MODULE_0__["Modifier"] {
    constructor(owner) {
        super(owner);
        this.tag = "modifier";
        this.version = 1;
        this.hasLevels = false;
    }
    costModifier() {
        return this.levels > 0 ? this.cost * this.levels : this.cost;
    }
    static modifyPoints(points, modifier) {
        return points + TraitModifier.calculateModifierPoints(points, modifier);
    }
    static calculateModifierPoints(points, modifier) {
        return points * (modifier / 100);
    }
    static applyRounding(value, roundCostDown) {
        return roundCostDown ? Math.floor(value) : Math.ceil(value);
    }
}
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


/***/ }),

/***/ "./src/gcs/gcs.ts":
/*!************************!*\
  !*** ./src/gcs/gcs.ts ***!
  \************************/
/*! exports provided: FeatureType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeatureType", function() { return FeatureType; });
var FeatureType;
(function (FeatureType) {
    FeatureType["attributeBonus"] = "attribute_bonus";
    FeatureType["damageResistanceBonus"] = "dr_bonus";
    FeatureType["skillBonus"] = "skill_bonus";
    FeatureType["weaponDamageBonus"] = "weapon_bonus";
    FeatureType["reactionBonus"] = "reaction_bonus";
    FeatureType["spellBonus"] = "spell_bonus";
    FeatureType["containedWeightReduction"] = "contained_weight_reduction";
    FeatureType["costReduction"] = "cost_reduction";
})(FeatureType || (FeatureType = {}));


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: Character, Signature, Skill, Difficulty, SkillDefault, SkillLike, SkillList, Trait, TraitType, TraitList, TraitModifier, Spell, SpellList, Technique, Equipment, EquipmentList, EquipmentModifier, Serializer, isArray, Feature */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _character_character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./character/character */ "./src/character/character.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Character", function() { return _character_character__WEBPACK_IMPORTED_MODULE_0__["Character"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Signature", function() { return _character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"]; });

/* harmony import */ var _character_skill_skill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./character/skill/skill */ "./src/character/skill/skill.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Skill", function() { return _character_skill_skill__WEBPACK_IMPORTED_MODULE_1__["Skill"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Difficulty", function() { return _character_skill_skill__WEBPACK_IMPORTED_MODULE_1__["Difficulty"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SkillDefault", function() { return _character_skill_skill__WEBPACK_IMPORTED_MODULE_1__["SkillDefault"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SkillLike", function() { return _character_skill_skill__WEBPACK_IMPORTED_MODULE_1__["SkillLike"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SkillList", function() { return _character_skill_skill__WEBPACK_IMPORTED_MODULE_1__["SkillList"]; });

/* harmony import */ var _character_trait__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./character/trait */ "./src/character/trait.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Trait", function() { return _character_trait__WEBPACK_IMPORTED_MODULE_2__["Trait"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TraitType", function() { return _character_trait__WEBPACK_IMPORTED_MODULE_2__["TraitType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TraitList", function() { return _character_trait__WEBPACK_IMPORTED_MODULE_2__["TraitList"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TraitModifier", function() { return _character_trait__WEBPACK_IMPORTED_MODULE_2__["TraitModifier"]; });

/* harmony import */ var _character_spell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./character/spell */ "./src/character/spell.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Spell", function() { return _character_spell__WEBPACK_IMPORTED_MODULE_3__["Spell"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SpellList", function() { return _character_spell__WEBPACK_IMPORTED_MODULE_3__["SpellList"]; });

/* harmony import */ var _character_technique__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./character/technique */ "./src/character/technique.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Technique", function() { return _character_technique__WEBPACK_IMPORTED_MODULE_4__["Technique"]; });

/* harmony import */ var _character_equipment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./character/equipment */ "./src/character/equipment.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Equipment", function() { return _character_equipment__WEBPACK_IMPORTED_MODULE_5__["Equipment"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EquipmentList", function() { return _character_equipment__WEBPACK_IMPORTED_MODULE_5__["EquipmentList"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EquipmentModifier", function() { return _character_equipment__WEBPACK_IMPORTED_MODULE_5__["EquipmentModifier"]; });

/* harmony import */ var _character_serialization_serializer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./character/serialization/serializer */ "./src/character/serialization/serializer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Serializer", function() { return _character_serialization_serializer__WEBPACK_IMPORTED_MODULE_6__["Serializer"]; });

/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return _utils_json_utils__WEBPACK_IMPORTED_MODULE_7__["isArray"]; });

/* harmony import */ var _character_misc_feature__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @character/misc/feature */ "./src/character/misc/feature.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Feature", function() { return _character_misc_feature__WEBPACK_IMPORTED_MODULE_8__["Feature"]; });













/***/ }),

/***/ "./src/utils/2R20.ts":
/*!***************************!*\
  !*** ./src/utils/2R20.ts ***!
  \***************************/
/*! exports provided: exportR20, generateUUID, generateRowID */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exportR20", function() { return exportR20; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateUUID", function() { return generateUUID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateRowID", function() { return generateRowID; });
/* harmony import */ var _character_character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../character/character */ "./src/character/character.ts");

const base = {
    "schema_version": 2,
    "oldId": "-M2EO3g9sXH6Q8lSFxpT",
    "name": "",
    "avatar": "",
    "bio": "",
    "gmnotes": "",
    "defaulttoken": "",
    "tags": "[]",
    "controlledby": "",
    "inplayerjournals": "",
    "attribs": [
        {
            name: "show_new_techniques",
            current: "1",
            max: "",
            id: generateUUID()
        },
        {
            name: "show_old_techniques",
            current: "0",
            max: "",
            id: generateUUID()
        },
        {
            "name": "point_summary_layout",
            "current": "2",
            "max": "",
            "id": generateUUID()
        }
    ],
    "abilities": []
};
function exportR20(character) {
    const profile = character.profile;
    const pointTotals = character.pointTotals();
    const native_language = character.traitList.iter().find(trait => {
        if (trait.categories.has("Language") &&
            Array.from(trait.modifiers.values()).some(modifier => {
                if (modifier.enabled && modifier.name.includes("Native"))
                    return true;
            })) {
            return true;
        }
    });
    const static_fields = {
        strength_mod: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].ST).getMod(),
        strength_points: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].ST).pointsSpent(),
        dexterity_mod: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].DX).getMod(),
        dexterity_points: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].DX).pointsSpent(),
        intelligence_mod: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].IQ).getMod(),
        intelligence_points: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].IQ).pointsSpent(),
        health_mod: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].HT).getMod(),
        health_points: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].HT).pointsSpent(),
        perception_mod: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].Per).getMod(),
        perception_points: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].Per).pointsSpent(),
        willpower_mod: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].Will).getMod(),
        willpower_points: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].Will).pointsSpent(),
        basic_speed_mod: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].Speed).getMod(),
        basic_speed_points: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].Speed).pointsSpent(),
        basic_move_mod: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].Move).getMod(),
        basic_move_points: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].Move).pointsSpent(),
        hit_points_max_mod: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].HP).getMod(),
        hit_points_max_points: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].HP).pointsSpent(),
        fatigue_points_mod: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].FP).getMod(),
        fatigue_points_points: character.getAttribute(_character_character__WEBPACK_IMPORTED_MODULE_0__["Signature"].FP).pointsSpent(),
        name_native_language: native_language ? native_language.name : "",
        native_language_spoken: 0,
        native_language_written: 0,
        tl: profile.techLevel,
        fullname: profile.name,
        race: profile.race,
        gender: profile.gender,
        size: profile.sizeModifier,
        hand: profile.handedness,
        birth_date: profile.birthday,
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        eyes: profile.eyes,
        hair: profile.hair,
        total_points: pointTotals.total,
        skills_points: pointTotals.skills
    };
    var output = base;
    output.name = profile.name;
    output.avatar = 'data:image/png;base64,' + profile.portrait;
    output.attribs = output.attribs.concat(writeObjects(character.traitList.iter().map(trait => trait.toR20())), writeObjects(character.skillList.iter().map(skill => skill.toR20())), writeObjects(character.allItems().map(item => item.toR20())), writeObjects(static_fields, true));
    var json = JSON.stringify(output);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    return url;
}
function writeObjects(objects, single = false) {
    if (!single) {
        console.log(objects);
        return [].concat.apply([], objects.map((object) => {
            const row_id = object.row_id;
            var x = Object.entries(object.data).map(key => {
                return {
                    name: `${object.key}_${row_id}_${key[0]}`,
                    current: key[1] ? key[1] : "",
                    max: "",
                    id: generateUUID()
                };
            });
            return x;
        }));
    }
    else if (single) {
        var x = [].concat.apply([], Object.entries(objects).map(object => {
            const row_id = generateRowID();
            return {
                name: `${object[0]}`,
                current: object[1] ? object[1] : "",
                max: "",
                id: generateUUID()
            };
        }));
        return x;
    }
    else {
        console.log("nothing is happening");
    }
}
function generateUUID() {
    var a = 0, b = [];
    return function () {
        var c = (new Date()).getTime() + 0, d = c === a;
        a = c;
        for (var e = new Array(8), f = 7; 0 <= f; f--) {
            e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
            c = Math.floor(c / 64);
        }
        c = e.join("");
        if (d) {
            for (f = 11; 0 <= f && 63 === b[f]; f--) {
                b[f] = 0;
            }
            b[f]++;
        }
        else {
            for (f = 0; 12 > f; f++) {
                b[f] = Math.floor(64 * Math.random());
            }
        }
        for (f = 0; 12 > f; f++) {
            c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
        }
        return c;
    }();
}
function generateRowID() {
    return generateUUID().replace(/_/g, "Z");
}


/***/ }),

/***/ "./src/utils/json_utils.ts":
/*!*********************************!*\
  !*** ./src/utils/json_utils.ts ***!
  \*********************************/
/*! exports provided: objectify, isArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "objectify", function() { return objectify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return isArray; });
function objectify(object, reviver) {
    if (typeof object === "string")
        object = JSON.parse(object, reviver);
    return object;
}
function isArray(potentialArray) {
    return Array.isArray(potentialArray) ? potentialArray : [];
}


/***/ }),

/***/ "./src/utils/string_utils.ts":
/*!***********************************!*\
  !*** ./src/utils/string_utils.ts ***!
  \***********************************/
/*! exports provided: StringCompare, stringCompare */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StringCompare", function() { return StringCompare; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringCompare", function() { return stringCompare; });
var StringCompare;
(function (StringCompare) {
    StringCompare["isAnything"] = "is_anything";
    StringCompare["is"] = "is";
    StringCompare["isNot"] = "is_not";
    StringCompare["contains"] = "contains";
    StringCompare["doesNotContain"] = "does_not_contain";
    StringCompare["startsWith"] = "starts_with";
    StringCompare["doesNotStartWith"] = "does_not_start_with";
    StringCompare["endsWith"] = "ends_with";
    StringCompare["doesNotEndWith"] = "does_not_end_with";
})(StringCompare || (StringCompare = {}));
function iterableCompare(compare, compareTo) {
}
function stringCompare(defaultQuery, skillQuery, type) {
    var _a;
    defaultQuery = defaultQuery === null || defaultQuery === void 0 ? void 0 : defaultQuery.toLowerCase();
    skillQuery = (_a = skillQuery === null || skillQuery === void 0 ? void 0 : skillQuery.toString()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    switch (type) {
        case StringCompare.isAnything: return true;
        case StringCompare.is: return skillQuery === defaultQuery;
        case StringCompare.isNot: return skillQuery !== defaultQuery;
        case StringCompare.contains: return skillQuery.includes(defaultQuery);
        case StringCompare.doesNotContain: return !skillQuery.includes(defaultQuery);
        case StringCompare.startsWith: return skillQuery.startsWith(defaultQuery);
        case StringCompare.doesNotStartWith: return !skillQuery.startsWith(defaultQuery);
        case StringCompare.endsWith: return skillQuery.endsWith(defaultQuery);
        case StringCompare.doesNotEndWith: return !skillQuery.endsWith(defaultQuery);
        default: return false;
    }
}


/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! E:\G4eLogic\src\index.ts */"./src/index.ts");


/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map