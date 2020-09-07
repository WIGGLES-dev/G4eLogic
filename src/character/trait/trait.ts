import { Modifier } from "../misc/modifier";
import { List, ListItem } from "../misc/list";
import { Character } from "../character";
import { json, objectify } from "@utils/json_utils";
import { Feature } from "../misc/feature";
import * as gcs from "@gcs/gcs";
import { getAdjustedPoints } from "./logic";


export class TraitList extends List<Trait> {
    constructor(character: Character) {
        super(character);
    }

    populator(data: any) {
        return new Trait(this)
    }

    sumRacials({ activeOnly = true } = {}) {
        return this.iter().reduce((prev, cur) => {
            if (cur.isRacial()) {
                if (activeOnly) {
                    if (!cur.disabled) prev += cur.adjustedPoints();
                } else {
                    prev += cur.adjustedPoints();
                }
            }
            return prev
        }, 0)
    }
    sumAdvantages({ activeOnly = true } = {}) {
        return this.iter().reduce((prev, cur) => {
            if (cur.isRacial()) return prev

            if (cur.categories.has("Advantage") || cur.categories.has("Perk") || cur.adjustedPoints() >= 1) {
                if (activeOnly) {
                    if (!cur.disabled) prev += cur.adjustedPoints();
                } else {
                    prev += cur.adjustedPoints();
                }
            }
            return prev
        }, 0)
    }
    sumDisadvantages({ activeOnly = true } = {}) {
        return this.iter().reduce((prev, cur) => {
            if (cur.isRacial()) return prev
            if (cur.categories.has("Disadvantage") || cur.adjustedPoints() < -1) {
                if (activeOnly) {
                    if (!cur.disabled) prev += cur.adjustedPoints();
                } else {
                    prev += cur.adjustedPoints();
                }
            }
            return prev
        }, 0);
    }
    sumQuirks({ activeOnly = true } = {}) {
        return this.iter().reduce((prev, cur) => {
            if (cur.isRacial()) return prev
            if (cur.categories.has("Quirk") || cur.adjustedPoints() === -1) {
                if (activeOnly) {
                    if (!cur.disabled) prev += cur.adjustedPoints();
                } else {
                    prev += cur.adjustedPoints();
                }
            }
            return prev
        }, 0);
    }

    splitByType() {
        return {
            advantages: this.iter().filter(trait => trait.categories.has("Advantage") || trait.adjustedPoints() > 1),
            perks: this.iter().filter(trait => trait.categories.has("Perk") || trait.adjustedPoints() === 1),
            disadvantages: this.iter().filter(trait => trait.categories.has("Disadvantage") || trait.adjustedPoints() < -1),
            quirks: this.iter().filter(trait => trait.categories.has("Quirk") || trait.adjustedPoints() === -1),
            languages: this.iter().filter(trait => trait.categories.has("Language")),
            racial: this.iter().filter(trait => trait.isRacial())
        }
    }
}

enum ContainerType {
    group = "",
    metaTrait = "meta trait",
    race = "race",
    alternativeAbilities = "alternative abilities"
}

export class Trait extends ListItem<Trait> {
    static keys = ["name", "basePoints", "levels", "allowHalfLevels", "hasHalfLevel", "roundDown", "controlRating", "types", ""]
    version = 1
    tag = "trait"

    name: string
    basePoints: number

    hasLevels: boolean = false
    levels: number = 0
    allowHalfLevels: boolean = false
    hasHalfLevel: boolean = false
    roundDown: boolean
    controlRating: ControlRollMultiplier

    types: Set<TraitType> = new Set()

    pointsPerLevel: number
    disabled: boolean = false
    containerType: ContainerType

    modifiers: Set<TraitModifier> = new Set()

    constructor(list: List<Trait>, keys: string[] = []) {
        super(list, [...keys, ...Trait.keys]);
    }

    isActive() { return !this.disabled }
    getLevel() { return this.levels }

    isRacial(): Boolean {
        if (!this.containedBy) {
            return false
        }
        if (this.containedBy.containerType === ContainerType.race) {
            return true
        } else {
            return this.containedBy.isRacial();
        }
    }

    childrenPoints(): number {
        return this.iterChildren().reduce((prev, cur) => {
            if (cur.canContainChildren) {
                prev += cur.findSelf().childrenPoints();
            } else {
                prev += cur.findSelf().adjustedPoints();
            }
            return prev
        }, 0)
    }

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

    adjustedPoints() {
        if (this.isContainer()) {
            return 0
        } else {
            return getAdjustedPoints(this.modifiers, this.basePoints, this.hasLevels, this.hasHalfLevel, this.pointsPerLevel, this.levels, this.roundDown)
        }
    }

    disable() { this.disabled = true; }
    enable() { this.disabled = false; }

    addModifier(): TraitModifier {
        const modifier = new TraitModifier(this);
        this.modifiers.add(modifier);
        return modifier
    }
}

export class TraitModifier extends Modifier<Trait> {
    static keys = ["cost", "type", "levels", "affects"]
    tag: string = "modifier"
    version: number = 1

    cost: number
    type: TraitModifierType
    levels: number
    affects: TraitModifierAffects

    hasLevels: boolean = false

    constructor(owner: Trait, keys = []) {
        super(owner, [...keys, ...TraitModifier.keys])
    }

    costModifier() {
        return this.levels > 0 ? this.cost * this.levels : this.cost
    }

    static modifyPoints(points: number, modifier: number) {
        return points + TraitModifier.calculateModifierPoints(points, modifier);
    }
    static calculateModifierPoints(points: number, modifier: number) {
        return points * (modifier / 100)
    }
    static applyRounding(value: number, roundCostDown: boolean) {
        return roundCostDown ? Math.floor(value) : Math.ceil(value)
    }
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

enum ControlRollMultiplier {
    cannotResist = "0",
    resistRarely = "6",
    resistFairlyOften = "9",
    resistQuiteOften = "12",
    resistAlmostAlway = "15",
    noneRequired = ""
}