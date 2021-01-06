import Ajv from 'ajv';
import { Table } from 'dexie';
import {
    State,
} from 'rxdeep';
import {
    Identity,
    log,
    mapEach,
    System,
    orArray,
    OrArray
} from '@internal';
import { Observer, Subscription, combineLatest, merge } from 'rxjs';
import deepmerge from 'deepmerge';
import {
    map,
    tap,
    takeWhile,
    debounceTime
} from 'rxjs/operators';
interface CollectionConfig {
    type: string
}

export class Collection<T extends Identity> {
    private _subscriptions: Subscription[] = []
    get system() { return System }
    type: string
    get caster() { return this.system.casters.get(this.type) }
    get table(): Table<T, string> { return this.system.db.table(this.type) }
    schema
    state: State<Record<string, T>> = new State({})
    constructor({
        type
    }: CollectionConfig) {
        this.type = type;
        this._createInitialSubscription();
    }
    private _createInitialSubscription() {
        const sub1 = this.state.pipe(
            debounceTime(300)
        ).subscribe((store) => {
            for (const [key, value] of Object.entries(store)) {
                this.table.update(key, value);
            }
        });
        this._subscriptions.push(sub1);
    }
    async create(data: Partial<T>) {
        const {
            id = this.system.crud.tag(),
            type = this.type
        } = data;
        const valid = this.validate(data);
        if (!valid) return
        const newData = {
            ...data,
            id,
            type
        } as T
        this.state.value = {
            ...this.state.value,
            [data.id]: newData
        }
        return newData
    }
    read(id: string) {
        return this.state.value[id]
    }
    async update(updates: OrArray<Partial<T> & { id: string }>) {
        const oldState = this.state.value;
        const changes = {} as any;
        for (const update of orArray(updates)) {
            const oldValue = this.read(update.id);
            const newValue = deepmerge<T>(oldValue, update, {
                arrayMerge: (t, s) => s
            });
            const valid = this.validate(newValue);
            if (!valid) continue;
            changes[update.id] = update
        }
        this.state.value = deepmerge(oldState, changes, {
            arrayMerge: (t, s) => s
        })
        return updates
    }
    async delete(id: string) {
        const entities = this.state.value;
        const entity = entities[id];
        delete entities[id];
        this.state.value = { ...entities }
        return { ...entity }
    }
    check(id: string) {
        return this.state.value[id]?.id === id;
    }
    validate(data: any): data is T {
        return System.validate<T>(this.type, data)
    }
    get instances$() {
        return this.state
            .pipe(
                map(i => Object.values(i)),
                mapEach(r => new (this.caster)(r))
            )
    }
    select(id: string) {
        return this
            .state
            .sub(id)
            .pipe(
                takeWhile((ident) => ident && ident.id && this.check(ident.id) && this.system.check(ident.id)),
            )
    }
    selectMany(ids: string[]) {
        const subs = ids.map(this.select, this);
        return merge(...subs)
    }
}