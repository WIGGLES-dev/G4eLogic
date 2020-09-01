import { Signature, Character, Featurable } from "../character";
import { List, ListItem } from "../misc/list";
import { Feature, SkillBonus } from "../misc/feature";
import { StringCompare, stringCompare } from "utils/string_utils";
import { objectify, json, isArray } from "@utils/json_utils";
import { Default, DefaultType } from "../misc/default";
import * as gcs from "@gcs/gcs";
import { Constructor } from "../serialization/serializer";
import { calculateSkillLevel } from "./logic";

export class SkillList extends List<Skill> {
    constructor(character: Character) {
        super(character);
    }

    populator() {
        return new Skill(this, []);
    }

    sumSkills() {
        return this.iter().reduce((prev, cur) => {
            return prev + cur.points
        }, 0);
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
    static keys = ["name", "difficulty", "points", "specialization", "gMod"]

    name: string
    difficulty: Difficulty
    points: number
    specialization: string
    gMod: number = 0

    abstract defaults: Set<SkillDefault<SkillLike<any>>>
    abstract defaultedFrom: SkillDefault<SkillLike<any>>
    abstract signature: Signature
    abstract encumbrancePenaltyMultiple: number = 0

    hasLevels = false

    constructor(list: List<T>, keys: string[]) {
        super(list, [...keys, ...SkillLike.keys]);
    }

    /**
     * @returns A bonus to be applied to {@calculateLevel} that must be implemented by classes that inherit from this one.
     */
    abstract getBonus(): number

    /**
     * @override Skill-like entities do not provide leveled feature bonuses.
     */
    getLevel(): number { return null }

    getAttribute() {
        return this.list.character.getAttribute(this.signature);
    }

    getRelativeLevel() {
        try {
            return this.calculateLevel() - this.getAttribute().calculateLevel()
        } catch (err) {

        }
    }

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

    calculateLevel({ withBonuses = true, considerDefaults = true } = {}): number {
        if (this.isContainer()) return null
        return calculateSkillLevel(
            this.difficulty,
            this.points,
            this.list.character.getAttribute(this.signature).calculateLevel(),
            considerDefaults ?
                SkillLike.getBestDefaultWithPoints(this.list.character, this, this.defaults)
                : undefined,
            withBonuses ? this.getBonus() : 0,
            this.list.character.encumbranceLevel({ forSkillEncumbrance: true }),
            this.encumbrancePenaltyMultiple,
            withBonuses ? this.gMod : 0
        )
    }

    static getBestDefaultWithPoints<T extends SkillLike<T>>
        (
            character: Character,
            skill: T,
            defaults: Set<SkillDefault<T>>
        ): SkillDefault<any> {
        const best = skill.getBestDefault();
        if (!(best === null)) {
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
    getBestDefault<T extends SkillLike<T>>() {
        if (this.defaults.size > 0) {
            let best: number = Number.NEGATIVE_INFINITY;
            let bestSkill: SkillDefault<SkillLike<T>>;
            this.defaults.forEach(skillDefault => {
                let level;
                if (skillDefault.isSkillBased()) {
                    let skill = skillDefault.getMatches().highest;
                    level = SkillLike.calculateRelativeLevel(this.points, this.getBaseRelativeLevel());
                } else {
                    level = this.list.character.getAttribute((skillDefault.type as Signature)).calculateLevel();
                }
                if (level > best) {
                    best = level;
                    bestSkill = skillDefault;
                    if (bestSkill.isSkillBased()) bestSkill.level = level
                }

            })
            return bestSkill
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
        let baseSkill = this.defaultedFrom.getMatches().highest;
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
    static keys = ["signature", "techLevel", "defaults", "defaultedFrom", "encumbrancePenaltyMultiple"]
    version = 1
    tag = "skill"
    type: "skill" | "skill_container"

    signature: Signature
    techLevel: string
    defaults: Set<SkillDefault<SkillLike<any>>> = new Set()
    defaultedFrom: SkillDefault<SkillLike<any>>
    encumbrancePenaltyMultiple: number = 0

    isTechnique: boolean = false

    constructor(list: List<Skill>, keys: string[] = []) {
        super(list, [...keys, ...Skill.keys]);
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

    getBonus(): number { return this.getModList().reduce((prev, cur) => prev + cur.getBonus(), 0) }
    getModList(): SkillBonus<any>[] {
        const skill = this;
        return this.list.character.featureList.getFeaturesByType(gcs.FeatureType.skillBonus).filter(bonus =>
            bonus instanceof SkillBonus && bonus.type === gcs.FeatureType.skillBonus && bonus.isApplicableTo(skill) && bonus.ownerIsActive()
        ) as SkillBonus<any>[]
    }

    addDefault(): SkillDefault<Skill> {
        const newDefault = new SkillDefault(this);
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
    static keys = ["level", "adjustedLevel", "points"]
    tag = "default"

    level: number
    adjustedLevel: number
    points: number

    constructor(skill: T, keys: string[] = []) {
        super(skill, [...keys, ...SkillDefault.keys]);
        this.owner.defaults.add(this);
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