import { List, ListItem } from "../misc/list";
import { Modifier } from "../misc/modifier";
import { HitLocation } from "../locations";

export class EquipmentList extends List<Equipment> {
    locations: Set<string> = new Set(["carried", "other"])

    constructor(name = "equipment") {
        super(name);
    }
    populator(data: any) {
        return new Equipment(this)
    }
    itemsByLocation(location: string) { return this.rootItems().filter(item => item.location === location) }
    forSkillEncumbrancePenalty() {
        return this.rootItems().reduce((prev, cur) => {
            if (cur.equipped && cur.applySkillEncumbrancePenalty) prev += cur.extendedWeight();
            return prev
        }, 0)
    }
    totalWeight({ carriedOnly = true } = {}) {
        return this.rootItems().reduce((prev, cur) => {
            return prev + cur.extendedWeight({ equippedOnly: carriedOnly });
        }, 0)
    }
    totalValue({ carriedOnly = true } = {}) {
        return this.rootItems().reduce((prev, cur) => {
            if (carriedOnly) {
                if (cur.equipped) prev += cur.extendedValue();
            } else {
                prev += cur.extendedValue()
            }
            return prev
        }, 0);
    }
}

export class Equipment extends ListItem {
    static keys = [
        "techLevel", "legalityClass", "quantity", "uses", "maxUses",
        "weight", "value", "containedWeightReduction", "applySkillEncumbrancePenalty",
        "isAmmunition"
    ]

    disabled = true

    boundLocation: HitLocation

    #location = "carried"

    uses: number = 0
    maxUses: number = 0

    techLevel: string = ""
    legalityClass: string
    quantity: number = 1
    weight: number = 0
    value: number = 0
    containedWeightReduction: string

    applySkillEncumbrancePenalty: boolean = true
    isAmmunition: boolean = false

    modifiers: Set<EquipmentModifier> = new Set()

    hasLevels = false

    constructor(list: List<Equipment>, keys: string[] = []) {
        super(list, [...keys, ...Equipment.keys]);
    }

    get location() { return this.#location }
    set location(location) {
        if (this.#location === location) return
        this.containedBy = null;
        this.#location = location;
        this.getRecursiveChildren().forEach(child => child.#location = location);
        this.dispatch();
    }

    get equipped() { return !this.disabled }
    set equipped(value) { this.disabled = !value }

    addModifier() {
        return new EquipmentModifier(this);
    }

    get description() { return this.name }
    set description(description) { this.name = description }

    isActive() { return this.equipped }
    getLevel(): number { return null }

    getAmmoSources() {
        return Array.from(this.getRecursiveChildren()).reduce((prev: Equipment[], cur: Equipment) => {
            if (cur.isAmmunition) {
                prev = [...prev, cur]
            }
            return prev
        }, []);
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

    extendedWeight({ equippedOnly = false } = {}) {
        const adjustedWeight = this.adjustedWeight();
        const childrenWeight = [...this.children].reduce((prev, cur) => {
            return prev + cur.extendedWeight({ equippedOnly });
        }, 0);
        if (equippedOnly && !this.equipped) return 0
        return this.weight * this.quantity + childrenWeight
    }
    extendedValue() {
        const adjustedValue = this.adjustedValue();
        if (this.isContainer()) {
            return Array.from(this.getRecursiveChildren()).reduce((prev, cur) => prev + cur.value * cur.quantity, 0) + this.value
        } else {
            return this.value * this.quantity
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

    private static processNonCFStep(costType: EquipmentModifierValueType, value: number, modifiers: Set<EquipmentModifier>) {
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

    private static processMultiplyAddWeightStep(weightType: EquipmentModifierWeightType, weight: number, modifiers: Set<EquipmentModifier>) {
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

export class EquipmentModifier extends Modifier<Equipment> {
    static keys = ["cost", "costType", "weight", "weightType"]
    tag: string = "eqp_modifier"
    version: number = 1
    static minCF = -0.8

    cost: string
    costType: EquipmentModifierValueType
    weight: string
    weightType: EquipmentModifierWeightType

    techLevel = ""

    constructor(equipment: Equipment, keys: string[] = []) {
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

export enum EquipmentModifierWeightType {
    originalWeight = "to_original_weight",
    baseWeight = "to_base_weight",
    finalBaseWeight = "to_final_base_weight",
    finalWeight = "to_final_weight",
}

export enum EquipmentModifierWeightValueType {
    addition = "+",
    percentageAdder = "%",
    percentageMultiplier = 1,
    multiplier = 0
}

export enum EquipmentModifierValueType {
    originalCost = "to_original_cost",
    baseCost = "to_base_cost",
    finalBaseCost = "to_final_base_cost",
    finalCost = "to_final_cost",
}

export enum EquipmentModifierCostValueType {
    addition = "+",
    percentage = "%",
    multiplier = "x",
    cf = "cf"
}
