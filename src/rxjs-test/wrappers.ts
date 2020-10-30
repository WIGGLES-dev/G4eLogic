import config from "../gurps4e/config.json";
import {
    UpdateStateCallback,
    combineQueries,
    SelectAllOptionsB,
    ID,
    EntityStore,
    QueryEntity,
    EntityState,
    applyTransaction
} from '@datorama/akita';
import {
    calculateSkillLevel,
    calculateRelativeSkillLevel,
    SkillData,
    SkillDefault,
    SkillDifficulty,
    skillMatchesAnyDefaults,
} from "./entities/skill/model"
import { v4 as uuidv4 } from 'uuid';
import { Valor } from "./valor";
import { SheetData, parseHitLocations } from "./entities/sheet/model"
import { filter, map, concatMap, reduce, find, expand, publishBehavior, refCount, share, mergeAll, flatMap, combineAll } from "rxjs/operators";
import { NestedElement, SheetElement, StoreEntity } from './general';
import { concat, merge, Observable, Observer } from 'rxjs';
import { SheetQuery, SheetStore } from './entities/sheet/store';
import { SkillQuery, SkillStore } from './entities/skill/store';
import { EquipmentData } from "./entities/equipment/model";
import { EquipmentStore, EquipmentQuery } from "./entities/equipment/store";

function clone(data: any) {
    try {
        return JSON.parse(JSON.stringify(data))
    } catch (err) {

    }
}
abstract class EntityWrapper<D, S extends EntityStore<EntityState<D, ID>>, Q extends QueryEntity<EntityState<D, ID>>> {
    abstract get storeName(): string
    get store(): S { return this.#stores[this.storeName] }
    get query(): Q { return this.#queries[this.storeName] }
    #stores = Valor.Stores
    get stores() { return this.#stores }
    #queries = Valor.Queries
    get queries() { return this.#queries }
    #id: ID
    get id() { return this.#id }
    get data() { return this.query.getEntity(this.#id) }
    get observable() { return this.query.selectEntity(this.#id) }
    constructor(id?: ID) {
        if (this.query.hasEntity([id])) {
            this.#id = id;
        } else {
            const id = uuidv4();
            this.store.add(Object.assign({}, this.defaultData(), { id }));
            this.#id = id;
        }
    }
    abstract defaultData(): D
    protected _createThis(id?: ID) {
        return new (this.constructor as new (id: ID) => this)(id)
    }
    clone() {
        const id = uuidv4();
        this.store.add(Object.assign({}, this.data, { id }));
        return this._createThis(id)
    }
    update(fn: UpdateStateCallback<D, Partial<D>>) { this.store.update(this.#id, fn) }
    set(value: D) { this.store.update(this.id, sheet => sheet = value) }
    subscribe(observer: Observer<any>) {
        return {
            unsubscribe: this.observable.pipe(map(data => clone(data))).subscribe(observer).unsubscribe,
            set: (val) => this.set(val)
        }
    }
    delete() { }
}

abstract class OwnedEntity<D extends SheetElement, S extends EntityStore<EntityState<D, ID>>, Q extends QueryEntity<EntityState<D, ID>>> extends EntityWrapper<D, S, Q> {
    get sheet() {
        const sheetId = this.data.sheetId;
        if (!this.queries.sheets.hasEntity((sheet) => sheet.id === sheetId)) return null
        return new Sheet(sheetId)
    }
    constructor(id: ID) {
        super(id)
    }
    mount(sheetId: ID): this {
        if (!this.queries.sheets.hasEntity(sheet => sheet.id === sheetId)) return null
        if (!this.sheet) {
            const clone = this.clone()
            clone.update(data => { data.sheetId = sheetId })
            return clone
        } else {
            this.update(data => { data.sheetId = sheetId });
            return this
        }
    }
}


abstract class NestedEntity<D extends NestedElement, S extends EntityStore<EntityState<D, ID>>, Q extends QueryEntity<EntityState<D, ID>>> extends OwnedEntity<D, S, Q> {
    get index$() { return 0 }
    get open$() { return false }
    get isContainer$() { return false }
    get owner$() {
        return this.query.selectAll().pipe(
            map(entityList => this._createThis(entityList.find(entity => entity.id === this.data.ownedById).id))
        )
    }
    get allOwners$() { return [] }
    get children$() {
        return this.query.selectAll({ filterBy: entity => entity.ownedById === this.id }).
            pipe(
                map(children => children.map(child => this._createThis(child.id)))
            )
    }
    get allChildren$() {
        return this.children$.pipe(
            expand(children => children.map(child => child.allChildren$))
        )
    }
    constructor(id: ID) {
        super(id)
    }
    nest() {
        const id = uuidv4();
        this.store.add(Object.assign({}, this.defaultData(), { ownedById: this.id, id }))
        return this._createThis(id);
    }
    eject() { }
    makeContainer() { }
}

export class Sheet extends EntityWrapper<SheetData, SheetStore, SheetQuery> {
    get storeName() { return "sheets" }
    constructor(id: ID) {
        super(id);
    }
    defaultData() {
        return {
            id: uuidv4(),
            profile: {},
            skills: [],
            techniques: [],
            spells: [],
            traits: [],
            equipment: [],
            config,
            hitLocationDamage: {},
            poolLevels: {},
            attributeLevels: {}
        }
    }
    get skills$() {
        return this.queries.skills.selectAll({
            filterBy: skill => skill.sheetId === this.id
        }).pipe(
            map(skills => skills.map(skill => new Skill(skill.id))),
        )
    }
    get equipment$() {
        return this.queries.equipment.selectAll({
            filterBy: equipment => equipment.sheetId === this.id
        }).pipe(
            map(equipment => equipment.map(item => new Equipment(item.id)))
        )
    }
    get techniques$() { return [] }
    get spells$() { return [] }
    get traits$() { return [] }

    get config$() {
        return this.observable.pipe(
            map(sheet => sheet.config)
        )
    }
    get locations$() {
        return this.config$.pipe(
            map(config => {
                return parseHitLocations(config.locations);
            })
        )
    }
    get attributes$() {
        return this.observable.pipe()
    }

    get features$() {
        return combineQueries([
            this.skills$,
            this.equipment$
        ]).pipe(
            map(([skills, equipment]) => {
                [...skills, ...equipment].reduce((features, entity) => {

                    return [...features]
                }, [])
            })
        )
    }

    getAttribute(signature: string) {

    }

    delete() { }
}

export class Skill extends NestedEntity<SkillData, SkillStore, SkillQuery> {
    get storeName() { return "skills" }

    constructor(id: ID) {
        super(id);
    }
    defaultData(): SkillData {
        return {
            id: uuidv4(),
            name: "",
            points: 0,
            difficulty: SkillDifficulty.Average,
            mod: 0,
            signature: "10",
            encumbrancePenaltyMultiple: 0,
            defaults: [] as SkillDefault[]
        }
    }

    get level$() {
        return combineQueries([
            this.observable,
            this.queries.skills.selectAll()
        ]
        ).pipe(
            map(([targetSkill, otherSheetSkills]) => {
                const defaults = otherSheetSkills.filter(skill => skill.sheetId === targetSkill.sheetId && skillMatchesAnyDefaults(skill, targetSkill.defaults))
                const highestSkillDefault = defaults.reduce(
                    (highest, skill) => Math.max(highest, calculateRelativeSkillLevel(skill.points, skill.difficulty)), 0
                );
                return calculateSkillLevel(targetSkill, highestSkillDefault);
            })
        )
    }
    get attribute$() { return 0 }
    get bonus$() { return 0 }
}

class Technique {

}

class Spell {

}

class Equipment extends NestedEntity<EquipmentData, EquipmentStore, EquipmentQuery> {
    get storeName() { return "equipment" }
    constructor(id: ID) {
        super(id)
    }
    defaultData() {
        return {
            id: uuidv4(),
            storedLocation: "carried",
            name: "",
            weight: 1,
            quantity: 1
        }
    }
}

class Trait extends NestedEntity<any, any, any> {
    get storeName() { return "trait" }
    constructor(id: ID) {
        super(id);
    }
    defaultData() {
        return {

        }
    }
}