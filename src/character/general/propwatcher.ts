export function watch(...props: string[]) {
    return function (constructor: any): new () => any {
        return class extends constructor {
            static keys: string[] = props

            constructor(...args) {
                super(...args, props);
            }
        }
    }
}

export function getAllKeys(object: any) {
    return getAllPrototypes(object).reduce((prev, cur) => {
        return prev.concat(cur.constructor.keys || []);
    }, [])
}

function getAllPrototypes(object: any): any[] {
    let prototypes = [];
    if (object.__proto__) {
        prototypes.push(object.__proto__);
        return prototypes.concat(getAllPrototypes(object.__proto__));
    }
    return prototypes
}