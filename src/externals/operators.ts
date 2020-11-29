import { OperatorFunction, SchedulerLike, concat, Observable } from "rxjs";
import { async } from "rxjs/internal/scheduler/async";
import { debounceTime, publish, take, distinctUntilChanged } from "rxjs/operators";
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';
import * as jp from "jsonpath";

export function debounceTimeAfter<T>(
    amount: number,
    dueTime: number,
    scheduler: SchedulerLike = async,
): OperatorFunction<T, T> {
    return publish(value =>
        concat(
            value.pipe(take(amount)),
            value.pipe(debounceTime(dueTime, scheduler))),
    );
}

export function debounceTimeAfterFirst<T>(
    dueTime: number,
    scheduler: SchedulerLike = async,
): OperatorFunction<T, T> {
    return debounceTimeAfter(1, dueTime, scheduler);
}

export function pathIsDirty<T extends Object>(...paths: string[]): OperatorFunction<T, T> {
    return distinctUntilChanged<T>((before, after) =>
        paths.map(
            path => diff(jp.value(before, path), jp.value(after, path))
        ).some(
            result => (result instanceof Array && result.length > 0) || Object.values(result).length > 0)
    )
}

export function log<T>(message: string) {
    return (source: Observable<T>): Observable<T> => {
        console.log(message);
        return source
    }
}