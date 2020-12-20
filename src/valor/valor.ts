import Dexie from 'dexie';
import 'dexie-observable';
import {
    createStore,
    createQuery,
    runEntityStoreAction,
    EntityStoreAction,
    snapshotManager,
} from "@datorama/akita";
import {
    Config,
    Collection
} from "@internal";
import { Subject } from "rxjs";
import deepmerge from "deepmerge";
import { map } from "rxjs/operators";

export interface ValorConfig {
    contextMenuActive: boolean
    globalConfig: Config
    lastStateUpdate?: {
        id: string,
        timestamp: number
    }
    currentlyEditing?: {
        id: string,
        type: string
        owner?: {
            id: string,
            type: string
        }
    },
    view?: string
}

export const defaultValorConfig = (): ValorConfig => ({
    contextMenuActive: false,
    globalConfig: {} as any,
    currentlyEditing: null
})

export const valorState = createStore<ValorConfig>(defaultValorConfig(), { name: 'valor' });
export const valorQuery = createQuery(valorState)

export enum GurpsResources {
    Sheet = "sheet",
    Skill = "skill",
    Technique = "technique",
    Spell = "spell",
    Trait = "trait",
    Equipment = "equipment",
    MeleeWeapon = "melee weapon",
    RangedWeapon = "ranged weapon"
}

export enum ValorEventType {
    AddEntities,
    UpdateEntities,
    RemoveEntities,
    Roll
}

export interface ValorEvent {
    type: string | number
    data: any
}

const assets = {
    silhouette: "silhouette.png",
    blockIco: "shield.svg",
    attackIco: "sword.svg,",
    parryIco: "fencer.svg"
}

const entityIndexes = [
    "id",
    "source",
    "embedded",
    "rootEntity.id",
    "rootEntity.type",
    "progenitor.id",
    "progenitor.type",
    "createdOn",
    "lastEdit"
];

function concatIndexes(indexes: string[]) { return indexes.join(",") }

const schema = {
    [GurpsResources.Sheet]: concatIndexes(entityIndexes),
    [GurpsResources.Skill]: concatIndexes(entityIndexes),
    [GurpsResources.Spell]: concatIndexes(entityIndexes),
    [GurpsResources.Technique]: concatIndexes(entityIndexes),
    [GurpsResources.Trait]: concatIndexes(entityIndexes),
    [GurpsResources.Equipment]: concatIndexes(entityIndexes),
    [GurpsResources.MeleeWeapon]: concatIndexes(entityIndexes),
    [GurpsResources.RangedWeapon]: concatIndexes(entityIndexes),
}

export const db = new Dexie("valor database");
db.version(1).stores(schema);

export class Valor {
    static assets = assets
    static events$ = new Subject<ValorEvent>()
    static db = db

    static channel = new BroadcastChannel("valor")

    static get state() { return valorState.getValue() }
    static get state$() { return valorQuery.select() }
    static setState(state: Partial<ValorConfig>) {
        valorState.update(prevState => deepmerge(prevState, state))
    }
}

export const valorConnectionMethods = {
    setStoreSnapshot: snapshotManager.setStoresSnapshot,
    getStoreSnapshot: snapshotManager.getStoresSnapshot,
    sendEvent(event: ValorEvent) { Valor.events$.next(event); },
    setState: Valor.setState
}