import { Entity, Data } from "@app/entity";
import { CharacterData } from "./character";
export interface EquipmentData extends Data {
    type: typeof Equipment["type"];
    version: typeof Equipment["version"];
    disabled: boolean;
    quantity: number;
    weight: number;
    value: number;
    location: string;
    uses?: number;
    maxUses?: number;
    ignoreForSkills?: boolean;
}
export declare class Equipment extends Entity<EquipmentData, CharacterData> {
    static type: "equipment";
    static version: 1;
    constructor(value: any, root: any);
    get equipped(): boolean;
    get quantity(): number;
    get _value(): number;
    get weight(): number;
    get eValue(): number;
    get eWeight(): number;
    get containedValue(): any;
    getContainedValue(): any;
    get containedWeight(): any;
    getContainedWeight(): any;
}
export declare enum EquipmentModifierWeightType {
    originalWeight = "to_original_weight",
    baseWeight = "to_base_weight",
    finalBaseWeight = "to_final_base_weight",
    finalWeight = "to_final_weight"
}
export declare enum EquipmentModifierWeightValueType {
    addition = "+",
    percentageAdder = "%",
    percentageMultiplier = 1,
    multiplier = 0
}
export declare enum EquipmentModifierValueType {
    originalCost = "to_original_cost",
    baseCost = "to_base_cost",
    finalBaseCost = "to_final_base_cost",
    finalCost = "to_final_cost"
}
export declare enum EquipmentModifierCostValueType {
    addition = "+",
    percentage = "%",
    multiplier = "x",
    cf = "cf"
}
