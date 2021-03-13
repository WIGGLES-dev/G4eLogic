import { State, Change } from 'rxdeep';
import { Observer, Subject } from 'rxjs';
import { db } from '@internal';
import $RefParser, { JSONSchema } from '@apidevtools/json-schema-ref-parser';
import Ajv from 'ajv';
import jsonquery from 'json-query';
import { IDatabaseChange } from 'dexie-observable/api';
import { GResource, Resource } from './resource';
export interface Ident {
    rootId?: string;
    id: string;
    type: string;
}
export declare type TypeCollection = Record<string, Data[]>;
export interface MetaData {
    alternativeIds: Record<string, string>;
    source: string;
    progenitor?: string;
    enabled: boolean;
    flags: Record<string, any>;
    createdOn: number;
    lastEdit: number;
}
export interface Data extends Record<string, any>, Ident {
    version: number;
    categories: string[];
    name: string;
    children: TypeCollection;
    features: any[];
    config?: Record<string, any>;
    metadata: MetaData;
}
export interface ResourceRegister {
    type: string;
    caster: GResource;
    schema: string | JSONSchema;
}
interface System {
    db: typeof db;
    resources: Collection;
    changes$: Subject<IDatabaseChange[]>;
    casters: Record<string, any>;
    validator: Ajv;
    $parser: $RefParser;
    locals: {
        descendants(this: jsonquery.Options, input: Data, maxDepth?: number): Data[];
        ancestors(this: jsonquery.Options, input: Data): Data[];
        add(this: jsonquery.Options, input: number, ...numbers: number[]): number;
        subtract(this: jsonquery.Options, input: number, ...numbers: number[]): number;
        multiply(this: jsonquery.Options, input: number, ...numbers: number[]): number;
        divide(this: jsonquery.Options, input: number, ...number: number[]): number;
        then(this: jsonquery.Options, input: any, thenValue: any, elseValue: any): any;
        pluck(this: jsonquery.Options, input: any, ...properties: string[]): any;
        select(this: jsonquery.Options, input: any, ...properties: string[]): any[];
        path(this: jsonquery.Options, input: any): string[];
        paths(this: jsonquery.Options, input: any[]): string[][];
        deep(this: jsonquery.Options, input: any): any[];
        debug(this: jsonquery.Options, input: any, message?: any): any;
    };
    methods: typeof methods;
    check(key: string): boolean;
    addSchema(...schema: (string | JSONSchema)[]): any;
    register(...resources: ResourceRegister[]): any;
    init(): Promise<void>;
}
declare const methods: {
    create(...data: ({
        id?: string;
        type: string;
        root?: string;
        parent?: string;
    })[]): Promise<void>;
    read(...idents: {
        id: string;
        root?: string;
    }[]): Promise<any[]>;
    update(...data: ({
        id: string;
        root?: string;
    })[]): Promise<void>;
    delete(...idents: {
        id: string;
        root?: string;
    }[]): Promise<void>;
};
export declare const System: System;
declare type KeyMap<T> = Record<string, T>;
export declare class Collection extends State<KeyMap<Data>> {
    constructor(initial: any, table: string);
    get(type: string): import("rxjs").Observable<Resource<Data>[]>;
    watchTable(table: string): import("rxjs").Observable<Record<string, Data>>;
    static tableObserver(table: string): Observer<Change<Record<string, Data>>>;
}
export {};
