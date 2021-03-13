import {
    SkillDifficulty,
    Data,
    SkillLikeKeys,
    SkillDefault,
    SkillLike,
    staticImplements,
    GResource,
    Resource
} from "@internal";
import {
    Observable,
    from
} from 'rxjs'
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
    constructor(state: Technique["state"]) {
        super(state);
    }
    get level$(): Observable<number> {
        return from([0])
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