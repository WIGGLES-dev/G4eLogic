import { combineQueries } from "@datorama/akita";
import { combineLatest, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Feature } from "../feature";
import { SkillData, SkillLikeData, SkillDefault, SkillDifficulty, defaultSkillData, FeatureType, Features, FeatureBonusType, FeatureBonuses, SkillBonus } from "../keys";
import { TechniqueData, defaultTechniqueData } from "../keys";
import { SpellData, defaultSpellData } from "../keys"

type Skills = SkillData | TechniqueData | SpellData
abstract class SkillLike<T extends Skills> extends Feature<T> {
    get type() { return FeatureType.Skill }
    constructor(id: string) {
        super(id);
    }
    get level() { return null }
    get level$() {
        const sheet = this.sheet;
        if (!sheet) return NaN
        return combineLatest([
            this.instance$,
            sheet.skills$,
            sheet.attributes$,
            this._skillBonus$
        ]).pipe(
            map(([targetSkill, otherSheetSkills, attributes]) => {
                const defaults = targetSkill?.keys.defaults
                const matches = otherSheetSkills.filter(skill => this.id !== skill.id && skillMatchesAnyDefaults(skill.keys, defaults));
                const highestSkillDefault = defaults.reduce(
                    (highest, skillDefault) => {
                        const canidates = matches.filter(skill => skillMatchesDefault(skill.keys, skillDefault));
                        const best = canidates.reduce(
                            (highest, skill) => {
                                const base = attributes[skill.keys.signature]?.calculateLevel() ?? 10;
                                const mod = skillDefault.modifier || null;
                                return Math.max(skill.relativeLevel + base + mod, highest)
                            }, Number.NEGATIVE_INFINITY
                        );
                        return Math.max(highest, best);
                    }, Number.NEGATIVE_INFINITY
                )
                return calculateSkillLevel(
                    targetSkill.keys,
                    attributes[targetSkill.keys?.signature]?.calculateLevel() ?? 10,
                    0,
                    0,
                    highestSkillDefault
                );
            })
        )
    } get relativeLevel() {
        return calculateRelativeSkillLevel(
            this.keys?.points,
            this.keys?.difficulty
        )
    }
    get relativeLevel$() {
        const sheet = this.sheet;
        if (!sheet) return NaN
        return combineLatest([
            this.instance$,
            this.level$,
            sheet.attributes$
        ]).pipe(
            map(([skill, level, attributes]) => {
                return skill.relativeLevel
            })
        )
    }
    protected get _skillBonus$() {
        const sheet = this.sheet;
        if (!sheet) return
        return this.bonuses$.pipe(
            map(bonuses => {
                bonuses
                    .filter(bonus => !bonus.disabled)
                    .reduce(
                        (bonuses, features) => {
                            const skillBonuses = features.bonuses.filter(bonus => bonus.type === FeatureBonusType.Skill);
                            [...bonuses, ...skillBonuses]
                            return bonuses
                        }, [] as SkillBonus[]
                    )
            })
        )
    }
    calculateLevel() {

    }
}
export function skillMatchesAnyDefaults(skill: SkillData, defaults: SkillDefault[]) {
    return defaults?.some((skillDefault) => skillMatchesDefault(skill, skillDefault))
}
export function skillMatchesDefault(skill: SkillLikeData, skillDefault: SkillDefault) {
    if (skillDefault.type !== "Skill") return false
    const nameMatches = skillDefault.name === skill.name;
    const specializationMatches = skillDefault.specialization === skill.specialization;
    return (!skillDefault.name || nameMatches) && (!skillDefault.specialization || specializationMatches)
}
function calculateBaseRelativeLevel(difficulty: SkillDifficulty) {
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
export function calculateRelativeSkillLevel(points: number, difficulty: SkillDifficulty) {
    let relativeLevel = calculateBaseRelativeLevel(difficulty);
    if (points === 1) {

    } else if (points < 4) {
        relativeLevel++;
    } else {
        relativeLevel += 1 + points / 4;
    }
    return relativeLevel
}
export function calculateSkillLevel(
    skill: SkillLikeData,
    baseLevel: number = 10,
    encumbranceLevel: number = 0,
    bonus: number = 0,
    defaultLevel: number = null
) {
    if (!skill) return NaN
    let points = skill.points;
    if (skill.difficulty === SkillDifficulty.Wildcard) points = points / 3;
    let relativeLevel = calculateRelativeSkillLevel(points, skill.difficulty);
    const encumbrancePenalty = encumbranceLevel * skill.encumbrancePenaltyMultiple;
    const preliminaryLevel = baseLevel + relativeLevel + encumbrancePenalty;
    return Math.max(preliminaryLevel, defaultLevel) + skill.mod + bonus
}
export class Skill extends SkillLike<SkillData> {
    constructor(id: string) {
        super(id);
    }
    defaultData() { return this._wrapFeatureData(defaultSkillData()) }
}
export class Technique extends SkillLike<TechniqueData> {
    get type() { return FeatureType.Technique }
    constructor(id: string) {
        super(id);
    }
    defaultData() { return this._wrapFeatureData(defaultTechniqueData()) }
}
export class Spell extends SkillLike<SpellData> {
    get type() { return FeatureType.Spell }
    constructor(id: string) {
        super(id)
    }
    defaultData() { return this._wrapFeatureData(defaultSpellData()) }
}
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