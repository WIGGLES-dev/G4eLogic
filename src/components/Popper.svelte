<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import {
        createPopper,
        Instance,
        Placement,
        PositioningStrategy,
    } from "@popperjs/core";
    import { VirtualElement } from "@utils/dom";
    let classList: string = "";
    export { classList as class };
    export let style: string = "";
    export let popper: Instance;
    export let reference: HTMLElement | MouseEvent;
    export let modifiers = [];
    export let placement: Placement = "auto";
    export let strategy: PositioningStrategy = "absolute";
    export let use: (node: Element) => any = () => {};
    let element: HTMLDivElement;
    $: if (!reference && element) reference = element.parentElement;
    $: if (element) {
        const refElement =
            reference instanceof HTMLElement
                ? reference
                : new VirtualElement(reference);
        popper = createPopper(refElement, element, {
            modifiers,
            placement,
            strategy,
        });
        popper.update();
    }
    $: if (popper && element) {
        popper.state.elements.reference =
            reference instanceof HTMLElement
                ? reference
                : new VirtualElement(reference);
        popper.update();
    }
    onDestroy(() => popper.destroy());
    export async function update() {
        return await popper.update();
    }
</script>

<div bind:this={element} use:use class={classList} {style}>
    <slot />
</div>

<style>
</style>
