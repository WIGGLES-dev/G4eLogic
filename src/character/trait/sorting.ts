import { TraitType } from "index";
import { Trait } from "./trait";

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

function isAdvantage(trait: Trait) {
    return trait.basePoints > 1
        || trait.pointsPerLevel > 1
        || trait.adjustedPoints() > 1
}
function isPerk(trait: Trait) {
    return trait.basePoints === 1
        && trait.pointsPerLevel === 1
        && trait.adjustedPoints() === 1
}
function isDisadvantage(trait: Trait) {
    return trait.basePoints > 1
        || trait.pointsPerLevel > 1
        || trait.adjustedPoints() < -1
}
function isQuirk(trait: Trait) {
    return trait.basePoints === -1
        && trait.pointsPerLevel === -1
        && trait.adjustedPoints() === -1
}
function isFeature(trait: Trait) {
    return !trait.basePoints
        && !trait.pointsPerLevel
        && trait.adjustedPoints() === 0
}

function getCategory(trait: Trait) {
    const categories = [...trait.categories].join(" ");
    if (/meta/i.test(categories)) return TraitCategory.Meta
    if (/racial/i.test(categories)) return TraitCategory.Racial
    if (/quirk/i.test(categories)) return TraitCategory.Quirk
    if (/disadvantage/i.test(categories)) return TraitCategory.Disadavantage
    if (/perk/i.test(categories)) return TraitCategory.Perk
    if (/advantage/i.test(categories)) return TraitCategory.Advantage
    if (/feature/i.test(categories)) return TraitCategory.Feature
    return false
}

function getContainerType(trait: Trait) {
    if (trait.isContainer()) {
        const children = [...trait.children];

        let racial = false;
        let perk = false;
        let advantage = false;
        let quirk = false;
        let disadvantage = false;
        let feature = false;

        // iterate once over the children and gather the information we need to determine the type
        let types = children.map(child => {
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
    } else {
        return getTraitType(trait)
    }
}

export function getTraitType(trait: Trait) {
    if (trait.children.size > 0) {
        return getContainerType(trait)
    } else {
        let type = getCategory(trait);

        if (type > -1) return type

        const perk = isPerk(trait)
        const advantage = isAdvantage(trait)
        const quirk = isQuirk(trait)
        const disadvantage = isDisadvantage(trait)
        const feature = isFeature(trait)

        if (quirk) return TraitCategory.Quirk;
        if (disadvantage) return TraitCategory.Disadavantage;
        if (perk) return TraitCategory.Perk;
        if (advantage) return TraitCategory.Advantage;

        if (feature) return TraitCategory.Feature;

        type = TraitCategory.Meta;
        return type
    }
}