import { signatures, Character, Featurable } from "./character";
import { List, ListItem } from "./misc/list";
import { Feature, FeatureType } from "./misc/feature";
import { CharacterElement } from "./misc/element";
import { StringCompare } from "../utils/string_utils";
import { objectify, json } from "../utils/json_utils";

export abstract class SkillLike<T extends SkillLike<T>> extends ListItem<T>  {
    name: string

    difficulty: difficulty;
    points: number

    specialization?: string
    signature?: signatures
    defaults?: Set<SkillDefault<T>>
    defaultedFrom?: SkillDefault<T>

    constructor(list: List<T>) {
        super(list);
    }

    abstract getBonus(): number

    getBaseRelativeLevel() {
        switch (this.difficulty) {
            case difficulty.easy:
                return 0
            case difficulty.average:
                return -1
            case difficulty.hard:
                return -2
            case difficulty.very_hard:
                return -3
            case difficulty.wildcard:
                return -3
        }
    }
    getRelativeLevel() {
        const attribute = this.list?.character?.attributes(this.signature);
        return this.calculateLevel() - attribute;
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
    calculateLevel() {
        const defaultedFrom = this.getBestDefaultWithPoints();
        const character = this.list.character;
        let points = this.points;
        let relativeLevel = this.getBaseRelativeLevel();
        let level = character.attributes(this.signature);
        if (level !== Number.NEGATIVE_INFINITY) {
            if (this.difficulty === difficulty.wildcard) {
                points /= 3;
            } else {
                if (defaultedFrom.bound !== null && defaultedFrom.bound.points > 0) {
                    points += defaultedFrom.bound.points;
                }
            }
            if (points > 0) {
                relativeLevel = SkillLike.calculateRelativeLevel(points, relativeLevel);
            } else if (defaultedFrom.bound !== null && defaultedFrom.bound.points < 0) {
                relativeLevel = defaultedFrom.bound.adjustedLevel - level;
            } else {
                level = Number.NEGATIVE_INFINITY;
                relativeLevel = 0;
            }
            if (level !== Number.NEGATIVE_INFINITY) {
                level += relativeLevel;
                if (defaultedFrom.bound !== null) {
                    if (level < defaultedFrom.bound.adjustedLevel) {
                        level = defaultedFrom.bound.adjustedLevel;
                    }
                }
                if (character !== null) {
                    level += this.getBonus();
                    relativeLevel += this.getBonus();
                    //TODO encumbrance penalties
                }
            }
        }
        return level;
    }
    getBestDefaultWithPoints() {
        let best = this.getBestDefault();
        if (best !== null) {
            const character = this.list.character;
            let baseLine = character.attributes(this.signature) + this.getBaseRelativeLevel();
            let level = best.bound.level;
            best.bound.adjustedLevel = level;
            if (level === baseLine) {
                best.bound.points = 1;
            } else if (level === baseLine + 1) {
                best.bound.points = 2;
            } else if (level > baseLine + 1) {
                best.bound.points = 4 * (level - (baseLine + 1));
            } else {
                level = best.bound.level;
                if (level < 0) {
                    level = 0;
                }
                best.bound.points = -level;
            }
        }
        return best
    }
    getBestDefault() {
        if (this.defaultedFrom) {
            return this.defaultedFrom
        }
        const character = this.list.character;
        if (character) {
            const defaults = this.defaults;
            if (defaults.size > 0) {
                let best: number = Number.NEGATIVE_INFINITY;
                let bestSkill: SkillDefault<any> = null;
                defaults.forEach((skillDefault) => {
                    if (true) {
                        if (skillDefault.isSkillBased()) {
                            var skill = skillDefault.getSkillsNamedFrom(this.list).highest;
                            var level = SkillLike.calculateRelativeLevel(skill.points, skill.getBaseRelativeLevel());
                        }
                        if (level > best) {
                            best = level;
                            bestSkill = skillDefault;
                            bestSkill.bound.level = level
                        }
                    }
                })
                return bestSkill
            }
        }
        return null
    }
    canSwapDefaults(skill: SkillLike<T>) {
        let result = false;
        if (this.defaultedFrom !== null && this.points > 0) {
            if (skill !== null && skill.hasDefaultTo(this)) {
                result = true;
            }
        }
        return result
    }
    hasDefaultTo(skill: SkillLike<T>) {
        let result = false;
        this.defaults.forEach(skillDefault => {
            let skillBased = skillDefault.isSkillBased();
            let nameMatches = skillDefault.name === skill.name;
            let specializationMatches = skillDefault.specialization === skill.specialization;
            if (skillBased && nameMatches && specializationMatches) {
                result = true;
            }
        });
        return result
    }
    swapDefault() {
        let extraPointsSpent = 0;
        let baseSkill = this.defaultedFrom.getSkillsNamedFrom(this.list);
        if (baseSkill !== null) {
            this.defaultedFrom = this.getBestDefaultWithPoints();
        }
        return extraPointsSpent
    }
    toJSON() {
        return {}
    }
    loadJSON(object: string | json) {
        object = objectify(object);
        super.loadJSON(object);
    }
}

export class SkillList extends List<Skill> {
    class = Skill

    constructor(character: Character) {
        super(character);
    }
}

export class Skill extends SkillLike<Skill> {
    tag = "skill"

    specialization: string
    signature: signatures
    techLevel: string
    defaults: Set<SkillDefault<Skill>>
    defaultedFrom: SkillDefault<Skill>
    isTechnique: boolean

    constructor(list: List<Skill>) {
        super(list);
        this.isTechnique = false;
        this.defaults = new Set();
    }

    childrenPoints() {
        return this.iterChildren().reduce((prev, cur) => {
            if (cur.canContainChildren) {
                prev += cur.childrenPoints();
            } else {
                prev += cur.points;
            }
            return prev
        }, 0)
    }

    getBonus() {
        return this.list.character.featureList.iter().flatMap(feature => {
            if (feature instanceof SkillBonus && feature.isApplicableTo(this)) {
                return feature
            } else {
                return false
            }
        }).reduce((prev, cur) => {
            if (cur) prev += cur.totalBonus()
            return prev
        }, 0);
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
    toJSON() {
        return {}
    }
    loadJSON(object: string | json) {
        object = objectify(object);
        super.loadJSON(object);
        function mapSkill(object: json, skill: Skill) {
            skill.name = object.name;
            skill.specialization = object.specialization;
            skill.points = object.points
            skill.signature = object.difficulty?.split("/")[0] as signatures;
            skill.difficulty = object.difficulty?.split("/")[1] as difficulty;
            skill.techLevel = object.tech_level ?? "";
            object.defaults?.forEach((skillDefault: json) => skill.defaults.add(new SkillDefault<Skill>(skill).loadJSON(skillDefault, skill)));
            if (object.defaulted_from) skill.defaultedFrom = new SkillDefault<Skill>(skill).loadJSON(object.defaulted_from, skill);
        }
        function loadSubElements(object: json, parent: Skill) {
            object.children.forEach((child: json) => {
                const subElement = parent.list.addListItem().loadJSON(child);
                subElement.containedBy = parent;
                parent.children.add(subElement);
            });
            return parent
        }
        mapSkill(object, this);
        if (object.type.includes("_container")) {
            this.canContainChildren = true;
            this.list.addListItem(this);
            loadSubElements(object, this);
        }
        return this
    }

    toR20() {
        return {
            key: "repeating_skills",
            row_id: this.r20rowID,
            data: {
                name: this.name,
                base: (() => {
                    switch (this.signature) {
                        case signatures.ST: return "@{strength}"
                        case signatures.DX: return "@{dexterity}"
                        case signatures.IQ: return "@{intelligence}"
                        case signatures.HT: return "@{health}"
                        case signatures.Per: return "@{perception}"
                        case signatures.Will: return "@{willpower}"
                        case signatures.Base: return 10
                    }
                })(),
                difficulty: (() => {
                    switch (this.difficulty) {
                        case difficulty.easy: return -1
                        case difficulty.average: return -2
                        case difficulty.hard: return -3
                        case difficulty.very_hard: return -4
                        case difficulty.wildcard: return "-5 + 1"
                    }
                })(),
                bonus: this.getBonus(),
                points: this.points,
                wildcard_skill_points: this.points / 3,
                use_wildcard_points: this.difficulty === difficulty.wildcard ? 1 : 0,
                use_normal_points: this.difficulty !== difficulty.wildcard ? 0 : 1,
                skill_points: this.points,
                ref: this.reference,
                notes: this.notes
            }
        }
    }
}

export class SkillBonus<T extends Featurable> extends Feature<T> {
    selectionType: string
    nameCompareType: StringCompare
    name: string
    specializationCompareType: string
    specialization: string
    categoryCompareType: string

    constructor(owner: T) {
        super(owner, FeatureType.skillBonus);
    }

    totalBonus() {
        return this.leveled ? this.amount * 1 : this.amount
    }

    isApplicableTo(skill: Skill): boolean {
        let nameMatch = false;
        let specializationMatch = false;
        let categoryMatch = false
        switch (this.nameCompareType) {
            case StringCompare.isAnything:
                nameMatch = true;
                break
            case StringCompare.is:
                nameMatch = skill.name === this.name;
                break
            case StringCompare.startsWith:
                nameMatch = skill.name.toLowerCase().startsWith(this.name.toLowerCase())
                break
        }
        switch (this.specializationCompareType) {
            case StringCompare.isAnything:
                specializationMatch = true;
                break
            case StringCompare.is:
                specializationMatch = skill.specialization === this.specialization;
                break
        }
        switch (this.categoryCompareType) {
            case StringCompare.isAnything:
                categoryMatch = true;
                break
        }
        return nameMatch && specializationMatch && categoryMatch
    }
    toJSON() {
        return {}
    }
    loadJSON(object: string | json) {
        object = objectify(object);
        super.loadJSON(object);
    }
}

interface SkillBinding<T> {
    skill: T
    level: number
    adjustedLevel: number
    points: number
}

export class SkillDefault<T extends SkillLike<T>> {
    tag = "default"

    bound: SkillBinding<T> = {} as SkillBinding<T>

    type: string
    name: string
    specialization: string
    modifier: number

    constructor(skill: T) {
        this.bound.skill = skill;
    }

    isSkillBased() {
        return this.type === signatures.Base.toString()
    }
    getSkillsNamedFrom(list: List<T>) {
        const skills = list.iter().filter(skill => {
            return this.name === skill.name && this.specialization === skill.specialization
        });
        const highest = skills.reduce((prev, cur) => {
            if (prev.getRelativeLevel() > cur.getRelativeLevel()) {
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
    toJSON() {

    }
    loadJSON(object: json, skill: T) {
        object = objectify(object);
        this.bound.skill = skill;
        this.type = object.type;
        this.name = object.name;
        this.specialization = object.specialization;
        this.modifier = object.modifier;
        if (object.type.includes("_from")) {
            Object.assign(this.bound, {
                level: object.level,
                adjustedLevel: object.adjusted_level,
                points: object.points
            })
        }
        return this
    }
}

export enum difficulty {
    easy = "E",
    average = "A",
    hard = "H",
    very_hard = "VH",
    wildcard = "W"
}