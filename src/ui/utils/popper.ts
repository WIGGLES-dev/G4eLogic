import { createPopper } from "@popperjs/core";
import { fade } from "svelte/transition";

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
    const math = /[/*|/%|/*|/+|/-]/;
    try {
        return input.replace(brackets, (match) => {
            if (brackets.test(match.slice(1, -1))) {
                let expression = match.slice(1, -1).replace(brackets, (match) => context[match.slice(1, -1)] !== undefined ? context[match.slice(1, -1)] : `[ERROR!]`);
                return new Function(`return ${expression}`)()
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
    let tooltip

    if (params.component) {

    } else if (params.tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = 'bg-black text-white text-sm rounded-lg p-2' + ' ' + params.tipclass || "";
        tooltip.innerHTML = interpolate(params.tooltip, params.context);
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
            if (!document.body.contains(tooltip)) {
                document.body.appendChild(tooltip);
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