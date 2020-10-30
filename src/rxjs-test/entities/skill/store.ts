import { produce } from 'immer';
import { EntityState, EntityStore, QueryEntity, StoreConfig, UpdateStateCallback } from "@datorama/akita";
import { SkillData, SkillDifficulty, SkillDefault, calculateSkillLevel } from "./model";

export interface SkillState extends EntityState<SkillData, string> {

}

@StoreConfig({ name: 'skills', producerFn: produce })
export class SkillStore extends EntityStore<SkillState> {
    constructor() {
        super()
    }
}

export class SkillQuery extends QueryEntity<SkillState> {
    constructor(store: SkillStore) {
        super(store);
    }
}