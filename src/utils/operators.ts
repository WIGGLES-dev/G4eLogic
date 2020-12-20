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

export function reduceToArray<T>(src: Observable<T>): Observable<T[]> {
    return src.pipe(
        reduce((arr, v) => [...arr, v], [])
    )
}

export function debounceTimeAfter<T>(
    amount: number,
    dueTime: number,
    scheduler: SchedulerLike = asyncScheduler,
): OperatorFunction<T, T> {
    return publish(value =>
        concat(
            value.pipe(take(amount)),
            value.pipe(debounceTime(dueTime, scheduler))),
    );
}

export function debounceTimeAfterFirst<T>(
    dueTime: number,
    scheduler: SchedulerLike = asyncScheduler,
): OperatorFunction<T, T> {
    return debounceTimeAfter(1, dueTime, scheduler);
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