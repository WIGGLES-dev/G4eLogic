import { ListItem } from "@character/misc/list";
import { Feature, FeatureCore } from "../feature";

export class AttributeBonus extends FeatureCore {
    static keys = ["attribute"]

    attribute: string = "ST"

    constructor(feature: Feature) {
        super(feature, AttributeBonus.keys);
    }

    validFor(target: ListItem) { return true }
}