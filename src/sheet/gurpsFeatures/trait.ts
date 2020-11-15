
import {
    Feature,
    FeatureType,
    featureData,
    FeatureData,
    Sheet
} from "@internal"
import { map } from "rxjs/operators"

export const traitData = (): TraitData => ({
    ...featureData(),
    type: FeatureType.Trait,
    basePoints: 0,
    hasLevels: false,
    levels: null,
    pointsPerLevel: null,
    allowHalfLevel: false,
    hasHalfLevel: false,
    roundDown: false,
    controlRating: null,
    types: [],
    modifiers: []
});

export interface TraitData extends FeatureData {
    type: FeatureType.Trait
    basePoints: number
    hasLevels: boolean
    levels: number
    pointsPerLevel: number
    allowHalfLevel: boolean
    hasHalfLevel: boolean
    roundDown: boolean
    controlRating: ControlRating
    types: TraitType[]
    modifiers: TraitModifierData[]
}
export interface TraitModifierData {
    type: FeatureType.Trait
    enabled: boolean
    cost: number,
    costType: TraitModifierType
    levels: number
    hasLevels: boolean
    affects: TraitModifierAffects
}
export enum ControlRating {
    CannotResist = "none",
    ResistRarely = "6",
    ResistFairlyOften = "9",
    ResistQuiteOften = "12",
    ResistAlmostAlway = "15",
    NoneRequired = "n/a"
}
export enum TraitModifierType {
    Percentage = "percentage",
    Points = "points",
    Multiplier = "multiplier",
}
export enum TraitModifierAffects {
    Base = "base_only",
    Levels = "levels_only",
    Total = "total"
}
export enum TraitType {
    Mental = "Mental",
    Physical = "Physical",
    Social = "Social",
    Exotic = "Exotic",
}



export class Trait extends Feature<FeatureType.Trait, TraitData> {
    type = FeatureType.Trait as FeatureType.Trait
    constructor(id: string, sheet?: Sheet) {
        super(id, sheet)
    }
    defaultData() { return traitData() }
    get adjustedPoints$() { return this.instance$.pipe(map(instance => calculateTraitCost(instance.keys))) }
}

export function calculateTraitCost(
    {
        basePoints,
        hasLevels,
        levels,
        hasHalfLevel,
        roundDown,
        controlRating,
        pointsPerLevel,
        modifiers
    }: TraitData
) {
    let baseEnh = 0;
    let levelEnh = 0;
    let baseLim = 0;
    let levelLim = 0;
    let multiplier = getControlRatingMultipland(controlRating);

    modifiers.forEach(modifier => {
        if (modifier.enabled) {
            let mod = costModifier(modifier);
            switch (modifier.costType) {
                case TraitModifierType.Percentage:
                default:
                    switch (modifier.affects) {
                        case TraitModifierAffects.Total:
                        default:
                            if (mod < 0) {
                                baseLim += mod;
                                levelLim += mod;
                            } else {
                                baseEnh += mod;
                                levelEnh += mod;
                            }
                            break
                        case TraitModifierAffects.Base:
                            if (mod < 0) {
                                baseLim += mod;
                            } else {
                                baseEnh += mod;
                            }
                            break
                        case TraitModifierAffects.Levels:
                            if (mod < 0) {
                                levelLim += mod;
                            } else {
                                levelEnh += mod;
                            }
                            break
                    }
                    break
                case TraitModifierType.Points:
                    switch (modifier.affects) {
                        case TraitModifierAffects.Total:
                        case TraitModifierAffects.Base:
                        default:
                            basePoints += mod;
                            break
                        case TraitModifierAffects.Levels:
                            pointsPerLevel += mod;
                            break
                    }
                    break
                case TraitModifierType.Multiplier:
                    multiplier *= mod;
                    break
            }
        }
    });

    let modifiedBasePoints = basePoints;

    let leveledPoints =
        hasLevels ?
            pointsPerLevel * (levels + (hasHalfLevel ? .5 : 0)) || 0
            : 0;
    if (baseEnh !== 0 || baseLim !== 0 || levelEnh !== 0 || levelLim !== 0) {
        if (false) {
            //TODO multiplicative modifiers
        } else {
            let baseMod = Math.max(baseEnh + baseLim, -80);
            let levelMod = Math.max(levelEnh + levelLim, -80);

            modifiedBasePoints = baseMod === levelMod ?
                modifyPoints((modifiedBasePoints + leveledPoints), baseMod) :
                modifyPoints(modifiedBasePoints, baseMod) + modifyPoints(leveledPoints, levelMod);
        }
    } else {
        modifiedBasePoints += (leveledPoints);
    }
    return applyRounding((modifiedBasePoints * multiplier), Boolean(roundDown))
}

function getControlRatingMultipland(cr: ControlRating) {
    switch (cr) {
        case ControlRating.CannotResist: return 2.5
        case ControlRating.ResistRarely: return 2
        case ControlRating.ResistFairlyOften: return 1.5
        case ControlRating.ResistQuiteOften: return 1
        case ControlRating.ResistAlmostAlway: return 0.5
        default: return 1
    }
}

export function costModifier(modifier: TraitModifier) {
    return modifier.hasLevels && modifier.levels > 0 ? modifier.cost * modifier.levels : modifier.cost
}

export function modifyPoints(points: number, modifier: number) { return points + calculateModifierPoints(points, modifier); }
export function calculateModifierPoints(points: number, modifier: number) { return points * (modifier / 100) }
export function applyRounding(value: number, roundCostDown: boolean) { return roundCostDown ? Math.floor(value) : Math.ceil(value) }

export interface TraitModifier {
    enabled: boolean
    cost: number,
    costType: TraitModifierType
    levels: number
    affects: TraitModifierAffects
    hasLevels: boolean
}

export enum TraitCategory {
    Advantage,
    Perk,
    Disadavantage,
    Quirk,
    Feature,
    Racial,
    Meta,
    Language,
    Culture
}

export function isAdvantage(trait: TraitData) {
    return trait.basePoints > 1
        || trait.pointsPerLevel > 1
        || calculateTraitCost(trait) > 1
}
export function isPerk(trait: TraitData) {
    return (trait.basePoints === 1 || !trait.basePoints)
        && (trait.hasLevels ? trait.pointsPerLevel === 1 : true)
        && calculateTraitCost(trait) !== 0
}
export function isDisadvantage(trait: TraitData) {
    return trait.basePoints < -1
        || trait.pointsPerLevel < -1
        || calculateTraitCost(trait) < -1
}
export function isQuirk(trait: TraitData) {
    return (trait.basePoints === -1 || !trait.basePoints)
        && (trait.hasLevels ? trait.pointsPerLevel === -1 : true)
        && calculateTraitCost(trait) !== 0
}
export function isFeature(trait: TraitData) {
    return !trait.basePoints
        && !trait.pointsPerLevel
        && calculateTraitCost(trait) === 0
}

export function getCategory(trait: TraitData) {
    const categories = trait.categories?.join(" ");
    if (/meta/i.test(categories)) return TraitCategory.Meta
    if (/racial/i.test(categories)) return TraitCategory.Racial
    if (/quirk/i.test(categories)) return TraitCategory.Quirk
    if (/disadvantage/i.test(categories)) return TraitCategory.Disadavantage
    if (/perk/i.test(categories)) return TraitCategory.Perk
    if (/advantage/i.test(categories)) return TraitCategory.Advantage
    if (/feature/i.test(categories)) return TraitCategory.Feature
    return -1
}

export function getContainerType(traits: Trait[]) {
    let racial = false;
    let perk = false;
    let advantage = false;
    let quirk = false;
    let disadvantage = false;
    let feature = false;

    // iterate once over the children and gather the information we need to determine the type
    let types = traits.map(child => {
        let type = getTraitType(child);
        switch (type) {
            case TraitCategory.Racial: racial = true; break;
            case TraitCategory.Perk: perk = true; break;
            case TraitCategory.Advantage: advantage = true; break;
            case TraitCategory.Quirk: quirk = true; break;
            case TraitCategory.Disadavantage: disadvantage = true; break;
            case TraitCategory.Feature: feature = true; break;
        }
        return type
    });

    // no need to check for all conditions, they couldn't show up if the previous one returns
    if (!types.some(type => type !== TraitCategory.Racial)) return TraitCategory.Racial;
    if (!types.some(type => type !== TraitCategory.Perk)) return TraitCategory.Perk;
    if (!types.some(type => type !== TraitCategory.Advantage)) return TraitCategory.Advantage;
    if (!types.some(type => type !== TraitCategory.Quirk)) return TraitCategory.Quirk;
    if (!types.some(type => type !== TraitCategory.Disadavantage)) return TraitCategory.Disadavantage;
    if (!types.some(type => type !== TraitCategory.Feature)) return TraitCategory.Feature;

    // if we don't have a homogenous container put it into meta traits
    if (!advantage && !perk && (disadvantage || quirk)) return TraitCategory.Disadavantage
    if (!disadvantage && !quirk && (advantage || perk)) return TraitCategory.Advantage
    return TraitCategory.Meta;
}

export function getTraitType(trait: Trait) {
    let type = getCategory(trait.keys);

    if (trait.children.length > 0) {
        return getContainerType(trait.children.filter((trait): trait is Trait => trait.keys.type === FeatureType.Trait))
    }
    if (type > -1) return type

    const perk = isPerk(trait.keys)
    const advantage = isAdvantage(trait.keys)
    const quirk = isQuirk(trait.keys)
    const disadvantage = isDisadvantage(trait.keys)
    const feature = isFeature(trait.keys)

    if (quirk) return TraitCategory.Quirk;
    if (disadvantage) return TraitCategory.Disadavantage;
    if (perk) return TraitCategory.Perk;
    if (advantage) return TraitCategory.Advantage;
    if (feature) return TraitCategory.Feature;

    type = TraitCategory.Meta;
    return type
}

export function split(traits: Trait[]) {
    return removeDuplicates({
        advantages: traits.filter(trait => getTraitType(trait) === TraitCategory.Advantage),
        disadvantages: traits.filter(trait => getTraitType(trait) === TraitCategory.Disadavantage),
        racial: traits.filter(trait => getTraitType(trait) === TraitCategory.Racial),
        meta: traits.filter(trait => getTraitType(trait) === TraitCategory.Meta),
        perks: traits.filter(trait => getTraitType(trait) === TraitCategory.Perk),
        quirks: traits.filter(trait => getTraitType(trait) === TraitCategory.Quirk),
        features: traits.filter(trait => getTraitType(trait) === TraitCategory.Feature)
    })
}

/**
 * Reducing Algorithm to remove duplicates from derived lists. Any item that appears
 * in the list later on, based on the order of the keys. Things earlier in the lists will
 * be overridden by things later in the list. Be sure to account for that when using this function.
 * @param lists A series of lists to remove the duplicates from
 */
export function removeDuplicates(lists: { [key: string]: Trait[] }) {
    const checked = new Set();
    return Object.entries(lists).reduce((prev, [key, list]) => {
        checked.add(key);
        const checkAgainst = Object.entries(lists).filter(([key1, list]) => {
            key !== key1 && !checked.has(key1)
        }).map(values => values[1]).flat().map(list => list.id);
        let newCollection = list.filter(item => !checkAgainst.includes(item.id));
        lists[key] = newCollection;
        return prev
    }, lists)
}