export interface TraitData {
    id: string
    basePoints: number
    hasLevels: boolean
    levels: number
    allowHalfLevels: boolean
    hasHalfLevel: boolean
    roundDown: boolean
    controlRating: ControlRating
    types: string[]
    pointsPerLevel
    categories: string[],
    modifiers: TraitModifier[]
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
        case ControlRating.cannotResist: return 2.5
        case ControlRating.resistRarely: return 2
        case ControlRating.resistFairlyOften: return 1.5
        case ControlRating.resistQuiteOften: return 1
        case ControlRating.resistAlmostAlway: return 0.5
        default: return 1
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

export enum ControlRating {
    cannotResist = "none",
    resistRarely = "6",
    resistFairlyOften = "9",
    resistQuiteOften = "12",
    resistAlmostAlway = "15",
    noneRequired = "n/a"
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