import { EntityState, StoreConfig, EntityStore, QueryEntity, EntityStateHistoryPlugin } from "@datorama/akita";
import produce from "immer";
import { combineLatest, Observable } from "rxjs";
import { flatMap, map, mergeMap, reduce } from "rxjs/operators";
import { MeleeWeapon, RangedWeapon } from "./gurpsFeatures/weapon";
import {
    Entity,
    EntityData,
    Config,
    PoolLevel,
    AttributeLevel,
    config,
    FeatureQuery,
    parseAttributes,
    Attribute,
    KeyList,
    parsePools,
    Pool,
    parseHitLocations,
    HitLocation,
    getSwingDamage,
    getThrustDamage,
    basicLift,
    Skill,
    Technique,
    Spell,
    split,
    sumTraitArray,
    ValorEntityStore,
    SkillDefault,
    FeatureBonuses,
    skillBonusMatchesSkill,
    FeatureBonusType,
} from "@internal";
import { TraitCategory } from "./gurpsFeatures/trait";
import { SkillLikeData, skillMatchesAnyDefaults, skillMatchesDefault } from "./gurpsFeatures/skill";
import { encumbranceLevel } from "./gurps";

export interface SheetState extends EntityState<EntityData<"sheet", SheetData>, string> { }
@StoreConfig({ name: 'sheets', producerFn: produce })
export class SheetStore extends ValorEntityStore<SheetState> {
    constructor() {
        super();
    }
}
export class SheetQuery extends QueryEntity<SheetState> {
    constructor(store: SheetStore) {
        super(store);
    }
}
export const SheetRepo = new SheetStore();
export const SheetLookup = new SheetQuery(SheetRepo);
export const SheetHistory = new EntityStateHistoryPlugin<SheetState>(SheetLookup)

export interface SheetData {
    config: Config
    pointTotal: number
    notes: string
    profile: ProfileData
    hitLocationDamage: KeyList<number>,
    poolLevels: KeyList<PoolLevel>,
    attributeLevels: KeyList<AttributeLevel>
}
export const sheetData = (): SheetData => ({
    config,
    pointTotal: 150,
    notes: "",
    profile: profileData(),
    hitLocationDamage: {},
    poolLevels: {},
    attributeLevels: {},
})
export enum Appearance {
    Horrific,
    Monstrous,
    Hideous,
    Unattractive,
    Average,
    Attractive,
    Handsome_Beautiful,
    Very_Handsome_Beautiful,
    Transcendent
}
export interface ProfileData {
    birthPlace?: string
    birthday?: string
    status?: string
    wealth?: string
    income?: string
    expenses?: string
    base?: string
    affiliation?: string
    family?: string

    name?: string
    nickName?: string
    sex?: string
    gender?: string
    race?: string
    handedness?: string

    reaction?: string
    appearanceFeatures?: string

    age?: string
    appearance?: Appearance
    eyes?: string
    skin?: string
    hair?: string
    facialHair?: string
    build?: string
    weight?: string
    height?: string

    religion?: string
    education?: string
    citizenship?: string
    orientation?: string

    other?: string

    portrait: string
    cropped?: string
}
const profileData = (): ProfileData => ({
    portrait: new URL("silhouette.png", window.location.origin).href,
    appearance: Appearance.Average
});

export class Sheet extends Entity<"sheet", SheetData, SheetStore, SheetQuery> {
    type: "sheet" = "sheet"

    store = SheetRepo
    query = SheetLookup
    stateHistory = SheetHistory

    constructor(id: string) {
        super(id);
    }

    get config$() { return this.data$.pipe(map(data => data.keys.config)) }
    defaultData() { return sheetData() }

    get skills$() { return FeatureQuery.allSkills$.pipe(map(features => features.filter(feature => feature.data.rootEntityId === this.id))) }
    get techniques$() { return FeatureQuery.allTechniques$.pipe(map(features => features.filter(feature => feature.data.rootEntityId === this.id))) }
    get spells$() { return FeatureQuery.allSpells$.pipe(map(features => features.filter(feature => feature.data.rootEntityId === this.id))) }
    get traits$() { return FeatureQuery.allTraits$.pipe(map(features => features.filter(feature => feature.data.rootEntityId === this.id))) }
    get equipment$() { return FeatureQuery.allEquipment$.pipe(map(features => features.filter(feature => feature.data.rootEntityId === this.id))) }

    get allFeatures$() { return combineLatest([this.skills$, this.techniques$, this.spells$, this.traits$, this.equipment$]) }
    get allFeaturesFlat$() { return this.allFeatures$.pipe(map(feature => feature.flat())) }

    get meleeWeapons$() { return this.allFeaturesFlat$.pipe(map(features => features.flatMap(feature => feature.meleeWeapons as MeleeWeapon[]))) }
    get rangedWeapons$() { return this.allFeaturesFlat$.pipe(map(features => features.flatMap(feature => feature.rangedWeapons as RangedWeapon[]))) }
    get weapons$() { return combineLatest([this.meleeWeapons$, this.rangedWeapons$]) }

    get bonuses$() {
        return this.allFeaturesFlat$.pipe(
            map(features =>
                features.flat().filter(feature => feature.exists).map(feature => {
                    return {
                        id: feature.id,
                        disabled: feature.keys.disabled,
                        bonuses: feature.keys.bonuses,
                        level: feature.keys["levels"]
                    }
                })
            )
        )
    }

    get carriedWeight$() {
        return this.equipment$.pipe(
            map(equipment => equipment.filter(item => !item.keys.disabled).reduce((weight, equipment) => weight + equipment.weight, 0)),
        )
    }
    get encumbranceLevel$() { return combineLatest([this.basicLift$, this.carriedWeight$]).pipe(map(([bl, weight]) => encumbranceLevel(bl, weight))) }

    get attributes() {
        return Object.entries(
            parseAttributes(this.keys.config.attributes)
        ).reduce(
            (attributes, [signature, data]) => {
                attributes[signature] = new Attribute(this, data, signature, attributes)
                return attributes
            }, {} as KeyList<Attribute>
        )
    }
    get attributes$(): Observable<KeyList<Attribute>> {
        return combineLatest(
            [this.instance$, this.bonuses$]
        ).pipe(
            map(([sheet, bonuses]) => {
                return sheet.attributes
            })
        )
    }
    get pools() {
        const attributes = this.attributes;
        return Object.entries(
            parsePools(this.keys.config.pools)
        ).reduce(
            (pools, [signature, data]) => {
                pools[signature] = new Pool(this, data, signature, attributes)
                return pools
            }, {} as KeyList<Pool>
        )
    }
    get pools$() {
        return combineLatest(
            [this.instance$, this.bonuses$]
        ).pipe(map(([sheet, bonuses]) => sheet.pools))
    }
    get hitLocations$() {
        return combineLatest(
            [this.instance$, this.bonuses$]
        ).pipe(
            map(([sheet, bonuses]) => {
                return Object.entries(
                    parseHitLocations(sheet.keys.config.locations)
                ).reduce(
                    (locations, [name, data]) => {
                        locations[name] = new HitLocation(this, data, name, locations);
                        return locations
                    }, {} as KeyList<HitLocation>
                )
            })
        )
    }

    get swingDamage$() {
        return this.attributes$.pipe(
            map(attributes => getSwingDamage(attributes["striking strength"]?.calculateLevel() ?? 10))
        )
    }
    get swingDamage() { return "" }
    get thrustDamage$() {
        return this.attributes$.pipe(
            map(attributes => getThrustDamage(attributes["striking strength"]?.calculateLevel() ?? 10))
        )
    }
    get thrustDamage() { return "" }
    get basicLift$() {
        return this.attributes$.pipe(
            map(attributes => basicLift(attributes["lifting strength"]?.calculateLevel() ?? 10))
        )
    }
    get pointTotal$() {
        return combineLatest([
            this.data$,
            this.traits$,
            this.skills$,
            this.techniques$,
            this.spells$,
            combineLatest([
                this.attributes$,
                this.pools$
            ])
        ]).pipe(
            map(([data, traits, skills, techniques, spells, [attributes, pools]]) => {
                const total = data.keys.pointTotal;
                const attributePoints = Object.values(attributes).concat(Object.values(pools)).reduce(
                    (points, attribute) => points + (attribute.pointsSpent() || 0), 0
                );
                const splitTraits = split(traits);
                const racialPoints = sumTraitArray(splitTraits[TraitCategory.Racial]);
                const advantages = sumTraitArray(splitTraits[TraitCategory.Advantage]);
                const perks = sumTraitArray(splitTraits[TraitCategory.Perk]);
                const disadvantages = sumTraitArray(splitTraits[TraitCategory.Disadavantage]);
                const quirks = sumTraitArray(splitTraits[TraitCategory.Quirk]);
                const sumSkilllike = (points: number, skilllike: Skill | Technique | Spell) => points + skilllike.keys.points;
                const skillTotal = skills.reduce(sumSkilllike, 0);
                const techniqueTotal = techniques.reduce(sumSkilllike, 0);
                const spellTotal = spells.reduce(sumSkilllike, 0);
                const spent = attributePoints + racialPoints + advantages + perks + disadvantages + quirks + skillTotal + techniqueTotal + spellTotal;
                return {
                    attributePoints,
                    racialPoints,
                    advantages,
                    perks,
                    disadvantages,
                    quirks,
                    skills: skillTotal,
                    techniques: techniqueTotal,
                    spells: spellTotal,
                    spent,
                    total,
                    unspent: total - spent
                }
            })
        )
    }
}

function pointTotalSplits() {

}

export function skillDefaultMatches(sheet: Sheet, defaults: Observable<SkillDefault[]>) {
    return combineLatest([
        defaults,
        sheet.skills$,
        sheet.techniques$,
        sheet.spells$,
        sheet.attributes$
    ]).pipe(
        map(([defaults, skills, techniques, spells, attributes]) => {
            const query = [...skills, ...techniques, ...spells];
            const skillMatches = query.filter(skill => skillMatchesAnyDefaults(skill.keys, defaults))
            const highestSkillMatch = defaults.reduce(
                (highest, skillDefault) => {
                    const canidates = skillMatches.filter(skill => skillMatchesDefault(skill.keys, skillDefault))
                    const best = canidates.reduce(
                        (highest, skill) => {
                            const base = attributes[skill.keys.signature]?.calculateLevel() ?? 10;
                            const mod = (skillDefault.modifier || null) + (skill.keys.mod || null);
                            const bonus = skill.skillBonus || null
                            return Math.max(highest, skill.relativeLevel + base + mod + bonus)
                        }, Number.NEGATIVE_INFINITY
                    )
                    return Math.max(highest, best)
                }, Number.NEGATIVE_INFINITY
            );
            const highestAttributeMatch = defaults.reduce(
                (highest, skillDefault) => {
                    if (skillDefault.type === "Skill") return highest
                    const attributeLevel = attributes[skillDefault.type]?.calculateLevel() ?? 10
                    return Math.max(highest, attributeLevel + skillDefault.modifier)
                }, Number.NEGATIVE_INFINITY
            );
            return Math.max(highestSkillMatch, highestAttributeMatch)
        })
    )
}

export function bonusForSkill(
    bonuses: {
        id: string;
        disabled: boolean;
        bonuses: FeatureBonuses[];
        level: any;
    }[],
    skill: SkillLikeData
) {
    return bonuses.filter(bonus => !bonus.disabled)
        .map(bonus => {
            bonus.bonuses = bonus.bonuses.filter(bonus =>
                bonus.type === FeatureBonusType.Skill &&
                skillBonusMatchesSkill(skill, bonus)
            );
            return bonus
        })
        .reduce((total, feature) => {
            return total + feature.bonuses.reduce((total, bonus) => total + (bonus.leveled ? bonus.amount * (feature.level || 1) : bonus.amount), 0)
        }, 0) || null
}