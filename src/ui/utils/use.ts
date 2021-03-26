import { getRoot, VirtualElement } from "@app/utils/dom";
import { createPopper } from "@popperjs/core";

export function tooltip(node: HTMLElement, params: any = {}) {
    let component;
    let tooltip: HTMLElement

    if (params.component) {

    } else if (params.tooltip) {
        tooltip = Object.assign(document.createElement("div"), {
            className: 'bg-gray-700 text-white text-sm p-2' + ' ' + params.tipclass || "",
            innerHTML: interpolate(params.tooltip, params.context)
        });
        tooltip.style.zIndex = "1000";
    }

    const virtualElement = new VirtualElement();
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

    function mouseenter() {
        if (params.component) {
            new params.component({
                target: document.body,
                props: {
                    ...params.props,
                    context: params.context
                }
            });
        } else if (tooltip) {
            getRoot(node).appendChild(tooltip);
        }
    }
    function mouseleave() {
        if (component) {
            component.$destroy();
        } else if (tooltip) {
            tooltip.remove();
        }
    }
    async function mousemove({ clientX, clientY }) {
        virtualElement.update(clientX, clientY);
        popper.update();
    }

    node.addEventListener("mousemove", mousemove);
    node.addEventListener("mouseenter", mouseenter)
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
            document.removeEventListener("mouseenter", mousemove);
            if (tooltip) tooltip.remove();
            if (component) component.$destroy();
        }
    }
}
function interpolate(input: string, context: any) {
    if (!context) return input
    if (!input.startsWith("`")) input = '`' + input;
    if (!input.endsWith("`")) input = input + '`'
    try {
        return new Function(...Object.keys(context), `return ${input}`)(...Object.values(context))
    } catch (err) {
        return err
    }
}