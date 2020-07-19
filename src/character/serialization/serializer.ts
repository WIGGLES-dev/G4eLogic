import { Skill } from "../skill";
import { Technique } from "../technique";
import { Spell } from "../spell";
import { Equipment } from "../equipment";
import { Trait } from "../trait";

export abstract class Serializer {
    static dataTypes: Set<{ new(): Serializer }> = new Set()

    constructor() {
        
    }

    abstract mapSkill(skill: Skill): Skill
    abstract mapTechnique(technique: Technique): Technique
    abstract mapSpell(spell: Spell): Spell
    abstract mapItem(item: Item): Equipment
    abstract mapTrait(trait: Trait): Trait
}

export function registerDataType(type: { new(): Serializer }) {
    Serializer.dataTypes.add(type);
    return this
}