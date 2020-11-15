import { StringCompare } from "@utils/strings";
import {
    FeatureType,
    FeatureBonusType,
    FeatureBonus,
    Feature,
    featureData,
    FeatureData,
    Sheet,

} from "@internal";
import { combineLatest, Observable } from "rxjs";
import { filter, map, withLatestFrom, takeWhile } from "rxjs/operators";


export enum SkillDifficulty {
    Easy = "E",
    Average = "A",
    Hard = "H",
    VeryHard = "VH",
    Wildcard = "W"
}
export interface SkillDefault {
    type: "Skill" | "Attribtue",
    name: string,
    specialization?: string
    modifier: number
}
export interface SkillBonus extends FeatureBonus {
    type: FeatureBonusType.Skill
    nameCompare: StringCompare
    nameCriteria: string
    specializationCompare: StringCompare
    specializationCriteria: string
    categoryCompare: StringCompare
    categoryCriteria: string
}

export type Skills = SkillData | TechniqueData | SpellData
export interface SkillLikeData {
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
export interface SkillData extends FeatureData, SkillLikeData {
    type: FeatureType.Skill,
}
export const skillData = (): SkillData => ({
    ...featureData(),
    type: FeatureType.Skill,
    points: 1,
    name: "",
    specialization: null,
    techLevel: null,
    difficulty: SkillDifficulty.Average,
    signature: null,
    mod: 0,
    encumbrancePenaltyMultiple: 1,
    defaults: []
});
export type TechniqueDifficulty = SkillDifficulty.Average | SkillDifficulty.Hard;
export interface TechniqueData extends FeatureData, SkillLikeData {
    type: FeatureType.Technique
    difficulty: TechniqueDifficulty
    default: SkillDefault
    defaults: undefined
}
export const techniqueData = (): TechniqueData => ({
    ...skillData(),
    type: FeatureType.Technique,
    difficulty: SkillDifficulty.Average,
    default: {} as SkillDefault,
    defaults: null
});
export interface SpellData extends FeatureData, SkillLikeData {
    type: FeatureType.Spell
    requiresConcentration: boolean
    currentlyActive: boolean
    college?: string
    class?: string
    resist?: string
    powerSource?: string
    spellClass?: string
    castingCost?: string
    maintenanceCost?: string
    castingTime?: string
    duration?: string
}
export const spellData = (): SpellData => ({
    ...skillData(),
    type: FeatureType.Spell,
    requiresConcentration: false,
    currentlyActive: false,
});

abstract class SkillLike<T extends FeatureType, K extends Skills> extends Feature<T, K> {
    constructor(id: string, sheet?: Sheet) {
        super(id, sheet);
    }
    get level() { return null }
    get level$(): Observable<number> {
        if (!this.exists) return
        const sheet = this.sheet;
        if (!sheet) return null
        return combineLatest([
            this.instance$,
            sheet.skills$,
            sheet.attributes$,
            this.skillBonus$
        ]).pipe(
            takeWhile(([targetSkill]) => targetSkill.exists)
        ).pipe(
            map(([targetSkill, otherSheetSkills, attributes, bonus]) => {
                const defaults = targetSkill.keys.defaults
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
    }
    get relativeLevel() {
        return calculateRelativeSkillLevel(
            this.keys.points,
            this.keys.difficulty
        )
    }
    get relativeLevel$() { return this.instance$.pipe(map(skill => skill.relativeLevel)) }
    get skillBonus$() {
        const sheet = this.sheet;
        if (!sheet) return
        return this.sheet.bonuses$.pipe(
            map(bonuses => {
                return bonuses
                    .filter(bonus => !bonus.disabled)
                    .map(bonus => {
                        bonus.bonuses = bonus.bonuses.filter(bonus => bonus.type === FeatureBonusType.Skill);
                        return bonus
                    })
                    .reduce((total, { bonus }) => total + bonus, 0)
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
    return (!skillDefault.name && nameMatches) && (!skillDefault.specialization || specializationMatches)
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
export class Skill extends SkillLike<FeatureType.Skill, SkillData> {
    type = FeatureType.Skill as FeatureType.Skill
    constructor(id: string, sheet?: Sheet) {
        super(id, sheet);
    }
    defaultData() { return skillData() }
}
export class Technique extends SkillLike<FeatureType.Technique, TechniqueData> {
    type = FeatureType.Technique as FeatureType.Technique
    constructor(id: string, sheet?: Sheet) {
        super(id, sheet);
    }
    defaultData() { return techniqueData() }
}
export class Spell extends SkillLike<FeatureType.Spell, SpellData> {
    type = FeatureType.Spell as FeatureType.Spell
    constructor(id: string, sheet?: Sheet) {
        super(id, sheet)
    }
    defaultData() { return spellData() }
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