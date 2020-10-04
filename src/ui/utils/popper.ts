import { createPopper } from "@popperjs/core";

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
    const tooltip = document.createElement("div");
    tooltip.className = 'bg-black text-white rounded-lg p-2' + ' ' + params.tipclass || "";
    tooltip.innerHTML = interpolate(params.tooltip, params.context);

    const popper = createPopper(node, tooltip, {
        placement: params.placement || "right",
        strategy: "fixed"
    });

    node.addEventListener("mouseover", () => { document.body.appendChild(tooltip) });
    node.addEventListener("mouseleave", () => { tooltip.remove() });

    return {
        update(params) { tooltip.innerHTML = interpolate(params.tooltip, params.context) },
        destroy() {
            popper.destroy();
        }
    }
}