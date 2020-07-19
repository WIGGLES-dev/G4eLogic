export declare type json = {
    [key: string]: any;
};
export declare function objectify<T>(object: string | json, reviver?: (this: any, key: string, value: any) => T): T;
export declare function isArray(potentialArray: any): (any | any[])[];
