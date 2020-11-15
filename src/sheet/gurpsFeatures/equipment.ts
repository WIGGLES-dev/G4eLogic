import {
    FeatureData,
    featureData,
    FeatureType,
    Feature,
    Sheet
} from "@internal";
import { Observable, Observer, Subscriber } from "rxjs";
import { map } from "rxjs/operators";

export interface EquipmentData extends FeatureData {
    type: FeatureType.Equipment
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
    type = FeatureType.Equipment as FeatureType.Equipment
    constructor(id: string, sheet?: Sheet) {
        super(id, sheet)
    }
    get equipped$(): Observable<boolean> { return this.instance$.pipe(map(data => !data.keys.disabled)) }
    get extendedValue$() { return this.instance$.pipe(map(item => item.extendedValue)) }
    get extendedValue() {
        const { quantity, value } = this.keys;
        const extendedValue = quantity * value;
        const children = this.children
        if (!children) return extendedValue
        return children.reduce(
            (value, child) => value + (child instanceof Equipment ? child.extendedValue : 0), 0
        ) + extendedValue
    }
    get extendedWeight$() { return this.instance$.pipe(map(item => item.extendedWeight)) }
    get extendedWeight() {
        const { quantity, weight } = this.keys;
        const extendedWeight = quantity * weight;
        const children = this.children
        if (!children) return extendedWeight
        return children.reduce(
            (value, child) => value + (child instanceof Equipment ? child.extendedWeight : 0), 0
        ) + extendedWeight
    }
    defaultData() { return equipmentData() }
}