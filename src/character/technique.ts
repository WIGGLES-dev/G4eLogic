import { Skill, SkillDefault, Difficulty, SkillLike } from "./skill/skill";
import { Signature } from "./character";
import { List } from "./misc/list";
import { objectify, json } from "@utils/json_utils";
import * as gcs from "@gcs/gcs";

export type TehchniqueDifficulty = Difficulty.average | Difficulty.hard
export class Technique extends Skill {
    static keys = ["limit", "default"]
    tag = "technique"

    limit: number
    difficulty: TehchniqueDifficulty = Difficulty.average

    defaults: Set<SkillDefault<SkillLike<any>>> = null

    default: SkillDefault<Skill>
    defaultedFrom: SkillDefault<SkillLike<any>> = null

    isTechnique: boolean = true

    constructor(list: List<Skill>, keys: string[] = []) {
        super(list, [...keys, ...Technique.keys]);
    }

    get signature(): Signature { return null }

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