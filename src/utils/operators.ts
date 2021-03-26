import { asyncScheduler, concat, defer, from, merge, MonoTypeOperatorFunction, Observable, OperatorFunction, pipe, scheduled, SchedulerLike, using } from "rxjs";
import { Remote, wrap, releaseProxy } from "comlink";
import { reduce, map, filter, mergeMap, debounceTime, distinctUntilChanged, publish, take, concatAll, tap, pluck, switchMap, observeOn } from "rxjs/operators";
import * as searchjs from "searchjs";
import * as jp from "jsonpath";
export function matchArray<T>(jssql: Record<string, any>): MonoTypeOperatorFunction<T[]> {
    return pipe(
        map(i => searchjs.matchArray(i, jssql))
    )
}
export function matchObject<T>(jssql: Record<string, any>): MonoTypeOperatorFunction<T> {
    return pipe(
        filter(t => searchjs.matchObject(t, jssql))
    )
}
export function preventDefault<T extends Event>(source: Observable<T>): Observable<T> {
    return source.pipe(tap(e => e.preventDefault()))
}
export function withComlinkProxy<T, U extends Remote<any>>(op: (v: T) => Promise<U>): OperatorFunction<T, U> {
    return pipe(
        switchMap(op),
        switchMap(proxy =>
            using(
                () => ({
                    unsubscribe() {
                        proxy[releaseProxy]();
                    }
                }),
                () => from([proxy])
            )
        )
    )
}