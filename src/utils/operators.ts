import {
    asyncScheduler,
    BehaviorSubject,
    concat,
    defer,
    EMPTY,
    from,
    merge,
    MonoTypeOperatorFunction,
    Observable,
    OperatorFunction,
    pipe,
    scheduled,
    SchedulerLike,
    Subject,
    using,
    bindCallback,
    fromEventPattern
} from "rxjs";
import {
    Remote,
    wrap,
    releaseProxy
} from "comlink";
import {
    reduce,
    map,
    filter,
    mergeMap,
    debounceTime,
    distinctUntilChanged,
    publish,
    take,
    concatAll,
    tap,
    pluck,
    switchMap,
    observeOn,
    multicast,
    refCount,
    mergeAll,
    share,
    publishBehavior,
    takeWhile,
    catchError,
    scan
} from "rxjs/operators";
export function preventDefault<T extends Event>(source: Observable<T>): Observable<T> {
    return source.pipe(tap(e => e.preventDefault()))
}
export function withComlinkProxy<T, U>(op: (v: T) => Promise<U>): OperatorFunction<T, U> {
    return pipe(
        mergeMap(op),
        switchMap(proxy => {
            return using(
                function () {
                    return {
                        unsubscribe() {
                            proxy[releaseProxy]();
                        }
                    }
                },
                function () {
                    return from([proxy])
                }
            )
        })
    )
}