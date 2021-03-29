import type { Data } from "@app/entity";
import { SkillLike, SkillLikeKeys, SkillDefault } from "./skill";
import { SkillDifficulty } from "./skill";
export type TechniqueDifficulty = SkillDifficulty.Average | SkillDifficulty.Hard;
export interface TechniqueData extends Data, SkillLikeKeys {
    type: "technique"
    version: 1
    difficulty: TechniqueDifficulty
    limit?: number
    default: SkillDefault
    defaults: undefined
}

export class Technique extends SkillLike<TechniqueData> {
    static type = 'technique' as const
    static version = 1 as const
    constructor(technique, character) {
        super(technique, character);
    }
    get defaults() {
        const df = this.getValue()?.default;
        return df ? [df] : []
    }
    get level() {
        const value = this.getValue();
        const bonus = this.bonus
        const baseLevel = this.getHighestDefault();
        return calculateTechniqueLevel(
            value,
            baseLevel,
            bonus
        );
    }
}
export function calculateTechniqueLevel(
    technique: TechniqueData,
    baseLevel: number = 10,
    bonus: number = 0,
) {
    let { points, limit } = technique
    let relativeLevel = 0;
    let level = baseLevel
    if (level) {
        let baseLevel = level;
        if (technique.difficulty === SkillDifficulty.Hard) {
            points--;
        }
        if (points > 0) {
            relativeLevel = points
        }
        if (level) {
            level += bonus
            level += relativeLevel;
        }
        if (typeof limit === "number") {
            let max = baseLevel - limit;
            if (level > max) {
                relativeLevel -= level - max;
                level = max;
            }
        }
        return level + technique.mod
    } else {
        return NaN
    }
}