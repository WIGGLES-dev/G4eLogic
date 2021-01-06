import {
    Data,
    each,
    Resource,
    AutoSubscriber,
    mapEach
} from "@internal";
import { Observable, combineLatest, from } from "rxjs";
import { expand, map, mergeAll, mergeMap, switchMap, mergeScan, reduce, scan } from "rxjs/operators";
import { GResource } from "src/sheet/resource";
import { staticImplements } from "src/utils/decorators";

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
@staticImplements<GResource<Equipment>>()
export class Equipment extends Resource<EquipmentData> {
    static type = "equipment" as const
    static version = 1 as const
    constructor(identifier: Equipment["identity"]) {
        super(identifier);
    }
    selectEquipped() { return this.enabled$ }
    equip() { }
    unequip() { }
    get quantity$() { return this.sub('quantity') }
    get value$() { return this.sub('value') }
    get eValue$() {
        return combineLatest([this.quantity$, this.value$])
            .pipe(map(([q, v]) => q * v))
    }
    selectExtendedValue(): Observable<number> {
        const children$ = this.selectChildren({
            type: this.type,
            caster: this.class,
            maxDepth: Number.POSITIVE_INFINITY
        });
        return children$.pipe(
            mapEach(e => e.eValue$),
            switchMap(values$ => combineLatest([this.eValue$, ...values$])),
            map(values => values.reduce((a, b) => a + b, 0))
        )
    }
    get weight$() { return this.sub('weight') }
    get eWeight$() {
        return combineLatest([this.quantity$, this.weight$])
            .pipe(map(([q, w]) => q * w))
    }
    selectExtendedWeight(): Observable<number> {
        const children$ = this.selectChildren({ type: this.type, caster: this.class, maxDepth: Number.POSITIVE_INFINITY });
        return children$.pipe(
            mapEach(e => e.eWeight$),
            switchMap(weights$ => combineLatest([this.eWeight$, ...weights$])),
            map(values => values.reduce((a, b) => a + b, 0))
        )
    }
    moveToLocation(location: string) {
        this.set({
            location
        });
        const children = AutoSubscriber.get(this.selectSameChildren())
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
