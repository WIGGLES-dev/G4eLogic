import { Entity, Data } from "@app/entity";
import { CharacterData } from "./character";
export interface EquipmentData extends Data {
    type: typeof Equipment["type"]
    version: typeof Equipment["version"]
    disabled: boolean
    quantity: number
    weight: number
    value: number
    location: string
    uses?: number
    maxUses?: number
    ignoreForSkills?: boolean
}
export class Equipment extends Entity<EquipmentData, CharacterData> {
    static type = "equipment" as const
    static version = 1 as const
    constructor(value, root) {
        super(value, root);
    }
    get equipped() {
        return this.enabled
    }
    get quantity() {
        return this.getValue()?.quantity;
    }
    get value() {
        return this.getValue()?.value;
    }
    get weight() {
        return this.getValue()?.weight;
    }
    get eValue() {
        return this.quantity * this.value;
    }
    get eWeight() {
        return this.quantity * this.weight
    }
    get containedValue() {
        const children = Object.values(this.getEmbeds())
            .filter(e => e.type === "equipment" && e.enabled)
            .map(e => new Equipment(e.getValue(), this.root))
        return children.reduce((weight, item) => weight + item.containedValue, 0) + this.eValue
    }
    getContainedValue() { return this.containedValue }
    get containedWeight() {
        const children = Object.values(this.getEmbeds())
            .filter(e => e.type === "equipment" && e.enabled)
            .map(e => new Equipment(e.getValue(), this.root))
        return children.reduce((weight, item) => weight + item.eWeight, 0) + this.eWeight
    }
    getContainedWeight() { return this.containedWeight }
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