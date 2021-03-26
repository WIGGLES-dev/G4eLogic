<script context="module" lang="ts">
    import { createEventDispatcher } from "svelte";
    import Menu, { MenuOption } from "./Menu.svelte";
    import Cell from "@components/Value.svelte";
    import { safeCall } from "@utils/object";
</script>

<script lang="ts">
    export let label: any;
    export let callback = () => {};
    export let show = () => true;
    export let interactive = false;
    let classList: string = "";
    export { classList as class };
    export let style: string = "";
    export let options: MenuOption[];
    const dispatch = createEventDispatcher();
    function click(e: MouseEvent) {
        safeCall(callback);
        if (!interactive) dispatch("close");
    }
    let reference: HTMLLIElement;
    let rendered = false;
</script>

{#if safeCall(show)}
    <li
        class="{classList} p-1 flex hover:shadow-inner hover:bg-gray-300 text-sm items-center "
        {style}
        on:click|capture={click}
        on:mouseenter={(e) =>
            options instanceof Array ? (rendered = true) : undefined}
        on:mouseleave={(e) => (rendered = false)}
        bind:this={reference}
    >
        <Cell value={label} {...label} />
        {#if options instanceof Array}
            <span class="fas fa-caret-right text-gray-500 text-sm px-2" />
        {/if}
        <Menu {reference} {options} on:close {rendered}>
            <slot />
        </Menu>
    </li>
{/if}

<style>
</style>
