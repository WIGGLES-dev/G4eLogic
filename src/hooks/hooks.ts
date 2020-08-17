export class Hooks {
    private hooks: Map<string, Function[]> = new Map()
    private _once: Function[] = []
    private ids: Map<number, Function> = new Map
    private id: number = 1

    /**
    * Register a callback handler which should be triggered when a hook is triggered.
    *
    * @param {String} hook   The unique name of the hooked event
    * @param {Function} fn   The callback function which should be triggered when the hook event occurs
    */
    on(hook: string, fn: Function) {
        const id = this.id++
        this.hooks.set(hook, this.hooks.get(hook) || []);
        this.hooks.get(hook).push(fn);
        this.ids.set(id, fn)
        return id
    }

    /**
    * Register a callback handler for an event which is only triggered once the first time the event occurs.
    * After a "once" hook is triggered the hook is automatically removed.
    *
    * @param {String} hook   The unique name of the hooked event
    * @param {Function} fn   The callback function which should be triggered when the hook event occurs
    */
    once(hook: string, fn: Function) {
        this._once.push(fn)
        return this.on(hook, fn)
    }

    /**
     * Unregister a callback handler for a particular hook event
     *
     * @param {String} hook   The unique name of the hooked event
     * @param {Function} fn   The function that should be removed from the set of hooked callbacks
     */
    off(hook: string, fn: Function) {
        if (typeof fn === "number") {
            let id = fn;
            fn = this.ids.get(fn);
            this.ids.delete(id)
        }
        if (!this.hooks.has(hook)) {

        } else {
            const fns = this.hooks.get(hook);
            let idx = fns.indexOf(fn);
            if (idx !== -1) fns.splice(idx, 1)
        }
    }
    /**
   * Call all hook listeners in the order in which they were registered
   * Hooks called this way can not be handled by returning false and will always trigger every hook callback.
   *
   * @param {String} hook   The hook being triggered
   * @param {Array} args    Arguments passed to the hook callback functions
   */
    callAll(hook: string, ...args) {
        if (!this.hooks.has(hook)) {

        } else {
            const fns = [...this.hooks.get(hook)];
            fns.forEach(fn => {
                this._call(hook, fn, args)
            })
        }
    }

    /**
     * Call hook listeners in the order in which they were registered.
     * Continue calling hooks until either all have been called or one returns `false`.
     *
     * Hook listeners which return `false` denote that the original event has been adequately handled and no further
     * hooks should be called.
     *
     * @param {String} hook   The hook being triggered
     * @param {...*} args     Arguments passed to the hook callback functions
     */
    call(hook: string, ...args) {
        if (!this.hooks.has(hook)) {

        } else {
            const fns = [...this.hooks.get(hook)]
            fns.forEach(fn => {
                let callAdditional = this._call(hook, fn, args);
                if (callAdditional === false) return false
            })
        }
        return true
    }

    /**
     * Call a hooked function using provided arguments and perhaps unregister it.
     * @private
     */
    private _call(hook: string, fn: Function, args) {
        if (this._once.includes(fn)) this.off(hook, fn);
        try {
            return fn(...args)
        } catch (err) {
            console.log(err);
        }
    }
}

const hooks = new Hooks();
export default hooks