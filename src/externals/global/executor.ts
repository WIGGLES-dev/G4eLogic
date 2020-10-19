export class Executor {
    constructor() { }

    static execute(script: string, args: { [key: string]: any }, thisArg?) {
        if (!script.startsWith("return")) return
        return new Function(Object.keys(args).join(" "), script).apply(thisArg, Object.values(args))
    }
}