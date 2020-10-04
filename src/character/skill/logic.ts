import { Difficulty, SkillDefault, SkillLike } from "./skill";

export function getBaseRelativeLevel(difficulty: Difficulty) {
    switch (difficulty) {
        case Difficulty.easy:
            return 0
        case Difficulty.average:
            return -1
        case Difficulty.hard:
            return -2
        case Difficulty.very_hard:
            return -3
        case Difficulty.wildcard:
            return -3
    }
}

export function calculateRelativeLevel(points: number, relativeLevel: number) {
    if (points === 1) {

    } else if (points < 4) {
        relativeLevel++;
    } else {
        relativeLevel += 1 + points / 4;
    }
    return relativeLevel
}


/**
 * Pure function responsible for determining final skill level.
 * @param difficulty 
 * @param points 
 * @param base 
 * @param defaultedFrom 
 * @param bonus 
 * @param encumbranceLevel 
 * @param encPenaltyMult
 * @param gMod
 * @param buy
 * @returns The final calculated skill level.
 */
export function calculateSkillLevel(
    buyLevelFromDefault: boolean,
    difficulty: Difficulty,
    points: number,
    base: number = 10,
    defaultedFrom?: SkillDefault<SkillLike>,
    bonus = 0,
    encumbranceLevel = 0,
    encPenaltyMult = 1,
    mod = 0,
    bestDefaultLevel = Number.NEGATIVE_INFINITY
) {
    let relativeLevel = getBaseRelativeLevel(difficulty);
    let level = base;
    if (level !== Number.NEGATIVE_INFINITY) {
        if (difficulty === Difficulty.wildcard) {
            points /= 3;
        } else {
            if (defaultedFrom && defaultedFrom.points > 0 && buyLevelFromDefault) {
                points += defaultedFrom.points;
            }
        }
        if (points > 0) {
            relativeLevel = calculateRelativeLevel(points, relativeLevel);
        } else if (defaultedFrom && defaultedFrom.points < 0 && buyLevelFromDefault) {
            relativeLevel = defaultedFrom.adjustedLevel - level;
        } else {
            level = Number.NEGATIVE_INFINITY;
            relativeLevel = 0;
        }
        if (level !== Number.NEGATIVE_INFINITY) {
            if (defaultedFrom && buyLevelFromDefault) {
                if (level < defaultedFrom.adjustedLevel) {
                    // level = defaultedFrom.adjustedLevel;
                }
            }
        }
    }

    const encumbrancePenalty = encumbranceLevel * encPenaltyMult;
    const preliminaryLevel = level + relativeLevel + encumbrancePenalty;

    const defaultLevel = defaultedFrom ? defaultedFrom.getHighestMatchLevel({ withBonuses: false }) : Number.NEGATIVE_INFINITY;

    return Math.max(defaultLevel + mod + bonus, preliminaryLevel + mod + bonus)
}