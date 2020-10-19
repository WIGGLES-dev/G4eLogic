import { SkillLike, SkillDefault, Difficulty, SkillList } from "./skill/skill";
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

export class Spell extends SkillLike {
    static keys = [
        "active",
        "concentration",
        "college",
        "class",
        "resist",
        "powerSource",
        "spellClass",
        "castingCost",
        "maintenanceCost",
        "castingTime",
        "duration",
    ]

    active: boolean = false
    concentration: boolean = false

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

    calculateLevel(...args) {
        return super.calculateLevel(...args) - Math.abs(this.castingPenalty())
    }

    isActive() { return true }
    getBonus() {
        return 0
    }

    castingPenalty() {
        return this.list.iter().reduce((penalty, spell) => {
            if (spell.active) return penalty + (spell.concentration ? 4 : 1)
            return penalty
        }, 0);
    }
}