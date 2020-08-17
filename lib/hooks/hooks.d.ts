export declare class Hooks {
    private hooks;
    private _once;
    private ids;
    private id;
    on(hook: string, fn: Function): number;
    once(hook: string, fn: Function): number;
    off(hook: string, fn: Function): void;
    callAll(hook: string, ...args: any[]): void;
    call(hook: string, ...args: any[]): boolean;
    private _call;
}
declare const hooks: Hooks;
export default hooks;
