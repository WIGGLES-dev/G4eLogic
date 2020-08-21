import { Modifier } from "./misc/modifier";
import { List, ListItem } from "./misc/list";
import { Character } from "./character";
import { json, objectify } from "@utils/json_utils";
import { Feature } from "./misc/feature";
import * as gcs from "@gcs/gcs";


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

    hasLevels: boolean

    name: string
    basePoints: number
    levels: number
    allowHalfLevels: boolean
    hasHalfLevel: boolean
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
            return Trait.getAdjustedPoints(this.modifiers, this)
        }
    }

    disable() { this.disabled = true; }
    enable() { this.disabled = false; }

    static getAdjustedPoints(modifiers: Set<TraitModifier>, trait: Trait): number {
        let basePoints = trait.basePoints || 0;
        let pointsPerLevel = trait.pointsPerLevel || 0;
        let levels = trait.levels || 0;

        let baseEnh = 0;
        let levelEnh = 0;
        let baseLim = 0;
        let levelLim = 0;
        let multiplier = 1;

        modifiers?.forEach(modifier => {
            if (modifier.enabled) {
                let mod = modifier.costModifier();
                console.log(mod);
                switch (modifier.type) {
                    case TraitModifierType.percentage:
                    default:
                        switch (modifier.affects) {
                            case TraitModifierAffects.total:
                            default:
                                if (mod < 0) {
                                    baseLim += mod;
                                    levelLim += mod;
                                } else {
                                    baseEnh += mod;
                                    levelEnh += mod;
                                }
                                break
                            case TraitModifierAffects.base:
                                if (mod < 0) {
                                    baseLim += mod;
                                } else {
                                    baseEnh += mod;
                                }
                                break
                            case TraitModifierAffects.levels:
                                if (mod < 0) {
                                    levelLim += mod;
                                } else {
                                    levelEnh += mod;
                                }
                                break
                        }
                        break
                    case TraitModifierType.points:
                        switch (modifier.affects) {
                            case TraitModifierAffects.total:
                            case TraitModifierAffects.base:
                            default:
                                basePoints += mod;
                                break
                            case TraitModifierAffects.levels:
                                pointsPerLevel += mod;
                                break
                        }
                        break
                    case TraitModifierType.multiplier:
                        multiplier *= mod;
                        break
                }
            }
        });

        let modifiedBasePoints = basePoints;

        let leveledPoints = pointsPerLevel * (levels + (trait.hasHalfLevel ? .5 : 0)) || 0;
        if (baseEnh !== 0 || baseLim !== 0 || levelEnh !== 0 || levelLim !== 0) {
            if (false) {
                //TODO multiplicative modifiers
            } else {
                let baseMod = Math.max(baseEnh + baseLim, -80);
                let levelMod = Math.max(levelEnh + levelLim, -80);

                modifiedBasePoints = baseMod === levelMod ?
                    TraitModifier.modifyPoints((modifiedBasePoints + leveledPoints), baseMod) :
                    TraitModifier.modifyPoints(modifiedBasePoints, baseMod) + TraitModifier.modifyPoints(leveledPoints, levelMod);
            }

        } else {
            modifiedBasePoints += (leveledPoints);
        }
        return TraitModifier.applyRounding((modifiedBasePoints * multiplier), Boolean(trait.roundDown))
    }
    addModifier(): TraitModifier {
        const modifier = new TraitModifier(this);
        this.modifiers.add(modifier);
        return modifier
    }

    toString() {
        return `${this.name} ${this.hasLevels ? this.hasHalfLevel ? "(.5)" : "" : `(${this.levels})`}`
    }

    toR20() {
        let key;
        const traitTemplate = {
            name: this.name,
            points: this.adjustedPoints(),
            ref: this.reference,
            notes: this.notes
        }
        const categories = this.categories;
        const activeModifiers = Array.from(this.modifiers);
        const perkFlag = categories.has("Perk") || this.adjustedPoints() === 1;
        const quirkFlag = categories.has("Quirk") || this.adjustedPoints() === -1;
        const advantageFlag = categories.has("Advantage") || this.adjustedPoints() >= 0;
        const disadvantageFlag = categories.has("Disadvantage") || this.adjustedPoints() < 0;
        const languageFlag = categories.has("Language");
        const nativeLanguageFlag = categories.has("Language") && activeModifiers.some(modifier => modifier.name === "Native");
        const racialFlag = this.isRacial();
        const cultureFlag = this.name.includes("Cultural Familiarity");
        if (nativeLanguageFlag) {

        } else if (languageFlag) {

        }
        else if (cultureFlag) {

        } else if (racialFlag) {
            key = "repeating_racial";
            Object.assign(traitTemplate, {
                cr: this.controlRating
            });
        } else if (quirkFlag) {
            key = "repeating_quirks";
            Object.assign(traitTemplate, {
                cr: this.controlRating
            });
        } else if (disadvantageFlag) {
            key = "repeating_disadvantages";
            Object.assign(traitTemplate, {
                cr: this.controlRating
            });
        } else if (perkFlag) {
            key = "repeating_perk";
            Object.assign(traitTemplate, {
                foa: this.controlRating
            });
        } else if (advantageFlag) {
            key = "repeating_traits";
            Object.assign(traitTemplate, {
                foa: this.controlRating
            });
        }
        return {
            key,
            row_id: this.r20rowID,
            data: traitTemplate
        }
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

enum TraitModifierType {
    percentage = "percentage",
    points = "points",
    multiplier = "multiplier",
}

enum TraitModifierAffects {
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