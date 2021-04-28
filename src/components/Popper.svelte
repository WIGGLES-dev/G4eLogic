<script lang="ts">
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import {
        createPopper,
        VirtualElement as PopperVirtualElement,
    } from "@popperjs/core";
    import type {
        Instance,
        Placement,
        PositioningStrategy,
    } from "@popperjs/core";
    import { VirtualElement, highestZIndex } from "@utils/dom";
    let classList: string = "";
    export let reference: Element | { clientX: number; clientY: number } = null;
    export let modifiers = [];
    export let placement: Placement = "auto";
    export let strategy: PositioningStrategy = "absolute";
    type DisplayOptions = "fixed" | "virtual" | "hovered" | "hovered virtual";
    export let display: DisplayOptions = "fixed";
    export let offset: [number, number] = null;
    let popper: HTMLElement;
    let instance: Instance;
    function useReference(node: Element) {
        reference = node;
        return {
            destroy() {
                reference = null;
            },
        };
    }
    function usePopper(node: HTMLElement) {
        popper = node;
        if (display !== "fixed") {
            node.style.display = "none";
        }
        document.body.append(node);
        return {
            destroy() {
                popper = null;
                node?.remove();
            },
        };
    }
    $: if (popper) {
        if (instance) {
            instance.destroy();
        }
        if (!reference) reference = popper.parentElement;
        let refElement: Element | PopperVirtualElement;
        if (display === "virtual") {
            refElement = new VirtualElement(reference);
        } else if (reference instanceof Element) {
            refElement = reference;
        } else if (reference) {
            refElement = new VirtualElement(reference);
        }
        if (reference instanceof Element) {
            const events = {
                onmouseenter(e: MouseEvent) {
                    if (display.includes("hovered"))
                        popper.style.display = null;
                },
                onmouseleave(e: MouseEvent) {
                    if (display.includes("hovered")) {
                        popper.style.display = "none";
                    }
                },
                async onmousemove(e: MouseEvent) {
                    if (display.includes("virtual")) {
                        update(e.clientX, e.clientY);
                    }
                },
            };
            Object.assign(reference, events);
        }
        const offsetModifier = offset
            ? [
                  {
                      name: "offset",
                      options: {
                          offset,
                      },
                  },
              ]
            : [];
        if (refElement) {
            instance = createPopper(refElement, popper, {
                modifiers: [...modifiers, ...offsetModifier],
                placement,
                strategy,
            });
        }
    }
    export async function update(x?: number, y?: number) {
        const reference = instance?.state?.elements?.reference;
        if (reference instanceof VirtualElement && x && y) {
            reference.update(x, y);
        }
        await instance.update();
    }
</script>

<slot popper={usePopper} reference={useReference} />

<style>
</style>
