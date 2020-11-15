import { immerable, produce } from 'immer';
import { combineQueries, EntityState, EntityStore, QueryEntity, StoreConfig, UpdateStateCallback, transaction } from "@datorama/akita";
import { v4 as uuidv4 } from 'uuid';
import { combineLatest, merge, Observable, Observer } from 'rxjs';
import { mergeMap, map, pluck, reduce, filter, takeWhile } from 'rxjs/operators';
import * as jp from "jsonpath";
import {
    Entity,
    EntityData,
    Equipment,
    FeatureType,
    Sheet,
    SheetQuery,
    SheetRepo,
    Skill,
    Spell,
    Technique,
    Trait,
    Valor,
    MeleeWeapon,
    RangedWeapon,
    FeatureBonuses,
    Features,
    EmbeddableEntity
} from '@internal';
import { SvelteComponent } from 'svelte';
import { ValorEntityStore } from './valor';

export interface FeatureState extends EntityState<EntityData<FeatureType, FeatureData>> { }
@StoreConfig({ name: 'features', producerFn: produce })
export class FeatureStore extends ValorEntityStore<FeatureState> {
    constructor() {
        super()
    }
}

export class FeatureQuery extends QueryEntity<FeatureState> {
    constructor(store: FeatureStore) {
        super(store);
    }
    allOfType(type: FeatureType) { return this.selectAll({ filterBy: feature => feature.type === type }) }
    allOfTypeWithClass<C extends Feature>(type: FeatureType, cls: new (id: string) => C) {
        return this.allOfType(type).pipe(map(features => features.map(feature => new cls(feature.id))))
    }
    get skills$(): Observable<Skill[]> { return this.allOfTypeWithClass(FeatureType.Skill, Skill) }
    get techniques$(): Observable<Technique[]> { return this.allOfTypeWithClass(FeatureType.Technique, Technique) }
    get spells$(): Observable<Spell[]> { return this.allOfTypeWithClass(FeatureType.Spell, Spell) }
    get traits$(): Observable<Trait[]> { return this.allOfTypeWithClass(FeatureType.Trait, Trait) }
    get equipment$(): Observable<Equipment[]> { return this.allOfTypeWithClass(FeatureType.Equipment, Equipment) }
}
export const FeatureRepo = new FeatureStore();

export interface FeatureData {
    type: FeatureType
    disabled?: boolean
    ownedById?: string
    bonuses: FeatureBonuses[]
    templates: FeatureData[]
    childrenIds: string[]
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
export const featureData = () => ({
    childrenIds: [],
    bonuses: [],
    templates: [],
    categories: [],
    ui: {}
});

export abstract class Feature<T extends FeatureType = FeatureType, K extends FeatureData = Features> extends EmbeddableEntity<T, K, Sheet, FeatureStore, FeatureQuery> {
    static store
    static query

    readonly store = FeatureRepo
    readonly query = new FeatureQuery(this.store)

    readonly sheetQuery = new SheetQuery(SheetRepo)

    constructor(id: string, sheet?: Sheet) {
        super(id, sheet);
    }
    get sheet() { return this.root || null }
    get config$() { return this.embedded ? this.sheet.config$ : Valor.data$.pipe(map(valor => valor.globalConfig)) }

    get bonuses() { return this.keys.bonuses }
    get bonuses$(): Observable<FeatureBonuses[]> { return this.instance$.pipe(map(instance => instance.bonuses)) }
    get owner() {
        if (!this.embedded) return null
        const embeddedData = this.sheet.allEmbeddedData;
        const owner = embeddedData.find(data => data.id === this.keys.ownedById);
        if (!owner) return null;
        return featuresFromData([owner], this.sheet.id)[0];
    }
    get owner$() { return this.instance$.pipe(takeWhile(instance => instance.owner.exists), map(instance => { return instance.owner })) }
    recursiveOwners(owners = []) {
        if (this.owner) {
            owners.push(this.owner);
            this.owner.recursiveOwners(owners);
        }
        return owners
    }

    get sameChildren() { return this.children.filter((child) => child instanceof this.constructor) as unknown as this[] }
    get children() { return featuresFromData(this.sheet.allEmbeddedData, this.sheet.id).filter(entity => entity.keys.ownedById === this.id) }
    get children$() { return this.instance$.pipe(map(instance => { return instance.children })) }
    recursiveChildren(children = []) {
        this.children.forEach(child => {
            children.push(child);
            child.recursiveChildren(children);
        });
        return children
    }

    get meleeWeapons(): MeleeWeapon<T, K>[] {
        return this.allEmbeddedData.filter(data => data.type === FeatureType.MeleeWeapon).map(data => new MeleeWeapon(data.id, this))
    }
    get meleeWeapons$(): Observable<MeleeWeapon<T, K>[]> {
        return this.instance$.pipe(map(instance => instance.meleeWeapons))
    }
    get rangedWeapons(): RangedWeapon<T, K>[] {
        return this.allEmbeddedData.filter(data => data.type === FeatureType.RangedWeapon).map(data => new RangedWeapon(data.id, this))
    }
    get rangedWeapons$(): Observable<RangedWeapon<T, K>[]> { return this.instance$.pipe(map(instance => instance.rangedWeapons)) }

    get weapons() { return [...this.rangedWeapons, ...this.meleeWeapons] }

    isContainer() { return this.keys.ui.canContainChildren === true }
    get hidden() { return this.keys.ui.hidden }
    set hidden(hidden) { this.update(data => { data.keys.ui.hidden = hidden }) }
    get disabled() { return this.keys.disabled }
    set disabled(disabled) { this.update(data => { data.keys.disabled = disabled }) }
    get listWeight() { return this.keys?.ui.listWeight }

    private _removeReferenceFromSheet() { }
    private _addReferenceToSheet() { }

    private _removeReferenceFromOwner() { }
    private _addReferenceToOwner() { }

    private _removeReferenceFromChildren() { }
    private _addReferenceToChildren() { }

    @transaction()
    mount(sheetId: string) {
        const sheet = new Sheet(sheetId);
        if (!sheet.exists) return
        return sheet.embed(this) as this;
    }
    @transaction()
    slot(...ids: string[]) {
        const data = this.sheet.allEmbeddedData;
        const features = embeddedFeaturesFromIds(ids, this.sheet.id);
        features.forEach(feature => {
            if (
                feature.id !== this.id &&
                !this.recursiveOwners().some(owner => owner.id === feature.id)
            ) {
                feature.update(data => {
                    data.keys.ownedById = this.id;
                });
            }
        });
    }
    @transaction()
    addAfter(...ids: string[]) {
        if (!this.embedded) return
        const features = embeddedFeaturesFromIds(ids, this.sheet.id);
        features.forEach(feature => {
            if (
                feature.id !== this.id &&
                !this.recursiveOwners().some(owner => owner.id === feature.id)
            ) {
                feature.update(data => { data.keys.ownedById = this.owner?.id })
            }
        })
    }
    @transaction()
    makeContainer() {
        if (this.isContainer()) return
        this.update(data => { data.keys.ui.canContainChildren = true });
    }
    @transaction()
    eject() {
        if (!this.isContainer()) return
        const owner = this.owner;
        this.children.forEach(child => {
            child.update(data => { data.keys.ownedById = owner?.id });
        });
        this.update(data => { data.keys.ui.canContainChildren = false });
    }
    @transaction()
    delete() {
        this.children.forEach(child => child.delete());
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

export function featureClassFromType(featureType: FeatureType) {
    switch (featureType) {
        case FeatureType.Skill: return Skill
        case FeatureType.Technique: return Technique
        case FeatureType.Spell: return Spell
        case FeatureType.Trait: return Trait
        case FeatureType.Equipment: return Equipment
        // case FeatureType.MeleeWeapon: return MeleeWeapon
        // case FeatureType.RangedWeapon: return RangedWeapon
    }
}

export function featuresFromData(data: EntityData<string, any>[], embeddedIn?: string) {
    return data.map(feature => {
        const id = feature.id;
        const sheet = new Sheet(embeddedIn);
        const cls = featureClassFromType(feature.type as FeatureType);
        if (cls) return new cls(id, sheet.exists ? sheet : null);
    }).filter(val => val)
}

export function embeddedFeaturesFromIds(ids: string[], embeddedIn?: string) {
    const sheet = new Sheet(embeddedIn);
    return ids.map(id => {
        if (sheet.exists) {
            const data = sheet.data.embeddedEntities[id]
            if (data) {
                return featuresFromData([data], sheet.exists ? sheet.id : null)[0];
            }
        }
    }).filter(val => val)
}