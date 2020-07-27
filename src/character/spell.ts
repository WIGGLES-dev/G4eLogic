import { SkillLike, SkillDefault, Difficulty } from "./skill/skill";
import { List } from "./misc/list";
import { Character, Signature } from "./character";
import { objectify, json } from "@utils/json_utils";

export class SpellList extends List<Spell> {
    populator = Spell

    constructor(character: Character) {
        super(character);
    }
}

export class Spell extends SkillLike<Spell> {
    version = 1
    tag = "spell"
    type: "spell" | "spell_container"

    college: string
    powerSource: string
    spellClass: string
    castingCost: string
    maintenanceCost: string
    castingTime: string
    duration: string

    difficulty: Difficulty = Difficulty.hard

    signature: Signature = Signature.IQ
    defaults: Set<SkillDefault<SkillLike<any>>>
    defaultedFrom: SkillDefault<SkillLike<any>> = null
    encumbrancePenaltyMultiple: number = null;

    constructor(list: List<Spell>) {
        super(list)
    }
    isActive() { return true }
    getBonus() {
        return 0
    }
}