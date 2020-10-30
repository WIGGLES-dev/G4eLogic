import { SkillDefault, SkillData, SkillDifficulty } from "../model";

interface TechniqueData extends SkillData {
    default: SkillDefault
    limit: number

    defaults: undefined
}

export type TehchniqueDifficulty = SkillDifficulty.Average | SkillDifficulty.Hard
export function calculateTechniqueLevel(
    technique: TechniqueData,
    baseLevel: number = 10,
    bonus: number = 0,
    mod: number = 0
) {
    if (this.default.getMatches()?.highest?.points === 0) return NaN
    let points = technique.points;
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
        if (typeof this.limit === "number") {
            let max = baseLevel + this.limit;
            if (level > max) {
                relativeLevel -= level - max;
                level = max;
            }
        }
        return level + mod
    } else {
        return NaN
    }
}
