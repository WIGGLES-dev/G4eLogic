import { registerDataType, Serializer } from "./serializer";
import { Skill } from "../../character/skill";
import { Technique } from "../../character/technique";
import { Spell } from "../../character/spell";
import { Equipment } from "../../character/equipment";
import { Trait } from "../../character/trait";

@registerDataType(GCSJSON)
class GCSJSON extends Serializer {
    constructor() {
        super();
    }

    mapSkill() { return {} as Skill }
    mapTechnique(object: any) { return {} as Technique }
    mapSpell(object: any) { return {} as Spell }
    mapItem(object: any) { return {} as Equipment }
    mapTrait(object: any) { return {} as Trait }
}