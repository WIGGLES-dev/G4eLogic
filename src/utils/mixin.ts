export type GFunction<A = any> = (...input: any[]) => A
export type GConstructor<A = object> = new (...input: any[]) => A
export type Mixin<T extends GFunction> = InstanceType<ReturnType<T>>
