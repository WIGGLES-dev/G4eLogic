import { EntityState, StoreConfig, EntityStore, QueryEntity } from "@datorama/akita";
import produce from "immer";
import { combineLatest, Observable } from "rxjs";
import { flatMap, map, mergeMap, reduce } from "rxjs/operators";
import { MeleeWeapon, RangedWeapon } from "./gurpsFeatures/weapon";
import { FeatureType } from "./interfaces";
import {
    Entity,
    EntityData,
    Config,
    PoolLevel,
    AttributeLevel,
    config,
    FeatureQuery,
    FeatureRepo,
    parseAttributes,
    Attribute,
    KeyList,
    parsePools,
    Equipment,
    Pool,
    parseHitLocations,
    HitLocation,
    MeleeWeaponData,
    RangedWeaponData,
    getSwingDamage,
    getThrustDamage,
    basicLift,
    Skill,
    Technique,
    Spell,
    Feature,
    Trait,
    ValorEntityStore
} from "@internal";

export interface SheetState extends EntityState<EntityData<"Sheet", SheetData>, string> { }
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
    query = new SheetQuery(this.store)
    featureQuery = new FeatureQuery(FeatureRepo)
    constructor(id: string) {
        super(id);
    }
    get config$() { return this.data$.pipe(map(data => data.keys.config)) }
    defaultData() { return sheetData() }

    private _dataOfTypeAsClass<C extends Feature>(type: FeatureType, cls: new (id: string, sheet: Sheet) => C) {
        return this.instance$.pipe(
            map(instance => instance.allEmbeddedData.filter(data => data.type === type).map(feature => new cls(feature.id, this)))
        )
    }
    get skills$(): Observable<Skill[]> { return this._dataOfTypeAsClass(FeatureType.Skill, Skill) }
    get techniques$(): Observable<Technique[]> { return this._dataOfTypeAsClass(FeatureType.Technique, Technique) }
    get spells$(): Observable<Spell[]> { return this._dataOfTypeAsClass(FeatureType.Spell, Spell) }
    get traits$(): Observable<Trait[]> { return this._dataOfTypeAsClass(FeatureType.Trait, Trait) }
    get equipment$(): Observable<Equipment[]> { return this._dataOfTypeAsClass(FeatureType.Equipment, Equipment) }

    get allFeatures$() { return combineLatest([this.skills$, this.techniques$, this.spells$, this.traits$, this.equipment$]) }
    get allFeaturesFlat$() { return this.allFeatures$.pipe(map(feature => feature.flat())) }

    get meleeWeapons$() { return this.allFeaturesFlat$.pipe(map(features => features.flatMap(feature => feature.meleeWeapons as MeleeWeapon[]))) }
    get rangedWeapons$() { return this.allFeaturesFlat$.pipe(map(features => features.flatMap(feature => feature.rangedWeapons as RangedWeapon[]))) }
    get weapons$() { return combineLatest([this.meleeWeapons$, this.rangedWeapons$]) }

    get bonuses$() {
        return this.allFeaturesFlat$.pipe(
            map(features =>
                features.flat().filter(feature => feature.exists).map(feature => ({
                    id: feature.id,
                    disabled: feature.keys.disabled,
                    bonuses: feature.keys.bonuses,
                    bonus: 0
                }))
            )
        )
    }

    get carriedWeight$() {
        return this.equipment$.pipe(
            mergeMap(equipment => equipment.filter(item => !item.keys.disabled)),
            reduce((weight, equipment) => weight, 0)
        )
    }
    get encumbranceLevel$() { return null }

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
    get attributes$(): Observable<KeyList<Attribute>> { return this.instance$.pipe(map(sheet => sheet.attributes)) }
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
    get pools$() { return this.instance$.pipe(map(sheet => sheet.pools)) }
    get hitLocations$() {
        return this.data$.pipe(
            map(data => {
                return Object.entries(
                    parseHitLocations(data.keys.config.locations)
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
                const racialPoints = 0;
                const advantages = 0;
                const perks = 0;
                const disadvantages = 0;
                const quirks = 0;
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
