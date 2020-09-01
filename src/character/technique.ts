import { Difficulty, SkillList, SkillLike, Skill, SkillDefault } from "./skill/skill"
import { List } from "./misc/list"
import { Signature } from "./character"
import { Character } from "index";

export class TechniqueList extends SkillList {
    constructor(character: Character) {
        super(character);
    }

    populator() {
        return new Technique(this, [])
    }

    sumSkills() {
        return this.iter().reduce((prev, cur) => {
            return prev + cur.points
        }, 0);
    }
}

export type TehchniqueDifficulty = Difficulty.average | Difficulty.hard
export class Technique extends Skill {
    static keys = ["limit", "default"]
    tag = "technique"

    limit: number
    difficulty: TehchniqueDifficulty = Difficulty.average

    defaults: Set<SkillDefault<SkillLike<any>>> = new Set()

    default: SkillDefault<Skill>
    defaultedFrom: SkillDefault<SkillLike<any>> = null

    isTechnique: boolean = true

    constructor(list: List<Skill>, keys: string[] = []) {
        super(list, [...keys, ...Technique.keys]);
        this.default = new SkillDefault(this);
    }

    get signature(): Signature { return null }

    getBonus() {
        return 0
    }

    calculateLevel(): number {
        let points = this.points;
        let relativeLevel;
        let level = this.getBaseLevel(false);
        if (level) {
            let baseLevel = level;
            level += this.default?.modifier;
            if (this.difficulty === Difficulty.hard) {
                points--;
            }
            if (points > 0) {
                relativeLevel = points
            }
            if (level) {
                // level += this.getBonus();
                level += relativeLevel;
            }
            if (this.limit) {
                let max = baseLevel + this.limit;
                if (level > max) {
                    relativeLevel -= level - max;
                    level = max;
                }
            }
            return level + this.gMod
        } else {
            return NaN
        }
    }

    getBestDefault(): SkillDefault<any> {
        return this.default
    }

    getBaseLevel(requirePoints: boolean) {
        try {
            return this.default.getHighestMatchLevel()
            if (this.default.type === "Skill") {
                let skill = this.default.getMatches().highest;
                return skill !== null ? skill.calculateLevel() : Number.NEGATIVE_INFINITY
            }
        } catch (err) {
            return NaN
        }
    }

    getRelativeLevel() {
        try {
            return this.calculateLevel() - this.default.getHighestMatchLevel()
        }
        catch (err) {
            return NaN;
        }
    }

    toR20(): any {
        const link = this.default.isSkillBased() ? this.default.getMatches().highest : null
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