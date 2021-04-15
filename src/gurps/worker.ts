import { getPath } from '@utils/object';
import { Character } from "./resources/character"
import { Trait } from "./resources/trait";
import { Equipment } from "./resources/equipment";
import { Skill, SkillLike } from "./resources/skill";
import { Technique } from "./resources/technique";
import { Spell } from "./resources/spell";
import { Weapon, MeleeWeapon, RangedWeapon } from "./resources/weapon";
import { expose } from "comlink";
import type { Remote } from "comlink";
import { Entity, Data } from "@app/entity";
export const remote = {
    classes: {
        [Character.type]: Character,
        [Trait.type]: Trait,
        [Equipment.type]: Equipment,
        "skilllike": SkillLike,
        [Skill.type]: Skill,
        [Technique.type]: Technique,
        [Spell.type]: Spell,
        "weapon": Weapon,
        [MeleeWeapon.type]: MeleeWeapon,
        [RangedWeapon.type]: RangedWeapon,
    },
    helpers: {

    },
    async process(rootData, embedData = rootData) {
        try {
            const { type } = rootData;
            const constructor = remote.classes[type] || Entity;
            const entity: Entity<Data, Data> = new constructor(rootData, embedData);
            return entity.process()
        } catch (err) {
            return {}
        }
    }
};
export interface GURPSWorker {
    classes: {
        character: Remote<typeof Character>
        trait: Remote<typeof Trait>
        equipment: Remote<typeof Equipment>
        skilllike: Remote<typeof SkillLike>
        skill: Remote<typeof Skill>
        technique: Remote<typeof Technique>
        spell: Remote<typeof Spell>
        weapon: Remote<typeof Weapon>
        "melee weapon": Remote<typeof MeleeWeapon>
        "ranged weapon": Remote<typeof RangedWeapon>
    }
    helpers: {

    }
    process(rootData: Data, embedData: Data): Promise<Record<string, any>>
}
self["onconnect"] = e => expose(remote, e.ports[0])
