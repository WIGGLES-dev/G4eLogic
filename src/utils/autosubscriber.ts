import { Observable, Subscription, ObservedValueOf } from "rxjs";

export class AutoSubscriber {
    static unsubscribeEach(subscription: Subscription) {
        subscription.unsubscribe()
    }
    subscriptions: Record<string, Subscription>
    constructor() {

    }
    addSubscription(key: string, subscription: Subscription) {

    }
    subscribe<T>(observable: Observable<T>, key: string) {
        const subscription = observable.subscribe();
    }
    unsubscribe(key: string) {
        this.subscriptions[key].unsubscribe()
    }
    unsubscribeAll() {
        Object.values(this.subscriptions)
            .forEach(
                AutoSubscriber.unsubscribeEach
            )
    }
    onNext() {

    }
    static get<O extends Observable<any>>(observable: O): ObservedValueOf<O> {
        let value: ObservedValueOf<O>;
        const sub = observable.subscribe(v => value = v);
        sub.unsubscribe();
        return value
    }
}