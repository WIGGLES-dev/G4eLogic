import { Modifier } from "./misc/modifier";
import { List, ListItem } from "./misc/list";
import { Character } from "./character";
export declare class TraitList extends List<Trait> {
    constructor(character: Character);
    populator(data: any): any;
    sumRacials(): number;
    sumAdvantages(): number;
    sumDisadvantages(): number;
    sumQuirks(): number;
}
declare enum ContainerType {
    group = "",
    metaTrait = "meta trait",
    race = "race",
    alternativeAbilities = "alternative abilities"
}
export declare class Trait extends ListItem<Trait> {
    static keys: string[];
    version: number;
    tag: string;
    hasLevels: boolean;
    name: string;
    basePoints: number;
    levels: number;
    allowHalfLevels: boolean;
    hasHalfLevel: boolean;
    roundDown: boolean;
    controlRating: ControlRollMultiplier;
    types: Set<TraitType>;
    pointsPerLevel: number;
    disabled: boolean;
    containerType: ContainerType;
    modifiers: Set<TraitModifier>;
    constructor(list: List<Trait>, keys?: string[]);
    isActive(): boolean;
    getLevel(): number;
    isRacial(): Boolean;
    childrenPoints(): number;
    static getCRMultipland(cr: ControlRollMultiplier): 1 | 2 | 2.5 | 1.5 | 0.5;
    adjustedPoints(): number;
    disable(): void;
    enable(): void;
    static getAdjustedPoints(modifiers: Set<TraitModifier>, trait: Trait): number;
    addModifier(): TraitModifier;
    toR20(): {
        key: any;
        row_id: string;
        data: {
            name: string;
            points: number;
            ref: string;
            notes: string;
        };
    };
}
export declare class TraitModifier extends Modifier<Trait> {
    static keys: string[];
    tag: string;
    version: number;
    cost: number;
    type: TraitModifierType;
    levels: number;
    affects: TraitModifierAffects;
    hasLevels: boolean;
    constructor(owner: Trait, keys?: any[]);
    costModifier(): number;
    static modifyPoints(points: number, modifier: number): number;
    static calculateModifierPoints(points: number, modifier: number): number;
    static applyRounding(value: number, roundCostDown: boolean): number;
}
declare enum TraitModifierType {
    percentage = "percentage",
    points = "points",
    multiplier = "multiplier"
}
declare enum TraitModifierAffects {
    base = "base_only",
    levels = "levels_only",
    total = "total"
}
export declare enum TraitType {
    mental = "Mental",
    physical = "Physical",
    social = "Social",
    exotic = "Exotic"
}
declare enum ControlRollMultiplier {
    cannotResist = "0",
    resistRarely = "6",
    resistFairlyOften = "9",
    resistQuiteOften = "12",
    resistAlmostAlway = "15",
    noneRequired = ""
}
export {};
