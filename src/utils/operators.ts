import { GConstructor } from "@internal";
import { asyncScheduler, concat, from, merge, MonoTypeOperatorFunction, Observable, OperatorFunction, scheduled, SchedulerLike } from "rxjs";
import { reduce, map, filter, mergeMap, debounceTime, distinctUntilChanged, publish, take, concatAll, tap } from "rxjs/operators";
import * as searchjs from "searchjs";
import * as jp from "jsonpath";

export function total(src: Observable<number>): Observable<number> {
    return src.pipe(
        reduce((total, number) => total + number, 0)
    )
}
export function matchArray<T>(jssql: Record<string, any>): MonoTypeOperatorFunction<T[]> {
    return function (src: Observable<T[]>): Observable<T[]> {
        return src.pipe(
            map(i => searchjs.matchArray(i, jssql))
        )
    }
}
export function matchObject<T>(jssql: Record<string, any>): MonoTypeOperatorFunction<T> {
    return function (src: Observable<T>): Observable<T> {
        return src.pipe(
            filter(t => searchjs.matchObject(t, jssql))
        )
    }
}
export function mapEach<T, U>(project: (value: T) => U): OperatorFunction<T[], U[]> {
    return function (src: Observable<T[]>): Observable<U[]> {
        return src.pipe(
            map(i => i?.map(project) ?? [])
        )
    }
}
export function collapse<T>(src: Observable<T[]>): Observable<T> {
    return src.pipe(
        mergeMap(i => i)
    )
}

export function log<T>(tag: string): MonoTypeOperatorFunction<T> {
    return function (source: Observable<T>): Observable<T> {
        return source.pipe(
            tap(function (t) {
                console.log(tag, t)
            }),
        )
    }
}

export function spread<T extends any[], U>(fn: (...args: Partial<T>) => U): OperatorFunction<T, U> {
    return function (source: Observable<T>): Observable<U> {
        return source.pipe(
            map(args => fn(...args))
        )
    }
}
export function preventDefault<T extends Event>(source: Observable<T>): Observable<T> {
    return source.pipe(tap(e => e.preventDefault()))
}