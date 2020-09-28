import { Difficulty, SkillList, SkillLike, Skill, SkillDefault } from "./skill/skill"
import { List } from "./misc/list"
import { Signature } from "./character"
import { Character } from "index";

export class TechniqueList extends SkillList {
    constructor(character: Character) {
        super(character, "technique");
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

    //@ts-ignore
    get signature(): Signature { return this.default.isSkillBased() ? null : this.default.type as Signature }

    getBonus() {
        return 0
    }

    calculateLevel(): number {
        if (this.default.getMatches()?.highest?.points === 0) return NaN
        let points = this.points;
        let relativeLevel = 0;
        let level = this.getBaseLevel();
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
                level += this.getBonus();
                level += relativeLevel;
            }
            if (typeof this.limit === "number") {
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

    getBaseLevel() {
        try {
            return this.default.getHighestMatchLevel() + Math.abs(this.default.modifier)
        } catch (err) {
            return NaN
        }
    }

    getRelativeLevel() {
        try {
            return this.calculateLevel() - this.getBaseLevel();
        }
        catch (err) {
            return NaN;
        }
    }
}