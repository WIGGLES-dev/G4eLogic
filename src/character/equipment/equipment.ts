import { List, ListItem } from "../misc/list";
import { Modifier, Modifiable } from "../misc/modifier";
import { Character } from "../character";
import { HitLocation } from "../locations";

export class EquipmentList extends List<Equipment> {

    constructor(character: Character) {
        super(character);
    }

    populator(data: any) {
        return new Equipment(this)
    }

    forSkillEncumbrancePenalty() {
        return this.iterTop().reduce((prev, cur) => {
            if (cur.equipped && cur.applySkillEncumbrancePenalty) prev += cur.extendedWeight();
            return prev
        }, 0)
    }

    totalWeight({ carriedOnly = true } = {}) {
        return this.iterTop().reduce((prev, cur) => {
            if (carriedOnly) {
                if (cur.equipped) prev += cur.extendedWeight();
            } else {
                prev += cur.extendedWeight();
            }
            return prev
        }, 0)
    }

    totalValue({ carriedOnly = true } = {}) {
        return this.iterTop().reduce((prev, cur) => {
            if (carriedOnly) {
                if (cur.equipped) prev += cur.extendedValue();
            } else {
                prev += cur.extendedValue()
            }
            return prev
        }, 0);
    }
}

export class Equipment extends ListItem<Equipment> {
    static keys = ["description", "equipped", "techLevel", "legalityClass", "quantity", "weight", "value", "containedWeightReduction"]
    version = 1
    tag = "equipment"

    description: string
    equipped: boolean = true
    boundLocation: HitLocation
    techLevel: string
    legalityClass: string
    quantity: number = 1
    weight: number = 0
    value: number = 0
    containedWeightReduction: string

    applySkillEncumbrancePenalty: boolean = true

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

    getAmmoSources() {
        return Array.from(this.getRecursiveChildren()).reduce((prev: Equipment[], cur: Equipment) => {
            if (cur.categories.has("Ammunition")) {
                prev = [...prev, cur]
            }
            return prev
        }, []);
    }

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
            return this.childrenWeight() + this.weight
            return this.reduceContainedWeight((this.childrenWeight() + adjustedWeight))
        } else {
            return this.weight * this.quantity
            return adjustedWeight * this.quantity
        }
    }

    extendedValue() {
        const adjustedValue = this.adjustedValue();

        if (this.isContainer()) {
            return this.childrenValue()
            // + adjustedValue
        } else {
            return this.value * this.quantity
            return adjustedValue * this.quantity
        }
    }
    getModifiers() { }
    delete() {
        if (this.boundLocation instanceof HitLocation) {
            this.boundLocation.equippedItems.delete(this);
        }
        super.delete()
    }
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
