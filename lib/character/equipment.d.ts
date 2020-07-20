import { List, ListItem } from "./misc/list";
import { Modifier, Modifiable } from "./misc/modifier";
import { Character } from "./character";
import { json } from "@utils/json_utils";
import * as gcs from "@gcs/gcs";
export declare class EquipmentList extends List<Equipment> {
    populator: typeof Equipment;
    constructor(character: Character);
}
export declare class Equipment extends ListItem<Equipment> {
    version: number;
    tag: string;
    description: string;
    equipped: boolean;
    techLevel: string;
    legalityClass: string;
    quantity: number;
    weight: number;
    value: number;
    containedWeightReduction: string;
    modifiers: Set<EquipmentModifier<Equipment>>;
    hasLevels: boolean;
    constructor(list: List<Equipment>);
    get name(): string;
    isActive(): boolean;
    getLevel(): number;
    private childrenWeight;
    private childrenValue;
    private reduceContainedWeight;
    extendedWeight(): number;
    extendedValue(): number;
    getModifiers(): void;
    adjustedValue(): number;
    private static processNonCFStep;
    adjustedWeight(): number;
    private static processMultiplyAddWeightStep;
    static mapEquipment(data: gcs.Equipment, equipment: Equipment): Equipment;
    toJSON(): {};
    loadJSON(json: string | json): this;
    toR20(): {
        key: string;
        row_id: string;
        data: {
            name: string;
            tl: string;
            ref: string;
            legality_class: string;
            count: number;
            cost: number;
            weight: number;
            costtotal: number;
            weighttotal: number;
            notes: string;
        };
    };
}
declare class EquipmentModifier<T extends Modifiable> extends Modifier<T> {
    static nodeName: string;
    static minCF: number;
    cost: string;
    costType: EquipmentModifierValueType;
    weight: string;
    weightType: EquipmentModifierWeightType;
    constructor(equipment: T);
    static determineWeightType(type: string): EquipmentModifierWeightValueType;
    static determineCostType(type: string): EquipmentModifierCostValueType;
    toJSON(): void;
    loadJSON(json: string | json): this;
}
declare enum EquipmentModifierWeightType {
    originalWeight = "to_original_weight",
    baseWeight = "to_base_weight",
    finalBaseWeight = "to_final_base_weight",
    finalWeight = "to_final_weight"
}
declare enum EquipmentModifierWeightValueType {
    addition = "+",
    percentageAdder = "%",
    percentageMultiplier = 1,
    multiplier = 0
}
declare enum EquipmentModifierValueType {
    originalCost = "to_original_cost",
    baseCost = "to_base_cost",
    finalBaseCost = "to_final_base_cost",
    finalCost = "to_final_cost"
}
declare enum EquipmentModifierCostValueType {
    addition = "+",
    percentage = "%",
    multiplier = "x",
    cf = "cf"
}
export {};
