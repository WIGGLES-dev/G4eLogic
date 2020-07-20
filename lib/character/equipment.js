import { List, ListItem } from "./misc/list";
import { Modifier } from "./misc/modifier";
import { objectify, isArray } from "@utils/json_utils";
import { Feature } from "./misc/feature";
export class EquipmentList extends List {
    constructor(character) {
        super(character);
        this.populator = Equipment;
    }
}
export class Equipment extends ListItem {
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
            let multiplyBy = Modifier.extractValue(weightReduction) / 100;
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
                let amt = Modifier.extractValue(adj);
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
                let amt = Modifier.extractValue(adj);
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
                let amt = Modifier.extractValue(adj);
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
    static mapEquipment(data, equipment) {
        var _a, _b, _c, _d, _e, _f, _g;
        (_a = isArray(data === null || data === void 0 ? void 0 : data.modifiers)) === null || _a === void 0 ? void 0 : _a.forEach((modifier) => equipment.modifiers.add(new EquipmentModifier(equipment).loadJSON(modifier)));
        equipment.description = data.description;
        equipment.equipped = data.equipped;
        equipment.quantity = data.quantity;
        equipment.value = parseFloat(data === null || data === void 0 ? void 0 : data.value);
        equipment.weight = parseFloat((_c = (_b = data === null || data === void 0 ? void 0 : data.weight) === null || _b === void 0 ? void 0 : _b.split(" ")[0]) !== null && _c !== void 0 ? _c : "0");
        equipment.techLevel = data.tech_level;
        equipment.legalityClass = data.legality_class;
        equipment.containedWeightReduction = (_f = (_e = (_d = isArray(data === null || data === void 0 ? void 0 : data.features)) === null || _d === void 0 ? void 0 : _d.find(feature => feature.type === "contained_weight_reduction")) === null || _e === void 0 ? void 0 : _e.reduction) !== null && _f !== void 0 ? _f : null;
        (_g = data.features) === null || _g === void 0 ? void 0 : _g.forEach((feature) => {
            var _a;
            (_a = Feature.loadFeature(equipment, feature.type)) === null || _a === void 0 ? void 0 : _a.loadJSON(feature);
        });
        return equipment;
    }
    toJSON() {
        return {};
    }
    loadJSON(json) {
        const data = objectify(json);
        super.loadJSON(json);
        Equipment.mapEquipment(data, this);
        if (data.type.includes("_container")) {
            this.canContainChildren = true;
            this.list.addListItem(this);
            this.loadChildren(isArray(data === null || data === void 0 ? void 0 : data.children), this, Equipment.mapEquipment);
        }
        return this;
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
class EquipmentModifier extends Modifier {
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
        const data = objectify(json);
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
//# sourceMappingURL=equipment.js.map