import { Skill, SkillDefault, Difficulty } from "./skill";
import { objectify } from "@utils/json_utils";
export class Technique extends Skill {
    constructor(list) {
        super(list);
        this.tag = "technique";
        this.difficulty = Difficulty.average;
        this.defaults = null;
        this.defaultedFrom = null;
        this.isTechnique = true;
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
                if (this.difficulty === Difficulty.hard) {
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
    loadJSON(json) {
        const data = objectify(json);
        super.loadJSON(json);
        this.limit = data.limit;
        this.difficulty = data.difficulty;
        this.default = new SkillDefault(this).loadJSON(data.default);
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
//# sourceMappingURL=technique.js.map