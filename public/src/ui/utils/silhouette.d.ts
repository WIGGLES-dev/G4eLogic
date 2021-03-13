import { Element as SVGElement } from "@svgdotjs/svg.js";
export declare function center(node: SVGElement): void;
export declare function frameInViewbox(node: SVGElement, { scale }?: {
    scale?: number;
}): Promise<unknown>;
