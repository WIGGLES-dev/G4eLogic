import { produce } from 'immer';
import { EntityState, EntityStore, QueryEntity, StoreConfig, UpdateStateCallback } from "@datorama/akita";


export interface SkillState extends EntityState<any, string> {

}

@StoreConfig({ name: 'spells', producerFn: produce })
export class SpellStore extends EntityStore<SkillState> {
    constructor() {
        super()
    }
}

export class SpellQuery extends QueryEntity<SkillState> {
    constructor(store: SpellStore) {
        super(store);
    }
}