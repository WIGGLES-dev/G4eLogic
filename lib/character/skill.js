"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Difficulty = exports.SkillDefault = exports.SkillBonus = exports.Skill = exports.SkillLike = exports.SkillList = void 0;
const character_1 = require("./character");
const list_1 = require("./misc/list");
const feature_1 = require("./misc/feature");
const string_utils_1 = require("../utils/string_utils");
const json_utils_1 = require("../utils/json_utils");
const default_1 = require("./misc/default");
const index_1 = require("index");
class SkillList extends list_1.List {
    constructor(character) {
        super(character);
        this.populator = Skill;
    }
    addListItem(item, isTechnique = false) {
        if (item)
            return super.addListItem(item);
        if (isTechnique) {
            return super.addListItem(new index_1.Technique(this));
        }
        else {
            return super.addListItem(new Skill(this));
        }
    }
}
exports.SkillList = SkillList;
class SkillLike extends list_1.ListItem {
    constructor(list) {
        super(list);
        this.hasLevels = false;
    }
    getLevel() { return null; }
    getBaseRelativeLevel() { return SkillLike.getBaseRelativeLevel(this.difficulty); }
    static getBaseRelativeLevel(difficulty) {
        switch (difficulty) {
            case Difficulty.easy:
                return 0;
            case Difficulty.average:
                return -1;
            case Difficulty.hard:
                return -2;
            case Difficulty.very_hard:
                return -3;
            case Difficulty.wildcard:
                return -3;
        }
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
        return SkillLike.calculateLevel(this.difficulty, this.points, this.list.character.attributes(this.signature), this.defaultedFrom, this.getBonus(), this.list.character.encumbranceLevel(), this.encumbrancePenaltyMultiple);
    }
    static calculateLevel(difficulty, points, base = 10, defaultedFrom, bonus = 0, encumbranceLevel = 0, encPenaltyMult = 1) {
        let relativeLevel = SkillLike.getBaseRelativeLevel(difficulty);
        let level = base;
        if (level !== Number.NEGATIVE_INFINITY) {
            if (difficulty === Difficulty.wildcard) {
                points /= 3;
            }
            else {
                if (defaultedFrom && defaultedFrom.points > 0) {
                    points += defaultedFrom.points;
                }
            }
            if (points > 0) {
                relativeLevel = SkillLike.calculateRelativeLevel(points, relativeLevel);
            }
            else if (defaultedFrom && defaultedFrom.points < 0) {
                relativeLevel = defaultedFrom.adjustedLevel - level;
            }
            else {
                level = Number.NEGATIVE_INFINITY;
                relativeLevel = 0;
            }
            if (level !== Number.NEGATIVE_INFINITY) {
                level += relativeLevel;
                if (defaultedFrom) {
                    if (level < defaultedFrom.adjustedLevel) {
                        level = defaultedFrom.adjustedLevel;
                    }
                }
                const encumbrancePenalty = encumbranceLevel * encPenaltyMult;
                level += bonus + encumbrancePenalty;
                relativeLevel += bonus + encumbrancePenalty;
            }
        }
        return level;
    }
    static getBestDefaultWithPoints(character, skill, defaults) {
        let best = SkillLike.getBestDefault(character, defaults);
        if (best !== null) {
            let baseLine = character.attributes(skill.signature) + SkillLike.getBaseRelativeLevel(skill.difficulty);
            let level = best.level;
            best.adjustedLevel = level;
            if (level === baseLine) {
                best.points = 1;
            }
            else if (level === baseLine + 1) {
                best.points = 2;
            }
            else if (level > baseLine + 1) {
                best.points = 4 * (level - (baseLine + 1));
            }
            else {
                level = best.level;
                if (level < 0) {
                    level = 0;
                }
                best.points = -level;
            }
        }
        return best;
    }
    static getBestDefault(character, defaults) {
        if (character) {
            if (defaults.size > 0) {
                let best = Number.NEGATIVE_INFINITY;
                let bestSkill;
                defaults.forEach(skillDefault => {
                    if (true) {
                        if (skillDefault.isSkillBased()) {
                            var skill = skillDefault.getSkillsNamedFrom(skillDefault.owner.list).highest;
                            var level = SkillLike.calculateRelativeLevel(skill.points, skill.getBaseRelativeLevel());
                        }
                        if (level > best) {
                            best = level;
                            bestSkill = skillDefault;
                            bestSkill.level = level;
                        }
                    }
                });
                return bestSkill;
            }
        }
        return null;
    }
    canSwapDefaults(skill, defaults) {
        let result = false;
        if (this.defaultedFrom !== null && this.points > 0) {
            if (skill !== null && skill.hasDefaultTo(this, defaults)) {
                result = true;
            }
        }
        return result;
    }
    hasDefaultTo(skill, defaults) {
        let result = false;
        defaults.forEach(skillDefault => {
            let skillBased = skillDefault.isSkillBased();
            let nameMatches = skillDefault.name === skill.name;
            let specializationMatches = skillDefault.specialization === skill.specialization;
            if (skillBased && nameMatches && specializationMatches) {
                result = true;
            }
        });
        return result;
    }
    swapDefault(skill, defaults) {
        let extraPointsSpent = 0;
        let baseSkill = this.defaultedFrom.getSkillsNamedFrom(this.list);
        if (baseSkill !== null) {
            this.defaultedFrom = SkillLike.getBestDefaultWithPoints(this.list.character, skill.findSelf(), defaults);
        }
        return extraPointsSpent;
    }
    loadJSON(json) {
        const data = json_utils_1.objectify(json);
        super.loadJSON(json);
        this.name = data.name;
        this.difficulty = data.difficulty;
        this.points = data.points;
    }
}
exports.SkillLike = SkillLike;
class Skill extends SkillLike {
    constructor(list, isTechnique = false) {
        super(list);
        this.version = 1;
        this.tag = "skill";
        this.encumbrancePenaltyMultiple = 0;
        this.isTechnique = false;
        this.isTechnique = false;
        this.defaults = new Set();
        if (isTechnique)
            return new index_1.Technique(list);
    }
    childrenPoints() {
        return this.iterChildren().reduce((prev, cur) => {
            if (cur.canContainChildren) {
                prev += cur.findSelf().childrenPoints();
            }
            else {
                prev += cur.findSelf().points;
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
    static mapSkill(data, skill) {
        var _a, _b, _c, _d;
        skill.name = data.name;
        skill.specialization = data.specialization;
        skill.points = data.points;
        skill.signature = (_a = data.difficulty) === null || _a === void 0 ? void 0 : _a.split("/")[0];
        skill.difficulty = (_b = data.difficulty) === null || _b === void 0 ? void 0 : _b.split("/")[1];
        skill.techLevel = (_c = data.tech_level) !== null && _c !== void 0 ? _c : "";
        (_d = json_utils_1.isArray(data.defaults)) === null || _d === void 0 ? void 0 : _d.forEach((skillDefault) => skill.defaults.add(new SkillDefault(skill).loadJSON(skillDefault)));
        if (data.defaulted_from)
            skill.defaultedFrom = new SkillDefault(skill).loadJSON(data.defaulted_from);
        return skill;
    }
    toJSON() {
        return {};
    }
    loadJSON(json) {
        const data = json_utils_1.objectify(json);
        super.loadJSON(data);
        Skill.mapSkill(data, this);
        if (data.type.includes("_container")) {
            this.canContainChildren = true;
            this.list.addListItem(this);
            this.loadChildren(json_utils_1.isArray(data === null || data === void 0 ? void 0 : data.children), this, Skill.mapSkill);
        }
        return this;
    }
    toR20() {
        return {
            key: "repeating_skills",
            row_id: this.r20rowID,
            data: {
                name: this.toString(),
                base: (() => {
                    switch (this.signature) {
                        case character_1.Signature.ST: return "@{strength}";
                        case character_1.Signature.DX: return "@{dexterity}";
                        case character_1.Signature.IQ: return "@{intelligence}";
                        case character_1.Signature.HT: return "@{health}";
                        case character_1.Signature.Per: return "@{perception}";
                        case character_1.Signature.Will: return "@{willpower}";
                        case character_1.Signature.Base: return 10;
                    }
                })(),
                difficulty: (() => {
                    switch (this.difficulty) {
                        case Difficulty.easy: return -1;
                        case Difficulty.average: return -2;
                        case Difficulty.hard: return -3;
                        case Difficulty.very_hard: return -4;
                        case Difficulty.wildcard: return "-5 + 1";
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
        };
    }
}
exports.Skill = Skill;
class SkillBonus extends feature_1.Feature {
    constructor(owner) {
        super(owner, feature_1.FeatureType.skillBonus);
    }
    totalBonus() {
        return this.leveled && this.owner.hasLevels ? this.amount * this.owner.getLevel() : this.amount;
    }
    isApplicableTo(skill) {
        let nameMatch = string_utils_1.stringCompare(this.name, skill.name, this.nameCompareType);
        let specializationMatch = string_utils_1.stringCompare(this.specialization, skill.specialization, this.specializationCompareType);
        let categoryMatch = string_utils_1.stringCompare(this.category, skill.categories, this.categoryCompareType);
        return nameMatch && specializationMatch && categoryMatch;
    }
    toJSON() {
        return {};
    }
    loadJSON(json) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const data = json_utils_1.objectify(json);
        super.loadJSON(data);
        this.selectionType = data.selection_type;
        this.name = (_a = data === null || data === void 0 ? void 0 : data.name) === null || _a === void 0 ? void 0 : _a.qualifier;
        this.nameCompareType = (_c = (_b = data === null || data === void 0 ? void 0 : data.name) === null || _b === void 0 ? void 0 : _b.compare) !== null && _c !== void 0 ? _c : string_utils_1.StringCompare.isAnything;
        this.specialization = (_d = data === null || data === void 0 ? void 0 : data.specialization) === null || _d === void 0 ? void 0 : _d.qualifier;
        this.specializationCompareType = (_f = (_e = data === null || data === void 0 ? void 0 : data.specialization) === null || _e === void 0 ? void 0 : _e.compare) !== null && _f !== void 0 ? _f : string_utils_1.StringCompare.isAnything;
        this.categoryCompareType = (_h = (_g = data === null || data === void 0 ? void 0 : data.category) === null || _g === void 0 ? void 0 : _g.compare) !== null && _h !== void 0 ? _h : string_utils_1.StringCompare.isAnything;
        return this;
    }
}
exports.SkillBonus = SkillBonus;
class SkillDefault extends default_1.Default {
    constructor(skill) {
        super(skill);
    }
    isSkillBased() {
        return this.type === character_1.Signature.Base.toString();
    }
    getSkillsNamedFrom(list) {
        const skills = list.iter().filter(skill => {
            return this.name === skill.name && this.specialization === skill.specialization;
        });
        const highest = skills.reduce((prev, cur) => {
            if (SkillLike.calculateRelativeLevel(prev.points, 10) > SkillLike.calculateRelativeLevel(cur.points, 10)) {
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
    loadJSON(data) {
        data = json_utils_1.objectify(data);
        super.loadJSON(data);
        return this;
    }
}
exports.SkillDefault = SkillDefault;
var Difficulty;
(function (Difficulty) {
    Difficulty["easy"] = "E";
    Difficulty["average"] = "A";
    Difficulty["hard"] = "H";
    Difficulty["very_hard"] = "VH";
    Difficulty["wildcard"] = "W";
})(Difficulty = exports.Difficulty || (exports.Difficulty = {}));
//# sourceMappingURL=skill.js.map