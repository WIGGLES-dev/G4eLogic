export declare type json = {
    [key: string]: any;
};
export declare function objectify(object: string | json, reviver?: (this: any, key: string, value: any) => any): json;
