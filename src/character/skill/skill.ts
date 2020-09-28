import { Signature, Character } from "../character";
import { List, ListItem } from "../misc/list";
import { SkillBonus, FeatureType } from "../misc/feature";
import { Default } from "../misc/default";
import { calculateSkillLevel, calculateRelativeLevel, getBaseRelativeLevel } from "./logic";

export class SkillList extends List<Skill> {
    constructor(character: Character, name: string = "skill") {
        super(character, name);
    }

    populator() {
        return new Skill(this);
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

    abstract defaults: Set<SkillDefault<SkillLike<any>>> = new Set()
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

    getBaseRelativeLevel() { return getBaseRelativeLevel(this.difficulty) }

    calculateRelativeLevel(relativeLevel?: number) {
        if (!relativeLevel) relativeLevel = this.list.character.getAttribute(this.signature).calculateLevel();
        return calculateRelativeLevel(this.points, relativeLevel);
    }

    calculateLevel({ withBonuses = true, considerDefaults = true, buyLevelFromDefault = false } = {}): number {
        if (this.isContainer()) return null
        return calculateSkillLevel(
            buyLevelFromDefault,
            this.difficulty,
            this.points,
            this.list.character.getAttribute(this.signature).calculateLevel(),
            considerDefaults ?
                this.getBestDefaultWithPoints()
                : undefined,
            withBonuses ? this.getBonus() : 0,
            this.list.character.encumbranceLevel({ forSkillEncumbrance: true }),
            this.encumbrancePenaltyMultiple,
            withBonuses ? this.gMod : 0,
        )
    }

    getBestDefaultWithPoints<T extends SkillLike<T>>(): SkillDefault<any> {
        const best = this.getBestDefault();
        if (best === this.defaultedFrom) return this.defaultedFrom
        if (best !== null) {
            if (!best.isSkillBased()) return best
            this.defaultedFrom = best;
            let baseLine = this.list.character.getAttribute(this.signature).calculateLevel() + this.getBaseRelativeLevel();
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
            let bestSkill: SkillDefault<SkillLike<T>> = null;
            this.defaults.forEach(skillDefault => {
                if (true) {
                    let level;
                    let modifier = skillDefault.modifier;
                    if (skillDefault.isSkillBased()) {
                        let skill = skillDefault.getMatches().highest;
                        level = skill ?
                            skill.calculateRelativeLevel()
                            : Number.NEGATIVE_INFINITY;
                    } else {
                        level = this.list.character.getAttribute((skillDefault.type as Signature))?.calculateLevel() ?? Number.NEGATIVE_INFINITY;
                    }
                    if (level + modifier > best) {
                        best = level;
                        bestSkill = skillDefault;
                        bestSkill.level = level
                    }
                }
            })
            return bestSkill
        }
        return null
    }

    isInDefaultChain(skillLike: SkillLike<any>, skillDefault: Default<SkillLike<any>>, lookedAt = new Set()) {
        const character = skillLike.list.character;
        let hadOne = false;
        if (character !== null && skillDefault !== null && skillDefault.isSkillBased()) {
            skillDefault.getMatches().skills.forEach(match => {
                if (match === skillLike) {
                    return true
                }
                lookedAt.add(skillDefault);
                if (lookedAt.has(match)) {
                    if (this.isInDefaultChain(skillLike, match.defaultedFrom, lookedAt)) {
                        return true
                    }
                }
                hadOne = true;
            })
            return !hadOne
        }
        return false
    }

    canSwapDefault(skill: Skill) {
        if (this.defaultedFrom && this.points > 0) {
            if (skill && skill.hasDefaultTo(this)) {
                return true
            }
        }
        return false
    }

    hasDefaultTo(skill: SkillLike<any>) {
        let result = false;
        this.defaults.forEach(skillDefault => {
            let skillBased = skillDefault.isSkillBased();
            let nameMatches = skillDefault.name === skill.name;
            let specializationMathches = skillDefault.specialization === skill.specialization;
            result = skillBased && nameMatches && specializationMathches;
        })
        return result
    }
}

export class Skill extends SkillLike<Skill> {
    static keys = ["signature", "hasTechLevel", "techLevel", /* "defaults", */ "defaultedFrom", "encumbrancePenaltyMultiple"]
    version = 1
    tag = "skill"
    type: "skill" | "skill_container"

    signature: Signature
    hasTechLevel = false
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
        return this.list.character.featureList.getFeaturesByType(FeatureType.skillBonus).filter(bonus =>
            bonus instanceof SkillBonus && bonus.type === FeatureType.skillBonus && bonus.isApplicableTo(skill) && bonus.ownerIsActive()
        ) as SkillBonus<any>[]
    }

    addDefault(): SkillDefault<Skill> {
        const newDefault = new SkillDefault(this);
        return newDefault
    }
}

export class SkillDefault<T extends SkillLike<any>> extends Default<T> {
    //static keys = ["level", "adjustedLevel", "points"]
    static keys = []
    tag = "default"

    level: number = 0
    adjustedLevel: number = 0
    points: number = 0

    constructor(skill: T, keys: string[] = []) {
        super(skill, [...keys, ...SkillDefault.keys]);
        this.owner.defaults.add(this);
    }

    getLookupList() { return this.owner.list.character.skillList }

    load(data: any, ...args) { return this.getSerializer().transform(this.constructor, "load")(this, data, ...args) }
    save(data: any, ...args) { return this.getSerializer().transform(this.constructor, "save")(this, data, ...args) }
}

export enum Difficulty {
    easy = "E",
    average = "A",
    hard = "H",
    very_hard = "VH",
    wildcard = "W"
}