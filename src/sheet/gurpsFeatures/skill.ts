import {
    FeatureType,
    FeatureBonusType,
    FeatureBonus,
    Feature,
    featureData,
    FeatureData,
    Sheet,
    StringCompare,
    skillDefaultMatches,
    bonusForSkill,
    stringCompare,

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
    type: "Skill" | string,
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

export interface SkillLikeData<T extends FeatureType = FeatureType> extends FeatureData<T> {
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
export interface SkillData extends SkillLikeData<FeatureType.Skill> { }
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
export interface TechniqueData extends SkillLikeData<FeatureType.Technique> {
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
export interface SpellData extends SkillLikeData<FeatureType.Spell> {
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

export abstract class SkillLike<T extends FeatureType = FeatureType, K extends SkillLikeData<T> = SkillLikeData<T>> extends Feature<T, K> {
    constructor(id: string) {
        super(id);
    }
    get level() { return this.get(this.level$) }
    get level$(): Observable<number> {
        return combineLatest([
            skillDefaultMatches(this.sheet, this.keys$.pipe(map(keys => keys.defaults))),
            this.sheet?.instance$,
            this.sheet?.attributes$,
        ]).pipe(
            takeWhile(() => this.exists && this.sheet.exists),
            map(([bestDefault, sheet, attributes]) => {
                return Math.max(
                    calculateSkillLevel(
                        this.keys,
                        attributes[this.keys?.signature]?.calculateLevel() ?? 10,
                        0,
                        this.skillBonus,

                    ),
                    bestDefault
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
    get skillBonus() {
        if (!this.sheet) return
        return bonusForSkill(this.sheet.get(this.sheet.bonuses$), this.keys)
    }
    get skillBonus$() {
        return this.instance$.pipe(map(instance => instance.skillBonus))
    }
}
export function skillBonusMatchesSkill(skill: SkillLikeData, skillBonus: SkillBonus) {
    const nameMatches = stringCompare(skill.name, skillBonus.nameCriteria, skillBonus.nameCompare);
    const specializationMatches = stringCompare(skill.specialization, skillBonus.specializationCriteria, skillBonus.specializationCompare);
    const categoryMatches = true;
    return (
        (skill.name && nameMatches) &&
        (skill.specialization ?
            specializationMatches : skill.name && nameMatches
        ) && categoryMatches)
}
export function skillMatchesAnyDefaults(skill: SkillLikeData, defaults: SkillDefault[]) {
    return defaults?.some((skillDefault) => skillMatchesDefault(skill, skillDefault))
}
export function skillMatchesDefault(skill: SkillLikeData, skillDefault: SkillDefault) {
    if (skillDefault.type !== "Skill") return false
    const nameMatches = skillDefault.name === skill.name;
    const specializationMatches = skillDefault.specialization === skill.specialization;
    return (
        skill.name && nameMatches) &&
        (skillDefault.specialization ?
            specializationMatches : skill.name && nameMatches
        )
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
) {
    if (!skill) return NaN
    let points = skill.points;
    if (skill.difficulty === SkillDifficulty.Wildcard) points = points / 3;
    let relativeLevel = calculateRelativeSkillLevel(points, skill.difficulty);
    const encumbrancePenalty = encumbranceLevel * skill.encumbrancePenaltyMultiple;
    const preliminaryLevel = baseLevel + relativeLevel + encumbrancePenalty;
    return Math.max(preliminaryLevel) + skill.mod + bonus
}
export class Skill extends SkillLike<FeatureType.Skill, SkillData> {
    type: FeatureType.Skill = FeatureType.Skill
    constructor(id: string) {
        super(id);
    }
    defaultData() { return skillData() }
}
export class Technique extends SkillLike<FeatureType.Technique, TechniqueData> {
    type: FeatureType.Technique = FeatureType.Technique
    constructor(id: string, sheet?: Sheet) {
        super(id);
    }

    get level$(): Observable<number> {
        return combineLatest([
            skillDefaultMatches(this.sheet, this.keys$.pipe(map(keys => [keys.default]))),
            this.sheet.skills$,
            this.sheet.attributes$,
            this.skillBonus$
        ]).pipe(
            takeWhile(() => this.exists && this.sheet.exists),
            map(([bestDefault]) => {
                return calculateTechniqueLevel(
                    this.keys,
                    bestDefault,
                    this.skillBonus
                )
            })
        )
    }
    defaultData() { return techniqueData() }
}
export function calculateTechniqueLevel(
    technique: TechniqueData,
    baseLevel: number = 10,
    bonus: number = 0,
) {
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
        return level + technique.mod
    } else {
        return NaN
    }
}
export class Spell extends SkillLike<FeatureType.Spell, SpellData> {
    type: FeatureType.Spell = FeatureType.Spell
    constructor(id: string) {
        super(id)
    }
    defaultData() { return spellData() }
}

