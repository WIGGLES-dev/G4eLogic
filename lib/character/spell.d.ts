import { SkillLike, SkillDefault, Difficulty } from "./skill/skill";
import { List } from "./misc/list";
import { Character, Signature } from "./character";
export declare class SpellList extends List<Spell> {
    constructor(character: Character);
    populator(data: any): any;
}
export declare class Spell extends SkillLike<Spell> {
    static keys: string[];
    version: number;
    tag: string;
    type: "spell" | "spell_container";
    college: string;
    class: string;
    resist: string;
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
    constructor(list: List<Spell>, keys?: string[]);
    isActive(): boolean;
    getBonus(): number;
}
