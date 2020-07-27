import { SkillLike, SkillDefault, Difficulty } from "./skill/skill";
import { List } from "./misc/list";
import { Character, Signature } from "./character";
export declare class SpellList extends List<Spell> {
    populator: typeof Spell;
    constructor(character: Character);
}
export declare class Spell extends SkillLike<Spell> {
    version: number;
    tag: string;
    type: "spell" | "spell_container";
    college: string;
    powerSource: string;
    spellClass: string;
    castingCost: string;
    maintenanceCost: string;
    castingTime: string;
    duration: string;
    difficulty: Difficulty;
    signature: Signature;
    defaults: Set<SkillDefault<SkillLike<any>>>;
    defaultedFrom: SkillDefault<SkillLike<any>>;
    encumbrancePenaltyMultiple: number;
    constructor(list: List<Spell>);
    isActive(): boolean;
    getBonus(): number;
}
