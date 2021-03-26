import { Data } from '@internal';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import Ajv from 'ajv';
import { Change } from 'rxdeep';
import { Remote } from "comlink";
import { Subject, Subscription } from "rxjs";
interface Event {
    event: string;
    data: any;
}
interface System {
    dispatch(event: any, data: any): any;
    broadcast(event: any, data: any): any;
}
export declare const System: {
    db: import("dexie").Dexie;
    changes$: Subject<import("dexie-observable/api").IDatabaseChange[]>;
    bc: Remote<System>;
    origin: string;
    events$: Subject<Event>;
    validator: Ajv;
    $parser: $RefParser;
    workers: Record<string, Remote<any>>;
    addSchema(schema: any, key?: string): Promise<void>;
    add(table: any, obj: any, key: any): Promise<import("dexie").IndexableType>;
    get(table: any, key: any): Promise<any>;
    update(table: any, key: any, data: any): Promise<number>;
    put(table: any, data: any, key?: any): Promise<import("dexie").IndexableType>;
    delete(table: any, id: any): Promise<void>;
    getTable(table: any): Promise<any[]>;
    addWorker(name: string, src: string): void;
    getWorker<T>(name: string): Remote<T>;
    dispatch(event: any, data: any): void;
    broadcast(event: any, data: any): void;
    roll(formula: any, data?: {}): void;
    on(event: string, cb: any): Subscription & import("comlink").ProxyMarked;
    validate(data: any): {
        data: any;
        valid: boolean;
        errors: any;
    };
    expose(): void;
    init(): Promise<void>;
};
export declare function validateResource(change: Change<Data>): boolean;
export {};
