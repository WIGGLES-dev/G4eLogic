import { Signature, Character, Featurable } from "../character";
import { List, ListItem } from "../misc/list";
import { Feature, SkillBonus } from "../misc/feature";
import { StringCompare, stringCompare } from "utils/string_utils";
import { objectify, json, isArray } from "@utils/json_utils";
import { Default } from "../misc/default";
import * as gcs from "@gcs/gcs";
import { Constructor } from "../serialization/serializer";
import { calculateSkillLevel } from "./logic";


export class SkillList extends List<Skill> {
    populator = Skill

    constructor(character: Character) {
        super(character);
    }
}

/**
 * Skill-like entities are those that need to have a level calculated like the general skills in basic set (e.g Spells) but are not 
 * necessarily a generic basic set skill. This class is not meant to be instantiated directly but provides the core logic for determining
 * final skill levels.
 * 
 * @param name
 * @param difficulty
 * @param points
 * @param specialization
 * 
 * @override @param hasLevels Skill-like entities do not support the idea of level bases bonuses 
 * @todo Skill-like entities could provide bonuses based on their relative skill level (e.g +1 to strength per relative skill level above 2)
 * 
 * @method getBonus
 */

export abstract class SkillLike<T extends SkillLike<T>> extends ListItem<T>  {
    abstract type: "skill" | "skill_container" | "spell" | "spell_container" | "technique"

    name: string

    difficulty: Difficulty
    points: number
    specialization: string

    abstract defaults: Set<SkillDefault<SkillLike<any>>>
    abstract defaultedFrom: SkillDefault<SkillLike<any>>
    abstract signature: Signature
    abstract encumbrancePenaltyMultiple: number

    hasLevels = false

    constructor(list: List<T>) {
        super(list);
    }

    /**
     * @returns A bonus to be applied to {@calculateLevel} that must be implemented by classes that inherit from this one.
     */
    abstract getBonus(): number

    /**
     * @override Skill-like entities do not provide leveled feature bonuses.
     */
    getLevel(): number { return null }

    getBaseRelativeLevel() { return SkillLike.getBaseRelativeLevel(this.difficulty) }
    static getBaseRelativeLevel(difficulty: Difficulty) {
        switch (difficulty) {
            case Difficulty.easy:
                return 0
            case Difficulty.average:
                return -1
            case Difficulty.hard:
                return -2
            case Difficulty.very_hard:
                return -3
            case Difficulty.wildcard:
                return -3
        }
    }

    static calculateRelativeLevel(points: number, relativeLevel: number) {
        if (points === 1) {

        } else if (points < 4) {
            relativeLevel++;
        } else {
            relativeLevel += 1 + points / 4;
        }
        return relativeLevel
    }
    calculateLevel(): number {
        return calculateSkillLevel(
            this.difficulty,
            this.points,
            this.list.character.getAttribute(this.signature)?.calculateLevel(),
            this.defaultedFrom,
            this.getBonus(),
            this.list.character.encumbranceLevel(),
            this.encumbrancePenaltyMultiple
        )
    }

    static getBestDefaultWithPoints<T extends SkillLike<T>>
        (
            character: Character,
            skill: T,
            defaults: Set<SkillDefault<T>>
        ): SkillDefault<T> {
        let best = SkillLike.getBestDefault(character, defaults);
        if (best !== null) {
            let baseLine = character.getAttribute(skill.signature).calculateLevel() + SkillLike.getBaseRelativeLevel(skill.difficulty);
            let level = best.level;
            best.adjustedLevel = level;
            if (level === baseLine) {
                best.points = 1;
            } else if (level === baseLine + 1) {
                best.points = 2;
            } else if (level > baseLine + 1) {
                best.points = 4 * (level - (baseLine + 1));
            } else {
                level = best.level;
                if (level < 0) {
                    level = 0;
                }
                best.points = -level;
            }
        }
        return best
    }
    static getBestDefault<T extends SkillLike<T>>
        (
            character: Character,
            defaults: Set<SkillDefault<T>>,
    ) {
        if (character) {
            if (defaults.size > 0) {
                let best: number = Number.NEGATIVE_INFINITY;
                let bestSkill: SkillDefault<T>;
                defaults.forEach(skillDefault => {
                    if (true) {
                        if (skillDefault.isSkillBased()) {
                            var skill = skillDefault.getSkillsNamedFrom(skillDefault.owner.list).highest;
                            var level = SkillLike.calculateRelativeLevel(skill.points, skill.getBaseRelativeLevel());
                        }
                        if (level > best) {
                            best = level;
                            bestSkill = skillDefault;
                            bestSkill.level = level
                        }
                    }
                })
                return bestSkill
            }
        }
        return null
    }
    canSwapDefaults(skill: SkillLike<T>, defaults: Set<SkillDefault<T>>) {
        let result = false;
        if (this.defaultedFrom !== null && this.points > 0) {
            if (skill !== null && skill.hasDefaultTo(this, defaults)) {
                result = true;
            }
        }
        return result
    }
    hasDefaultTo(skill: SkillLike<T>, defaults: Set<SkillDefault<T>>) {
        let result = false;
        defaults.forEach(skillDefault => {
            let skillBased = skillDefault.isSkillBased();
            let nameMatches = skillDefault.name === skill.name;
            let specializationMatches = skillDefault.specialization === skill.specialization;
            if (skillBased && nameMatches && specializationMatches) {
                result = true;
            }
        });
        return result
    }
    swapDefault(skill: SkillLike<T>, defaults: Set<SkillDefault<T>>) {
        let extraPointsSpent = 0;
        let baseSkill = this.defaultedFrom.getSkillsNamedFrom(this.list);
        if (baseSkill !== null) {
            this.defaultedFrom = SkillLike.getBestDefaultWithPoints<T>(
                this.list.character,
                skill.findSelf(),
                defaults
            );
        }
        return extraPointsSpent
    }
}

export class Skill extends SkillLike<Skill> {
    version = 1
    tag = "skill"
    type: "skill" | "skill_container"

    signature: Signature
    techLevel: string
    defaults: Set<SkillDefault<SkillLike<any>>>
    defaultedFrom: SkillDefault<SkillLike<any>>
    encumbrancePenaltyMultiple: number = 0

    isTechnique: boolean = false

    constructor(list: List<Skill>, isTechnique = false) {
        super(list);
        this.isTechnique = false;
        this.defaults = new Set();
    }
    isActive() { return true }
    childrenPoints() {
        return this.iterChildren().reduce((prev, cur) => {
            if (cur.canContainChildren) {
                prev += cur.findSelf().childrenPoints();
            } else {
                prev += cur.findSelf().points;
            }
            return prev
        }, 0)
    }

    getBonus(): any {
        return this.list.character.featureList.getFeaturesByType(gcs.FeatureType.skillBonus).reduce(
            (prev, cur) => {
                if (cur instanceof SkillBonus && cur.type === gcs.FeatureType.skillBonus && cur.isApplicableTo(this) && cur.ownerIsActive()) {
                    prev += cur.getBonus();
                }
                return prev
            }, 0)
    }

    toString() {
        let string = "";
        string += this.name;
        if (!this.isContainer()) {
            if (Boolean(this.techLevel)) {
                string += "/TL"
                string += this.techLevel;
            }
            if (Boolean(this.specialization)) {
                string += ` (${this.specialization})`;
            }
        }
        return string
    }
    addDefault(): SkillDefault<Skill> {
        const newDefault = new SkillDefault(this);
        this.defaults.add(newDefault);
        return newDefault
    }
    toR20() {
        return {
            key: "repeating_skills",
            row_id: this.r20rowID,
            data: {
                name: this.toString(),
                base: (() => {
                    switch (this.signature) {
                        case Signature.ST: return "@{strength}"
                        case Signature.DX: return "@{dexterity}"
                        case Signature.IQ: return "@{intelligence}"
                        case Signature.HT: return "@{health}"
                        case Signature.Per: return "@{perception}"
                        case Signature.Will: return "@{willpower}"
                        case Signature.Base: return 10
                    }
                })(),
                difficulty: (() => {
                    switch (this.difficulty) {
                        case Difficulty.easy: return -1
                        case Difficulty.average: return -2
                        case Difficulty.hard: return -3
                        case Difficulty.very_hard: return -4
                        case Difficulty.wildcard: return "-5 + 1"
                    }
                })(),
                bonus: this.getBonus(),
                points: this.points,
                wildcard_skill_points: this.points / 3,
                use_wildcard_points: this.difficulty === Difficulty.wildcard ? 1 : 0,
                use_normal_points: this.difficulty !== Difficulty.wildcard ? 0 : 1,
                skill_points: this.points,
                ref: this.reference,
                notes: this.notes
            }
        }
    }
}

export class SkillDefault<T extends SkillLike<any>> extends Default<T> {
    tag = "default"
    level: number
    adjustedLevel: number
    points: number

    constructor(skill: T) {
        super(skill);
    }

    isSkillBased() {
        return this.type === Signature.Base.toString()
    }
    getSkillsNamedFrom(list: List<T>) {
        const skills = list.iter().filter(skill => {
            return this.name === skill.name && this.specialization === skill.specialization
        });
        const highest = skills.reduce((prev, cur) => {
            if (SkillLike.calculateRelativeLevel(prev.points, 10) > SkillLike.calculateRelativeLevel(cur.points, 10)) {
                return prev
            } else {
                return cur
            }
        });
        return {
            skills,
            highest
        }
    }
    save() { return this.getSerializer().transformers.get(this.constructor as Constructor).save(this) }
    load(data: any) { return this.getSerializer().transformers.get(this.constructor as Constructor).load(this, data) }
}

export enum Difficulty {
    easy = "E",
    average = "A",
    hard = "H",
    very_hard = "VH",
    wildcard = "W"
}