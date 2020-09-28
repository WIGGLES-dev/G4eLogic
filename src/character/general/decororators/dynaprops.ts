export function watch(...keys: string[]): any {
    return (constructor: any) => {
        return class extends constructor {
            constructor(...args) {
                super(...args,);
                constructor.keys = [...constructor.keys || [], keys]
            }
        }
    }
}

export function rootWatcher(constructor: any): any {
    let keys = constructor.keys.reduce((acc, cur) => {
        if (cur in acc) {
            return acc
        } else {
            return [...acc, cur]
        }
    }, []);

    return class extends constructor {
        subscriptions: Set<(store: any) => void> = new Set()

        constructor(...args) {
            super(...args);
        }
        private _dispatch() {
            this.subscriptions.forEach(subscription => {
                subscription(this);
            });
        }
        private _unsubscribe(subscribtion: (store: any) => void) {
            this.subscriptions.delete(subscribtion)
        }
        subscribe(subscription: (store: any) => void) {
            this.subscriptions.add(subscription);
            return () => this._unsubscribe(subscription)
        }
        createDataAccesors(keys: string[]) {
            const props = keys.reduce((prev, cur) => {
                if (!prev[cur]) {
                    prev[cur] = {
                        set(val) {
                            try {
                                this.data[cur] = val
                            } catch (err) {

                            }
                        },
                        get() {
                            try {
                                return this.data[cur]
                            } catch (err) {
                                try {
                                    return this[cur]
                                } catch (err) {
                                    return undefined
                                }
                            }
                        }
                    }
                }
                return prev
            }, {});
            Object.defineProperties(this, props);
        }
    }
}