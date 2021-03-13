export declare type Resolvable<T> = {
    [P in keyof T]: T[P] | Resolver<any, T[P]> | Resolvable<T[P]>;
};
export declare class Resolver<C extends any[] = any[], R = any> {
    resolver: (...args: C) => R;
    constructor(resolver: (...args: C) => R);
    resolve(...args: C): R;
    static replace(): void;
    static deepResolve<T>(target: Resolvable<T>, { context, maxDepth, currentDepth, }: {
        context?: any[];
        maxDepth?: number;
        currentDepth?: number;
    }): T;
    static spread(fn: (...args: any[]) => any): (...args: any[]) => any;
}
