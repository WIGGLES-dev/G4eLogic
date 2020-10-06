import { Trait } from "./trait";

export enum TraitCategory {
    Advantage,
    Perk,
    Disadavantage,
    Quirk,
    Feature,
    Racial,
    Meta,
}

function isAdvantage(trait: Trait) {
    return !isRacial(trait)
        && (trait.categories.has("Advantage")
            || trait.basePoints > 1
            || trait.pointsPerLevel > 1
            || trait.adjustedPoints() > 1)
}
function isPerk(trait: Trait) {
    return !isRacial(trait)
        && (trait.categories.has("Perk")
            || (trait.basePoints === 1
                && trait.pointsPerLevel === 1
                && trait.adjustedPoints() === 1)
        )
}
function isDisadvantage(trait: Trait) {
    return !isRacial(trait)
        && (trait.categories.has("Disadvantage")
            || trait.basePoints > 1
            || trait.pointsPerLevel > 1
            || trait.adjustedPoints() < -1)
}
function isQuirk(trait: Trait) {
    return !isRacial(trait)
        && (trait.categories.has("Quirk")
            || (trait.basePoints === -1
                && trait.pointsPerLevel === -1
                && trait.adjustedPoints() === -1)
        )
}
function isFeature(trait: Trait) {
    return !isRacial(trait)
        && (trait.categories.has("Feature")
            || (!trait.basePoints
                && !trait.pointsPerLevel
                && trait.adjustedPoints() === 0)
        )
}
function isRacial(trait: Trait) {
    return trait.categories.has("Racial")
}

function getContainerType(trait: Trait) {
    if (trait.isContainer()) {
        const children = trait.children.arr;

        let racial = false;
        let perk = false;
        let advantage = false;
        let quirk = false;
        let disadvantage = false;
        let feature = false;

        // iterate once over the children and gather the information we need to determine the type
        children.forEach(child => {
            let type = getTraitType(child);
            switch (type) {
                case TraitCategory.Racial: racial = true; break;
                case TraitCategory.Perk: perk = true; break;
                case TraitCategory.Advantage: advantage = true; break;
                case TraitCategory.Quirk: quirk = true; break;
                case TraitCategory.Disadavantage: disadvantage = true; break;
                case TraitCategory.Feature: feature = true; break;
            }
        });

        // no need to check for all conditions, they couldn't show up if the previous one returns
        if (!perk && !advantage && !quirk && !disadvantage && !feature && racial) return TraitCategory.Racial;
        if (!advantage && !quirk && !disadvantage && !feature && perk) return TraitCategory.Perk;
        if (!quirk && !disadvantage && !feature && advantage) return TraitCategory.Advantage;
        if (!disadvantage && !feature && quirk) return TraitCategory.Quirk;
        if (!feature && disadvantage) return TraitCategory.Disadavantage;
        if (feature) return TraitCategory.Feature;

        // if we don't have a homogenous container we need to determine its type
        if (advantage) return TraitCategory.Advantage
        if (disadvantage) return TraitCategory.Disadavantage

        // lastly return the type of the container if no flags are raised
        let type: TraitCategory = getTraitType(trait);
        return type
    } else {
        return getTraitType(trait)
    }
}

export function getTraitType(trait: Trait) {
    if (trait.children.length > 0) {
        return getContainerType(trait)
    } else {
        const racial = isRacial(trait);
        const perk = isPerk(trait);
        const advantage = isAdvantage(trait);
        const quirk = isQuirk(trait);
        const disadvantage = isDisadvantage(trait);
        const feature = isFeature(trait);
        if (racial) return TraitCategory.Racial;
        if (perk) return TraitCategory.Perk;
        if (advantage) return TraitCategory.Advantage;
        if (quirk) return TraitCategory.Quirk;
        if (disadvantage) return TraitCategory.Disadavantage;
        if (feature) return TraitCategory.Feature;
        return TraitCategory.Meta
    }
}