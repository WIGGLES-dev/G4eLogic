import { Skill } from "../skill";
import { Technique } from "../technique";
import { Spell } from "../spell";
import { Item } from "../equipment";
import { Trait } from "../trait";

export abstract class Serializer {
    static dataTypes: Set<{ new(): Serializer }> = new Set()
    data: any

    constructor() {
        
    }

    abstract mapSkill(skill: Skill): Skill
    abstract mapTechnique(technique: Technique): Technique
    abstract mapSpell(spell: Spell): Spell
    abstract mapItem(item: Item): Item
    abstract mapTrait(trait: Trait): Trait
}

export function registerDataType(type: { new(): Serializer }) {
    Serializer.dataTypes.add(type);
    return this
}

