export type Resolvable<T> = {
    [P in keyof T]: T[P] | Resolver<any, T[P]> | Resolvable<T[P]>
}
export class Resolver<C extends any[] = any[], R = any> {
    resolver: (...args: C) => R
    constructor(resolver: (...args: C) => R) {
        this.resolver = resolver;
    }
    resolve(...args: C): R {
        try {
            return this.resolver(...args)
        } catch (err) {
            console.log(err);
        }
    }
    static deepResolve<T, C extends any[]>(target: Resolvable<T>, context: C, maxDepth = 10, currentDepth = 0): T {
        const clone = {} as T
        if (currentDepth > maxDepth) return target as T
        if (target == undefined || typeof target === 'string' || typeof target === 'number') return target as T
        Object.entries(target).forEach(([key, value]) => {
            if (value instanceof Resolver) {
                clone[key] = value.resolve(...context)
            } else if (value instanceof Array) {
                clone[key] = value.map(value => Resolver.deepResolve(value, context, maxDepth, currentDepth + 1));
            } else if (typeof value === 'object') {
                clone[key] = Resolver.deepResolve(value, context, maxDepth, currentDepth + 1);
            } else {
                clone[key] = value
            }
        });
        return clone
    }
    static spread(fn: (...args) => any) {
        return function (...args) {
            return fn(...args)
        }
    }
}