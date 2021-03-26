export declare class VActorSheet extends ActorSheet {
    constructor(...args: any[]);
    static get defaultOptions(): any;
    activateListeners(jquery: any): void;
    render(force?: boolean, options?: {}): any;
}
export declare class VActor extends Actor {
    constructor(...args: any[]);
    prepareData(...args: any[]): void;
}
export declare class VItemSheet extends ItemSheet {
    constructor(...args: any[]);
    static get defaultOptions(): any;
    activateListeners(jquery: any): void;
    render(): any;
}
export declare class VApp extends Application {
    constructor(...args: any[]);
    static get defaultOptions(): any;
}
export declare class VItem extends Item {
    constructor(...args: any[]);
}
