declare type AnyObject = Record<string | number | symbol, any>;
export declare function filterKeys<T extends AnyObject>(object: T, predicate: (key: string, value: any, src: T) => boolean): T;
export declare function keyMap<T extends AnyObject, U>(object: T, map: <P extends keyof T>(key: P, value: T[P], i: number, src: T) => [key: string | number | symbol, value: U]): {
    [k: string]: U;
};
export declare function flatFilter(): void;
export declare function merge(src: any, ...objects: any[]): any;
export declare function getPath(obj: any, value: any): string[];
export declare function each<T, U>(project: (value: T) => U): (array: T[]) => U[];
export declare function filterEach<T>(project: (value: T) => boolean): (array: T[]) => T[];
export declare function reduceEach(): void;
export declare function setValueAtPath(src: any, path: string, value: any): void;
export declare function safeCall<P extends any[] = any[], T = undefined, R = any>(fn: (this: T, ...args: P) => R, args?: P, err?: ((this: T, error: any, ...args: P) => any), thisarg?: T): R;
export declare function hook<T, M extends (...args: any[]) => any = (...args: any[]) => any>(target: T, method: string, hook: (fn: M, args: Parameters<M>) => ReturnType<M>): void;
export declare type OrArray<T> = T | T[];
export declare function orArray<T>(input: OrArray<T>): T[];
export declare type Length<array extends any[]> = array extends {
    length: infer L;
} ? L : never;
export {};
