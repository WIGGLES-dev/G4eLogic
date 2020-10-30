import { produce } from 'immer';
import { EntityState, EntityStore, StoreConfig, QueryEntity } from "@datorama/akita";

import { SheetData } from "./model";

import { reduce, map, concatMap, expand } from "rxjs/operators";

export interface SheetState extends EntityState<SheetData, string> {

}

@StoreConfig({ name: 'sheets', producerFn: produce })
export class SheetStore extends EntityStore<SheetState> {
    constructor() {
        super();
    }
    editSheet(id: string) {

    }
}

export class SheetQuery extends QueryEntity<SheetState> {
    constructor(store: SheetStore) {
        super(store);
    }
}

