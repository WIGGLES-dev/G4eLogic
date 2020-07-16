"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Technique = void 0;
const skill_1 = require("./skill");
const json_utils_1 = require("../utils/json_utils");
class Technique extends skill_1.Skill {
    constructor(list) {
        super(list);
        this.tag = "technique";
    }
    get signature() { return null; }
    getBonus() {
        return 0;
    }
    calculateLevel() {
        const techniqueDefault = this.default;
        const character = this.list.character;
        let relativeLevel = 0;
        let points = this.points;
        let level = Number.NEGATIVE_INFINITY;
        if (character != null) {
            level = this.getBaseLevel(techniqueDefault, null);
            if (level !== Number.NEGATIVE_INFINITY) {
                let baseLevel = level;
                level += techniqueDefault.modifier;
                if (this.difficulty === skill_1.difficulty.hard) {
                    points--;
                }
                if (points > 0) {
                    relativeLevel = points;
                }
                if (level !== Number.NEGATIVE_INFINITY) {
                    level += relativeLevel;
                }
                if (Boolean(this.limit)) {
                    let max = baseLevel + this.limit;
                    if (level > max) {
                        relativeLevel -= level - max;
                        level = max;
                    }
                }
            }
        }
        return level;
    }
    getBaseLevel(def, requirePoints) {
        const character = this.list.character;
        if (def.type === "Skill") {
            let skill = def.getSkillsNamedFrom(this.list).highest;
            return skill !== null ? skill.calculateLevel() : Number.NEGATIVE_INFINITY;
        }
    }
    getRelativeLevel() {
        const relativeTo = this.default.getSkillsNamedFrom(this.list).highest;
        console.log(this.name, relativeTo.name, relativeTo.calculateLevel());
        return this.calculateLevel() - relativeTo.calculateLevel();
    }
    toJSON() {
        return {};
    }
    loadJSON(object) {
        object = json_utils_1.objectify(object);
        super.loadJSON(object);
        this.limit = object.limit;
        this.difficulty = object.difficulty;
        this.default = new skill_1.SkillDefault(this).loadJSON(object.default, this);
        return this;
    }
    toR20() {
        const link = this.default.isSkillBased() ? this.default.getSkillsNamedFrom(this.list).highest : null;
        return {
            key: "repeating_techniquesrevised",
            row_id: this.r20rowID,
            data: {
                name: this.name,
                parent: this.default.name,
                default: this.default.modifier,
                skill_modifier: 0,
                points: this.points,
                ref: this.reference,
                notes: this.notes,
                technique_row_type: link ? "Skill" : "10",
                technique_skill_row_id: link ? link.uuid : "",
            }
        };
    }
}
exports.Technique = Technique;
//# sourceMappingURL=technique.js.map