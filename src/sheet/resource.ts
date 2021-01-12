import {
    System,
    Identity,
    Collection,
    mapEach,
    GConstructor,
    collapse,
    matchArray,
    log,
    staticImplements
} from '@internal'
import {
    combineLatest,
    EMPTY,
    from,
    merge,
    Observable
} from 'rxjs'
import {
    takeWhile,
    map,
    pluck,
    expand,
    scan,
    mergeMap,
    reduce,
    startWith,
    mergeAll,
    mergeScan,
    withLatestFrom,
    filter,
    distinctUntilChanged
} from 'rxjs/operators'
import deepmerge from 'deepmerge';
import searchjs from 'searchjs';
import { identity } from 'svelte/internal';
export interface Feature {
    type: string
    constraint: Record<string, any>
    bonus: number
}
export interface Modifier {

}
export interface Data extends Record<string, any>, Identity {
    version: number
    name: string
    modifiers: Modifier[]
    lookups: Record<string, Record<string, any>[]>
    features: Feature[]
    config?: Record<string, any>
    categories: string[]
}
export interface GResource<R extends Resource = Resource> {
    type: string
    version: number
    new(identity: Identity): R
}
@staticImplements<GResource<Resource>>()
export class Resource<T extends Data = Data> {
    static type: string
    static version: number
    system = System
    class = this.constructor as GResource<this>
    get collection(): Collection<T> {
        return this.system.collections.get(this.type) as Collection<T>
    }
    get caster() { return this.system.casters.get(this.type) }
    identity: Identity
    schema
    get state() { return this.collection.state.sub(this.id) }
    get index() { return this.system.index.state.sub(this.id) }
    get id() { return this.identity?.id }
    get type() { return this.identity?.type || this.class.type }
    get exists() { return this.collection.check(this.id) && this.system.check(this.id) }
    get value() { return this.collection.state.value[this.id] }
    set value(value: T) { this.collection.update({ ...value, ...this.identity }) }
    constructor(ident: Identity) {
        this.identity = ident;
        const caster = this.system.casters.get(this.type);
        if (caster && ident && ident.type === caster.type && this.constructor !== caster) {
            return new caster(ident) as Resource<T>
        }
    }
    get enabled$() { return this.index.sub('enabled') }
    get metadata$() { return this.index.pipe(takeWhile(d => this.exists)) }
    getMetadata() { return this.index.value }
    get instance$() { return this.data$.pipe(map(s => new this.class(s))) }
    get data$() { return this.state.pipe(takeWhile(d => this.exists)) }
    get keys$() { return this.data$ }
    getKeys() { return this.value }
    selectKeys() {
        return this.keys$
    }
    selectChildren<C extends Resource>({
        type = undefined as string,
        caster = Resource as GResource<C>,
        maxDepth = Number.POSITIVE_INFINITY,
        activeOnly = false
    } = {}): Observable<C[]> {
        return this.system.index.state.pipe(
            map(() => this.system.getDescendantsOf(this.id, { maxDepth })),
            mapEach(md => new caster(md)),
            map(ra => ra.filter(r => r && r.exists)),
            map(ra => type ? ra.filter(r => r.type === type) : ra),
            map(ra => activeOnly ? ra.filter(r => r.index.value.enabled) : ra),
            map(idents => idents.sort((a, b) => {
                const amd = this.system.index.read(a.id);
                const bmd = this.system.index.read(b.id);
                return amd.order - bmd.order
            })),
            distinctUntilChanged((a, b) => this.system.equals(a, b)),
            startWith([])
        )
    }
    selectSameChildren(): Observable<this[]> {
        return this.selectChildren({
            type: this.type,
            caster: this.class,
            maxDepth: 1
        })
    }
    get children$() { return this.index.sub('children') }
    selectNearest<C extends Resource>(type?: string, caster = Resource as GResource<C>): Observable<C> {
        return this
            .system
            .index
            .state
            .pipe(
                takeWhile(index => this.exists),
                distinctUntilChanged((a, b) => this.system.equals(a, b)),
                map(index => this.system.getTrailOf(this.id).find(ident => ident.type === type)),
                map(ident => new caster(ident))
            )
    }
    get parent$() { return this.index.sub('parent') }
    descendants$
    ancestors$
    sub(...keys: string[]) { return this.state.sub(...keys) }
    set(v) { return this.state.set(v) }
    next(v) { return this.state.next(v) }
    async update(value: Partial<T>) {
        return this.system.crud.update({
            ...value,
            ...this.identity
        })
    }
    async delete() { return this.system.crud.delete(this.identity) }
    async embed(embed: Partial<T> & { type: string }) {
        return this.system.crud.embed({
            parent: this.identity,
            ...embed
        })
    }
    async eject() {
        return this.system.crud.eject(this.identity)
    }
    async transfer(to: Identity) {
        return this.system.crud.transfer({
            from: this.identity,
            to
        });
    }
    subscribe(observer: (value: T) => T) { return this.state.subscribe(observer) }
    selectAllFeatures() {
        return this.selectChildren()
            .pipe(
                mapEach(r => {
                    const { features = [], levels = 0, hasLevels = false } = r.getKeys();
                    return features.map(f => ({
                        ...f,
                        amount: hasLevels ? f['amount'] * levels : f['amount']
                    }))
                }),
                map(f => f.flat()),
            )
    }
    selectFeatures() {
        return combineLatest([
            this.keys$,
            this.selectAllFeatures()
        ])
            .pipe(
                map(([keys, features]) =>
                    features.filter(f => searchjs.matchObject(keys, f.constraint))
                )
            )
    }
    selectBonus(jssql?: Record<string, any>) {
        return this.selectFeatures()
            .pipe(
                matchArray(jssql),
                mapEach(f => f.bonus),
                reduce((t, b) => t + b.reduce((_t, _b) => _t + _b, 0), 0),
                startWith(0)
            )
    }
    lookup(jssql?: Record<string, any>): Observable<Resource[]> {
        return this.selectChildren().pipe(
            mapEach(r => r.getKeys()),
            matchArray(jssql),
            mapEach(d => new Resource(d)),
        )
    }
    cast<C extends Resource>(caster: GConstructor<C>): C {
        return new (caster)(this.identity)
    }
    setFlag(scope: string, key: string, value: any) {
        const currentValue = this.index.value.flags[scope];
        this.index.sub('flags').sub(scope).value = {
            ...currentValue,
            [key]: value
        }
    }
    getFlag(scope: string, key: string) {
        return this.index.value.flags[scope][key]
    }
    do(...args) { }
    dump() {
        const dump = this.system.dumps(this.identity)
        console.log(dump);
    }
}