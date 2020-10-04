import { TraitModifier, TraitModifierType, TraitModifierAffects } from "./trait";

export function getAdjustedPoints(
    modifiers: Set<TraitModifier> = new Set(),
    basePoints: number = 0,
    hasLevels: boolean = false,
    hasHalfLevel: boolean = false,
    pointsPerLevel: number = 0,
    levels: number = 0,
    roundDown: boolean = false,
    controlMultipler = 1
) {
    let baseEnh = 0;
    let levelEnh = 0;
    let baseLim = 0;
    let levelLim = 0;
    let multiplier = controlMultipler;

    modifiers.forEach(modifier => {
        if (modifier.enabled) {
            let mod = modifier.costModifier();
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
                TraitModifier.modifyPoints((modifiedBasePoints + leveledPoints), baseMod) :
                TraitModifier.modifyPoints(modifiedBasePoints, baseMod) + TraitModifier.modifyPoints(leveledPoints, levelMod);
        }
    } else {
        modifiedBasePoints += (leveledPoints);
    }
    return TraitModifier.applyRounding((modifiedBasePoints * multiplier), Boolean(roundDown))
}