import { combineLatest, from, merge, Observable } from "rxjs";
import { catchError, filter, map, mergeAll, mergeMap, pluck, reduce, switchMap, toArray } from "rxjs/operators";
import {
    Resource,
    Config,
    AttributeLevel,
    Attribute,
    parseHitLocations,
    HitLocation,
    Gurps,
    Skill,
    Trait,
    Technique,
    Spell,
    split,
    sumTraitArray,
    Equipment,
    TraitCategory,
    Data,
    reduceToArray,
    matchArray,
    each,
} from "@internal";
export interface CharacterData extends Data {
    version: typeof Character["version"]
    type: typeof Character["type"]
    config: Config
    pointTotal: number
    notes: string
    profile: ProfileData
    hitLocationDamage: Record<string, number>,
    attributeLevels: Record<string, AttributeLevel>
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

export class Character extends Resource<CharacterData> {
    static type = "character"
    static version = 1
    constructor(identity: Character["identity"]) {
        super(identity);
    }
    selectRangedWeapons() { return this.selectAllChildren().pipe() }
    selectMeleeWeapons() { }
    selectWeapons() { }
    selectCarriedWeight() {
        return this.selectChildren("equipment", Equipment, { activeOnly: true }).pipe(
            mergeMap(each(item => item.selectExtendedWeight())),
            mergeAll(),
            reduce((t, w) => t + w, 0)
        )
    }
    selectEncumbranceLevel() {
        return combineLatest([
            this.selectBasicLift(),
            this.selectCarriedWeight()
        ])
            .pipe(map(([bl, weight]) => Gurps.encumbranceLevel(bl, weight)))
    }

    selectAttributes() {
        return combineLatest([
            this.selectKeys().pipe(
                pluck("config", "attributes"),
            ),
            this.selectAllFeatures()
                .pipe(
                    matchArray({
                        type: "attribute bonus",
                    }),
                )
        ]).pipe(
            //log("selecting all attributes"),
            map(([attributes, bonuses]) =>
                Object.entries(attributes)
                    .reduce((collection, [signature, data]) => {
                        const finalBonus = bonuses
                            .filter(b => b.constraint.attribute === signature)
                            .map(f => f.bonus)
                            .reduce((t, b) => t + b, 0)
                        collection[signature] = new Attribute(this, data, signature, collection, finalBonus)
                        return collection
                    }, {} as Record<string, Attribute>)
            )
        )
    }
    selectAttribute(key: string) {
        return this.selectAttributes().pipe(
            pluck(key)
        )
    }
    get attributes$() {
        return this.selectAttributes().pipe(
            map(collection => Object.values(collection)),
            mergeMap(i => i),
            filter(attr => !attr.keys.isPool),
            reduceToArray
        )
    }
    get orderedAttributes$(): Observable<Attribute[]> {
        return combineLatest([
            this.selectKeys().pipe(
                pluck("config", "ui", "attributeOrder"),
            ),
            this.selectAttributes()
        ]).pipe(
            map(([order, collection]) => order
                .map(attr => collection[attr])
                .filter(i => i)
            ),
            catchError(err => this.selectAttributes().pipe(
                map(collection => Object.values(collection))
            ))
        )
    }
    get pools$() {
        return this.selectAttributes().pipe(
            map(collection => Object.values(collection)),
            mergeMap(i => i),
            filter(attr => attr.keys.isPool),
            reduceToArray
        )
    }
    get orderedPools$() {
        return combineLatest([
            this.selectKeys().pipe(
                pluck("config", "ui", "poolOrder")
            ),
            this.selectAttributes()
        ]).pipe(
            map(([order, collection]) => order
                .map(attr => collection[attr])
                .filter(i => i)
            ),
            catchError(err => this.pools$)
        )
    }
    selectHitLocations$(): Observable<Record<string, HitLocation>> {
        return combineLatest([
            this.selectKeys().pipe(
                pluck("config", "locations"),
                map(parseHitLocations)
            ),
            this.selectAttributes(),
            this.selectAllFeatures().pipe(
                matchArray({
                    type: "armor bonus"
                })
            )
        ]).pipe(
            map(([locations, attributes, bonuses]) => Object.entries(locations)
                .reduce((locations, [location, data]) => {
                    const armorBonus = bonuses
                        ?.filter(b => b?.constraint?.location === location)
                        ?.map(b => b?.bonus)
                        ?.reduce((t, b) => t + b, 0)
                        ?? 0
                    locations[location] = new HitLocation(this, data, location, locations, {
                        armorBonus,
                        hitPoints: attributes["hit points"].calculateLevel()
                    })
                    return locations
                }, {} as Record<string, HitLocation>)
            )
        )
    }
    selectHitLocation(key: string) {
        return this.selectHitLocations$()
            .pipe(
                pluck(key)
            )
    }
    get hitLocations$() { return this.selectHitLocations$() }
    get swingDamage$() {
        return this
            .selectAttribute("striking strength")
            .pipe(
                map(attribute =>
                    Gurps.getSwingDamage(
                        attribute
                            ?.calculateLevel()
                        ?? 10)
                )
            )
    }
    get thrustDamage$() {
        return this
            .selectAttribute("striking strength")
            .pipe(
                map(attribute =>
                    Gurps.getThrustDamage(
                        attribute
                            ?.calculateLevel()
                        ?? 10)
                )
            )
    }
    selectBasicLift() {
        return this
            .selectAttribute("lifting strength")
            .pipe(
                map(attribute =>
                    Gurps
                        .basicLift(
                            attribute
                                ?.calculateLevel()
                            ?? 10
                        ))
            )
    }
    get pointTotal$() {
        const sumSkillLike = (src: Observable<(Skill | Technique | Spell)[]>) => src.pipe(
            map(each(s => s.getKeys())),
            map(each(s => s.points)),
            map(n => n.reduce((t, p) => t + p, 0))
        )
        return combineLatest([
            this.selectKeys(),
            this.selectAttributes() as Observable<Record<string, Attribute>>,
            this.selectChildren("trait", Trait).pipe(map(split)),
            this.selectChildren("skill", Skill).pipe(sumSkillLike),
            this.selectChildren("technique", Technique).pipe(sumSkillLike),
            this.selectChildren("spell", Spell).pipe(sumSkillLike)
        ]).pipe(
            map(([data, attributes, traits, skills, techniques, spells]) => {
                //console.log("summing point total");
                const total = data.pointTotal;
                const attributePoints = Object.values(attributes).reduce(
                    (points, attribute) => points + (attribute.pointsSpent() || 0), 0
                );
                const racialPoints = sumTraitArray(traits[TraitCategory.Racial]);
                const advantages = sumTraitArray(traits[TraitCategory.Advantage]);
                const perks = sumTraitArray(traits[TraitCategory.Perk]);
                const disadvantages = sumTraitArray(traits[TraitCategory.Disadavantage]);
                const quirks = sumTraitArray(traits[TraitCategory.Quirk]);
                const spent =
                    + attributePoints
                    + racialPoints
                    + advantages
                    + perks
                    + disadvantages
                    + quirks
                    + skills
                    + techniques
                    + spells;
                return {
                    attributePoints,
                    racialPoints,
                    advantages,
                    perks,
                    disadvantages,
                    quirks,
                    skills,
                    techniques,
                    spells,
                    spent,
                    total,
                    unspent: total - spent
                }
            })
        )
    }
}