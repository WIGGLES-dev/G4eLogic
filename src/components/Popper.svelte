<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import {
        createPopper,
        Instance,
        Placement,
        PositioningStrategy,
    } from "@popperjs/core";
    import { VirtualElement } from "@internal";
    let classList: string = "";
    export { classList as class };
    export let style: string = "";
    export let popper: Instance;
    export let reference: HTMLElement | MouseEvent;
    export let modifiers = [];
    export let placement: Placement = "auto";
    export let strategy: PositioningStrategy = "absolute";
    export let show: "always" | "hover" = "always";
    export let showingTooltip = show === "always" ? true : false;
    export let use: (node: Element) => any = () => {};
    let element: HTMLDivElement;
    $: if (!reference && element) reference = element.parentElement;
    $: if (element) {
        popper = createPopper(
            reference instanceof HTMLElement
                ? reference
                : new VirtualElement(reference),
            element,
            {
                modifiers,
                placement,
                strategy,
            }
        );
        popper.update();
    }
    $: if (popper && element) {
        popper.state.elements.reference =
            reference instanceof HTMLElement
                ? reference
                : new VirtualElement(reference);
        popper.update();
    }
    onDestroy(() => {
        popper.destroy();
    });
    onMount(() => {
        if (show === "hover") {
            const show = (e: MouseEvent) => {
                showingTooltip = true;
            };
            const hide = (e: MouseEvent) => {
                showingTooltip = false;
            };
            if (reference instanceof HTMLElement) {
                reference.addEventListener("mouseenter", show);
                reference.addEventListener("mouseleave", hide);
                return () => {
                    if (reference instanceof HTMLElement) {
                        reference.removeEventListener("mouseenter", show);
                        reference.removeEventListener("mouseleave", hide);
                    }
                };
            }
        }
    });
    export async function update() {
        return await popper.update();
    }
</script>

<div
    bind:this={element}
    use:use
    on:mouseenter={(e) => (showingTooltip = true)}
    on:mouseleave={(e) => (showingTooltip = false)}
    class={classList}
    {style}
    class:hidden={!showingTooltip}
>
    <slot />
</div>

<style>
</style>
