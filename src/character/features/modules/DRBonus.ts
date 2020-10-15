import { ListItem } from "@character/misc/list";
import { Feature, FeatureCore } from "../feature";

export class DRBonus extends FeatureCore {
    static keys = ["location"]

    location: string

    constructor(feature: Feature) {
        super(feature, DRBonus.keys);
    }

    validFor(target) {
        return true
    }
}