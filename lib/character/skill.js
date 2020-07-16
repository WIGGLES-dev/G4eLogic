"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.difficulty = exports.SkillDefault = exports.SkillBonus = exports.Skill = exports.SkillList = exports.SkillLike = void 0;
const character_1 = require("./character");
const list_1 = require("./misc/list");
const feature_1 = require("./misc/feature");
const string_utils_1 = require("../utils/string_utils");
const json_utils_1 = require("../utils/json_utils");
class SkillLike extends list_1.ListItem {
    constructor(list) {
        super(list);
    }
    getBaseRelativeLevel() {
        switch (this.difficulty) {
            case difficulty.easy:
                return 0;
            case difficulty.average:
                return -1;
            case difficulty.hard:
                return -2;
            case difficulty.very_hard:
                return -3;
            case difficulty.wildcard:
                return -3;
        }
    }
    getRelativeLevel() {
        var _a, _b;
        const attribute = (_b = (_a = this.list) === null || _a === void 0 ? void 0 : _a.character) === null || _b === void 0 ? void 0 : _b.attributes(this.signature);
        return this.calculateLevel() - attribute;
    }
    static calculateRelativeLevel(points, relativeLevel) {
        if (points === 1) {
        }
        else if (points < 4) {
            relativeLevel++;
        }
        else {
            relativeLevel += 1 + points / 4;
        }
        return relativeLevel;
    }
    calculateLevel() {
        if (this.isContainer())
            return null;
        const defaultedFrom = this.getBestDefaultWithPoints();
        const character = this.list.character;
        let points = this.points;
        let relativeLevel = this.getBaseRelativeLevel();
        let level = character.attributes(this.signature);
        if (level !== Number.NEGATIVE_INFINITY) {
            if (this.difficulty === difficulty.wildcard) {
                points /= 3;
            }
            else {
                if (defaultedFrom && defaultedFrom.bound !== null && defaultedFrom.bound.points > 0) {
                    points += defaultedFrom.bound.points;
                }
            }
            if (points > 0) {
                relativeLevel = SkillLike.calculateRelativeLevel(points, relativeLevel);
            }
            else if (defaultedFrom && defaultedFrom.bound !== null && defaultedFrom.bound.points < 0) {
                relativeLevel = defaultedFrom.bound.adjustedLevel - level;
            }
            else {
                level = Number.NEGATIVE_INFINITY;
                relativeLevel = 0;
            }
            if (level !== Number.NEGATIVE_INFINITY) {
                level += relativeLevel;
                if (defaultedFrom && defaultedFrom.bound !== null) {
                    if (level < defaultedFrom.bound.adjustedLevel) {
                        level = defaultedFrom.bound.adjustedLevel;
                    }
                }
                if (character !== null) {
                    level += this.getBonus();
                    relativeLevel += this.getBonus();
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
            }
            else if (level === baseLine + 1) {
                best.bound.points = 2;
            }
            else if (level > baseLine + 1) {
                best.bound.points = 4 * (level - (baseLine + 1));
            }
            else {
                level = best.bound.level;
                if (level < 0) {
                    level = 0;
                }
                best.bound.points = -level;
            }
        }
        return best;
    }
    getBestDefault() {
        if (this.defaultedFrom) {
            return this.defaultedFrom;
        }
        const character = this.list.character;
        if (character) {
            const defaults = this.defaults;
            if (defaults.size > 0) {
                let best = Number.NEGATIVE_INFINITY;
                let bestSkill = null;
                defaults.forEach((skillDefault) => {
                    if (true) {
                        if (skillDefault.isSkillBased()) {
                            var skill = skillDefault.getSkillsNamedFrom(this.list).highest;
                            var level = SkillLike.calculateRelativeLevel(skill.points, skill.getBaseRelativeLevel());
                        }
                        if (level > best) {
                            best = level;
                            bestSkill = skillDefault;
                            bestSkill.bound.level = level;
                        }
                    }
                });
                return bestSkill;
            }
        }
        return null;
    }
    canSwapDefaults(skill) {
        let result = false;
        if (this.defaultedFrom !== null && this.points > 0) {
            if (skill !== null && skill.hasDefaultTo(this)) {
                result = true;
            }
        }
        return result;
    }
    hasDefaultTo(skill) {
        let result = false;
        this.defaults.forEach(skillDefault => {
            let skillBased = skillDefault.isSkillBased();
            let nameMatches = skillDefault.name === skill.name;
            let specializationMatches = skillDefault.specialization === skill.specialization;
            if (skillBased && nameMatches && specializationMatches) {
                result = true;
            }
        });
        return result;
    }
    swapDefault() {
        let extraPointsSpent = 0;
        let baseSkill = this.defaultedFrom.getSkillsNamedFrom(this.list);
        if (baseSkill !== null) {
            this.defaultedFrom = this.getBestDefaultWithPoints();
        }
        return extraPointsSpent;
    }
    toJSON() {
        return {};
    }
    loadJSON(object) {
        object = json_utils_1.objectify(object);
        super.loadJSON(object);
    }
}
exports.SkillLike = SkillLike;
class SkillList extends list_1.List {
    constructor(character) {
        super(character);
        this.class = Skill;
    }
}
exports.SkillList = SkillList;
class Skill extends SkillLike {
    constructor(list) {
        super(list);
        this.tag = "skill";
        this.isTechnique = false;
        this.defaults = new Set();
    }
    childrenPoints() {
        return this.iterChildren().reduce((prev, cur) => {
            if (cur.canContainChildren) {
                prev += cur.childrenPoints();
            }
            else {
                prev += cur.points;
            }
            return prev;
        }, 0);
    }
    getBonus() {
        return this.list.character.featureList.iter().reduce((prev, cur) => {
            if (cur instanceof SkillBonus && cur.isApplicableTo(this)) {
                prev += cur.totalBonus();
            }
            return prev;
        }, 0);
    }
    toString() {
        let string = "";
        string += this.name;
        if (!this.isContainer()) {
            if (Boolean(this.techLevel)) {
                string += "/TL";
                string += this.techLevel;
            }
            if (Boolean(this.specialization)) {
                string += ` (${this.specialization})`;
            }
        }
        return string;
    }
    toJSON() {
        return {};
    }
    loadJSON(object) {
        object = json_utils_1.objectify(object);
        super.loadJSON(object);
        function mapSkill(object, skill) {
            var _a, _b, _c, _d;
            skill.name = object.name;
            skill.specialization = object.specialization;
            skill.points = object.points;
            skill.signature = (_a = object.difficulty) === null || _a === void 0 ? void 0 : _a.split("/")[0];
            skill.difficulty = (_b = object.difficulty) === null || _b === void 0 ? void 0 : _b.split("/")[1];
            skill.techLevel = (_c = object.tech_level) !== null && _c !== void 0 ? _c : "";
            (_d = object.defaults) === null || _d === void 0 ? void 0 : _d.forEach((skillDefault) => skill.defaults.add(new SkillDefault(skill).loadJSON(skillDefault, skill)));
            if (object.defaulted_from)
                skill.defaultedFrom = new SkillDefault(skill).loadJSON(object.defaulted_from, skill);
        }
        function loadSubElements(object, parent) {
            object.children.forEach((child) => {
                const subElement = parent.list.addListItem().loadJSON(child);
                subElement.containedBy = parent;
                parent.children.add(subElement);
            });
            return parent;
        }
        mapSkill(object, this);
        if (object.type.includes("_container")) {
            this.canContainChildren = true;
            this.list.addListItem(this);
            loadSubElements(object, this);
        }
        return this;
    }
    toR20() {
        return {
            key: "repeating_skills",
            row_id: this.r20rowID,
            data: {
                name: this.name,
                base: (() => {
                    switch (this.signature) {
                        case character_1.signatures.ST: return "@{strength}";
                        case character_1.signatures.DX: return "@{dexterity}";
                        case character_1.signatures.IQ: return "@{intelligence}";
                        case character_1.signatures.HT: return "@{health}";
                        case character_1.signatures.Per: return "@{perception}";
                        case character_1.signatures.Will: return "@{willpower}";
                        case character_1.signatures.Base: return 10;
                    }
                })(),
                difficulty: (() => {
                    switch (this.difficulty) {
                        case difficulty.easy: return -1;
                        case difficulty.average: return -2;
                        case difficulty.hard: return -3;
                        case difficulty.very_hard: return -4;
                        case difficulty.wildcard: return "-5 + 1";
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
        };
    }
}
exports.Skill = Skill;
class SkillBonus extends feature_1.Feature {
    constructor(owner) {
        super(owner, feature_1.FeatureType.skillBonus);
    }
    totalBonus() {
        return this.leveled && this.owner.canHaveLevels ? this.amount * this.owner.levels : this.amount;
    }
    isApplicableTo(skill) {
        let nameMatch = false;
        let specializationMatch = false;
        let categoryMatch = false;
        switch (this.nameCompareType) {
            case string_utils_1.StringCompare.isAnything:
                nameMatch = true;
                break;
            case string_utils_1.StringCompare.is:
                nameMatch = skill.name === this.name;
                break;
            case string_utils_1.StringCompare.startsWith:
                nameMatch = skill.name.toLowerCase().startsWith(this.name.toLowerCase());
                break;
        }
        switch (this.specializationCompareType) {
            case string_utils_1.StringCompare.isAnything:
                specializationMatch = true;
                break;
            case string_utils_1.StringCompare.is:
                specializationMatch = skill.specialization === this.specialization;
                break;
        }
        switch (this.categoryCompareType) {
            case string_utils_1.StringCompare.isAnything:
                categoryMatch = true;
                break;
        }
        if (nameMatch && specializationMatch && categoryMatch) {
            console.log(`testing against ${skill.name} is a match`);
        }
        return nameMatch && specializationMatch && categoryMatch;
    }
    toJSON() {
        return {};
    }
    loadJSON(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        object = json_utils_1.objectify(object);
        super.loadJSON(object);
        this.selectionType = object.selection_type;
        this.name = (_a = object === null || object === void 0 ? void 0 : object.name) === null || _a === void 0 ? void 0 : _a.qualifier;
        this.nameCompareType = (_c = (_b = object === null || object === void 0 ? void 0 : object.name) === null || _b === void 0 ? void 0 : _b.compare) !== null && _c !== void 0 ? _c : string_utils_1.StringCompare.isAnything;
        this.specialization = (_d = object === null || object === void 0 ? void 0 : object.specialization) === null || _d === void 0 ? void 0 : _d.qualifier;
        this.specializationCompareType = (_f = (_e = object === null || object === void 0 ? void 0 : object.specialization) === null || _e === void 0 ? void 0 : _e.compare) !== null && _f !== void 0 ? _f : string_utils_1.StringCompare.isAnything;
        this.categoryCompareType = (_h = (_g = object === null || object === void 0 ? void 0 : object.category) === null || _g === void 0 ? void 0 : _g.compare) !== null && _h !== void 0 ? _h : string_utils_1.StringCompare.isAnything;
        return this;
    }
}
exports.SkillBonus = SkillBonus;
class SkillDefault {
    constructor(skill) {
        this.tag = "default";
        this.bound = {};
        this.bound.skill = skill;
    }
    isSkillBased() {
        return this.type === character_1.signatures.Base.toString();
    }
    getSkillsNamedFrom(list) {
        const skills = list.iter().filter(skill => {
            return this.name === skill.name && this.specialization === skill.specialization;
        });
        const highest = skills.reduce((prev, cur) => {
            if (prev.getRelativeLevel() > cur.getRelativeLevel()) {
                return prev;
            }
            else {
                return cur;
            }
        });
        return {
            skills,
            highest
        };
    }
    toJSON() {
    }
    loadJSON(object, skill) {
        object = json_utils_1.objectify(object);
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
            });
        }
        return this;
    }
}
exports.SkillDefault = SkillDefault;
var difficulty;
(function (difficulty) {
    difficulty["easy"] = "E";
    difficulty["average"] = "A";
    difficulty["hard"] = "H";
    difficulty["very_hard"] = "VH";
    difficulty["wildcard"] = "W";
})(difficulty = exports.difficulty || (exports.difficulty = {}));
//# sourceMappingURL=skill.js.map