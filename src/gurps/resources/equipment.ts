import { character } from '../utils';
import { Entity, Data } from "@app/entity";
import { Character, CharacterData } from "./character";
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
export class Equipment extends Entity<CharacterData, EquipmentData> {
    static type = "equipment" as const
    static version = 1 as const
    character: Character
    constructor(character, equipment, ...args) {
        super(character, equipment, ...args);
        this.character = character instanceof Character ? character : new Character(character);
    }
    get children() {
        return this.getValue()
            ?.children
            ?.map(({ id }) => this.character.embedded[id])
            ?.filter((e): e is Equipment => e instanceof Equipment)
            ?? []
    }
    get equipped() {
        return this.enabled
    }
    get quantity() {
        return this.getValue()?.quantity ?? 1;
    }
    get value() {
        return this.getValue()?.value ?? 0;
    }
    get weight() {
        return this.getValue()?.weight ?? 0;
    }
    get eValue() {
        return this.quantity * this.value;
    }
    get eWeight() {
        return this.quantity * this.weight
    }
    get containedValue(): number {
        return this.children.filter((e) => e.enabled === true).reduce((weight, item) => weight + item.containedValue, this.eValue);
    }
    getContainedValue() { return this.containedValue }
    get containedWeight(): number {
        return this.children.filter((e) => e.enabled === true).reduce((weight, item) => weight + item.containedWeight, this.eWeight);
    }
    getContainedWeight() { return this.containedWeight }
    process() {
        const pd = {
            containedWeight: this.containedWeight,
            containedValue: this.containedValue
        }
        return { ...super.process(), ...pd }
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