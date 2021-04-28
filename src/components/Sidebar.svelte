<script context="module" lang="ts">
    export interface SidebarItem {
        enabled: boolean;
        image: string;
        label: string;
        click: () => void;
    }
</script>

<script lang="ts">
    import { createEventDispatcher, onMount, tick } from "svelte";
    import { slide, fly } from "svelte/transition";
    import { toTop } from "@utils/use";
    import { longSwipeLeft$, longSwipeRight$ } from "@internal";
    const dispatch = createEventDispatcher();
    let classList = "";
    export let style = "";
    export { classList as class };
    export let collapsed = true;
    export let offset: number;
    export async function collapse() {
        await tick();
        collapsed = true;
    }
    export async function expand() {
        await tick();
        collapsed = false;
    }
    export async function toggle() {
        await tick();
        collapsed = !collapsed;
    }
    $: if ($longSwipeRight$) {
        expand();
    }
    $: if ($longSwipeLeft$) {
        collapse();
    }
</script>

{#if !collapsed}
    <aside
        bind:clientWidth={offset}
        use:toTop
        transition:fly
        class="sidebar {classList}"
        {style}
    >
        <slot {collapse} {expand} />
    </aside>
{/if}

<style lang="postcss">
    .sidebar {
        @apply fixed top-0 h-screen bg-gray-500;
        z-index: 300;
        touch-action: none;
    }
</style>
