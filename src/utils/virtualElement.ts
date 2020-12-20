export class VirtualElement {
    element: ClientRect | DOMRect

    constructor(element?: Partial<ClientRect | DOMRect>) {
        this.element = Object.assign(this.generateGetBoundingClientRect(), element)
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