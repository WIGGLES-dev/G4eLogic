import { Feature } from "@sheet/feature";
import { defaultEquipmentData, EquipmentData, FeatureType } from "@sheet/keys";

export class Equipment extends Feature<EquipmentData> {
    get type() { return FeatureType.Equipment }
    constructor(id: string) {
        super(id)
    }
    defaultData() { return this._wrapFeatureData(defaultEquipmentData()) }
}