import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { Data } from "@internal";
import { State, VerifiedState } from "rxdeep";
import { Observable } from "rxjs";
import jsonquery from 'json-query';
export interface GResource<R extends Resource = Resource> {
    type: string;
    version: number;
    schema?: string | JSONSchema;
    new (state: State<Data>, root?: Resource): R;
}
export declare class Resource<T extends Data = Data> extends VerifiedState<T> {
    static type: string;
    static version: number;
    class: GResource<this>;
    get type(): string;
    get id(): string;
    get active(): boolean;
    constructor(state: State<T> | string);
    query(selector: string): jsonquery.Result;
    query$(selector: string): Observable<jsonquery.Result>;
    root$<C extends Resource>(): Observable<C>;
    self$(): Observable<this>;
    selectChildren<C extends Resource>(params?: {
        type?: string;
        maxDepth?: number;
        activeOnly?: boolean;
        caster?: GResource<C>;
    }): Observable<C[]>;
    selectEmbedded<C extends Resource>(id: string, caster?: GResource<C>): Observable<C>;
    selectFeatures(): Observable<any[]>;
    lookup<C extends Resource>(jssql?: Record<string, any>): Observable<C[]>;
    do(...args: any[]): void;
    dump(): void;
    static fetch(id: string): void;
    static create(data: {
        type: string;
        [key: string]: any;
    }): Promise<void>;
    static embed(data: {
        root: string;
        parent: string;
    } & Data): void;
    embed(data: Data): void;
}
