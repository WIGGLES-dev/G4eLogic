import Dexie from 'dexie';
import 'dexie-observable';
import { IDatabaseChange } from 'dexie-observable/api';

import { fromEvent } from "rxjs";

import { FeatureType, EntityType } from '@internal';

const entityIndexes = [
    "id",
    "type",
    "embedded",
    "rootEntityId",
    "rootEntityType",
    "progenitorId",
    "createdOn",
    "lastEdit"
];

const featureIndexes = []

function concatIndexes(indexes: string[]) { return indexes.join(",") }

const schema = {
    [EntityType.Sheet]: concatIndexes(entityIndexes),
    [FeatureType.Skill]: concatIndexes(entityIndexes),
    [FeatureType.Spell]: concatIndexes(entityIndexes),
    [FeatureType.Technique]: concatIndexes(entityIndexes),
    [FeatureType.Trait]: concatIndexes(entityIndexes),
    [FeatureType.Equipment]: concatIndexes(entityIndexes),
}

const db = new Dexie("valor database");
db.version(1).stores(schema);

db.on("changes", (changes: IDatabaseChange[], partial: boolean) => {
    changes.forEach(change => {

    });
});

db.open();

export default db