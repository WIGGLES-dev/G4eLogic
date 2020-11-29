import Schema from "validate"
import { produce } from 'immer';
import { EntityState, EntityStore, QueryEntity, transaction, createEntityStore, EntityStateHistoryPlugin, EntityDirtyCheckPlugin } from "@datorama/akita";
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import {
    EntityData,
    Equipment,
    FeatureType,
    Sheet,
    Skill,
    Spell,
    Technique,
    Trait,
    Valor,
    MeleeWeapon,
    RangedWeapon,
    FeatureBonuses,
    Entity,
    getEntityCollection,
    entitiesFromIds,
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

export abstract class Feature<T extends FeatureType = FeatureType, K extends FeatureData<T> = FeatureData<T>> extends Entity<T, K> {
    get schema() {
        const schema = super.schema;
        schema.path("keys", featureSchema())
        return schema
    }

    constructor(id: string) {
        super(id);
    }

    get sheet() { const parent = this.parent; if (parent instanceof Sheet) return parent }

    get config$() { return this.embedded ? this.sheet.config$ : Valor.state$.pipe(map(valor => valor.globalConfig)) }

    get bonuses() { return this.keys.bonuses }
    get bonuses$(): Observable<FeatureBonuses[]> { return this.instance$.pipe(map(instance => instance.bonuses)) }

    get ownerCollection() { const { ownedByType } = this.data.keys; return getEntityCollection<FeatureType | T, FeatureData | K, Feature>(ownedByType || this.type) }
    get owner() { const { ownedById } = this.data.keys; return this.ownerCollection?.instance(ownedById) }
    get owner$() { const { ownedById } = this.data.keys; return this.ownerCollection?.instance$(ownedById) }
    recursiveOwners(owners = []) {
        if (!this.owner) return owners
        owners.push(this.owner);
        this.owner.recursiveOwners(owners);
    }
    get sameChildren(): this[] { return this.children.filter(child => child instanceof this.constructor) as this[] }
    get children() { return this.keys.children.map((child) => entitiesFromIds(child.type, [child.id])[0]).filter((val): val is Feature => val && val.exists && val instanceof Feature) }
    get children$(): Observable<Feature[]> { return null }
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
        const features = entitiesFromIds(type, ids).filter((entity): entity is Feature => entity instanceof Feature);
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
        return super.delete();
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