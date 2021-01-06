<script context='module' lang='ts'>
    export interface SidebarItem {
        enabled: boolean
        image: string
        label: string
        click: () => void
    }
</script>
<script lang='ts'>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let items: SidebarItem[] = [];
    function itemStyle(item : SidebarItem): string {
        return `
            background: ${item.image};
        `
    }
    export let width: string;
    $: style = `width: ${width};`
</script>

<style>
    .sidebar {
        @apply bg-gray-700 h-full flex flex-col;
    }
    .sidebar-item {
        @apply p-3 bg-red-700;
    }
</style>

<section class='sidebar' {style}>
    <div>
        <slot name='top'> </slot>
    </div>
    <div class="py-2 flex-1">
        <slot>
            <div class="flex-1">
                {#each items as item}
                    <div class='sidebar-item' draggable={item.enabled} style={itemStyle(item)} on:click={item.click}>
                        {item.label}
                    </div>
                {/each}
            </div>
        </slot>
    </div>
    <div>
        <slot name='bottom'> </slot>
    </div>
</section>