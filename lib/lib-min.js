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
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");



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
    loadJSON(json) {
        const data = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_2__["objectify"])(json);
        super.loadJSON(data);
        this.attribute = data.attribute;
        return this;
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
/* harmony import */ var _skill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./skill */ "./src/character/skill.ts");
/* harmony import */ var _trait__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./trait */ "./src/character/trait.ts");
/* harmony import */ var _equipment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./equipment */ "./src/character/equipment.ts");
/* harmony import */ var _misc_feature__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./misc/feature */ "./src/character/misc/feature.ts");
/* harmony import */ var _profile__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./profile */ "./src/character/profile.ts");
/* harmony import */ var _spell__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./spell */ "./src/character/spell.ts");
/* harmony import */ var _utils_2R20__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @utils/2R20 */ "./src/utils/2R20.ts");
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");
/* harmony import */ var _serialization_gcs_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./serialization/gcs_json */ "./src/character/serialization/gcs_json.ts");










class Sheet {
    constructor(serializer = new _serialization_gcs_json__WEBPACK_IMPORTED_MODULE_9__["GCSJSON"]()) {
        this.serializer = serializer;
    }
}
class Character extends Sheet {
    constructor() {
        super();
        this.profile = new _profile__WEBPACK_IMPORTED_MODULE_5__["Profile"]();
        this.equipmentList = new _equipment__WEBPACK_IMPORTED_MODULE_3__["EquipmentList"](this);
        this.otherEquipmentList = new _equipment__WEBPACK_IMPORTED_MODULE_3__["EquipmentList"](this);
        this.skillList = new _skill__WEBPACK_IMPORTED_MODULE_1__["SkillList"](this);
        this.traitList = new _trait__WEBPACK_IMPORTED_MODULE_2__["TraitList"](this);
        this.spellList = new _spell__WEBPACK_IMPORTED_MODULE_6__["SpellList"](this);
        this.ST = new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.ST, this, 10, { defaultLevel: 10 });
        this.DX = new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.DX, this, 20, { defaultLevel: 10 });
        this.IQ = new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.IQ, this, 20, { defaultLevel: 10 });
        this.HT = new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.HT, this, 10, { defaultLevel: 10 });
        this.Will = new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.Will, this, 5, { basedOn: () => this.IQ.calculateLevel() });
        this.Speed = new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.Speed, this, 20, { basedOn: () => (this.DX.calculateLevel() + this.HT.calculateLevel()) / 4 });
        this.Move = new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.Move, this, 5, { basedOn: () => Math.floor(this.Speed.calculateLevel()) });
        this.Per = new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.Per, this, 5, { basedOn: () => this.IQ.calculateLevel() });
        this.HP = new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.HP, this, 2, { basedOn: () => this.ST.calculateLevel() });
        this.FP = new _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"](Signature.FP, this, 3, { basedOn: () => this.HT.calculateLevel() });
        this.featureList = new _misc_feature__WEBPACK_IMPORTED_MODULE_4__["FeatureList"]();
    }
    totalAttributesCost() {
        return Object.values(this).reduce((prev, cur) => {
            if (cur instanceof _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"]) {
                return prev + cur.pointsSpent();
            }
            else {
                return prev;
            }
        }, 0);
    }
    attributes(attribute) {
        switch (attribute) {
            case Signature.HP: return this.HP.calculateLevel();
            case Signature.FP: return this.FP.calculateLevel();
            case Signature.ST: return this.ST.calculateLevel();
            case Signature.DX: return this.DX.calculateLevel();
            case Signature.IQ: return this.IQ.calculateLevel();
            case Signature.HT: return this.HT.calculateLevel();
            case Signature.Per: return this.Per.calculateLevel();
            case Signature.Will: return this.Will.calculateLevel();
            case Signature.Base: return 10;
            case Signature.Speed: return this.Speed.calculateLevel();
            case Signature.Move: return this.Move.calculateLevel();
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
        return this.Move.calculateLevel() + this.encumbranceLevel();
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
    dodgeScore() { return Math.floor(this.Speed.calculateLevel() + _attribute__WEBPACK_IMPORTED_MODULE_0__["Attribute"].bonusReducer(this, Signature.Dodge) + 3); }
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
    toJSON() {
    }
    loadJSON(json) {
        var _a, _b;
        json = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_8__["objectify"])(json);
        this.gCalcID = json.id;
        this.profile.loadJSON(json.profile);
        this.equipmentList.load(json.equipment);
        this.otherEquipmentList.load(json.otherEquipmentList);
        this.skillList.load(json.skills);
        this.traitList.load(json.advantages);
        this.spellList.load(json.spells);
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
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");
/* harmony import */ var _misc_feature__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./misc/feature */ "./src/character/misc/feature.ts");




class EquipmentList extends _misc_list__WEBPACK_IMPORTED_MODULE_0__["List"] {
    constructor(character) {
        super(character);
        this.populator = Equipment;
        this.loader = this.character.serializer.mapEquipment;
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
        console.log(weightReduction);
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
    static mapEquipment(equipment, data) {
        var _a, _b, _c, _d, _e, _f, _g;
        (_a = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_2__["isArray"])(data === null || data === void 0 ? void 0 : data.modifiers)) === null || _a === void 0 ? void 0 : _a.forEach((modifier) => equipment.modifiers.add(new EquipmentModifier(equipment).loadJSON(modifier)));
        equipment.description = data.description;
        equipment.equipped = data.equipped;
        equipment.quantity = data.quantity;
        equipment.value = parseFloat(data === null || data === void 0 ? void 0 : data.value);
        equipment.weight = parseFloat((_c = (_b = data === null || data === void 0 ? void 0 : data.weight) === null || _b === void 0 ? void 0 : _b.split(" ")[0]) !== null && _c !== void 0 ? _c : "0");
        equipment.techLevel = data.tech_level;
        equipment.legalityClass = data.legality_class;
        equipment.containedWeightReduction = (_f = (_e = (_d = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_2__["isArray"])(data === null || data === void 0 ? void 0 : data.features)) === null || _d === void 0 ? void 0 : _d.find(feature => feature.type === "contained_weight_reduction")) === null || _e === void 0 ? void 0 : _e.reduction) !== null && _f !== void 0 ? _f : null;
        (_g = data.features) === null || _g === void 0 ? void 0 : _g.forEach((feature) => {
            var _a;
            (_a = _misc_feature__WEBPACK_IMPORTED_MODULE_3__["Feature"].loadFeature(equipment, feature.type)) === null || _a === void 0 ? void 0 : _a.loadJSON(feature);
        });
        const children = (data === null || data === void 0 ? void 0 : data.children) || null;
        if (data.type.includes("_container")) {
            return children;
        }
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
    toJSON() {
    }
    loadJSON(json) {
        const data = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_2__["objectify"])(json);
        super.loadJSON(json);
        this.cost = data.cost;
        this.weight = data.weight;
        this.costType = data.cost_type;
        this.weightType = data.weightType;
        return this;
    }
}
EquipmentModifier.nodeName = "eqp_modifier";
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
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");

var DefaultType;
(function (DefaultType) {
    DefaultType["skill"] = "Skill";
})(DefaultType || (DefaultType = {}));
class DefaultList {
}
class Default {
    constructor(owner) {
        this.tag = "default";
        this.owner = owner;
    }
    toJSON() { }
    loadJSON(object) {
        object = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_0__["objectify"])(object);
        this.type = object.type;
        this.modifier = object.modifier;
        this.name = object.name;
        this.specialization = object.specialization;
        return this;
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
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");


class CharacterElement {
    constructor(foundryID) {
        this.reference = "";
        this.userDescription = "";
        this.notes = "";
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
    toJSON() {
    }
    loadJSON(object) {
        object = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_1__["objectify"])(object);
        CharacterElement.mapElement(object, this);
    }
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
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");
/* harmony import */ var _gcs_gcs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @gcs/gcs */ "./src/gcs/gcs.ts");
/* harmony import */ var _character_attribute__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @character/attribute */ "./src/character/attribute.ts");
/* harmony import */ var _utils_string_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @utils/string_utils */ "./src/utils/string_utils.ts");






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
        super();
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
    toJSON() {
    }
    loadJSON(object) {
        var _a, _b;
        object = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_1__["objectify"])(object);
        super.loadJSON(object);
        this.amount = object.amount;
        this.leveled = (_a = object === null || object === void 0 ? void 0 : object.per_level) !== null && _a !== void 0 ? _a : false;
        this.limitation = (_b = object === null || object === void 0 ? void 0 : object.limitation) !== null && _b !== void 0 ? _b : false;
    }
    static loadFeature(owner, featureType) {
        switch (featureType) {
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_2__["FeatureType"].attributeBonus:
                return new _character_attribute__WEBPACK_IMPORTED_MODULE_3__["AttributeBonus"](owner);
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_2__["FeatureType"].containedWeightReduction:
                break;
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_2__["FeatureType"].costReduction:
                break;
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_2__["FeatureType"].damageResistanceBonus:
                break;
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_2__["FeatureType"].reactionBonus:
                break;
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_2__["FeatureType"].skillBonus:
                return new SkillBonus(owner);
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_2__["FeatureType"].spellBonus:
                break;
            case _gcs_gcs__WEBPACK_IMPORTED_MODULE_2__["FeatureType"].weaponDamageBonus:
                break;
            default:
                return null;
        }
    }
}
class SkillBonus extends Feature {
    constructor(owner) {
        super(owner, _gcs_gcs__WEBPACK_IMPORTED_MODULE_2__["FeatureType"].skillBonus);
    }
    isApplicableTo(skill) {
        let result = false;
        if (this.nameCompareType)
            result = Object(_utils_string_utils__WEBPACK_IMPORTED_MODULE_4__["stringCompare"])(this.name, skill.name, this.nameCompareType);
        if (this.specializationCompareType)
            result = Object(_utils_string_utils__WEBPACK_IMPORTED_MODULE_4__["stringCompare"])(this.specialization, skill.specialization, this.specializationCompareType);
        return result;
    }
    toJSON() {
        return {};
    }
    loadJSON(json) {
        var _a, _b, _c, _d, _e;
        const data = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_1__["objectify"])(json);
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
        super();
        this.open = true;
        _childIDs.set(this, void 0);
        _containedByID.set(this, void 0);
        this.list = list;
        this.list.addListItem(this);
        this.features = new Set();
        this.children = new Set();
        this.canContainChildren = false;
        this.listIndex = this.list.iter().length;
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
    toJSON() {
        return {};
    }
    loadJSON(json) {
        var _a;
        const data = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_1__["objectify"])(json);
        super.loadJSON(data);
        this.open = (_a = data.open) !== null && _a !== void 0 ? _a : true;
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
    load(loader, data) {
        const children = loader(this.findSelf(), data);
        if (children && children.length > 0) {
            this.canContainChildren = true;
            this.loadChildren(children, this.findSelf(), loader);
        }
        return this.findSelf();
    }
}
_childIDs = new WeakMap(), _containedByID = new WeakMap();
class List {
    constructor(character) {
        _contents.set(this, void 0);
        this.character = character;
        __classPrivateFieldSet(this, _contents, new Map());
        this.contents = new Set();
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
        return Array.from(__classPrivateFieldGet(this, _contents).values());
    }
    iterTop() {
        this.generate();
        return Array.from(this.contents);
    }
    keys() {
        return Array.from(this.contents.keys());
    }
    load(data) {
        data = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_1__["objectify"])(data);
        if (data) {
            data.forEach((skill) => {
                const item = new this.populator(this);
                item.load(this.loader, skill);
            });
            this.generate();
        }
        return this;
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
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element */ "./src/character/misc/element.ts");


class Modifier extends _element__WEBPACK_IMPORTED_MODULE_1__["CharacterElement"] {
    constructor(owner) {
        super();
        this.enabled = true;
        this.owner = owner;
        this.categories = new Set();
    }
    toJSON() {
    }
    loadJSON(object) {
        object = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_0__["objectify"])(object);
        super.loadJSON(object);
        function mapModifier(object, modifier) {
            modifier.name = object.name;
            modifier.reference = object.reference;
            modifier.notes = object.notes;
            modifier.enabled = !object.disabled;
            return modifier;
        }
        mapModifier(object, this);
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
Modifier.version = 2;


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
    toJSON() {
    }
    loadJSON(object) {
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
/* harmony import */ var _character_skill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../character/skill */ "./src/character/skill.ts");
/* harmony import */ var _character_equipment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../character/equipment */ "./src/character/equipment.ts");
/* harmony import */ var _character_trait__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../character/trait */ "./src/character/trait.ts");
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");
/* harmony import */ var _character_misc_feature__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @character/misc/feature */ "./src/character/misc/feature.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GCSJSON_1;






let GCSJSON = GCSJSON_1 = class GCSJSON extends _serializer__WEBPACK_IMPORTED_MODULE_0__["Serializer"] {
    constructor() {
        super();
    }
    static mapSkillLike(skillLike, data) {
        skillLike.name = data.name;
        skillLike.difficulty = data.difficulty;
        skillLike.points = data.points;
    }
    mapSkill(skill, data) {
        var _a, _b, _c, _d;
        GCSJSON_1.mapSkillLike(skill, data);
        skill.difficulty = (_a = data.difficulty) === null || _a === void 0 ? void 0 : _a.split("/")[1];
        skill.signature = (_b = data.difficulty) === null || _b === void 0 ? void 0 : _b.split("/")[0];
        skill.techLevel = (_c = data.tech_level) !== null && _c !== void 0 ? _c : "";
        if (data.encumbrance_penalty_multiplier)
            skill.encumbrancePenaltyMultiple = data.encumbrance_penalty_multiplier;
        if (data.defaulted_from)
            skill.defaultedFrom = new _character_skill__WEBPACK_IMPORTED_MODULE_1__["SkillDefault"](skill).loadJSON(data.defaulted_from);
        (_d = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_4__["isArray"])(data.defaults)) === null || _d === void 0 ? void 0 : _d.forEach((skillDefault) => skill.defaults.add(new _character_skill__WEBPACK_IMPORTED_MODULE_1__["SkillDefault"](skill).loadJSON(skillDefault)));
        const children = data.children;
        if (data.type.includes("_container")) {
            return children;
        }
    }
    mapTechnique(technique, data) {
        this.mapSkill(technique, data);
        technique.limit = data.limit;
        technique.difficulty = data.difficulty;
        technique.default = new _character_skill__WEBPACK_IMPORTED_MODULE_1__["SkillDefault"](technique).loadJSON(data.default);
        return null;
    }
    mapSpell(spell, data) {
        GCSJSON_1.mapSkillLike(spell, data);
        spell.college = data.college;
        spell.powerSource = data.power_source;
        spell.spellClass = data.spell_class;
        spell.castingCost = data.casting_cost;
        spell.maintenanceCost = data.maintenance_cost;
        spell.castingTime = data.casting_time;
        spell.duration = data.duration;
        if (spell.type.includes("_container")) {
            return data.children;
        }
    }
    mapEquipment(equipment, data) {
        var _a, _b, _c, _d, _e, _f, _g;
        (_a = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_4__["isArray"])(data === null || data === void 0 ? void 0 : data.modifiers)) === null || _a === void 0 ? void 0 : _a.forEach((modifier) => equipment.modifiers.add(new _character_equipment__WEBPACK_IMPORTED_MODULE_2__["EquipmentModifier"](equipment).loadJSON(modifier)));
        equipment.description = data.description;
        equipment.equipped = data.equipped;
        equipment.quantity = data.quantity;
        equipment.value = parseFloat(data === null || data === void 0 ? void 0 : data.value);
        equipment.weight = parseFloat((_c = (_b = data === null || data === void 0 ? void 0 : data.weight) === null || _b === void 0 ? void 0 : _b.split(" ")[0]) !== null && _c !== void 0 ? _c : "0");
        equipment.techLevel = data.tech_level;
        equipment.legalityClass = data.legality_class;
        equipment.containedWeightReduction = (_f = (_e = (_d = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_4__["isArray"])(data === null || data === void 0 ? void 0 : data.features)) === null || _d === void 0 ? void 0 : _d.find(feature => feature.type === "contained_weight_reduction")) === null || _e === void 0 ? void 0 : _e.reduction) !== null && _f !== void 0 ? _f : null;
        (_g = data.features) === null || _g === void 0 ? void 0 : _g.forEach((feature) => {
            var _a;
            (_a = _character_misc_feature__WEBPACK_IMPORTED_MODULE_5__["Feature"].loadFeature(equipment, feature.type)) === null || _a === void 0 ? void 0 : _a.loadJSON(feature);
        });
        const children = (data === null || data === void 0 ? void 0 : data.children) || null;
        if (data.type.includes("_container")) {
            return children;
        }
    }
    mapTrait(trait, data) {
        var _a, _b, _c, _d;
        trait.name = data.name;
        (_a = data.modifiers) === null || _a === void 0 ? void 0 : _a.forEach((modifier) => trait.modifiers.add(new _character_trait__WEBPACK_IMPORTED_MODULE_3__["TraitModifier"](trait).loadJSON(modifier)));
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
            (_a = _character_misc_feature__WEBPACK_IMPORTED_MODULE_5__["Feature"].loadFeature(trait, feature.type)) === null || _a === void 0 ? void 0 : _a.loadJSON(feature);
        });
        if (data.type.includes("_container")) {
            return data.children;
        }
    }
};
GCSJSON = GCSJSON_1 = __decorate([
    Object(_serializer__WEBPACK_IMPORTED_MODULE_0__["registerDataType"])(GCSJSON_1),
    __metadata("design:paramtypes", [])
], GCSJSON);



/***/ }),

/***/ "./src/character/serialization/serializer.ts":
/*!***************************************************!*\
  !*** ./src/character/serialization/serializer.ts ***!
  \***************************************************/
/*! exports provided: Serializer, registerDataType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Serializer", function() { return Serializer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerDataType", function() { return registerDataType; });
class Serializer {
    constructor() {
    }
}
Serializer.dataTypes = new Set();
function registerDataType(type) {
    Serializer.dataTypes.add(type);
    return this;
}


/***/ }),

/***/ "./src/character/skill.ts":
/*!********************************!*\
  !*** ./src/character/skill.ts ***!
  \********************************/
/*! exports provided: SkillList, SkillLike, Skill, SkillDefault, Difficulty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkillList", function() { return SkillList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkillLike", function() { return SkillLike; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Skill", function() { return Skill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkillDefault", function() { return SkillDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Difficulty", function() { return Difficulty; });
/* harmony import */ var _character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./character */ "./src/character/character.ts");
/* harmony import */ var _misc_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc/list */ "./src/character/misc/list.ts");
/* harmony import */ var _misc_feature__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./misc/feature */ "./src/character/misc/feature.ts");
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");
/* harmony import */ var _misc_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./misc/default */ "./src/character/misc/default.ts");
/* harmony import */ var _gcs_gcs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @gcs/gcs */ "./src/gcs/gcs.ts");






class SkillList extends _misc_list__WEBPACK_IMPORTED_MODULE_1__["List"] {
    constructor(character) {
        super(character);
        this.populator = Skill;
        this.loader = this.character.serializer.mapSkill;
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
        return SkillLike.calculateLevel(this.difficulty, this.points, this.list.character.attributes(this.signature), this.defaultedFrom, this.getBonus(), this.list.character.encumbranceLevel(), this.encumbrancePenaltyMultiple);
    }
    static calculateLevel(difficulty, points, base = 10, defaultedFrom, bonus = 0, encumbranceLevel = 0, encPenaltyMult = 1) {
        let relativeLevel = SkillLike.getBaseRelativeLevel(difficulty);
        let level = base;
        if (level !== Number.NEGATIVE_INFINITY) {
            if (difficulty === Difficulty.wildcard) {
                points /= 3;
            }
            else {
                if (defaultedFrom && defaultedFrom.points > 0) {
                    points += defaultedFrom.points;
                }
            }
            if (points > 0) {
                relativeLevel = SkillLike.calculateRelativeLevel(points, relativeLevel);
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
    static getBestDefaultWithPoints(character, skill, defaults) {
        let best = SkillLike.getBestDefault(character, defaults);
        if (best !== null) {
            let baseLine = character.attributes(skill.signature) + SkillLike.getBaseRelativeLevel(skill.difficulty);
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
        return this.list.character.featureList.getFeaturesByType(_gcs_gcs__WEBPACK_IMPORTED_MODULE_5__["FeatureType"].skillBonus).reduce((prev, cur) => {
            if (cur instanceof _misc_feature__WEBPACK_IMPORTED_MODULE_2__["SkillBonus"] && cur.type === _gcs_gcs__WEBPACK_IMPORTED_MODULE_5__["FeatureType"].skillBonus && cur.isApplicableTo(this) && cur.ownerIsActive()) {
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
class SkillDefault extends _misc_default__WEBPACK_IMPORTED_MODULE_4__["Default"] {
    constructor(skill) {
        super(skill);
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
    toJSON() {
    }
    loadJSON(data) {
        data = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_3__["objectify"])(data);
        super.loadJSON(data);
        return this;
    }
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
/* harmony import */ var _skill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./skill */ "./src/character/skill.ts");
/* harmony import */ var _misc_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc/list */ "./src/character/misc/list.ts");
/* harmony import */ var _character__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./character */ "./src/character/character.ts");



class SpellList extends _misc_list__WEBPACK_IMPORTED_MODULE_1__["List"] {
    constructor(character) {
        super(character);
        this.populator = Spell;
        this.loader = this.character.serializer.mapSpell;
    }
}
class Spell extends _skill__WEBPACK_IMPORTED_MODULE_0__["SkillLike"] {
    constructor(list) {
        super(list);
        this.version = 1;
        this.tag = "spell";
        this.difficulty = _skill__WEBPACK_IMPORTED_MODULE_0__["Difficulty"].hard;
        this.signature = _character__WEBPACK_IMPORTED_MODULE_2__["Signature"].IQ;
        this.defaultedFrom = null;
        this.encumbrancePenaltyMultiple = null;
        this.list = list;
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
/* harmony import */ var _skill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./skill */ "./src/character/skill.ts");

class Technique extends _skill__WEBPACK_IMPORTED_MODULE_0__["Skill"] {
    constructor(list) {
        super(list);
        this.tag = "technique";
        this.difficulty = _skill__WEBPACK_IMPORTED_MODULE_0__["Difficulty"].average;
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
                if (this.difficulty === _skill__WEBPACK_IMPORTED_MODULE_0__["Difficulty"].hard) {
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
/* harmony import */ var _utils_json_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @utils/json_utils */ "./src/utils/json_utils.ts");



class TraitList extends _misc_list__WEBPACK_IMPORTED_MODULE_1__["List"] {
    constructor(character) {
        super(character);
        this.populator = Trait;
        this.loader = this.character.serializer.mapTrait;
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
            modifiedBasePoints += leveledPoints;
        }
        return TraitModifier.applyRounding((modifiedBasePoints * multiplier), Boolean(trait.roundDown));
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
        object = Object(_utils_json_utils__WEBPACK_IMPORTED_MODULE_2__["objectify"])(object);
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
/*! exports provided: Character, Skill, Trait, Spell, Technique, Equipment, Serializer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _character_character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./character/character */ "./src/character/character.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Character", function() { return _character_character__WEBPACK_IMPORTED_MODULE_0__["Character"]; });

/* harmony import */ var _character_skill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./character/skill */ "./src/character/skill.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Skill", function() { return _character_skill__WEBPACK_IMPORTED_MODULE_1__["Skill"]; });

/* harmony import */ var _character_trait__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./character/trait */ "./src/character/trait.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Trait", function() { return _character_trait__WEBPACK_IMPORTED_MODULE_2__["Trait"]; });

/* harmony import */ var _character_spell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./character/spell */ "./src/character/spell.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Spell", function() { return _character_spell__WEBPACK_IMPORTED_MODULE_3__["Spell"]; });

/* harmony import */ var _character_technique__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./character/technique */ "./src/character/technique.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Technique", function() { return _character_technique__WEBPACK_IMPORTED_MODULE_4__["Technique"]; });

/* harmony import */ var _character_equipment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./character/equipment */ "./src/character/equipment.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Equipment", function() { return _character_equipment__WEBPACK_IMPORTED_MODULE_5__["Equipment"]; });

/* harmony import */ var _character_serialization_serializer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./character/serialization/serializer */ "./src/character/serialization/serializer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Serializer", function() { return _character_serialization_serializer__WEBPACK_IMPORTED_MODULE_6__["Serializer"]; });











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
        strength_mod: character.ST.getMod(),
        strength_points: character.ST.pointsSpent(),
        dexterity_mod: character.DX.getMod(),
        dexterity_points: character.DX.pointsSpent(),
        intelligence_mod: character.IQ.getMod(),
        intelligence_points: character.IQ.pointsSpent(),
        health_mod: character.HT.getMod(),
        health_points: character.HT.pointsSpent(),
        perception_mod: character.Per.getMod(),
        perception_points: character.Per.pointsSpent(),
        willpower_mod: character.Will.getMod(),
        willpower_points: character.Will.pointsSpent(),
        basic_speed_mod: character.Speed.getMod(),
        basic_speed_points: character.Speed.pointsSpent(),
        basic_move_mod: character.Move.getMod(),
        basic_move_points: character.Move.pointsSpent(),
        hit_points_max_mod: character.HP.getMod(),
        hit_points_max_points: character.HP.pointsSpent(),
        fatigue_points_mod: character.FP.getMod(),
        fatigue_points_points: character.FP.pointsSpent(),
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
//# sourceMappingURL=lib-min.js.map