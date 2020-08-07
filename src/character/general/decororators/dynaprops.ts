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
        constructor(...args) {
            super(...args);
            createDataAccessors(keys, this);
        }
    }
}

function createDataAccessors(keys: string[], target) {
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
    Object.defineProperties(target, props);
    return target
}