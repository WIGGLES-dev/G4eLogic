import { JSONSchema } from "@apidevtools/json-schema-ref-parser"
import { Data, staticImplements, System, AutoSubscriber } from "@internal"
import { State, VerifiedState } from "rxdeep"
import { Observable, combineLatest } from "rxjs"
import { map, takeWhile, distinctUntilChanged, pluck, switchMap, defaultIfEmpty } from "rxjs/operators"
import jsonquery from 'json-query';
import * as searchjs from "searchjs";
import { v4 } from "uuid"
export interface GResource<R extends Resource = Resource> {
    type: string
    version: number
    schema?: string | JSONSchema
    new(state: State<Data>, root?: Resource): R
}
@staticImplements<GResource>()
export class Resource<T extends Data = Data> extends VerifiedState<T> {
    static type: string
    static version: number
    class = this.constructor as GResource<this>
    get type() { return this.value?.type ?? this.class.type }
    get id() { return this.value?.id }
    get active() { return this.value?.metadata?.enabled ?? false }
    constructor(state: State<T> | string) {
        super(
            state instanceof State ? state : System.resources.sub(state) as State<T>,
            (change) => {
                const stamp = new Date().getTime();
                const valid = change.value === undefined || System.validator.validate(change?.value?.type, change?.value);
                if (
                    change?.value?.metadata
                ) {
                    if (!change?.value?.metadata?.createdOn) {
                        change.value.metadata.createdOn = stamp;
                    }
                    change.value.metadata.lastEdit = stamp;
                }
                return valid
            }
        );
        if (this.class === System.casters[this.type]) {

        } else {
            const caster = System.casters[this.type]
            if (caster) return new caster(state)
        }
    }
    query(selector: string) {
        return jsonquery(selector, {
            data: this.value,
            allowRegexp: true,
            locals: System.locals
        })
    }
    query$(selector: string) {
        return this.pipe(
            map(value => jsonquery(selector, {
                data: value,
                allowRegexp: true,
                locals: System.locals
            }))
        )
    }
    root$<C extends Resource>(): Observable<C> {
        return this.sub("rootId").pipe(
            takeWhile(System.check),
            map(rootId => new Resource(rootId) as C),
        )
    }
    self$(): Observable<this> {
        return this.pipe(
            distinctUntilChanged((a, b) => b?.metadata?.lastEdit > a?.metadata?.lastEdit),
            map(v => this)
        )
    }
    selectChildren<C extends Resource>(params?: {
        type?: string
        maxDepth?: number
        activeOnly?: boolean
        caster?: GResource<C>
    }): Observable<C[]> {
        const {
            type = undefined,
            maxDepth = Number.POSITIVE_INFINITY,
            activeOnly = false,
            caster = Resource as unknown as GResource<C>
        } = params || {};
        const paths$ = this.query$(
            `:descendants(${maxDepth})${type ? `[*type=${type}]` : ""}:paths`
        ).pipe(
            pluck('value')
        );
        const resources$ = paths$.pipe(
            distinctUntilChanged((a, b) => JSON.stringify(b) !== JSON.stringify(a)),
            map<string[], C[]>(paths => paths
                .map(path => this.sub(...path))
                .map(state => new caster(state))
            ),
            map(ra => activeOnly ? ra.filter(r => r.active === true) : ra)
        );
        return resources$
    }
    selectEmbedded<C extends Resource>(id: string, caster = Resource as unknown as GResource<C>): Observable<C> {
        return this
            .query$(`:descendants[id=${id}]:path`)
            .pipe(
                pluck('value'),
                distinctUntilChanged(),
                map(path => new caster(this.sub(...path))),
            )
    }
    selectFeatures() {
        const children$ = this.selectChildren().pipe(
            switchMap(ra => combineLatest(ra).pipe(
                defaultIfEmpty([])
            ))
        );
        return children$.pipe(
            map(ra => ra.filter(r => r?.value).flatMap((r, i) => {
                const { features = [], levels = 0, hasLevels = false } = r.value;
                return features.map(f => ({
                    ...f,
                    amount: hasLevels ? f['amount'] * levels : f['amount']
                }))
            }))
        )
    }
    lookup<C extends Resource>(jssql?: Record<string, any>): Observable<C[]> {
        return this.selectChildren().pipe(
            switchMap(ra => combineLatest(ra.map(r => r.self$())).pipe(
                defaultIfEmpty([])
            )),
            map(ra => ra.filter((r): r is C => r && r.value && searchjs.matchObject(r.value, jssql))),
        );
    }
    do(...args) {
    }
    dump() { }
    static fetch(id: string) { }
    static async create(data: { type: string, [key: string]: any }) {
        const {
            type,
            id = v4()
        } = data;
        const value = { ...data, id };
        const valid = System.validator.validate(type, value);
        if (valid) {
            System.resources.value = {
                ...System.resources.value,
                [id]: value
            }
        }
    }
    static embed(data: { root: string, parent: string } & Data) {
        const root = new Resource(data.root);
        let target = data.parent ? AutoSubscriber.get(root.selectEmbedded(data.parent)) : root;
        delete data.root;
        delete data.parent;
        target.embed(data);
    }
    embed(data: Data) {
        const { id = v4(), type } = data
        if (!type) return
        this.sub("children").value = {
            ...this.value.children,
            [type]: [
                ...this.value.children[type],
                data
            ]
        }
    }
}