import { Difficulty, SkillDefault, SkillLike } from "./skill";

/**
 * Pure function responsible for determining final skill level.
 * @param difficulty 
 * @param points 
 * @param base 
 * @param defaultedFrom 
 * @param bonus 
 * @param encumbranceLevel 
 * @param encPenaltyMult
 * @returns The final calculated skill level.
 */

export function calculateSkillLevel(
    difficulty: Difficulty,
    points: number,
    base: number = 10,
    defaultedFrom?: SkillDefault<SkillLike<any>>,
    bonus = 0,
    encumbranceLevel = 0,
    encPenaltyMult = 1,
    gMod = 0
) {
    let relativeLevel = SkillLike.getBaseRelativeLevel(difficulty);
    let level = base;
    if (level !== Number.NEGATIVE_INFINITY) {
        if (difficulty === Difficulty.wildcard) {
            points /= 3;
        } else {
            if (defaultedFrom && defaultedFrom.points > 0) {
                points += defaultedFrom.points;
            }
        }
        if (points > 0) {
            relativeLevel = SkillLike.calculateRelativeLevel(points, relativeLevel);
        } else if (defaultedFrom && defaultedFrom.points < 0) {
            relativeLevel = defaultedFrom.adjustedLevel - level;
        } else {
            level = Number.NEGATIVE_INFINITY;
            relativeLevel = 0;
        }
        if (level !== Number.NEGATIVE_INFINITY) {
            if (defaultedFrom) {
                if (level < defaultedFrom.adjustedLevel) {
                    level = defaultedFrom.adjustedLevel;
                }
            }
        }
    }
    const encumbrancePenalty = encumbranceLevel * encPenaltyMult;

    return level + relativeLevel + encumbrancePenalty + gMod;
}