import { Observable, Subscription, ObservedValueOf } from "rxjs";
export declare class AutoSubscriber {
    static unsubscribeEach(subscription: Subscription): void;
    subscriptions: Record<string, Subscription>;
    constructor();
    addSubscription(key: string, subscription: Subscription): void;
    subscribe<T>(key: string, observable: Observable<T>): void;
    unsubscribe(key: string): void;
    unsubscribeAll(): void;
    onNext(): void;
    static get<O extends Observable<any>>(observable: O): ObservedValueOf<O>;
}
