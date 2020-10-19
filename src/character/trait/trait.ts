import { Modifier } from "../misc/modifier";
import { List, ListItem, removeDuplicates } from "../misc/list";
import { getAdjustedPoints } from "./logic";
import { getTraitType, TraitCategory } from "./sorting";

export class TraitList extends List<Trait> {
    constructor() {
        super("trait");
    }

    populator(data: any) {
        return new Trait(this)
    }

    split() {
        let root = this.rootItems();
        let splits = {
            features: root.filter(trait => getTraitType(trait) === TraitCategory.Feature),
            disadvantages: root.filter(trait => getTraitType(trait) === TraitCategory.Disadavantage),
            quirks: root.filter(trait => getTraitType(trait) === TraitCategory.Quirk),
            advantages: root.filter(trait => getTraitType(trait) === TraitCategory.Advantage),
            perks: root.filter(trait => getTraitType(trait) === TraitCategory.Perk),
            meta: root.filter(trait => getTraitType(trait) === TraitCategory.Meta),
            racial: root.filter(trait => getTraitType(trait) === TraitCategory.Racial),
        }
        return removeDuplicates(splits) as { [key: string]: Trait[] }
    }
}

export class Trait extends ListItem {
    static keys = [
        "basePoints", "hasLevels", "levels", "allowHalfLevels",
        "hasHalfLevel", "roundDown", "controlRating", "types",
        "pointsPerLevel"]

    basePoints: number = 0
    hasLevels: boolean = false
    levels: number = null
    pointsPerLevel: number = null
    allowHalfLevels: boolean = false
    hasHalfLevel: boolean = false
    roundDown: boolean = false

    controlRating: ControlRollMultiplier = ControlRollMultiplier.noneRequired
    types: Set<TraitType> = new Set()

    modifiers: Set<TraitModifier> = new Set()

    constructor(list: List<Trait>, keys: string[] = []) {
        super(list, [...keys, ...Trait.keys]);
    }

    isActive() { return !this.disabled }
    getLevel() { return this.levels }

    static getCRMultipland(cr: ControlRollMultiplier) {
        switch (cr) {
            case ControlRollMultiplier.cannotResist: return 2.5
            case ControlRollMultiplier.resistRarely: return 2
            case ControlRollMultiplier.resistFairlyOften: return 1.5
            case ControlRollMultiplier.resistQuiteOften: return 1
            case ControlRollMultiplier.resistAlmostAlway: return 0.5
            default: return 1
        }
    }

    adjustedPoints({ children = true } = {}) {
        if (this.isContainer() && children) {
            return [...this.children].reduce((prev, cur) => prev + cur.adjustedPoints(), 0)
        } else {
            return getAdjustedPoints(this.modifiers, this.basePoints, this.hasLevels, this.hasHalfLevel, this.pointsPerLevel, this.levels, this.roundDown, Trait.getCRMultipland(this.controlRating))
        }
    }

    addModifier(): TraitModifier {
        return new TraitModifier(this);
    }
}

export class TraitModifier extends Modifier<Trait> {
    static keys = ["cost", "type", "levels", "hasLevels", "affects"]

    cost: number
    costType: TraitModifierType
    levels: number
    affects: TraitModifierAffects

    hasLevels: boolean = false

    constructor(owner: Trait, keys = []) {
        super(owner, [...keys, ...TraitModifier.keys])
    }

    costModifier() {
        return this.hasLevels && this.levels > 0 ? this.cost * this.levels : this.cost
    }

    static modifyPoints(points: number, modifier: number) { return points + TraitModifier.calculateModifierPoints(points, modifier); }
    static calculateModifierPoints(points: number, modifier: number) { return points * (modifier / 100) }
    static applyRounding(value: number, roundCostDown: boolean) { return roundCostDown ? Math.floor(value) : Math.ceil(value) }
}

export enum TraitModifierType {
    percentage = "percentage",
    points = "points",
    multiplier = "multiplier",
}

export enum TraitModifierAffects {
    base = "base_only",
    levels = "levels_only",
    total = "total"
}

export enum TraitType {
    mental = "Mental",
    physical = "Physical",
    social = "Social",
    exotic = "Exotic",
}

export enum ControlRollMultiplier {
    cannotResist = "none",
    resistRarely = "6",
    resistFairlyOften = "9",
    resistQuiteOften = "12",
    resistAlmostAlway = "15",
    noneRequired = "n/a"
}