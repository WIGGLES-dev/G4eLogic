import { MonoTypeOperatorFunction, Observable, Timestamp } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
export interface Stamped {
    lastEdit: TimeStamp
}
export type TimeStamp = Date | string | number
export class Stamp {
    static toMilleseconds(stamp: TimeStamp): number {
        if (stamp instanceof Date) return stamp.getTime();
        if (typeof stamp === "string") return new Date(stamp)?.getTime() ?? Number.NEGATIVE_INFINITY
        return stamp
    }
    static isDateNewer(old: TimeStamp, current: TimeStamp): boolean {
        const oldMs = this.toMilleseconds(old)
        const currentMs = this.toMilleseconds(current)
        return currentMs > oldMs
    }
    static distinctUntilNewer<T extends Stamped>(): MonoTypeOperatorFunction<T> {
        return function (src: Observable<T>) {
            return src.pipe(
                distinctUntilChanged((x, y) => this.isDateNewer(x.lastEdit, y.lastEdit))
            )
        }
    }
    static distinctUntilArrayItemNewer<T extends Stamped>(): MonoTypeOperatorFunction<T[]> {
        return function (src: Observable<T[]>) {
            return src.pipe(this.distinctUntilNewer())
        }
    }
}