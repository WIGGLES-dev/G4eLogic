import {
    from,
    Observable,
    OperatorFunction,
    pipe,
    using
} from "rxjs";
import {
    releaseProxy
} from "comlink";
import {
    mergeMap,
    tap,
    switchMap
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