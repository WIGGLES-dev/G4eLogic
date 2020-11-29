import {
    createStore,
    createQuery,
    runEntityStoreAction,
    EntityStoreAction,
    snapshotManager,
    EntityAction,
    EntityActions,
    combineQueries,
    transaction,
} from "@datorama/akita";
import produce from "immer";
import { connectToChild } from "penpal";
import {
    config,
    Config,
    getRoot,
    bubbleFrameEvents,
    createContextMenu,
    db,
    FeatureType,
    EntityType,
    Entity,
    EntityData,
    Identifiable
} from "@internal";
import { fromEvent, Observable } from "rxjs";
import deepmerge from "deepmerge";
import { Connection } from "penpal/lib/types";

export interface ValorConfig {
    contextMenuActive: boolean
    globalConfig: Config
    lastStateUpdate?: {
        id: string,
        timestamp: number
    }
    currentlyEditingId: string,
    currentlyEditingType: string
}

export const defaultValorConfig = (): ValorConfig => ({
    contextMenuActive: false,
    globalConfig: config,
    currentlyEditingId: null,
    currentlyEditingType: null
})

export const valorState = createStore<ValorConfig>(defaultValorConfig(), { name: 'valor', producerFn: produce });
export const valorQuery = createQuery(valorState)

export class Valor {
    static db = db
    static entityTable(type) { return this.db.table<EntityData>(type) }

    static channel = new BroadcastChannel("valor")
    static connections: Map<string, Connection<typeof Valor["methods"]>> = new Map()

    static get state() { return valorState.getValue() }
    static get state$() { return valorQuery.select() }
    static setState(state: Partial<ValorConfig>) {
        valorState.update(prevState => deepmerge(prevState, state, Valor.mergeOptions))
    }

    static contextMenu(e: MouseEvent, options = []) {
        const menu = createContextMenu(e, options);
        if (!menu || this.state.contextMenuActive) return
        valorState.update(data => { data.contextMenuActive = true; })
        menu.$on("close", () => valorState.update(data => { data.contextMenuActive = false }));
    }

    static async addEntities(store: string, entities: EntityData[], options = {}) {
        runEntityStoreAction(store, EntityStoreAction.AddEntities, (
            add
        ) => {
            add(entities)
        });
        return entities
    }

    private static get mergeOptions() {
        return {
            arrayMerge: (destinaition, source, options) => source
        }
    }

    @transaction()
    static async updateEntities(store: string, entities: EntityData[], options = {}) {
        runEntityStoreAction(store, EntityStoreAction.UpdateEntities, (
            update,
        ) => {
            entities.forEach(entity => {
                update(entity.id, (data) => {

                    if (data instanceof Array) {
                        return deepmerge.all(data, Valor.mergeOptions)
                    }
                    return deepmerge(data, entity, Valor.mergeOptions)
                }
                );
            });
        });
        return entities
    }

    static async removeEntities(store: string, entities: EntityData[], options = {}) {
        const ids = entities.map(entity => entity.id);
        runEntityStoreAction(store, EntityStoreAction.RemoveEntities, (
            remove
        ) => {
            remove(ids)
        });
        return entities
    }

    static get methods() {
        return {
            loadDatabase: this.loadDatabase,
            setStoreSnapshot: snapshotManager.setStoresSnapshot,
            getStoreSnapshot: snapshotManager.getStoresSnapshot,
            addEntities: this.addEntities,
            updateEntities: this.updateEntities,
            removeEntities: this.removeEntities,
            setState: this.setState
        }
    }

    private static _loadTable(obj: EntityData, { key, primaryKey }) { Entity.getCollection(obj.type)?.store.add(obj); }
    static loadDatabase(this: typeof Valor) {
        Valor.entityTable(EntityType.Sheet).each(this._loadTable);
        Valor.entityTable(FeatureType.Skill).each(this._loadTable);
        Valor.entityTable(FeatureType.Technique).each(this._loadTable);
        Valor.entityTable(FeatureType.Spell).each(this._loadTable);
        Valor.entityTable(FeatureType.Equipment).each(this._loadTable);
        Valor.entityTable(FeatureType.Trait).each(this._loadTable);
    }

    static open(this: typeof Valor) { }

    static async embed(target: HTMLElement, options) {
        if (!options.id) return
        const iframe = createFrame(target, options);
        const connection = connectToChild<typeof Valor["methods"]>({
            iframe,
            get methods() { return this.methods }
        });
        target.appendChild(iframe);
        const snapshot = snapshotManager.getStoresSnapshot();
        await (await connection.promise).setStoreSnapshot(snapshot);
        this.connections.set(options.id, connection);
        return connection
    }
}

function createFrame(target: HTMLElement, props) {
    const frame = target.appendChild(Object.assign(document.createElement("iframe"), {
        width: props.height || "100%",
        height: props.width || "100%",
        src: props.src || "about:blank",
        name: props.name,
    }));
    const meta = document.createElement("meta");
    meta.setAttribute("charset", "utf-8")
    const styles = props.styles?.map(href => {
        return Object.assign(document.createElement("link"), {
            rel: "stylesheet",
            href
        })
    });
    const scripts = props.scripts?.map(src => {
        return Object.assign(document.createElement("script"), {
            src
        })
    });
    frame.contentDocument.head.append(meta, ...styles, ...scripts);
    frame.onmouseenter = () => frame.focus();
    frame.onmouseleave = () => window.focus();
    bubbleFrameEvents(frame);
    return frame
}