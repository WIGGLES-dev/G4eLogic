import { accessFrame } from "@internal";
import { createPopper } from "@popperjs/core";
import { fade } from "svelte/transition";
import { string } from "./formatting";

export function popperVirtualElement() {
    return {
        getBoundingClientRect() {
            return this.generateGetBoundingClientRect();
        },
        generateGetBoundingClientRect(x = 0, y = 0) {
            return () => ({
                width: 0,
                height: 0,
                top: y,
                right: x,
                bottom: y,
                left: x,
            });
        },
        update(x, y) {
            this.getBoundingClientRect = this.generateGetBoundingClientRect(x, y);
        },
    };
}

function interpolate(input: string, context: any) {
    const brackets = /(\[([^\[\]]*|(\[[^\[\]]*\]))*\])/g
    try {
        return input.replace(brackets, (match) => {
            if (brackets.test(match.slice(1, -1))) {
                let expression = match.slice(1, -1).replace(brackets, (match) => context[match.slice(1, -1)] !== undefined ? context[match.slice(1, -1)] : `[ERROR!]`);
                let result = new Function(`return ${expression}`)();
                if (+result > Number.NEGATIVE_INFINITY) result = result.toFixed(0);
                return result
            } else {
                return context[match.slice(1, -1)] || `[ERROR!]`
            }
        });
    } catch (err) {
        console.log(err);
        console.log(input)
        console.log(context);
        return `Your tooltip interpolation has failed to render:<br/><pre>${err}</pre>`
    }
}

export function createTooltip(node: HTMLElement, params: any) {
    let component;
    let tooltip: HTMLElement

    if (params.component) {

    } else if (params.tooltip) {
        tooltip = Object.assign(document.createElement("div"), {
            className: 'bg-black text-white text-sm rounded-lg p-2' + ' ' + params.tipclass || "",
            innerHTML: interpolate(params.tooltip, params.context)
        });
        tooltip.style.zIndex = "1000";
    }

    const virtualElement = popperVirtualElement();
    const popper = createPopper(virtualElement, tooltip, {
        placement: params.placement || "bottom-start",
        strategy: "fixed",
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [params.offsetX || 16, params.offsetY || 16]
                }
            }
        ]
    });

    async function mousemove({ clientX, clientY }) {
        if (params.component) {
            new params.component({
                target: document.body,
                props: {
                    ...params.props,
                    context: params.context
                }
            });
        } else if (tooltip) {
            if (!accessFrame().document.body.contains(tooltip)) {
                accessFrame().document.body.appendChild(tooltip);
            }
            virtualElement.update(clientX, clientY);
            popper.update();
        }
    }
    function mouseleave() {
        if (component) {

            component.$destroy();
        } else if (tooltip) {
            tooltip.remove();
        }
    }

    node.addEventListener("mousemove", mousemove);
    node.addEventListener("mouseleave", mouseleave);

    return {
        update(params) {
            if (params.component) {
                component.$set({ ...params.props, context: params.context });
            } else if (params.tooltip) {
                tooltip.innerHTML = interpolate(params.tooltip, params.context)
            };
        },
        destroy() {
            popper.destroy();
            document.removeEventListener("mousemove", mousemove);
            document.removeEventListener("mouseleave", mouseleave);
            if (tooltip) tooltip.remove();
            if (component) component.$destroy();
        }
    }
}