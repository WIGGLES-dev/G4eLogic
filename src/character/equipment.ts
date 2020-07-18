import { List, ListItem } from "./misc/list";
import { Modifier, Modifiable } from "./misc/modifier";
import { Character, Featurable } from "./character";
import { Feature, FeatureType } from "./misc/feature";
import { Skill } from "./skill";
import { Trait } from "./trait";
import { objectify, json, isArray } from "../utils/json_utils";

export class EquipmentList extends List<Equipment> {
    populator = Equipment

    constructor(character: Character) {
        super(character);
    }
}


export class Equipment extends ListItem<Equipment> {
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

    modifiers: Set<EquipmentModifier<Equipment>>

    hasLevels = false

    constructor(list: List<Equipment>) {
        super(list);
        this.modifiers = new Set();
    }

    getLevel(): number { return null }
    private childrenWeight(): number | null {
        return 0
    }
    private childrenValue(): number | null {
        return 0
    }

    extendedWeight() {
        const adjustedWeight = this.adjustedWeight();
        const multiplyBy = this.containedBy && this.containedBy.containedWeightReduction ? 1 - Modifier.extractValue(this.containedBy.containedWeightReduction) / 100 : 1;

        if (this.isContainer()) {
            return (this.childrenWeight() + adjustedWeight) * multiplyBy;
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
        cost = Equipment.processNonCFStep(EquipmentModifierValueType.finalBaseCost, cost, modifiers)
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

    static mapEquipment(data: gcs.Equipment, equipment: Equipment): Equipment {
        isArray(data?.modifiers)?.forEach((modifier: json) => equipment.modifiers.add(new EquipmentModifier(equipment).loadJSON(modifier)));
        equipment.description = data.description;
        equipment.equipped = data.equipped;
        equipment.quantity = data.quantity;
        equipment.value = data.value;
        equipment.techLevel = data.tech_level;
        equipment.legalityClass = data.legality_class;
        return equipment
    }
    toJSON() {
        return {}
    }
    loadJSON(json: string | json) {
        const data = objectify<gcs.Equipment>(json);
        super.loadJSON(json);
        Equipment.mapEquipment(data, this);
        if (data.type.includes("_container")) {
            this.canContainChildren = true;
            this.list.addListItem(this);
            this.loadChildren(isArray(data?.children), this, Equipment.mapEquipment);
        }
        return this
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

class EquipmentModifier<T extends Modifiable> extends Modifier<T> {
    static nodeName = "eqp_modifier"
    static minCF = -0.8

    cost: string
    costType: EquipmentModifierValueType
    weight: string
    weightType: EquipmentModifierWeightType

    constructor(equipment: T) {
        super(equipment);
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

    toJSON() {

    }
    loadJSON(json: string | json) {
        const data = objectify<any>(json);
        super.loadJSON(json);
        this.cost = data.cost;
        this.weight = data.weight;
        this.costType = data.cost_type;
        this.weightType = data.weightType;
        return this
    }
}

enum EquipmentModifierWeightType {
    originalWeight = "to original weight",
    baseWeight = "to base weight",
    finalBaseWeight = "to final base weight",
    finalWeight = "to final weight",
}

enum EquipmentModifierWeightValueType {
    addition = "+",
    percentageAdder = "%",
    percentageMultiplier = 1,
    multiplier = 0
}

enum EquipmentModifierValueType {
    originalCost = "to original cost",
    baseCost = "to base cost",
    finalBaseCost = "to final base cost",
    finalCost = "to final cost",
}

enum EquipmentModifierCostValueType {
    addition = "+",
    percentage = "%",
    multiplier = "x",
    cf = "cf"
}
