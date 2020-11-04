export type Constructor<T = {}> = new (...args) => T;

export function mixin<T1>(...mixins: [Constructor<T1>]): Constructor<T1>;
export function mixin<T1, T2>(...mixins: [Constructor<T1>, Constructor<T2>]): Constructor<T1 & T2>;
export function mixin<T1, T2, T3>(...mixins: [Constructor<T1>, Constructor<T2>, Constructor<T3>]): Constructor<T1 & T2 & T3>;
export function mixin(...mixins) {
    let mixer = class { }
    mixins.forEach(mixin => {
        Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
            mixer.prototype[name] = mixin.prototype[name];
        })
    });
    return mixer
}
