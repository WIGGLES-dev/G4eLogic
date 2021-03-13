export declare type GFunction<A = any> = (...input: any[]) => A;
export declare type GConstructor<A = object> = new (...input: any[]) => A;
export declare type Mixin<T extends GFunction> = InstanceType<ReturnType<T>>;
