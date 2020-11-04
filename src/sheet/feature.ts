import { immerable, produce } from 'immer';
import { combineQueries, EntityState, EntityStore, QueryEntity, StoreConfig, UpdateStateCallback } from "@datorama/akita";
import { v4 as uuidv4 } from 'uuid';
import { Valor } from "./valor";
import { Skill, Technique, Spell, Trait, Equipment } from "./gurpsFeatures/index"
import { combineLatest, merge, Observable, Observer } from 'rxjs';
import { mergeMap, map, pluck, reduce, filter } from 'rxjs/operators';
import { SheetData, Features, FeatureType, KeyList, defaultSheetData, WeaponType, MeleeWeaponData, RangedWeaponData, Signatures } from "@sheet/keys";
import { parseAttributes, parseHitLocations, parsePools } from './config';
import { Attribute, Pool } from './attribute';
import { HitLocation } from "./hitLocation";
import { basicLift, getSwingDamage, getThrustDamage } from '@gurps4e/gurps';
import * as jp from "jsonpath";
abstract class EntityWrapper<D, S extends EntityStore<EntityState<D, string>>, Q extends QueryEntity<EntityState<D, string>>>  {
    abstract store: S
    abstract query: Q
    #id: string
    get id() { return this.#id }
    get data() { return this.query.getEntity(this.#id) }
    get data$() { return this.query.selectEntity(this.id) }
    get instance() { return this._createThis(this.id) }
    get instance$() { return this.data$.pipe(map(data => this._createThis(this.id))) }
    constructor(id?: string) {
        if (id == undefined) id = this.clone().id
        this.#id = id;
    }
    abstract defaultData(): D
    protected _createThis(id?: string) {
        return new (this.constructor as new (id: string) => this)(id)
    }
    clone(data?: D) {
        const id = uuidv4();
        this.store.add(Object.assign({}, data || this.data || this.defaultData(), { id }));
        return this._createThis(id)
    }
    private _safeAccessProxy() {
        const handler = {
            get(target: {}, p: string | number | symbol, receiver: any) {
                return new Proxy({}, handler)
            }
        }
        return new Proxy({}, handler)
    }
    update(fn: UpdateStateCallback<D, Partial<D>>) { this.store.update(this.#id, fn) }
    pathUpdate(path: string, value: any) { this.store.update(this.#id, (data) => { jp.value(data, path, value) }) }
    set(value: D) { this.store.update(this.id, data => data = value || data) }
    subscribe(observer: Observer<any>) {
        const subscription = this.data$.pipe(map(data => clone(data))).subscribe(observer);
        return {
            unsubscribe: () => subscription.unsubscribe(),
            set: (val) => this.set(val)
        }
    }
    delete() {
        this.store.remove(this.id);
    }
}
function clone<T>(data: T): T {
    try {
        return JSON.parse(JSON.stringify(data))
    }
    catch (err) {
        console.log(err);
        return {} as T
    }
}
export interface SheetState extends EntityState<SheetData, string> { }
@StoreConfig({ name: 'sheets', producerFn: produce })
export class SheetStore extends EntityStore<SheetState> {
    constructor() {
        super();
    }
}
export class SheetQuery extends QueryEntity<SheetState> {
    constructor(store: SheetStore) {
        super(store);
    }
}
export const Sheets = new SheetStore();
export class Sheet extends EntityWrapper<SheetData, SheetStore, SheetQuery> {
    get store() { return Sheets }
    get query() { return new SheetQuery(this.store) }
    get featureQuery() { return new FeatureQuery(Features) }
    constructor(id: string) {
        super(id);
    }
    defaultData() {
        return defaultSheetData()
    }
    get skills$() {
        return this.featureQuery.skills$.pipe(
            map(skills => skills.filter(skill => skill.data.sheetId === this.id))
        )
    }
    get techniques$() {
        return this.featureQuery.techniques$.pipe(
            map(techniques => techniques.filter(technique => technique.data.sheetId === this.id))
        )
    }
    get spells$() {
        return this.featureQuery.spells$.pipe(
            map(spells => spells.filter(spell => spell.data.sheetId === this.id))
        )
    }
    get traits$() {
        return this.featureQuery.traits$.pipe(
            map(traits => traits.filter(trait => trait.data.sheetId === this.id))
        )
    }
    get equipment$() {
        return this.featureQuery.equipment$.pipe(
            map(
                equipment => equipment.filter(item => item.data.sheetId === this.id).map(item => new Equipment(item.id)))
        )
    }
    get allFeatures$() { return combineLatest([this.skills$, this.techniques$, this.spells$, this.traits$, this.equipment$]) }
    get carriedWeight$() {
        return this.equipment$.pipe(
            mergeMap(equipment => equipment.filter(item => !item.keys.disabled)),
            reduce((weight, equipment) => weight, 0)
        )
    }
    get config$() { return this.data$.pipe(map(data => data.config)) }
    get encumbranceLevel$() { return null }
    get attributes() {
        const data = this.data;
        return Object.entries(
            parseAttributes(clone(data.config.attributes))
        ).reduce(
            (attributes, [signature, data]) => {
                attributes[signature] = new Attribute(this, data, signature, attributes)
                return attributes
            }, {} as KeyList<Attribute>
        )
    }
    get attributes$(): Observable<KeyList<Attribute>> {
        return this.instance$.pipe(map(sheet => sheet.attributes))
    }
    get pools$() {
        return combineLatest([
            this.data$,
            this.attributes$
        ]).pipe(
            map(([data, attributes]) => {
                return Object.entries(
                    parsePools(clone(data.config.pools))
                ).reduce(
                    (pools, [signature, data]) => {
                        pools[signature] = new Pool(this, data, signature, attributes)
                        return pools
                    }, {} as KeyList<Pool>
                )
            })
        )
    }
    get hitLocations$() {
        return this.data$.pipe(
            map(data => {
                return Object.entries(
                    parseHitLocations(clone(data.config.locations))
                ), reduce(
                    (locations, [name, data]) => {
                        locations[name] = new HitLocation(this, data, name);
                        return locations
                    }, {} as KeyList<HitLocation>
                )
            })
        )
    }
    get weapons$() {
        return this.allFeatures$.pipe(
            map(features => features.flat().map(feature => feature.keys.weapons).flat())
        )
    }
    get meleeWeapons$() {
        return this.weapons$.pipe(
            map(weapons => weapons.filter((weapon): weapon is MeleeWeaponData => weapon.type === WeaponType.Melee))
        )
    }
    get rangedWeapons$() {
        return this.weapons$.pipe(
            map(weapons => weapons.filter((weapon): weapon is RangedWeaponData => weapon.type === WeaponType.Ranged))
        )
    }
    get swingDamage$() {
        return this.attributes$.pipe(
            map(attributes => getSwingDamage(attributes["striking strength"]?.calculateLevel() ?? 10))
        )
    }
    get swingDamage() { return "" }
    get thrustDamage$() {
        return this.attributes$.pipe(
            map(attributes => getThrustDamage(attributes["striking strength"]?.calculateLevel() ?? 10))
        )
    }
    get thrustDamage() { return "" }
    get basicLift$() {
        return this.attributes$.pipe(
            map(attributes => basicLift(attributes["lifting strength"]?.calculateLevel() ?? 10))
        )
    }
    get pointTotal$() {
        return combineLatest([
            this.data$,
            this.traits$,
            this.skills$,
            this.techniques$,
            this.spells$,
            combineLatest([
                this.attributes$,
                this.pools$
            ])
        ]).pipe(
            map(([data, traits, skills, techniques, spells, [attributes, pools]]) => {
                const total = data.pointTotal;
                const attributePoints = Object.values(attributes).concat(Object.values(pools)).reduce(
                    (points, attribute) => points + (attribute.pointsSpent() || 0), 0
                );
                const racialPoints = 0;
                const advantages = 0;
                const perks = 0;
                const disadvantages = 0;
                const quirks = 0;
                const sumSkilllike = (points: number, skilllike: Skill | Technique | Spell) => points + skilllike.keys.points;
                const skillTotal = skills.reduce(sumSkilllike, 0);
                const techniqueTotal = techniques.reduce(sumSkilllike, 0);
                const spellTotal = spells.reduce(sumSkilllike, 0);
                const spent = attributePoints + racialPoints + advantages + perks + disadvantages + quirks + skillTotal + techniqueTotal + spellTotal;
                return {
                    attributePoints,
                    racialPoints,
                    advantages,
                    perks,
                    disadvantages,
                    quirks,
                    skills: skillTotal,
                    techniques: techniqueTotal,
                    spells: spellTotal,
                    spent,
                    total,
                    unspent: total - spent
                }
            })
        )
    }
}
interface UI {
    hidden?: boolean
    listWeight?: number
    canContainChildren?: boolean
    backgroundColor?: string
    textColor?: string
}
export interface FeatureWrapperData<K extends Features = Features> {
    id: string
    progenitor?: string
    sheetId?: string
    ownedById?: string
    childrenIds: string[]
    keys: K,
    ui: UI
    createdOn: Date
    lastEdit?: Date
}
const defaultUiData = (): UI => ({

});
const defaultFeatureWrapperData = () => ({
    id: uuidv4(),
    childrenIds: [],
    createdOn: new Date(),
    ui: defaultUiData()
});
interface FeatureState<K extends Features> extends EntityState<FeatureWrapperData<K>, string> { }
@StoreConfig({ name: 'features', producerFn: produce })
export class FeatureStore<K extends Features> extends EntityStore<FeatureState<K>> {
    constructor() {
        super()
    }
}
export class FeatureQuery<K extends Features> extends QueryEntity<FeatureState<K>> {
    constructor(store: FeatureStore<K>) {
        super(store);
    }
    get skills$() {
        return this.selectAll({ filterBy: feature => feature.keys.type === FeatureType.Skill }).pipe(
            map(features => features.filter(feature => feature.keys.type === FeatureType.Skill).map(skill => new Skill(skill.id)))
        )
    }
    get techniques$() {
        return this.selectAll({ filterBy: feature => feature.keys.type === FeatureType.Trait }).pipe(
            map(techniques => techniques.map(technique => new Technique(technique.id)))
        )
    }
    get spells$() {
        return this.selectAll({ filterBy: feature => feature.keys.type === FeatureType.Spell }).pipe(
            map(spells => spells.map(spell => new Spell(spell.id)))
        )
    }
    get traits$() {
        return this.selectAll({ filterBy: feature => feature.keys.type === FeatureType.Trait }).pipe(
            map(traits => traits.map(trait => new Trait(trait.id)))
        )
    }
    get equipment$() {
        return this.selectAll({ filterBy: feature => feature.keys.type === FeatureType.Equipment }).pipe(
            map(equipment => equipment.map(item => new Equipment(item.id)))
        )
    }
}
const Features = new FeatureStore();
export abstract class Feature<K extends Features> extends EntityWrapper<FeatureWrapperData<Features>, FeatureStore<Features>, FeatureQuery<Features>> {
    abstract type: FeatureType
    get store() { return Features }
    get query() { return new FeatureQuery(this.store) }
    get keys() { return this.data?.keys as K }
    get sheetQuery() { return new SheetQuery(Sheets) }
    get exists() { return this.query.hasEntity(this.id) }
    constructor(id: string) {
        super(id);
    }
    get sheet() {
        const sheetId = this.data.sheetId;
        if (!this.sheetQuery.hasEntity([sheetId])) return null
        return new Sheet(sheetId)
    }
    get config$() {
        const sheet = this.sheet;
        return sheet ? sheet.config$ : Valor.data$.pipe(map(valor => valor.globalConfig))
    }
    protected get bonuses$() {
        const sheet = this.sheet;
        if (!sheet) return
        return sheet.allFeatures$.pipe(
            map(features =>
                features.flat().map(feature => ({
                    id: feature.id,
                    disabled: feature.keys.disabled,
                    bonuses: feature.keys.bonuses
                }))
            )
        )
    }
    get owner() {
        const ownerId = this.data.ownedById;
        if (!this.query.hasEntity([ownerId])) return null
        return this._routeClasses(ownerId);
    }
    get owner$() {
        return this.data$.pipe(
            map(data => {
                const ownerId = data.ownedById;
                if (!this.query.hasEntity([ownerId])) return null
                return this._routeClasses(ownerId);
            })
        )
    }
    get children() {
        const childrenIds = this.data.childrenIds;
        return childrenIds.filter(id => this.query.hasEntity([id])).map(id => this._routeClasses(id))
    }
    get children$() {
        return this.data$.pipe(
            map(data => {
                return data?.childrenIds.filter(id => this.query.hasEntity([id])).map(id => this._routeClasses(id)) ?? []
            })
        )
    }
    protected _wrapFeatureData(keys: K): FeatureWrapperData<K> {
        return {
            ...defaultFeatureWrapperData(),
            keys,
        }
    }
    mount(sheetId: string) {
        if (!this.sheetQuery.hasEntity([sheetId])) return
        this.update(val => { val.sheetId = sheetId });
        return this
    }
    protected _routeClasses(id: string) {
        const type = new FeatureQuery(Features).getEntity(id).keys.type
        switch (type) {
            case FeatureType.Equipment: return new Equipment(id)
            case FeatureType.Skill: return new Skill(id)
            case FeatureType.Spell: return new Spell(id)
            case FeatureType.Technique: return new Technique(id)
            case FeatureType.Trait: return new Trait(id)
        }
    }
    isContainer() { return this.data.ui.canContainChildren === true }
}