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
    log,
    spread,
    staticImplements,
    matchArray
} from "@internal";
import { combineLatest, from, Observable, scheduled } from "rxjs";
import {
    filter,
    pluck,
    map,
    switchMap,
    mergeMap,
    combineAll,
    startWith,
    scan
} from "rxjs/operators";
import { GResource } from "src/sheet/resource";
import * as searchjs from 'searchjs';
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
    constructor(identity: SkillLike<Model>["identity"]) {
        super(identity);
    }
    static selectBestDefault() {  }
    selectHighestDefault$(this: Resource<{ defaults: SkillDefault[] } & Data>) {
        const character$ = this.selectNearest('character');
        const defaults$ = this.sub('defaults');
        const matches$ = combineLatest([defaults$, character$])
            .pipe(
                mergeMap(([sds, c]) => {
                    const matches: [number, Observable<Resource[]>][] = sds?.map(
                        ({ name, specialization, modifier }) =>
                            [
                                modifier,
                                c.lookup({
                                    type: 'skill',
                                    name,
                                    specialization: specialization
                                })
                            ]
                    ) ?? [];
                    return matches
                }),
                mergeMap(([mod, matches]) =>
                    matches.pipe(
                        mapEach(r => r.cast(Skill)),
                        mapEach(skill => skill.baseRelativeLevel$),
                        mapEach(lvl$ => lvl$.pipe(
                            map(lvl => lvl + mod)
                        )),
                        mergeMap(lvls$ => combineLatest(lvls$)),
                        spread(Math.max),
                    )
                )
            );
        return matches$.pipe(
            startWith(Number.NEGATIVE_INFINITY)
        )
    }
    getRelativeLevel() {
        return calculateRelativeSkillLevel(this.getKeys())
    }
    get attribute$() {
        const character$ = this.selectNearest('character', Character);
        const signature$ = this.sub('signature');
        const attribute$ = signature$.pipe(
            mergeMap(s => character$.pipe(
                mergeMap(c => c.selectAttribute(s)),
                map(a => a?.calculateLevel())
            ))
        )
        return attribute$
    }
    get relativeLevel$() { return this.keys$.pipe(map(calculateRelativeSkillLevel)) }
    get baseRelativeLevel$() {
        const observables = [
            this.relativeLevel$,
            this.attribute$
        ];
        return combineLatest(observables).pipe(
            map(([rsl, attr]) => rsl + attr)
        )
    }
    get level$(): Observable<number> {
        const character$ = this.selectNearest("character", Character);
        const keys$: Observable<SkillLikeKeys & Data> = this.keys$;
        const encumbranceLevel$ = character$.pipe(
            mergeMap(character => character.selectEncumbranceLevel())
        );
        const bonus$ = combineLatest([keys$, character$]).pipe(
            mergeMap(([keys, c]) =>
                c.selectAllFeatures()
                    .pipe(
                        map(fa => fa
                            .filter(f => f.type === 'skill bonus')
                            .filter(f => skillBonusMatchesSkill(keys, f as unknown as SkillBonus))
                            .reduce((a, b) => a + b.amount as number || null, 0)
                        ),
                    )
            ),
            startWith(0)
        )
        const lvl$ = combineLatest([
            keys$,
            this.attribute$,
            encumbranceLevel$,
            bonus$
        ]).pipe(
            spread(calculateSkillLevel)
        );
        const bestDefault$ = this.selectHighestDefault$();
        return combineLatest([
            lvl$,
            bestDefault$
        ]).pipe(
            spread(Math.max)
        )
    }
}
@staticImplements<GResource<Skill>>()
export class Skill extends SkillLike<SkillData> {
    static version = 1 as const
    static type = "skill" as const
    constructor(identity: Skill["identity"]) {
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
    name: string
    specializationCompare: StringCompare
    specialization: string
    categoryCompare: StringCompare
    category: string
}
export function skillBonusMatchesSkill(skill: SkillLikeKeys, skillBonus: SkillBonus) {
    const {
        name,
        specialization
    } = skill
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
