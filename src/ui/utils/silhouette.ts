import {
    SVG,
    Runner,
    extend as SVGextend,
    Element as SVGElement,
} from "@svgdotjs/svg.js";
import { createPopper } from "@popperjs/core";

export function center(node: SVGElement) {
    const { cx, cy } = node.root().viewbox();
    node.cx(cx).cy(cy);
}

/**
 * Frame target node centered horizontally in the root viewbox;
 * @param node 
 * @param param1 
 */

export async function frameInViewbox(node: SVGElement, { scale = 0.7 } = {}) {
    const oldview = node.root().viewbox();
    const { cx, cy, h, w, x, x2, y, y2 } = node.bbox();

    scale = (oldview.h / h) * scale;

    let width = oldview.w / scale;
    let height = oldview.h / scale;

    let xStart = x - (width / 2);
    let yStart = y - (height / 2);

    xStart += (w / 2);
    yStart += (h / 2);

    return new Promise((resolve, reject) => {
        node.root().animate(300).viewbox(xStart, yStart, width, height).after(resolve);
    });
}

/**
 * Determine the ideal popperoffset of the node based on available parent dimensions
 */
function idealPopperOffset(node: SVGElement) {

}

export function positionField(node: HTMLElement, params) {
    const popper = createPopper(params.reference, node, {
        placement: "auto"
    });

    const interval = setInterval(async () => {
        popper.update();
    }, 300);

    return {
        update() { },
        destroy() {
            clearInterval(interval)
            popper.destroy();
        }
    }
}