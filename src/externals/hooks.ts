const hooks: { [key: string]: Function[] } = {

}

export function addHook(hook: string, fn: Function): any {
    hooks[hook] = [...(hooks[hook] || []), fn];
}
export function removeHook(hook: string, fn: Function) {
    hooks[hook].filter(hook => hook !== fn)
}

export class HookEvent {
    prevented = false
    nexted = false
    value

    func: Function
    caller
    args: any[]

    constructor(func: Function, caller, ...args) {
        this.func = func;
        this.caller = caller;
        this.args = args;
    }

    next() {
        if (this.nexted) return
        this.nexted = true;
        this.value = this.func.call(this.caller, ...this.args);
        return this.value
    }

    preventDefault() { this.prevented = true; }
}

function createHook(fn: Function) {

}

function createAsyncHook(fn: (...args) => Promise<any>): (...args) => Promise<any> {
    return async function () {

    }
}

export function before(hook: string) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const func = descriptor.value;
        descriptor.value = function (...args) {
            const event = new HookEvent(func, this, ...args);
            hooks[hook]?.map(hook => hook(event)) ?? [];
            if (event.prevented) return event.value;
            if (!event.nexted) return event.next()
            return event.value
        }
        return descriptor
    }
}
export function after(hook: string) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const func = descriptor.value;
        descriptor.value = function (...args) {
            const event = new HookEvent(func, this, ...args)
            event.next();
            hooks[hook]?.forEach(hook => hook(event));
            return event.value
        }
        return descriptor
    }
}
