import {
    FeatureBonusType,
    FeatureBonus,
    Character,
    StringCompare,
    stringCompare,
    Resource,
    Data,
    mapEach,
    collapse,
    log
} from "@internal";
import { combineLatest, from, Observable, scheduled } from "rxjs";
import { filter, map, withLatestFrom, takeWhile, pluck, mergeMap, max, startWith, concatAll, catchError, defaultIfEmpty } from "rxjs/operators";

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
export type TechniqueDifficulty = SkillDifficulty.Average | SkillDifficulty.Hard;
export interface TechniqueData extends Data, SkillLikeKeys {
    type: "technique"
    version: 1
    difficulty: TechniqueDifficulty
    limit?: number
    default: SkillDefault
    defaults: undefined
}
export interface SpellData extends Data, SkillLikeKeys {
    type: "spell"
    version: 1
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

export abstract class SkillLike<Model extends SkillLikeKeys & Data = SkillLikeKeys & Data> extends Resource<Model> {
    constructor(identity: SkillLike<Model>["identity"]) {
        super(identity);
    }

    selectHighestDefault$(this: Resource<{
        defaults: SkillDefault[]
    } & Data>): Observable<number> {
        return this.selectKeys()
            .pipe(
                map(d => d.defaults || []),
                mergeMap(d => d),
                mergeMap(sd =>
                    this.lookup({
                        type: "skill",
                        name: sd.name,
                        specialization: sd.specialization,
                    })),
                mapEach(r => r.cast(Skill)),
                mergeMap(i => i),
                mergeMap(s => s.level$),
                max()
            )
    }
    getRelativeLevel() {
        return calculateRelativeSkillLevel(this.getKeys())
    }
    get relativeLevel$() { return this.selectKeys().pipe(map(calculateRelativeSkillLevel)) }
}
export class Skill extends SkillLike<SkillData> {
    static version = 1 as const
    static type = "skill" as const
    constructor(identity: Skill["identity"]) {
        super(identity)
    }
    calculateLevel = calculateSkillLevel
    get level$(): Observable<number> {
        return combineLatest([
            this.selectHighestDefault$().pipe(log('default')),
            this.selectBonus({
                type: "skill bonus"
            }).pipe(log('bonus')),
            this.selectNearest("character", Character).pipe(
                mergeMap(character => character.selectAttributes())
            ).pipe(log('attributes'))
        ]).pipe(
            takeWhile(() => this.exists),
            map(([bestDefault, bonus, attributes]) => {
                console.log(arguments);
                const keys = this.getKeys();
                return Math.max(
                    calculateSkillLevel(
                        keys,
                        attributes[keys?.signature]?.calculateLevel() ?? 10,
                        0,
                        bonus
                    ),
                    bestDefault
                );
            })
        )
    }
}

export class Technique extends SkillLike<TechniqueData> {

    constructor(identifier: Technique["identity"]) {
        super(identifier);
    }
    get level$(): Observable<number> {
        return from([0])
    }
}

export class Spell extends SkillLike<SpellData> {
    constructor(identity: Spell["identity"]) {
        super(identity);
    }
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
    nameCriteria: string
    specializationCompare: StringCompare
    specializationCriteria: string
    categoryCompare: StringCompare
    categoryCriteria: string
}
export function skillBonusMatchesSkill(skill: SkillLikeKeys, skillBonus: SkillBonus) {
    const {
        name,
        specialization
    } = skill
    const nameMatches = stringCompare(name, skillBonus.nameCriteria, skillBonus.nameCompare);
    const specializationMatches = stringCompare(specialization, skillBonus.specializationCriteria, skillBonus.specializationCompare);
    const categoryMatches = true;
    return (
        (name && nameMatches) &&
        (specialization ?
            specializationMatches : name && nameMatches
        ) && categoryMatches)
}
export function skillMatchesAnyDefaults(skill: SkillLikeKeys, defaults: SkillDefault[]) {
    return defaults?.some((skillDefault) => skillMatchesDefault(skill, skillDefault))
}
export function skillMatchesDefault(skill: SkillLikeKeys, skillDefault: SkillDefault) {
    if (skillDefault.type !== "Skill") return false
    const {
        specialization
    } = skill
    const nameMatches = skillDefault.name === skill.name;
    const specializationMatches = skillDefault.specialization === specialization;
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
export function calculateRelativeSkillLevel({ points, difficulty }: Pick<SkillLikeKeys, "points" | "difficulty">) {
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
    skill: SkillData,
    baseLevel: number = 10,
    encumbranceLevel: number = 0,
    bonus: number = 0,
) {
    if (!skill) return NaN
    let points = skill.points;
    if (skill.difficulty === SkillDifficulty.Wildcard) points = points / 3;
    let relativeLevel = calculateRelativeSkillLevel(skill);
    const encumbrancePenalty = encumbranceLevel * skill.encumbrancePenaltyMultiple;
    const preliminaryLevel = baseLevel + relativeLevel + encumbrancePenalty;
    return Math.max(preliminaryLevel) + skill.mod + bonus
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