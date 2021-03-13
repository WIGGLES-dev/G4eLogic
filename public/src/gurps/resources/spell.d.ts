import { Data, SkillLikeKeys, SkillLike } from '@internal';
export interface SpellData extends Data, SkillLikeKeys {
    type: "spell";
    version: 1;
    requiresConcentration: boolean;
    currentlyActive: boolean;
    college?: string;
    class?: string;
    resist?: string;
    powerSource?: string;
    spellClass?: string;
    castingCost?: string;
    maintenanceCost?: string;
    castingTime?: string;
    duration?: string;
}
export declare class Spell extends SkillLike<SpellData> {
    static type: "spell";
    static version: 1;
    constructor(state: Spell["state"]);
}
