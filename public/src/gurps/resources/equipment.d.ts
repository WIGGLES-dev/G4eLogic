import { Data, Resource } from "@internal";
import { Observable } from "rxjs";
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
export declare class Equipment extends Resource<EquipmentData> {
    static type: "equipment";
    static version: 1;
    constructor(state: Equipment["state"]);
    selectEquipped(): import("rxdeep").State<boolean>;
    equip(): boolean;
    unequip(): boolean;
    get quantity$(): import("rxdeep").State<number>;
    get value$(): import("rxdeep").State<number>;
    get eValue$(): Observable<number>;
    selectExtendedValue(): Observable<number>;
    get weight$(): import("rxdeep").State<number>;
    get eWeight$(): Observable<number>;
    selectExtendedWeight(): Observable<number>;
    moveToLocation(location: string): void;
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
