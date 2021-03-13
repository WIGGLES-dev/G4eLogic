<script context="module" lang="ts">
    import { createEventDispatcher } from "svelte";
</script>

<script lang="ts">
    const dispatch = createEventDispatcher();
    export let expanded = false;
</script>

<tr class="relative">
    <slot />
    <div class="absolute left-full" on:click={(e) => (expanded = !expanded)}>
        <slot name="toggle">
            <i class="fas fa-ellipsis-v text-2xl " />
        </slot>
    </div>
    <div class="absolute right-full" on:click={(e) => dispatch("delete")}>
        <slot name="delete">
            <i class="fas fa-trash text-xl hover:text-red-700" />
        </slot>
    </div>
    {#if expanded}
        <div class="absolute bottom-full">
            <slot name="expanded" />
        </div>
    {/if}
</tr>
