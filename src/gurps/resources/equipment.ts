import { transaction } from "@datorama/akita";
import {
    Data,
    each,
    Resource,
    AutoSubscriber
} from "@internal";
import { Observable, combineLatest, from } from "rxjs";
import { expand, map, mergeAll, mergeMap, mergeScan, reduce, scan } from "rxjs/operators";

export interface EquipmentData extends Data {
    type: typeof Equipment["type"]
    version: typeof Equipment["version"]
    disabled: boolean
    quantity: number
    weight: number
    value: number
    storedLocation: string
    uses?: number
    maxUses?: number
    ignoreForSkills?: boolean
}
export class Equipment extends Resource<EquipmentData> {
    static type = "equipment" as const
    static version = 1 as const
    constructor(identifier: Equipment["identity"]) {
        super(identifier);
    }
    selectEquipped() { return this.selectEnabled() }
    equip() { }
    unequip() { }
    selectValue() { return this.selectKeys().pipe(map(k => k.value * k.quantity)) }
    selectExtendedValue(): Observable<number> {
        const value$ = this.selectValue();
        const children$ = this.selectChildren(this.type, this.class);
        const extendedValue$ = children$.pipe(
            expand(each(child => child.selectExtendedValue())),
            mergeAll()
        );
        const branch$ = combineLatest([value$, extendedValue$]);
        return branch$.pipe(
            map(([value, eValue]) => value + eValue)
        )
    }
    selectWeight() { return this.selectKeys().pipe(map(k => k.weight * k.quantity)) }
    selectExtendedWeight(): Observable<number> {
        const weight$ = this.selectWeight();
        const children$ = this.selectChildren(this.type, this.class);
        const extendedWeight$ = children$.pipe(
            expand(each(child => child.selectExtendedWeight())),
            mergeAll()
        )
        const branch$ = combineLatest([weight$, extendedWeight$]);
        return branch$.pipe(
            map(([weight, eWeight]) => weight + eWeight)
        )
    }
    @transaction()
    moveToLocation(location: string) {
        this.set({
            storedLocation: location
        });
        const children = AutoSubscriber.get(this.selectChildren(this.type, this.class))
        children.forEach(child => {
            child.moveToLocation(location)
        });
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
