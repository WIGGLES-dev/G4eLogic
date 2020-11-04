import { Feature } from "@sheet/feature"
import { defaultTraitData, FeatureType, TraitData } from "@sheet/keys"

export class Trait extends Feature<TraitData> {
    get type() { return FeatureType.Trait }
    constructor(id: string) {
        super(id)
    }
    defaultData() { return this._wrapFeatureData(defaultTraitData()) }
}