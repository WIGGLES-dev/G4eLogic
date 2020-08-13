import { List, ListItem } from "./misc/list";
import { Modifier, Modifiable } from "./misc/modifier";
import { Character } from "./character";
import { objectify, json, isArray } from "@utils/json_utils";
import * as gcs from "@gcs/gcs";
import { Feature } from "./misc/feature";

export class EquipmentList extends List<Equipment> {

    constructor(character: Character) {
        super(character);
    }

    populator(data: any) {
        return new Equipment(this)
    }

    carriedWeight() {
        return this.iterTop().reduce((prev, cur) => {
            return prev + cur.extendedWeight();
        }, 0);
    }

    carriedValue() {
        return this.iterTop().reduce((prev, cur) => {
            return prev + cur.extendedValue();
        }, 0);
    }
}

export class Equipment extends ListItem<Equipment> {
    static keys = ["description", "equipped", "techLevel", "legalityClass", "quantity", "weight", "value", "containedWeightReduction"]
    version = 1
    tag = "equipment"

    description: string
    equipped: boolean
    techLevel: string
    legalityClass: string
    quantity: number
    weight: number
    value: number
    containedWeightReduction: string

    modifiers: Set<EquipmentModifier<Equipment>> = new Set()

    hasLevels = false

    constructor(list: List<Equipment>, keys: string[] = []) {
        super(list, [...keys, ...Equipment.keys]);
    }
    addModifier() {
        const modifier = new EquipmentModifier<Equipment>(this);
        this.modifiers.add(modifier)
        return modifier
    }
    get name() { return this.description }
    isActive() { return this.equipped }
    getLevel(): number { return null }

    private childrenWeight(): number | null {
        return Array.from(this.children).reduce((prev, cur) => {
            return prev += cur.findSelf().extendedWeight()
        }, 0)
    }
    private childrenValue(): number | null {
        return 0
    }

    private reduceContainedWeight(weight: number) {
        const weightReduction = this?.containedBy?.containedWeightReduction;
        if (weightReduction?.endsWith("%")) {
            let multiplyBy = Modifier.extractValue(weightReduction) / 100;
            return weight * multiplyBy
        } else if (weightReduction) {
            let subtract = parseFloat(weightReduction.split(" ")[0]);
            return weight - subtract
        } else {
            return weight
        }
    }

    extendedWeight() {
        const adjustedWeight = this.adjustedWeight();
        if (this.isContainer()) {
            return this.reduceContainedWeight((this.childrenWeight() + adjustedWeight))
        } else {
            return adjustedWeight * this.quantity
        }
    }

    extendedValue() {
        const adjustedValue = this.adjustedValue();

        if (this.isContainer()) {
            return this.childrenValue() + adjustedValue
        } else {
            return adjustedValue * this.quantity
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
                count++
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

    private static processNonCFStep(costType: EquipmentModifierValueType, value: number, modifiers: Set<EquipmentModifier<Equipment>>) {
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
                        break
                    case EquipmentModifierCostValueType.percentage:
                        percentages += amt;
                        break
                    case EquipmentModifierCostValueType.multiplier:
                        cost *= amt;
                        break
                }
            }
        });
        cost += additions;
        if (percentages !== 0) {
            cost += (value * (percentages / 100));
        }
        return cost
    }

    adjustedWeight() {
        let modifiers = this.modifiers;
        let weight = this.weight;

        let percentages = 0;
        let original = this.weight;

        modifiers.forEach(modifier => {
            if (modifier.enabled && modifier.weightType === EquipmentModifierWeightType.originalWeight) {
                let adj = modifier.weight;
                let mvt = EquipmentModifier.determineWeightType(modifier.weight)
                let amt = Modifier.extractValue(adj);
                if (mvt === EquipmentModifierWeightValueType.addition) {
                    weight += amt;
                } else {
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

        return weight
    }

    private static processMultiplyAddWeightStep(weightType: EquipmentModifierWeightType, weight: number, modifiers: Set<EquipmentModifier<Equipment>>) {
        let sum = 0;
        modifiers.forEach(modifier => {
            if (modifier.enabled && modifier.weightType === weightType) {
                let adj = modifier.weight;
                let mvt = EquipmentModifier.determineWeightType(adj);
                let fraction = 0;
                switch (mvt) {
                    case EquipmentModifierWeightValueType.multiplier:
                        weight = weight * fraction;
                        break
                    case EquipmentModifierWeightValueType.percentageMultiplier:
                        weight = weight * (fraction / 100);
                        break
                    case EquipmentModifierWeightValueType.addition:
                        weight += fraction;
                    default:
                }
            }
        });
        weight += sum;
        return weight
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
        }
    }
}

export class EquipmentModifier<T extends Modifiable> extends Modifier<T> {
    static keys = ["cost", "costType", "weight", "weightType"]
    tag: string = "eqp_modifier"
    version: number = 1
    static minCF = -0.8

    cost: string
    costType: EquipmentModifierValueType
    weight: string
    weightType: EquipmentModifierWeightType

    constructor(equipment: T, keys: string[] = []) {
        super(equipment, [...keys, ...EquipmentModifier.keys]);
    }

    static determineWeightType(type: string) {
        type = type.trim();
        if (type.endsWith("%")) {
            if (type.startsWith("x")) {
                return EquipmentModifierWeightValueType.percentageMultiplier
            }
            return EquipmentModifierWeightValueType.percentageAdder
        }
        if (type.startsWith("x") || type.endsWith("x")) {
            return EquipmentModifierWeightValueType.multiplier
        }
        return EquipmentModifierWeightValueType.addition
    }
    static determineCostType(type: string) {
        type = type.trim();
        if (type.endsWith("cf")) {
            return EquipmentModifierCostValueType.cf
        }
        if (type.endsWith("%")) {
            return EquipmentModifierCostValueType.percentage
        }
        if (type.startsWith("x") || type.endsWith("x")) {
            return EquipmentModifierCostValueType.multiplier
        }
        return EquipmentModifierCostValueType.addition
    }

}

enum EquipmentModifierWeightType {
    originalWeight = "to_original_weight",
    baseWeight = "to_base_weight",
    finalBaseWeight = "to_final_base_weight",
    finalWeight = "to_final_weight",
}

enum EquipmentModifierWeightValueType {
    addition = "+",
    percentageAdder = "%",
    percentageMultiplier = 1,
    multiplier = 0
}

enum EquipmentModifierValueType {
    originalCost = "to_original_cost",
    baseCost = "to_base_cost",
    finalBaseCost = "to_final_base_cost",
    finalCost = "to_final_cost",
}

enum EquipmentModifierCostValueType {
    addition = "+",
    percentage = "%",
    multiplier = "x",
    cf = "cf"
}
