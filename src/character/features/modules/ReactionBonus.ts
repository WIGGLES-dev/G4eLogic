import { ListItem } from "@character/misc/list";
import { Feature, FeatureCore } from "../feature";

export class ReactionBonus extends FeatureCore {
    static keys = []
    constructor(feature: Feature) {
        super(feature, ReactionBonus.keys)
    }

    validFor(target: ListItem) { return true }
}