export declare function upload(): Promise<FileList>;
export declare function download(href: string, filename: string): void;
export declare function inIframe(): boolean;
export declare function makeIframe({ origin, slug, src, style, appendTo }: {
    origin?: string;
    slug?: string;
    src?: any;
    style?: any;
    appendTo?: any;
}): HTMLIFrameElement;
export declare function bubble(frame: HTMLIFrameElement): Promise<void>;
export declare function getRoot(element: HTMLElement): HTMLElement;
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
export declare function initiateEvent(event: string, data: EventInit, coordinates: [number, number]): void;
export declare function initProxyEventDispatcher(): void;
export declare function dispatchEventToIframe(iframe: HTMLIFrameElement): void;
