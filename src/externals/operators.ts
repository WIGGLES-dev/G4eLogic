import { OperatorFunction, SchedulerLike, concat } from "rxjs";
import { async } from "rxjs/internal/scheduler/async";
import { debounceTime, publish, take } from "rxjs/operators";

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