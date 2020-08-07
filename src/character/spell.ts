import { SkillLike, SkillDefault, Difficulty } from "./skill/skill";
import { List } from "./misc/list";
import { Character, Signature } from "./character";
import { objectify, json } from "@utils/json_utils";

export class SpellList extends List<Spell> {
    constructor(character: Character) {
        super(character);
    }

    populator(data: any) {
        return new Spell(this)
    }
}

export class Spell extends SkillLike<Spell> {
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

    college: string
    class: string
    resist: string
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

    constructor(list: List<Spell>, keys: string[] = []) {
        super(list, [...keys, ...Spell.keys])
    }

    isActive() { return true }
    getBonus() {
        return 0
    }
}