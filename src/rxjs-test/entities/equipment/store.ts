import { produce } from 'immer';
import { EntityState, EntityStore, QueryEntity, StoreConfig } from "@datorama/akita";
import { EquipmentData } from "./model";

export interface EquipmentState extends EntityState<EquipmentData, string> {

}

@StoreConfig({ name: 'equipment', producerFn: produce })
export class EquipmentStore extends EntityStore<EquipmentState> {
    constructor() {
        super()
    }
}

export class EquipmentQuery extends QueryEntity<EquipmentState> {
    constructor(store: EquipmentStore) {
        super(store);
    }
}