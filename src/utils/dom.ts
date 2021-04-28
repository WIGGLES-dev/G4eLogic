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
interface MakeIFrameParams {
    origin?: string
    slug?: string
    src?: string
    style?: Record<string, string>
}
export function makeIframe(params = {} as MakeIFrameParams) {
    const {
        origin = window.origin,
        slug = "",
        src = origin + slug,
        style = {
            width: "100%",
            height: "100%",
            border: "none"
        },
    } = params;
    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, style);
    iframe.src = src;
    return iframe;
}
export class VirtualElement {
    element: ClientRect | DOMRect

    constructor(element?: Element | { clientX: number, clientY: number }) {
        if ("clientX" in element && "clientY" in element) {
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

export function maxCellCount(table: HTMLTableElement): number {
    const rows = table.querySelectorAll("tr");
    const cells = Array.from(rows).reduce((span, row) => Math.max(span, row.cells.length), 0);
    return cells
}

export enum Direction {
    Vertical,
    Horizontal,
    Up,
    Down,
    left,
    Right
}
export function analyzeTouch(start: TouchEvent, end: TouchEvent, touchpoints: Touch[][]) {
    const isMulti = touchpoints.length > 1;
    function analyzeTouches(touches: Touch[], i: number) {
        const first = touches[0];
        const last = touches[touches.length - 1];
        const deltaX = last.clientX - first.clientX;
        const deltaY = last.clientY - first.clientY;
        const distanceX = Math.abs(deltaX);
        const distanceY = Math.abs(deltaY);
        const duration = end.timeStamp - start.timeStamp;
        const velocityX = distanceX / duration;
        const velocityY = distanceY / duration;
        const directionVertical = distanceY > distanceX;
        const directionHorizontal = !directionVertical;
        const directionUp = deltaY > 0 && directionVertical;
        const directionDown = deltaY < 0 && directionVertical
        const directionLeft = deltaX < 0 && directionHorizontal;
        const directionRight = deltaX > 0 && directionHorizontal;
        const direction = directionUp || directionDown || directionLeft || directionRight;
        return {
            first,
            last,
            deltaX,
            deltaY,
            distanceX,
            distanceY,
            duration,
            velocityX,
            velocityY,
            direction,
        }
    }
    touchpoints.map(analyzeTouches);
}


function elementOffScreen(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {

}
function elementsFixedOffset(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {

}
export const offScreenObserver = new IntersectionObserver(elementOffScreen);
export const fixedOffsetObserver = new IntersectionObserver(elementsFixedOffset);

function dataSetChange(mutations: MutationRecord[], observer: MutationObserver) {
    mutations.filter(mutation => mutation.attributeName.includes("data-"))
}

function styleChange(mutation: MutationRecord[], observer: MutationObserver) {

}

export const dataSetChangeObserver = new MutationObserver(dataSetChange);
export const styleChangeObserver = new MutationObserver(styleChange);