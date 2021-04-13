<script lang="ts">
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { createPopper } from "@popperjs/core";
    import type {
        Instance,
        Placement,
        PositioningStrategy,
    } from "@popperjs/core";
    import { VirtualElement, highestZIndex } from "@utils/dom";
    let classList: string = "";
    export let reference: HTMLElement | MouseEvent = null;
    export let modifiers = [];
    export let placement: Placement = "auto";
    export let strategy: PositioningStrategy = "absolute";
    export let display: "fixed" | "virtual" | "hovered" | "hovered virtual" =
        "fixed";
    export let rendered = display.includes("fixed") ? true : false;
    export let offset: [number, number] = null;
    let popper: Instance;
    let element: HTMLDivElement;
    onMount(() => {
        if (!reference) reference = element.parentElement;
        document.body.append(element);
        let refElement: HTMLElement | VirtualElement;
        if (display.includes("virtual")) {
            refElement = new VirtualElement(reference);
        } else if (reference instanceof HTMLElement) {
            refElement = reference;
        } else {
            refElement = new VirtualElement(reference);
        }
        if (offset) {
            modifiers.push({
                name: "offset",
                options: {
                    offset,
                },
            });
        }
        popper = createPopper(refElement, element, {
            modifiers,
            placement,
            strategy,
        });
        const events = {
            onmouseenter(e: MouseEvent) {
                if (display.includes("hovered")) rendered = true;
            },
            onmouseleave(e: MouseEvent) {
                if (display.includes("hovered")) {
                    rendered = false;
                }
            },
            async onmousemove(e: MouseEvent) {
                if (display.includes("virtual")) {
                    update(e.clientX, e.clientY);
                }
            },
        };
        Object.assign(reference, events);
        return () => {
            popper.destroy();
            //element.remove();
        };
    });
    //afterUpdate(update);
    export async function update(x?: number, y?: number) {
        const reference = popper.state.elements.reference;
        if (reference instanceof VirtualElement && x && y) {
            reference.update(x, y);
        }
        await popper.update();
    }
</script>

<div bind:this={element} class="popper">
    {#if rendered}
        <slot />
    {/if}
</div>

<style>
    .popper {
        z-index: 1000;
    }
</style>
