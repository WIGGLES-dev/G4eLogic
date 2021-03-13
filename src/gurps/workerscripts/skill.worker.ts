import { Data, FeatureBonus, FeatureBonusType, StringCompare, Mask, CharacterData } from "@internal";
import * as Comlink from "comlink";
import { Character } from "./character.worker";
export interface SkillLikeKeys {
    points: number
    name: string
    specialization?: string
    techLevel?: string
    difficulty: SkillDifficulty,
    signature: string,
    mod: number
    encumbrancePenaltyMultiple: number
    defaults: SkillDefault[]
}
export interface SkillData extends Data, SkillLikeKeys {
    type: "skill"
    version: 1
}
export enum SkillDifficulty {
    Easy = "E",
    Average = "A",
    Hard = "H",
    VeryHard = "VH",
    Wildcard = "W"
}
export interface SkillDefault {
    type: "Skill" | string,
    name: string,
    specialization?: string
    modifier: number
}
export interface SkillBonus extends FeatureBonus {
    type: FeatureBonusType.Skill
    nameCompare: StringCompare
    name: string
    specializationCompare: StringCompare
    specialization: string
    categoryCompare: StringCompare
    category: string
}
export class Skill extends Mask<SkillData, CharacterData> {
    character: Character
    constructor(value: SkillData, root: CharacterData) {
        super(value, root);
        this.character = new Character(root);
    }
    get baseRelativeLevel() {
        switch (this.value.difficulty) {
            case SkillDifficulty.Easy:
                return 0
            case SkillDifficulty.Average:
                return -1
            case SkillDifficulty.Hard:
                return -2
            case SkillDifficulty.VeryHard:
                return -3
            case SkillDifficulty.Wildcard:
                return -3
        }
    }
    get relativeLevel() {
        let relativeLevel = this.baseRelativeLevel
        const {
            points = 0
        } = this.value;
        if (points === 1) {

        } else if (points < 4) {
            relativeLevel++;
        } else {
            relativeLevel += 1 + points / 4;
        }
        return relativeLevel
    }
    get level() {
        return 10
    }
    test(message) {
        console.log(`I'm testing this worker and it will log ${message}`)
    }
}
Comlink.expose(Skill);