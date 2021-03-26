<script context="module" lang="ts">
    export interface SidebarItem {
        enabled: boolean;
        image: string;
        label: string;
        click: () => void;
    }
</script>

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let items: SidebarItem[] = [];
    function itemStyle(item: SidebarItem): string {
        return `
            background: ${item.image};
        `;
    }
    export let width: string;
    let classList: string;
    export { classList as class };
    $: style = `width: ${width};`;
    let collapsed = false;
    function collapse() {
        collapsed = true;
    }
    function expand() {
        collapsed = false;
    }
</script>

{#if collapsed}
    <!--  -->
{:else}
    <aside class="sidebar {classList}" {style}>
        <slot name="top" {collapse} {expand} />
        <div class="py-2 flex-1">
            <slot {collapse} {expand} />
        </div>
        <slot name="bottom" {collapse} {expand} />
    </aside>
{/if}

<style lang="postcss">
    .sidebar {
        @apply h-full flex flex-col;
    }
</style>
