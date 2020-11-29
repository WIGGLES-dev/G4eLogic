import Schema from "validate"
import { EntityState } from "@datorama/akita";
import { combineLatest, merge, Observable } from "rxjs";
import { distinctUntilChanged, map, reduce } from "rxjs/operators";
import { MeleeWeapon, RangedWeapon } from "./gurpsFeatures/weapon";
import {
    Entity,
    EntityData,
    Config,
    AttributeLevel,
    config,
    Attribute,
    parseHitLocations,
    HitLocation,
    getSwingDamage,
    getThrustDamage,
    basicLift,
    Skill,
    Trait,
    Technique,
    Spell,
    split,
    sumTraitArray,
    SkillDefault,
    FeatureBonuses,
    skillBonusMatchesSkill,
    FeatureBonusType,
    filterKeys,
    FeatureType,
    Feature,
    Equipment,
    entityConfig,
    getEntityCollection,
    configSchema,
    encumbranceLevel,
    SkillLikeData,
    skillMatchesAnyDefaults,
    skillMatchesDefault,
    TraitCategory,
    log,
    pathIsDirty
} from "@internal";

export enum EntityType {
    Sheet = "sheet"
}

export interface SheetState extends EntityState<EntityData<EntityType.Sheet, SheetData>, string> { }
export interface SheetData {
    type: EntityType.Sheet,
    config: Config
    pointTotal: number
    notes: string
    profile: ProfileData
    hitLocationDamage: Record<string, number>,
    attributeLevels: Record<string, AttributeLevel>
}
export const sheetSchema = () =>
    new Schema({
        type: { enum: [EntityType.Sheet] },
        config: configSchema(),
        pointTotal: Number,
        //notes: String,
        // profile: { "*": String },
        // hitLocationDamage: { "*": Number },
        // attributeLevels: {
        //     "*": {
        //         level: Number,
        //         mod: Number
        //     }
        // }
    })
export const sheetData = (): SheetData => ({
    type: EntityType.Sheet,
    config,
    pointTotal: 150,
    notes: "",
    profile: profileData(),
    hitLocationDamage: {},
    attributeLevels: {},
});

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
    voice?: string

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

    sizeModifier: number

    portrait: string
    cropped?: string
}
const profileData = (): ProfileData => ({
    portrait: new URL("silhouette.png", window.location.origin).href,
    appearance: Appearance.Average,
    sizeModifier: 0
});

@entityConfig(EntityType.Sheet)
export class Sheet extends Entity<EntityType.Sheet, SheetData> {
    static type: EntityType.Sheet = EntityType.Sheet
    type: EntityType.Sheet = EntityType.Sheet

    get schema() {
        const schema = super.schema;
        schema.path("keys", sheetSchema())
        return schema;
    }

    constructor(id: string) { super(id) }

    get config$() {
        return this.data$.pipe(
            map(data => data.keys.config),
            distinctUntilChanged(() => this.pathIsDirty("data.keys.config"))
        )
    }

    static defaultData = sheetData()
    get defaultData() { return Sheet.defaultData }

    private static _getOwnedEntities<E extends Feature>(id: string) { return (entities: E[]) => entities.filter(entity => entity.data?.rootEntity?.id === id) }
    get skills$() { return getEntityCollection<Skill["type"], Skill["keys"], Skill>(FeatureType.Skill).instances$().pipe(map(Sheet._getOwnedEntities(this.id))) }
    get techniques$() { return getEntityCollection<Technique["type"], Technique["keys"], Technique>(FeatureType.Technique).instances$().pipe(map(Sheet._getOwnedEntities(this.id))) }
    get spells$() { return getEntityCollection<Spell["type"], Spell["keys"], Spell>(FeatureType.Spell).instances$().pipe(map(Sheet._getOwnedEntities(this.id))) }
    get traits$() { return getEntityCollection<Trait["type"], Trait["keys"], Trait>(FeatureType.Trait).instances$().pipe(map(Sheet._getOwnedEntities(this.id))) }
    get equipment$() { return getEntityCollection<Equipment["type"], Equipment["keys"], Equipment>(FeatureType.Equipment).instances$().pipe(map(Sheet._getOwnedEntities(this.id))) }

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

    private get _getAllAttributes$() {
        return combineLatest(
            [this.keys$, this.bonuses$]
        ).pipe(
            map(
                ([data]) => Object.entries(data?.config?.attributes)
                    .reduce((attributes, [signature, data]) => {
                        attributes[signature] = new Attribute(this, data, signature, attributes)
                        return attributes
                    }, {} as Record<string, Attribute>)
            ),
            //log("getting attributes")
        )
    }
    get attributes$() {
        return this._getAllAttributes$.pipe(
            map(
                (attributes) => filterKeys(attributes, (key, attribute) => !attribute.keys.isPool)
            )
        )
    }
    get orderedAttributes$(): Observable<Attribute[]> {
        return this.attributes$.pipe(
            map(
                attributes => this.keys.config.UI?.attributeOrder?.map(attr => attributes[attr]).filter(val => val) ?? Object.values(attributes)
            )
        )
    }
    get pools$() {
        return this._getAllAttributes$.pipe(
            map(
                attributes => filterKeys(attributes, (key, attribute) => attribute.keys.isPool)
            )
        )
    }
    get orderedPools$() {
        return this.pools$.pipe(
            map(
                pools => this.keys.config.UI?.poolOrder?.map(attr => pools[attr]).filter(val => val) ?? Object.values(pools)
            )
        )
    }

    get hitLocations() {
        try {
            return Object.entries(
                parseHitLocations(this.keys?.config?.locations) || {}
            ).reduce(
                (locations, [name, data]) => {
                    locations[name] = new HitLocation(this, data, name, locations);
                    return locations
                }, {} as Record<string, HitLocation>
            ) || {}
        } catch (err) {
            return {}
        }
    }
    get hitLocations$(): Observable<Record<string, HitLocation>> {
        return combineLatest(
            [this.instance$, this.bonuses$]
        ).pipe(
            map(([sheet]) => sheet.hitLocations)
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
            this.keys$,
            merge(
                this.attributes$,
                this.pools$
            ),
            this.traits$,
            this.skills$,
            this.techniques$,
            this.spells$,
        ]).pipe(
            map(([data, attributes, traits, skills, techniques, spells]) => {
                const total = data.pointTotal;
                const attributePoints = Object.values(attributes).reduce(
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

export function skillDefaultMatches(sheet: Sheet, defaults: Observable<SkillDefault[]>) {
    return combineLatest([
        defaults,
        sheet.attributes$,
        sheet.skills$,
        sheet.techniques$,
        sheet.spells$,
    ]).pipe(
        map(([defaults, attributes, skills, techniques, spells]) => {
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