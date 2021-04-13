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
    const a = document.createElement("a");
    Object.assign(
        a, {
        href,
        download: filename,
    });
    a.click();
}
export function getComputedStyle(element: Element, styleProp: string) {
    if (window && window.getComputedStyle) {
        return document.defaultView.getComputedStyle(element, null).getPropertyValue(styleProp)
    }
}
export function highestZIndex(): number {
    return Array.from(document.querySelectorAll("*")).reduce((highest, element) => {
        const zIndex = +getComputedStyle(element, "zIndex");
        return Math.max(zIndex, highest)
    }, Number.NEGATIVE_INFINITY)
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