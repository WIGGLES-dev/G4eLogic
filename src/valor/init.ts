import { fromEvent } from "rxjs";
import { connectToParent } from 'penpal';
import { Valor, Entity, Skill, EntityData, EntityType, FeatureType, foundryConnectionMethods } from "@internal"
import { applyTransaction, snapshotManager, EntityStoreAction, EntityActions, combineQueries } from "@datorama/akita";
import deepmerge from "deepmerge";


import ValorGUI from "@ui/view.svelte";
import "@ui/styles/styles.css";

async function initWindow(this: GlobalEventHandlers, ev: Event) {
    if (!window) return
    const { opener, frames } = window;
    let connection;
    try {
        connection = await connectToParent<typeof foundryConnectionMethods>({ methods: {} }).promise;
    } catch (err) {

    }

    const channel = Valor.channel;
    const storage$ = fromEvent<StorageEvent>(window, "storage")
    const channel$ = fromEvent<MessageEvent>(channel, "message");
    const messages$ = fromEvent<MessageEvent>(window, "message");

    storage$;
    channel$;
    messages$;

    if (connection) {
        const _valor = { ...Object.getOwnPropertyDescriptors(Valor) }
        Valor.addEntities = async function (store, entities, options) {
            try {
                entities = Entity.clone(entities);
                for (let entity of entities) {
                    if (!connection) break
                    if (!entity) continue
                    if (entity.embedded) {
                        const actor = await connection.getActorData(entity.rootEntity?.alternativeIds?.valor)
                        if (!actor) continue
                        const item = await connection.createOwnedItem(actor._id, {
                            _id: undefined,
                            type: entity.type,
                            name: entity.keys.name || `new ${entity.type}`,
                            img: undefined,
                            data: entity
                        }, options);
                        entity.alternativeIds = Object.assign(entity.alternativeIds || {}, { valor: item._id });
                    } else {
                        const target: "createActor" | "createItem" = entity.type === EntityType.Sheet ? "createActor" : "createItem"
                        const newEntity = await connection[target]({
                            _id: undefined,
                            type: entity.type,
                            name: "???",
                            img: undefined,
                            data: entity
                        }, options);
                        entity.alternativeIds = Object.assign(entity.alternativeIds || {}, { valor: newEntity.id });
                    }
                }
            } catch (err) {

            }
            return _valor.addEntities.value(store, entities, options);
        }
        Valor.removeEntities = async function (store, entities, options) {
            try {
                entities = Entity.clone(entities);
                for (const entity of entities) {
                    if (!connection) break
                    if (!entity) continue
                    if (entity.embedded) {
                        connection.deleteOwnedItem(entity.rootEntity?.alternativeIds?.valor, entity?.alternativeIds?.valor, options);
                    } else {
                        const target: "deleteActor" | "deleteItem" = entity.type === EntityType.Sheet ? "deleteActor" : "deleteItem"
                        connection[target](entity?.alternativeIds?.valor, options);
                    }
                }
            } catch (err) {

            }
            return _valor.removeEntities.value(store, entities, options);
        }
        Valor.updateEntities = async function (store, entities, options) {
            try {
                for (const entity of entities) {
                    if (entity.embedded) {
                        connection.updateOwnedItem(entity?.rootEntity?.alternativeIds?.valor, {
                            _id: entity?.alternativeIds?.valor,
                            type: entity.type,
                            data: entity,
                            name: entity.keys?.name,
                            img: undefined
                        }, options)
                    } else {
                        const target: "updateActor" | "updateItem" = entity.type === EntityType.Sheet ? "updateActor" : "updateItem";
                        connection[target]({
                            _id: entity?.alternativeIds?.valor,
                            type: entity.type,
                            data: entity,
                            name: undefined,
                            img: undefined
                        }, options)
                    }
                }
            } catch (err) {

            }
            return _valor.updateEntities.value(store, entities);
        }
    }

    new ValorGUI({
        target: document.body,
        props: {}
    });
}

function loadTable(obj: EntityData, { key, primaryKey }) {
    Entity.getCollection(obj.type)?.store.add(obj);
}
function loadDatabase() {
    Valor.entityTable(EntityType.Sheet).each(loadTable);
    Valor.entityTable(FeatureType.Skill).each(loadTable);
    Valor.entityTable(FeatureType.Technique).each(loadTable);
    Valor.entityTable(FeatureType.Spell).each(loadTable);
    Valor.entityTable(FeatureType.Equipment).each(loadTable);
    Valor.entityTable(FeatureType.Trait).each(loadTable);
}

document.onload = initWindow;