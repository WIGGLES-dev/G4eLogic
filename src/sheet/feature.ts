import Schema from "validate"
import { produce } from 'immer';
import { EntityState, EntityStore, QueryEntity, transaction, createEntityStore, EntityStateHistoryPlugin } from "@datorama/akita";
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import {
    EntityData,
    Equipment,
    FeatureType,
    Sheet,
    sheetQuery,
    Skill,
    Spell,
    Technique,
    Trait,
    Valor,
    MeleeWeapon,
    RangedWeapon,
    FeatureBonuses,
    EmbeddableEntity,
    Repo,
    Lookup,
    SkillData,
    TechniqueData,
    TraitData,
} from '@internal';
import { SpellData } from './gurpsFeatures/skill';
import { EquipmentData } from './gurpsFeatures/equipment';

export interface FeatureState<T extends FeatureType, K extends FeatureData> extends EntityState<EntityData<T, K>, string> { }
export interface FeatureData<T extends FeatureType = FeatureType> {
    type: T
    disabled?: boolean
    ownedById?: string
    ownedByType?: FeatureType
    children: {
        id: string
        type: FeatureType
    }[]
    bonuses: FeatureBonuses[]
    templates: FeatureData[]
    reference?: string
    categories: string[]
    userDescription?: string
    ui: UI
}
export interface UI {
    hidden?: boolean
    listWeight?: number
    canContainChildren?: boolean
    backgroundColor?: string
    textColor?: string
}
export const uiSchema = () =>
    new Schema({
        hidden: Boolean,
        listWeight: Number,
        canContainChildren: Boolean,
        backgroundColor: String,
        textColor: String
    })
export const featureSchema = () =>
    new Schema({
        type: { enum: Object.values(FeatureType), required: true },
        disabled: Boolean,
        ownedById: String,
        ownedByType: String,
        children: [
            {
                id: { type: String, required: true },
                type: { enum: Object.values(FeatureType), required: true }
            }
        ],
        bonuses: [],
        templates: [],
        reference: String,
        categories: [String],
        userDescription: String,
        ui: uiSchema()
    })
export const featureData = () => ({
    disabled: false,
    children: [],
    bonuses: [],
    templates: [],
    categories: [],
    ui: {}
});

export class FeatureQuery<T extends FeatureType, K extends FeatureData, I extends Feature> extends QueryEntity<FeatureState<T, K>> {
    type: FeatureType
    constructor(type: FeatureType, store: EntityStore<FeatureState<T, K>>) {
        super(store);
        this.type = type;
    }

    get class() { return featureClassFromType(this.type) as unknown as new (id: string) => I }
    get instances$() { return this.selectAll().pipe(map(features => features.map(feature => new this.class(feature.id)))) }

    static get allSkills$(): Observable<Skill[]> { return Feature.getCollection<FeatureType.Skill, SkillData, Skill>(FeatureType.Skill).embeddedQuery.instances$ }
    static get allTechniques$() { return Feature.getCollection<FeatureType.Technique, TechniqueData, Technique>(FeatureType.Technique).embeddedQuery.instances$ }
    static get allSpells$() { return Feature.getCollection<FeatureType.Spell, SpellData, Spell>(FeatureType.Spell).embeddedQuery.instances$ }
    static get allTraits$() { return Feature.getCollection<FeatureType.Trait, TraitData, Trait>(FeatureType.Trait).embeddedQuery.instances$ }
    static get allEquipment$() { return Feature.getCollection<FeatureType.Equipment, EquipmentData, Equipment>(FeatureType.Equipment).embeddedQuery.instances$ }
}

interface FeatureCollection<T extends FeatureType, K extends FeatureData, I extends Feature> {
    store: Repo<T, K>,
    embeddedStore: Repo<T, K>
    query: FeatureQuery<T, K, I>
    state: EntityStateHistoryPlugin<FeatureState<T, K>>
    embeddedQuery: FeatureQuery<T, K, I>
    embeddedState: EntityStateHistoryPlugin<FeatureState<T, K>>
}

function createFeatureCollection<T extends FeatureType, K extends FeatureData<T>, I extends Feature>(type: T, keys: K): FeatureCollection<T, K, I> {
    const store = createEntityStore<FeatureState<T, K>>(keys, { name: `${type}`, producerFn: produce });
    const embeddedStore = createEntityStore<FeatureState<T, K>>(keys, { name: `embedded ${type}`, producerFn: produce });
    const query = new FeatureQuery<T, K, I>(type, store);
    const embeddedQuery = new FeatureQuery<T, K, I>(type, embeddedStore);
    return {
        store,
        embeddedStore,
        query,
        state: new EntityStateHistoryPlugin(query),
        embeddedQuery,
        embeddedState: new EntityStateHistoryPlugin(embeddedQuery)
    }
}
function createFeatureStores() {
    return {
        [FeatureType.Skill]: createFeatureCollection(FeatureType.Skill, {} as SkillData),
        [FeatureType.Technique]: createFeatureCollection(FeatureType.Technique, {} as TechniqueData),
        [FeatureType.Spell]: createFeatureCollection(FeatureType.Spell, {} as SpellData),
        [FeatureType.Trait]: createFeatureCollection(FeatureType.Trait, {} as TraitData),
        [FeatureType.Equipment]: createFeatureCollection(FeatureType.Equipment, {} as EquipmentData)
    }
}

export abstract class Feature<T extends FeatureType = FeatureType, K extends FeatureData<T> = FeatureData<T>> extends EmbeddableEntity<T, K, Sheet, Repo<T, K>, Lookup<T, K>> {
    static collections = createFeatureStores()
    static getCollection<T extends FeatureType, K extends FeatureData, I extends Feature>(type: T) {
        return this.collections[type as string] as FeatureCollection<T, K, I>
    }

    get collection() { return Feature.getCollection<T, K, this>(this.type) }
    get store() { return this.collection?.store }
    get query() { return this.collection?.query }
    get stateHistory() { return this.collection?.state }
    get state() { return this._forwardStateToEntity(this.stateHistory) }

    get embeddedStore() { return this.collection?.embeddedStore }
    get embeddedQuery() { return this.collection?.embeddedQuery }
    get embeddedStateHistory() { return this.collection?.embeddedState }
    get embeddedState() { return this._forwardStateToEntity(this.embeddedState) }

    readonly sheetQuery = sheetQuery

    get schema() {
        const schema = super.schema;
        schema.path("keys", featureSchema())
        return schema
    }

    constructor(id: string) {
        super(id);
    }

    get sheet() { return this.parent }
    get parent() { return new Sheet(this.data?.rootEntityId) }

    get config$() { return this.embedded ? this.sheet.config$ : Valor.data$.pipe(map(valor => valor.globalConfig)) }

    get bonuses() { return this.keys.bonuses }
    get bonuses$(): Observable<FeatureBonuses[]> { return this.instance$.pipe(map(instance => instance.bonuses)) }
    get owner() {
        const owner = Feature.getCollection<FeatureType | T, FeatureData | K, this>(this.keys.ownedByType || this.type)?.embeddedQuery?.getEntity(this.keys?.ownedById)
        if (!owner) return null
        return featuresFromData([owner])[0]
    }
    get owner$() { return this.instance$.pipe(takeWhile(instance => instance.owner.exists), map(instance => { return instance.owner })) }
    recursiveOwners(owners = []) {
        if (this.owner) {
            owners.push(this.owner);
            this.owner.recursiveOwners(owners);
        }
        return owners
    }

    get sameChildren(): this[] { return this.children.filter(child => child instanceof this.constructor) as this[] }
    get children() {
        return this.keys.children.map(child => featuresFromIds(child.type || this.type, [child.id])[0])
    }
    get children$(): Observable<Feature[]> { return this.instance$.pipe(map(instance => instance.children)) }
    recursiveChildren(children = []) {
        this.children.forEach(child => {
            children.push(child);
            child.recursiveChildren(children);
        });
        return children
    }

    get meleeWeapons(): MeleeWeapon<T, K>[] {
        return this.allEmbeddedData.filter(data => data?.type === FeatureType.MeleeWeapon).map(data => new MeleeWeapon(this, data.id))
    }
    get meleeWeapons$(): Observable<MeleeWeapon<T, K>[]> {
        return this.instance$.pipe(map(instance => instance.meleeWeapons))
    }
    get rangedWeapons(): RangedWeapon<T, K>[] {
        return this.allEmbeddedData.filter(data => data?.type === FeatureType.RangedWeapon).map(data => new RangedWeapon(this, data.id))
    }
    get rangedWeapons$(): Observable<RangedWeapon<T, K>[]> {
        return this.instance$.pipe(map(instance => instance.rangedWeapons))
    }

    get weapons() { return [...this.rangedWeapons, ...this.meleeWeapons] }

    isContainer() { return this.keys.ui.canContainChildren === true }
    get hidden() { return this.keys.ui.hidden }
    set hidden(hidden) {
        this.update(data => {
            data.keys.ui.hidden = hidden;
            return data
        })
    }
    get disabled() { return this.keys.disabled }
    set disabled(disabled) {
        this.update(data => {
            data.keys.disabled = disabled;
            return data
        })
    }
    get listWeight() { return this.keys?.ui.listWeight }

    @transaction()
    slot(type: FeatureType, ...ids: string[]) {
        const features = featuresFromIds(type, ids);
        features.forEach(feature => {
            if (
                feature.id !== this.id &&
                !this.recursiveOwners().some(owner => owner.id === feature.id)
            ) {
                const owner = feature.owner;
                if (owner?.id === this.id) {
                    feature.update(data => {
                        data.keys.ownedById = this.owner?.id;
                        return data
                    });
                    this.update(data => {
                        data.keys.children = data.keys.children.filter(child => child.id !== feature.id);
                        return data
                    });
                    this.owner?.update(data => {
                        data.keys.children.push({
                            id: feature.id,
                            type: feature.type
                        })
                        return data
                    })
                } else {
                    feature.update(data => {
                        data.keys.ownedById = this.id;
                        data.keys.ownedByType
                        return data
                    });
                    owner?.update(data => {
                        data.keys.children = data.keys.children.filter(child => child.id !== feature.id);
                        return data
                    })
                    this.update(data => {
                        data.keys.children.push({
                            id: feature.id,
                            type: feature.type
                        })
                        return data
                    })
                }
            }
        });
    }

    @transaction()
    makeContainer() {
        if (this.isContainer()) return
        this.update(data => {
            data.keys.ui.canContainChildren = true
            return data
        });
    }

    @transaction()
    eject() {
        if (!this.isContainer()) return
        const owner = this.owner;
        this.children.forEach(child => {
            child?.update(
                data => {
                    data.keys.ownedById = owner?.id;
                    return data
                });
        });
        owner?.update(data => {
            data.keys.children = []
            return data
        });
        this.update(data => {
            data.keys.ui.canContainChildren = false;
            return data
        });
    }

    @transaction()
    delete() {
        const owner = this.owner
        this.children.forEach(child => child.delete());
        owner?.update(data => {
            data.keys.children = data.keys.children.filter(child => child.id !== this.id);
            return data
        })
        super.delete();
    }

    get contextMenuOptions() {
        return [
            {
                label: "Collapse",
                callback: () => this.hidden = true,
                show: () => this.isContainer() && !this.hidden
            },
            {
                label: "Expand",
                callback: () => this.hidden = false,
                show: () => this.isContainer() && this.hidden
            },
            {
                label: "Make Container",
                callback: () => this.makeContainer(),
                show: () => !this.isContainer() &&
                    this.type !== FeatureType.MeleeWeapon &&
                    this.type !== FeatureType.RangedWeapon
            },
            {
                label: "Undo Make Container",
                callback: () => this.eject(),
                show: () => this.isContainer()
            },
            ...super.contextMenuOptions
        ]
    }
}

export function featureClassFromType<T extends FeatureType>(featureType: T) {
    switch (featureType) {
        case FeatureType.Skill: return Skill
        case FeatureType.Technique: return Technique
        case FeatureType.Spell: return Spell
        case FeatureType.Trait: return Trait
        case FeatureType.Equipment: return Equipment
    }
}

export function featuresFromData<D extends EntityData<FeatureType, FeatureData>>(data: D[]): Feature[] {
    return data.map(feature => {
        const cls = featureClassFromType(feature.type);
        if (cls) return new cls(feature.id);
    }).filter(cls => cls && cls.exists)
}

export function featuresFromIds<T extends FeatureType>(type: T, ids: string[]): Feature[] {
    const cls = featureClassFromType(type);
    if (!cls) return []
    return ids.map(id => {
        return new cls(id)
    }).filter(cls => cls.exists)
}