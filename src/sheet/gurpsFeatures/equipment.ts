import { createStore } from "@datorama/akita";
import {
    FeatureData,
    featureData,
    FeatureType,
    Feature,
    Sheet
} from "@internal";
import { Observable, Observer, Subscriber } from "rxjs";
import { map } from "rxjs/operators";

export interface EquipmentData extends FeatureData<FeatureType.Equipment> {
    quantity: number
    name: string
    weight: number
    value: number
    storedLocation: string
    uses?: number
    maxUses?: number
    ignoreForSkills?: boolean
}
export const equipmentData = (): EquipmentData => ({
    ...featureData(),
    type: FeatureType.Equipment,
    name: "",
    weight: 1,
    value: 0,
    storedLocation: "carried",
    quantity: 1
})

export class Equipment extends Feature<FeatureType.Equipment, EquipmentData> {
    type: FeatureType.Equipment = FeatureType.Equipment

    constructor(id: string) {
        super(id)
    }
    get equipped$(): Observable<boolean> { return this.instance$.pipe(map(data => !data.keys.disabled)) }
    get value() { return (this.keys.value || null) * (this.keys.quantity || 1) }
    get extendedValue(): number {
        const { quantity, value } = this.keys;
        const extendedValue = quantity * value;
        const children = this.children
        if (!children) return extendedValue
        return children.filter((child): child is Equipment => child instanceof Equipment).reduce(
            (value, child) => value + (child.extendedValue || null), 0
        ) + extendedValue
    }
    get extendedValue$() { return this.instance$.pipe(map(item => item.extendedValue)) }
    get weight() { return (this.keys.weight || null) * (this.keys.quantity || 1) }
    get extendedWeight(): number {
        const { quantity, weight } = this.keys;
        const extendedWeight = quantity * weight;
        const children = this.children
        if (!children) return extendedWeight
        return children.filter((child): child is Equipment => child instanceof Equipment).reduce(
            (value, child) => value + (child.extendedWeight || null), 0
        ) + extendedWeight
    }
    get extendedWeight$() { return this.instance$.pipe(map(item => item.extendedWeight)) }

    defaultData() { return equipmentData() }
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
