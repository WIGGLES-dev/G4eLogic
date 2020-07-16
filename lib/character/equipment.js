"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = exports.ItemList = void 0;
const list_1 = require("./misc/list");
const modifier_1 = require("./misc/modifier");
const json_utils_1 = require("../utils/json_utils");
class ItemList extends list_1.List {
    constructor(character) {
        super(character);
        this.class = Item;
    }
}
exports.ItemList = ItemList;
class Item extends list_1.ListItem {
    constructor(list) {
        super(list);
        this.tag = "equipment";
        this.modifiers = new Set();
    }
    childrenWeight() {
        return 0;
    }
    childrenValue() {
        return 0;
    }
    extendedWeight() {
        const adjustedWeight = this.adjustedWeight();
        const multiplyBy = this.containedBy && this.containedBy.containedWeightReduction ? 1 - modifier_1.Modifier.extractValue(this.containedBy.containedWeightReduction) / 100 : 1;
        if (this.isContainer()) {
            return (this.childrenWeight() + adjustedWeight) * multiplyBy;
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
        let cost = Item.processNonCFStep(EquipmentModifierValueType.originalCost, value, modifiers);
        let cf = 0;
        let count = 0;
        this.modifiers.forEach(modifier => {
            if (modifier.enabled && modifier.costType === EquipmentModifierValueType.baseCost) {
                let adj = modifier.cost;
                let mvt = EquipmentModifier.determineCostType(modifier.cost);
                let amt = modifier_1.Modifier.extractValue(adj);
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
        cost = Item.processNonCFStep(EquipmentModifierValueType.finalBaseCost, cost, modifiers);
        cost = Item.processNonCFStep(EquipmentModifierValueType.finalCost, cost, modifiers);
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
                let amt = modifier_1.Modifier.extractValue(adj);
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
                let amt = modifier_1.Modifier.extractValue(adj);
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
        weight = Item.processMultiplyAddWeightStep(EquipmentModifierWeightType.baseWeight, weight, modifiers);
        weight = Item.processMultiplyAddWeightStep(EquipmentModifierWeightType.finalBaseWeight, weight, modifiers);
        weight = Item.processMultiplyAddWeightStep(EquipmentModifierWeightType.finalWeight, weight, modifiers);
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
    toJSON() {
        return {};
    }
    loadJSON(object) {
        object = json_utils_1.objectify(object);
        super.loadJSON(object);
        function mapItem(object, item) {
            var _a;
            (_a = object === null || object === void 0 ? void 0 : object.modifiers) === null || _a === void 0 ? void 0 : _a.forEach((modifier) => item.modifiers.add(new EquipmentModifier(item).loadJSON(modifier)));
            item.description = object.description;
            item.equipped = object.equipped;
            item.quantity = object.quantity;
            item.value = object.value;
            item.techLevel = object.tech_level;
            item.legalityClass = object.legality_class;
        }
        function loadSubElements(object, parent) {
            object.children.forEach((object) => {
                const subElement = parent.list.addListItem().loadJSON(object);
                subElement.containedBy = parent;
                parent.children.add(subElement);
            });
            return parent;
        }
        mapItem(object, this);
        if (object.type.includes("_container")) {
            this.canContainChildren = true;
            loadSubElements(object, this);
        }
        return this;
    }
}
exports.Item = Item;
class EquipmentModifier extends modifier_1.Modifier {
    constructor(item) {
        super(item);
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
    loadJSON(object) {
        object = json_utils_1.objectify(object);
        super.loadJSON(object);
        this.cost = object.cost;
        this.weight = object.weight;
        this.costType = object.cost_type;
        this.weightType = object.weightType;
        return this;
    }
}
EquipmentModifier.nodeName = "eqp_modifier";
EquipmentModifier.minCF = -0.8;
var EquipmentModifierWeightType;
(function (EquipmentModifierWeightType) {
    EquipmentModifierWeightType["originalWeight"] = "to original weight";
    EquipmentModifierWeightType["baseWeight"] = "to base weight";
    EquipmentModifierWeightType["finalBaseWeight"] = "to final base weight";
    EquipmentModifierWeightType["finalWeight"] = "to final weight";
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
    EquipmentModifierValueType["originalCost"] = "to original cost";
    EquipmentModifierValueType["baseCost"] = "to base cost";
    EquipmentModifierValueType["finalBaseCost"] = "to final base cost";
    EquipmentModifierValueType["finalCost"] = "to final cost";
})(EquipmentModifierValueType || (EquipmentModifierValueType = {}));
var EquipmentModifierCostValueType;
(function (EquipmentModifierCostValueType) {
    EquipmentModifierCostValueType["addition"] = "+";
    EquipmentModifierCostValueType["percentage"] = "%";
    EquipmentModifierCostValueType["multiplier"] = "x";
    EquipmentModifierCostValueType["cf"] = "cf";
})(EquipmentModifierCostValueType || (EquipmentModifierCostValueType = {}));
//# sourceMappingURL=equipment.js.map