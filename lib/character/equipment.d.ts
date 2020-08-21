import { List, ListItem } from "./misc/list";
import { Modifier, Modifiable } from "./misc/modifier";
import { Character } from "./character";
export declare class EquipmentList extends List<Equipment> {
    constructor(character: Character);
    populator(data: any): any;
    totalWeight({ carriedOnly }?: {
        carriedOnly?: boolean;
    }): number;
    totalValue({ carriedOnly }?: {
        carriedOnly?: boolean;
    }): number;
}
export declare class Equipment extends ListItem<Equipment> {
    static keys: string[];
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
    appliesSkillEncumbrancePenalty: boolean;
    modifiers: Set<EquipmentModifier<Equipment>>;
    hasLevels: boolean;
    constructor(list: List<Equipment>, keys?: string[]);
    addModifier(): EquipmentModifier<Equipment>;
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
export declare class EquipmentModifier<T extends Modifiable> extends Modifier<T> {
    static keys: string[];
    tag: string;
    version: number;
    static minCF: number;
    cost: string;
    costType: EquipmentModifierValueType;
    weight: string;
    weightType: EquipmentModifierWeightType;
    constructor(equipment: T, keys?: string[]);
    static determineWeightType(type: string): EquipmentModifierWeightValueType;
    static determineCostType(type: string): EquipmentModifierCostValueType;
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
