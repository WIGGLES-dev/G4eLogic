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
    abstract mapSkill(skill: Skill, data?: any): any[];
    abstract mapTechnique(technique: Technique, data: any): any[];
    abstract mapSpell(spell: Spell, data?: any): any[];
    abstract mapEquipment(equipment: Equipment, data: any): any[];
    abstract mapTrait(trait: Trait, data?: any): any[];
}
export declare function registerDataType(type: {
    new (): Serializer;
}): any;
