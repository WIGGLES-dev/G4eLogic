import { ListItem } from "@character/misc/list";
import { Feature, FeatureCore } from "../feature";

import { stringCompare, StringCompare } from "@utils/string_utils";
import { SkillLike } from "@character/skill/skill";

export class SkillBonus extends FeatureCore {
    static keys = ["nameCompareType", "name", "specializationCompareType", "specialization", "categoryCompareType", "category"]

    nameCompareType: StringCompare = StringCompare.is
    name: string

    specializationCompareType: StringCompare = StringCompare.is
    specialization: string

    categoryCompareType: StringCompare = StringCompare.is
    category: string

    constructor(feature: Feature) {
        super(feature, SkillBonus.keys);
    }

    validFor(target: ListItem) {
        if (!(target instanceof SkillLike)) return false

        let nameCompare = true;
        let specializationCompare = true;
        let categoryCompare = true;

        if (this.nameCompareType) nameCompare = stringCompare(this.name, target.name, this.nameCompareType);
        if (this.specializationCompareType) specializationCompare = stringCompare(this.specialization, target.specialization, this.specializationCompareType);

        return nameCompare && specializationCompare && categoryCompare
    }
}