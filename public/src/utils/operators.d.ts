import { MonoTypeOperatorFunction, Observable, OperatorFunction } from "rxjs";
import { Remote } from "comlink";
export declare function matchArray<T>(jssql: Record<string, any>): MonoTypeOperatorFunction<T[]>;
export declare function matchObject<T>(jssql: Record<string, any>): MonoTypeOperatorFunction<T>;
export declare function preventDefault<T extends Event>(source: Observable<T>): Observable<T>;
export declare function withComlinkProxy<T, U extends Remote<any>>(op: (v: T) => Promise<U>): OperatorFunction<T, U>;
