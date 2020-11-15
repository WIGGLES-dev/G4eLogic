import { SkillDifficulty } from "@internal";

export function getBaseRelativeLevel(difficulty: SkillDifficulty) {
    switch (difficulty) {
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

export function calculateRelativeLevel(points: number, relativeLevel: number) {
    if (points === 1) {

    } else if (points < 4) {
        relativeLevel++;
    } else {
        relativeLevel += 1 + points / 4;
    }
    return relativeLevel
}

export function calculateSkillLevel(
    buyLevelFromDefault: boolean,
    difficulty: SkillDifficulty,
    points: number,
    base: number = 10,
    defaultedFrom?: any,
    bonus = 0,
    encumbranceLevel = 0,
    encPenaltyMult = 1,
    mod = 0,
    bestDefaultLevel = Number.NEGATIVE_INFINITY
) {
    let relativeLevel = getBaseRelativeLevel(difficulty);
    let level = base;
    if (level !== Number.NEGATIVE_INFINITY) {
        if (difficulty === SkillDifficulty.Wildcard) {
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

    const defaultLevel = defaultedFrom ? defaultedFrom.getMatches()?.bestLevel : Number.NEGATIVE_INFINITY;

    return Math.max(defaultLevel + mod + bonus, preliminaryLevel + mod + bonus)
}

// getBestDefaultWithPoints(): Default {
//     const best = this.getBestDefault();
//     if (best === this.defaultedFrom) return this.defaultedFrom
//     if (best !== null) {
//         if (!best.isSkillBased()) return best
//         this.defaultedFrom = best;
//         let baseLine = this.sheet?.getAttribute(this.signature).calculateLevel() + this.getBaseRelativeLevel();
//         let level = best.level;
//         best.adjustedLevel = level;
//         if (level === baseLine) {
//             best.points = 1;
//         } else if (level === baseLine + 1) {
//             best.points = 2;
//         } else if (level > baseLine + 1) {
//             best.points = 4 * (level - (baseLine + 1));
//         } else {
//             level = best.level;
//             if (level < 0) {
//                 level = 0;
//             }
//             best.points = -level;
//         }
//     }
//     return best
// }
// getBestDefault() {
//     if (this.defaults.length > 0) {
//         let best: number = Number.NEGATIVE_INFINITY;
//         let bestSkill: Default = null;
//         this.defaults.forEach(skillDefault => {
//             if (true) {
//                 let level = skillDefault.getMatches()?.bestLevel;
//                 let modifier = skillDefault.modifier;
//                 if (level > best) {
//                     best = level;
//                     bestSkill = skillDefault;
//                     bestSkill.level = level
//                 }
//             }
//         })
//         return bestSkill
//     }
//     return null
// }

// isInDefaultChain(skillLike: Skill, skillDefault: Default, lookedAt = new Set()) {
//     const character = skillLike.sheet;
//     let hadOne = false;
//     if (character !== null && skillDefault !== null && skillDefault.isSkillBased()) {
//         skillDefault.getMatches()?.skills.forEach(match => {
//             if (match === skillLike) {
//                 return true
//             }
//             lookedAt.add(skillDefault);
//             if (lookedAt.has(match)) {
//                 if (this.isInDefaultChain(skillLike, match.defaultedFrom, lookedAt)) {
//                     return true
//                 }
//             }
//             hadOne = true;
//         })
//         return !hadOne
//     }
//     return false
// }

// canSwapDefault(skill: Skill) {
//     if (this.defaultedFrom && this.points > 0) {
//         if (skill && skill.hasDefaultTo(this)) {
//             return true
//         }
//     }
//     return false
// }

// hasDefaultTo(skill: Skill) {
//     let result = false;
//     this.defaults.forEach(skillDefault => {
//         let skillBased = skillDefault.isSkillBased();
//         let nameMatches = skillDefault.criteria.name === skill.name;
//         let specializationMathches = skillDefault.criteria.specialization === skill.specialization;
//         result = skillBased && nameMatches && specializationMathches;
//     })
//     return result
// }