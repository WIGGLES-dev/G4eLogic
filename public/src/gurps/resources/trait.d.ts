import { Data, Resource } from "@internal";
import { Observable } from "rxjs";
export interface TraitModifierData {
    type: "trait";
    enabled: boolean;
    name: string;
    cost: number;
    costType: TraitModifierType;
    levels: number;
    hasLevels: boolean;
    affects: TraitModifierAffects;
}
export declare enum ControlRating {
    CannotResist = "none",
    ResistRarely = 6,
    ResistFairlyOften = 9,
    ResistQuiteOften = 12,
    ResistAlmostAlway = 15,
    NoneRequired = "n/a"
}
export declare enum TraitModifierType {
    Percentage = "percentage",
    Points = "points",
    Multiplier = "multiplier"
}
export declare enum TraitModifierAffects {
    Base = "base only",
    Levels = "levels only",
    Total = "total"
}
export declare enum TraitType {
    Mental = "Mental",
    Physical = "Physical",
    Social = "Social",
    Exotic = "Exotic"
}
export interface TraitData extends Data {
    version__: typeof Trait["version"];
    type: typeof Trait["type"];
    basePoints: number;
    hasLevels: boolean;
    levels: number;
    pointsPerLevel: number;
    allowHalfLevel: boolean;
    hasHalfLevel: boolean;
    roundDown: boolean;
    controlRating: ControlRating;
    types: TraitType[];
    modifiers: TraitModifierData[];
}
export declare class Trait extends Resource<TraitData> {
    static version: number;
    static type: string;
    constructor(state: Trait["state"]);
    selectAdjustedPoints(): Observable<number>;
}
export declare function calculateTraitCost({ basePoints, hasLevels, levels, hasHalfLevel, roundDown, controlRating, pointsPerLevel, modifiers }: TraitData): number;
export declare function costModifier(modifier: TraitModifier): number;
export declare function modifyPoints(points: number, modifier: number): number;
export declare function calculateModifierPoints(points: number, modifier: number): number;
export declare function applyRounding(value: number, roundCostDown: boolean): number;
export interface TraitModifier {
    enabled: boolean;
    cost: number;
    costType: TraitModifierType;
    levels: number;
    affects: TraitModifierAffects;
    hasLevels: boolean;
}
export declare enum TraitCategory {
    Advantage = "advantage",
    Perk = "perk",
    Disadavantage = "disadvantage",
    Quirk = "quirk",
    Feature = "feature",
    Racial = "racial",
    Meta = "meta",
    Language = "language",
    Culture = "culture",
    Never = -1
}
export declare function isAdvantage(trait: TraitData): boolean;
export declare function isPerk(trait: TraitData): boolean;
export declare function isDisadvantage(trait: TraitData): boolean;
export declare function isQuirk(trait: TraitData): boolean;
export declare function isFeature(trait: TraitData): boolean;
export declare function getCategory(tags: string[]): -1 | TraitCategory.Advantage | TraitCategory.Perk | TraitCategory.Disadavantage | TraitCategory.Quirk | TraitCategory.Feature | TraitCategory.Racial | TraitCategory.Meta;
export declare function getContainerType(traits: Trait["value"][]): TraitCategory.Advantage | TraitCategory.Perk | TraitCategory.Disadavantage | TraitCategory.Quirk | TraitCategory.Feature | TraitCategory.Racial | TraitCategory.Meta;
export declare function getTraitType(trait: Trait["value"]): number | TraitCategory.Advantage | TraitCategory.Perk | TraitCategory.Disadavantage | TraitCategory.Quirk | TraitCategory.Feature | TraitCategory.Racial | TraitCategory.Meta;
export declare function split(traits: Trait["value"][]): Record<string, TraitData[]>;
export declare function sumTraitArray(traits: Trait["value"][]): number;
export declare function removeDuplicates<T extends {
    id: string;
}>(lists: {
    [key: string]: T[];
}): Record<string, T[]>;
