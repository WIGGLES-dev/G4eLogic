import {
    FeatureBonusType,
    FeatureBonus,
    Character,
    StringCompare,
    stringCompare,
    Resource,
    Data,
    mapEach,
    spread,
    staticImplements,
    GResource,
    Attribute
} from "@internal";
import { Downstream, Upstream } from "rxdeep";
import { combineLatest, from, iif, Observable, Observer } from "rxjs";
import {
    defaultIfEmpty,
    distinctUntilChanged,
    map,
    max,
    mergeMap,
    mergeScan,
    pluck,
    scan,
    startWith,
    switchMap,
    tap,
    withLatestFrom
} from "rxjs/operators";
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
export abstract class SkillLike<Model extends SkillLikeKeys & Data = SkillLikeKeys & Data> extends Resource<Model> {
    constructor(state: Resource<Model>["state"]) {
        super(state);
    }
    static selectBestDefault() { }
    selectHighestDefault$(): Observable<number> {
        const character$ = this.root$<Character>();
        const attributes$ = character$.pipe(switchMap(c => c.selectAttributes()));
        const defaults$ = this.sub("defaults");
        return combineLatest([
            defaults$,
            attributes$,
        ]).pipe(
            withLatestFrom(character$),
            map(([[sds, attrs], c]) =>
                sds?.map(
                    ({ type, name, specialization, modifier = null }) =>
                        attrs[type] instanceof Attribute ?
                            from([attrs[type].calculateLevel() + modifier]) :
                            c.lookup<Skill>({
                                type: 'skill',
                                name,
                                specialization
                            }).pipe(
                                map(skills => skills.map(s => s.baseRelativeLevel$.pipe(
                                    map(lvl => lvl + modifier)))
                                ),
                                switchMap(observables => combineLatest(observables).pipe(
                                    defaultIfEmpty([Number.NEGATIVE_INFINITY])
                                )),
                                map(levels => Math.max(...levels)),
                                distinctUntilChanged(),
                            )
                ) ?? []
            ),
            switchMap(observables => combineLatest(observables)
                .pipe(
                    defaultIfEmpty([Number.NEGATIVE_INFINITY])
                )
            ),
            map(values => Math.max(...values)),
            distinctUntilChanged(),
            defaultIfEmpty(Number.NEGATIVE_INFINITY)
        )
    }
    getRelativeLevel() {
        return calculateRelativeSkillLevel(this.value)
    }
    get attribute$() {
        const character$ = this.root$<Character>()
        const signature$ = this.sub('signature');
        return signature$.pipe(
            withLatestFrom(character$),
            switchMap(([s, character]) => character.selectAttribute(s).pipe(
                map(a => a?.calculateLevel())
            )),
            distinctUntilChanged()
        )
    }
    get relativeLevel$() {
        return this.pipe(
            map(calculateRelativeSkillLevel),
            distinctUntilChanged()
        )
    }
    get baseRelativeLevel$() {
        const observables = [
            this.relativeLevel$,
            this.attribute$
        ];
        return combineLatest(observables).pipe(
            map(([rsl, attr]) => rsl + attr)
        )
    }
    get bonus$(): Observable<number> {
        const character$ = this.root$<Character>();
        return combineLatest([this, character$]).pipe(
            switchMap(([keys, c]) => c.selectFeatures().pipe(
                map(fa => fa
                    .filter(f => f.type === 'skill bonus')
                    .filter(f => skillBonusMatchesSkill(keys, f as unknown as SkillBonus))
                    .reduce((a, b) => a + b.amount as number || null, 0)
                ),
            )),
            distinctUntilChanged(),
            defaultIfEmpty(0),
        )
    }
    get level$(): Observable<number> {
        const character$ = this.root$<Character>()
        const encumbranceLevel$ = character$.pipe(
            switchMap(character => character.selectEncumbranceLevel()),
        );
        const lvl$ = combineLatest([
            this,
            this.attribute$,
            encumbranceLevel$,
            this.bonus$
        ]).pipe(
            spread(calculateSkillLevel)
        );
        const bestDefault$ = this.selectHighestDefault$();
        return combineLatest([
            lvl$,
            bestDefault$
        ]).pipe(
            map(([lvl, d]) => {
                return Math.max(lvl, d)
            }),
            distinctUntilChanged()
        )
    }
}
@staticImplements<GResource<Skill>>()
export class Skill extends SkillLike<SkillData> {
    static version = 1 as const
    static type = "skill" as const
    constructor(state: Skill["state"]) {
        super(state);
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
    name: string
    specializationCompare: StringCompare
    specialization: string
    categoryCompare: StringCompare
    category: string
}
export function skillBonusMatchesSkill(skill: SkillLikeKeys, skillBonus: SkillBonus) {
    if (!skill) return false
    const {
        name,
        specialization
    } = skill;
    const nameMatches = stringCompare(name, skillBonus.name, skillBonus.nameCompare);
    const specializationMatches = stringCompare(specialization, skillBonus.specialization, skillBonus.specializationCompare);
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
export function calculateRelativeSkillLevel(
    { points, difficulty } = {} as Pick<SkillLikeKeys, "points" | "difficulty">
) {
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
    skill: SkillLikeKeys,
    baseLevel: number = 10,
    encumbranceLevel: number = 0,
    bonus: number = 0,
) {
    if (!skill) return NaN
    let {
        points = 0,
        encumbrancePenaltyMultiple = 0,
        mod = 0
    } = skill;
    if (skill.difficulty === SkillDifficulty.Wildcard) points = points / 3;
    let relativeLevel = calculateRelativeSkillLevel(skill);
    const encumbrancePenalty = encumbranceLevel * encumbrancePenaltyMultiple;
    const preliminaryLevel = baseLevel + relativeLevel + encumbrancePenalty;
    return Math.max(preliminaryLevel) + mod + bonus
}