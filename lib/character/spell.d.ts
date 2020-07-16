import { SkillLike } from "./skill";
import { List } from "./misc/list";
import { Character } from "./character";
import { json } from "../utils/json_utils";
export declare class SpellList extends List<Spell> {
    tag: string;
    class: typeof Spell;
    constructor(character: Character);
}
export declare class Spell extends SkillLike<Spell> {
    tag: string;
    college: string;
    powerSource: string;
    spellClass: string;
    castingCost: string;
    maintenanceCost: string;
    castingTime: string;
    duration: string;
    constructor(list: List<Spell>);
    getBonus(): number;
    toJSON(): {};
    loadJSON(object: string | json): this;
}
