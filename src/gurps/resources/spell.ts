import {
    Data,
    SkillLikeKeys,
    SkillLike,
    GResource,
    staticImplements
} from '@internal'
export interface SpellData extends Data, SkillLikeKeys {
    type: "spell"
    version: 1
    requiresConcentration: boolean
    currentlyActive: boolean
    college?: string
    class?: string
    resist?: string
    powerSource?: string
    spellClass?: string
    castingCost?: string
    maintenanceCost?: string
    castingTime?: string
    duration?: string
}

export class Spell extends SkillLike<SpellData> {
    static type = 'spell' as const
    static version = 1 as const
    constructor(state: Spell["state"]) {
        super(state);
    }
}