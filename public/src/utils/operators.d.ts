import { MonoTypeOperatorFunction, Observable, OperatorFunction } from "rxjs";
export declare function total(src: Observable<number>): Observable<number>;
export declare function matchArray<T>(jssql: Record<string, any>): MonoTypeOperatorFunction<T[]>;
export declare function matchObject<T>(jssql: Record<string, any>): MonoTypeOperatorFunction<T>;
export declare function mapEach<T, U>(project: (value: T) => U): OperatorFunction<T[], U[]>;
export declare function collapse<T>(src: Observable<T[]>): Observable<T>;
export declare function log<T>(tag: string): MonoTypeOperatorFunction<T>;
export declare function spread<T extends any[], U>(fn: (...args: Partial<T>) => U): OperatorFunction<T, U>;
export declare function preventDefault<T extends Event>(source: Observable<T>): Observable<T>;
