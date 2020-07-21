import { Skill } from "../skill";
import { Technique } from "../technique";
import { Spell } from "../spell";
import { Equipment } from "../equipment";
import { Trait } from "../trait";
import { Character } from "index";

/**
 * Abstract class from which all serializers draw functionality. It covers loading and saving functionality
 * by allowing a function to write data from an arbitrary external source. A loader is defined as the 
 * following: A function that exposes the interal object you load into which will return the children that need to 
 * be loaded next. The loader will stop loading when your function does not return a non-zero length array.
 */

export abstract class Serializer {
    static dataTypes: Set<{ new(): Serializer }> = new Set()

    constructor() {

    }

    abstract mapSkill(skill: Skill, data?: any): any[]
    abstract mapTechnique(technique: Technique, data: any): any[]
    abstract mapSpell(spell: Spell, data?: any): any[]
    abstract mapEquipment(equipment: Equipment, data: any): any[]
    abstract mapTrait(trait: Trait, data?: any): any[]

    abstract load(character: Character, data: any): Character
}

export function registerDataType(type: { new(): Serializer }) {
    Serializer.dataTypes.add(type);
    return this
}