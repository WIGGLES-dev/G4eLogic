import { List, ListItem } from "./misc/list";
import { Modifier, Modifiable } from "./misc/modifier";
import { Character } from "./character";
import { json } from "../utils/json_utils";
export declare class ItemList extends List<Item> {
    class: typeof Item;
    constructor(character: Character);
}
export declare class Item extends ListItem<Item> {
    tag: string;
    description: string;
    equipped: boolean;
    techLevel: string;
    legalityClass: string;
    quantity: number;
    weight: number;
    value: number;
    containedWeightReduction: string;
    modifiers: Set<EquipmentModifier<Item>>;
    constructor(list: List<Item>);
    private childrenWeight;
    private childrenValue;
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
    toJSON(): {};
    loadJSON(object: string | json): this;
}
declare class EquipmentModifier<T extends Modifiable> extends Modifier<T> {
    static nodeName: string;
    static minCF: number;
    cost: string;
    costType: EquipmentModifierValueType;
    weight: string;
    weightType: EquipmentModifierWeightType;
    constructor(item: T);
    static determineWeightType(type: string): EquipmentModifierWeightValueType;
    static determineCostType(type: string): EquipmentModifierCostValueType;
    toJSON(): void;
    loadJSON(object: string | json): this;
}
declare enum EquipmentModifierWeightType {
    originalWeight = "to original weight",
    baseWeight = "to base weight",
    finalBaseWeight = "to final base weight",
    finalWeight = "to final weight"
}
declare enum EquipmentModifierWeightValueType {
    addition = "+",
    percentageAdder = "%",
    percentageMultiplier = 1,
    multiplier = 0
}
declare enum EquipmentModifierValueType {
    originalCost = "to original cost",
    baseCost = "to base cost",
    finalBaseCost = "to final base cost",
    finalCost = "to final cost"
}
declare enum EquipmentModifierCostValueType {
    addition = "+",
    percentage = "%",
    multiplier = "x",
    cf = "cf"
}
export {};
