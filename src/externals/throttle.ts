export function throttle(throttle: number) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const func = descriptor.value;
        descriptor.value = function (...args) {
            const val = func.call(this, ...args);

            return val
        }
        return descriptor
    }
}