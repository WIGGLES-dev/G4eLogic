import { Skill, SkillDefault, difficulty } from "./skill";
import { signatures } from "./character";
import { List } from "./misc/list";

export class Technique extends Skill {
    tag = "technique"

    limit: number
    difficulty: difficulty
    default: SkillDefault<Skill>

    constructor(list: List<Skill>) {
        super(list);
    }

    get signature(): signatures { return null }

    getBonus() {
        return 0
    }

    calculateLevel(): number {
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
                if (this.difficulty === difficulty.hard) {
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
        return level
    }
    getBaseLevel(def: SkillDefault<Skill>, requirePoints: boolean) {
        const character = this.list.character;
        if (def.type === "Skill") {
            let skill = def.getSkillsNamedFrom(this.list).highest;
            return skill !== null ? skill.calculateLevel() : Number.NEGATIVE_INFINITY
        }
    }
    getRelativeLevel() {
        const relativeTo = this.default.getSkillsNamedFrom(this.list).highest;
        console.log(this.name, relativeTo.name, relativeTo.calculateLevel());
        return this.calculateLevel() - relativeTo.calculateLevel()
    }
    toJSON() {
        return {}
    }
    loadJSON(object: any) {
        super.loadJSON(object);
        this.limit = object.limit;
        this.difficulty = object.difficulty;
        this.default = new SkillDefault<Skill>(this).loadJSON(object.default, this);
        return this
    }
    toR20(): any {
        const link = this.default.isSkillBased() ? this.default.getSkillsNamedFrom(this.list).highest : null
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
        }
    }
}