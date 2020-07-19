import { Skill } from "../skill";
import { Technique } from "../technique";
import { Spell } from "../spell";
import { Equipment } from "../equipment";
import { Trait } from "../trait";
export declare abstract class Serializer {
    static dataTypes: Set<{
        new (): Serializer;
    }>;
    constructor();
    abstract mapSkill(skill: Skill): Skill;
    abstract mapTechnique(technique: Technique): Technique;
    abstract mapSpell(spell: Spell): Spell;
    abstract mapItem(item: Item): Equipment;
    abstract mapTrait(trait: Trait): Trait;
}
export declare function registerDataType(type: {
    new (): Serializer;
}): any;
