import { SkillLike, SkillDefault, Difficulty, Skill, SkillList } from "./skill/skill";
import { List } from "./misc/list";
import { Character, Signature } from "./character";

export class SpellList extends SkillList<Spell> {
    constructor() {
        super("spell");
    }

    populator() {
        return new Spell(this)
    }
}

export class Spell extends Skill {
    static keys = [
        "college",
        "class",
        "resist",
        "powerSource",
        "spellClass",
        "castingCost",
        "maintenanceCost",
        "castingTime",
        "duration",
        "difficulty",
        "signature",
        "defaults",
        "defaultedFrom",
        "encumbrancePenaltyMultiple"]
    version = 1
    tag = "spell"
    type: "spell" | "spell_container"

    college: string = ""
    class: string = ""
    resist: string = ""
    powerSource: string = ""
    spellClass: string = ""
    castingCost: string = ""
    maintenanceCost: string = ""
    castingTime: string = ""
    duration: string = ""

    difficulty: Difficulty = Difficulty.hard
    signature: Signature = Signature.IQ

    defaults: Set<SkillDefault<SkillLike>> = new Set()
    defaultedFrom: SkillDefault<SkillLike> = null
    encumbrancePenaltyMultiple: number = null;

    constructor(list: List<Spell>, keys: string[] = []) {
        super(list, [...keys, ...Spell.keys])
    }

    isActive() { return true }
    getBonus() {
        return 0
    }
}