export declare function upload(): Promise<FileList>;
export declare function download(href: string, filename: string): void;
export declare function bubbleFrameEvents(frame: HTMLIFrameElement): void;
export declare function getRoot(element: HTMLElement): HTMLElement;
export declare function handleMessage<P>(message: MessageEvent, proxy: P): void;
export declare class VirtualElement {
    element: ClientRect | DOMRect;
    constructor(element?: Partial<ClientRect | DOMRect> | HTMLElement | MouseEvent);
    getBoundingClientRect(): ClientRect | DOMRect;
    generateGetBoundingClientRect(x?: number, y?: number): ClientRect | DOMRect;
    update(x: any, y: any): this;
}
export interface EventHandlerOptions {
    target: any;
    coerce: typeof Number | typeof Boolean | typeof String;
}
export declare function handleEvent(options: EventHandlerOptions): (this: Event, e: Event) => void;
