import { wrap, expose, windowEndpoint, transferHandlers, Remote } from "comlink";
export function upload() {
    return new Promise<FileList>((resolve, reject) => {
        Object.assign(document.createElement("input"), {
            type: "file",
            async onchange(this: HTMLInputElement) {
                resolve(this.files)
            }
        }).click();
    });
}

export function download(href: string, filename: string) {
    Object.assign(document.createElement("a"), {
        href,
        filename
    }).click();
}
export function inIframe() {
    return window && window.parent !== window
}
export function makeIframe({
    origin = window.origin,
    slug = "",
    src = origin + slug,
    style = {
        width: "100%",
        height: "100%",
        border: "none"
    } as any,
    appendTo = null
}) {
    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, style);
    iframe.src = src;
    if (appendTo instanceof HTMLElement) {
        appendTo.append(iframe);
    }
    return iframe;
}
export async function bubble(frame: HTMLIFrameElement) {
    if (!frame.contentDocument) await new Promise(resolve => frame.onload = resolve);
    console.log(frame, frame.contentDocument);
    const target = frame?.contentDocument;
    target.onmousemove = (e) => {
        const bounding = frame.getBoundingClientRect();
        const event = new MouseEvent("mousemove", {
            ...e,
            screenX: e.screenX + bounding.left,
            clientX: e.clientX + bounding.left,
            screenY: e.clientY + bounding.top,
            clientY: e.clientY + bounding.top,
        });
        window.dispatchEvent(event);
    }
    target.onclick = (e) => {
        const bounding = frame.getBoundingClientRect();
        const event = new MouseEvent("click", {
            ...e,
            screenX: e.screenX + bounding.left,
            clientX: e.clientX + bounding.left,
            screenY: e.clientY + bounding.top,
            clientY: e.clientY + bounding.top,
        });
        console.log("CLICK");
        window.dispatchEvent(event);
    }
    target.onkeypress = (e) => {
        const event = new MouseEvent("keypress", {
            ...e
        });
        window.dispatchEvent(event);
    }
    target.onmouseup = (e) => {
        const bounding = frame.getBoundingClientRect();
        const event = new MouseEvent("mouseup", {
            ...e,
            screenX: e.screenX + bounding.left,
            clientX: e.clientX + bounding.left,
            screenY: e.clientY + bounding.top,
            clientY: e.clientY + bounding.top,
        });
        window.dispatchEvent(event);
    }
    target.onmousedown = (e) => {
        const bounding = frame.getBoundingClientRect();
        const event = new MouseEvent("mousedown", {
            ...e,
            screenX: e.screenX + bounding.left,
            clientX: e.clientX + bounding.left,
            screenY: e.clientY + bounding.top,
            clientY: e.clientY + bounding.top,
        });
        frame.parentElement.dispatchEvent(event);
    }
    target.onscroll = (e) => {
        frame.ownerDocument.body.scrollTop = frame.ownerDocument.body.scrollHeight;
    }
}
export function getRoot(element: HTMLElement) {
    const rootNode = element.getRootNode()
    if (rootNode instanceof Document || rootNode.nodeName === "#document") {
        return (rootNode as Document).body
    } else if (rootNode instanceof ShadowRoot) {
        return rootNode.appendChild(document.createElement("div"));
    } else {
        return document.body
    }
}
export class VirtualElement {
    element: ClientRect | DOMRect

    constructor(element?: Partial<ClientRect | DOMRect> | HTMLElement | MouseEvent) {
        if (element instanceof MouseEvent) {
            const { clientX, clientY } = element;
            this.element = this.generateGetBoundingClientRect(clientX, clientY);
        }
        else {
            const bb = element instanceof HTMLElement ? element.getBoundingClientRect() : element;
            this.element = Object.assign(this.generateGetBoundingClientRect(), bb);
        }
    }
    getBoundingClientRect(): ClientRect | DOMRect {
        return this.element
    }
    generateGetBoundingClientRect(x = 0, y = 0): ClientRect | DOMRect {
        return {
            width: 0,
            height: 0,
            top: y,
            right: x,
            bottom: y,
            left: x,
        };
    }
    update(x, y) {
        this.element = this.generateGetBoundingClientRect(x, y);
        return this
    }
}
export interface EventHandlerOptions {
    target
    coerce: typeof Number | typeof Boolean | typeof String
}
export function handleEvent(options: EventHandlerOptions) {
    function doChange(value, cast?) {
        const { target, coerce } = options;
        if (target) {
            const toSend = coerce || cast ? (coerce || cast)(value) : value
            if (typeof target.next === "function") {
                target.next(toSend);
            } else if (typeof target.set === "function") {
                target.set(toSend);
            }
        }
    }
    return function (this: Event, e: Event) {
        const target = e.target;
        if (target instanceof HTMLElement) {
            if (target instanceof HTMLInputElement) {
                if (target.type === "number") {
                    doChange(target.value, Number)
                } else if (target.type === "checkbox") {
                    doChange(target.value, Boolean)
                } else if (target.type === "text") {
                    doChange(target.value, String)
                }
            } else if (target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) {
                doChange(target.value, String);
            } else if (target.isContentEditable) {
                doChange(target.innerHTML)
            }
        }
    }
}
export function initiateEvent(event: string, data: EventInit, coordinates: [number, number]) {
    new Event(event, data)
}
export function initProxyEventDispatcher() {
    try {
        if (window.parent === window) {
            expose(initiateEvent, windowEndpoint(window.parent));
        }
    } catch (err) {
        
    }
}

export function dispatchEventToIframe(iframe: HTMLIFrameElement) {

}