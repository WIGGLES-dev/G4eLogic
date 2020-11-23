export function debounce(debounce: number, stagger = true) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const func = descriptor.value;
        let timer;
        let promises = [];
        descriptor.value = function (...args) {
            if (stagger) clearTimeout(timer);
            timer = setTimeout(() => {
                let funcFailed = false;
                let val;
                try {
                    val = func.call(this, ...args);
                } catch (err) {
                    funcFailed = true
                }
                promises.forEach(promise => {
                    funcFailed ? promise.reject() : promise.resolve(val)
                });
                promises = [];
            }, debounce);
            const promise = new Promise((resolve, reject) => {
                promises.push({ resolve, reject });
            });
            return promise
        }
        return descriptor
    }
}