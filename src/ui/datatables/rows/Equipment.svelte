<script lang="ts">
    import { System } from "@app/system";
    import Toggle from "@components/Toggle.svelte";
    import type { TreeNode } from "@components/Tree.svelte";
    import { pluck } from "rxjs/operators";
    import { Character } from "@internal";
    import { getEditorContext } from "@app/ui/Editor.svelte";
    const { processed$ } = getEditorContext<Character>();
    export let node: TreeNode;
    $: ({ isContainer$, showingChildren$, state, id, indent } = node);
    $: isContainer = $isContainer$;
    $: showingChildren = $showingChildren$;
    $: embed = processed$.pipe(pluck("embedded", "equipment", id));
    $: containedWeight = +$embed?.containedWeight?.toFixed(3);
    $: containedValue = +$embed?.containedValue?.toFixed(3);

    $: enabled = state.sub("enabled");
    $: quantity = state.sub("quantity");
    $: name = state.sub("name");
    $: uses = state.sub("uses");
    $: maxUses = state.sub("maxUses");
    $: value = state.sub("value");
    $: weight = state.sub("weight");
    $: reference = state.sub("reference");
</script>

<td class="px-0">
    <input type="checkbox" bind:checked={$enabled} />
</td>
<td>
    {#if !isContainer}
        <input type="number" bind:value={$quantity} />
    {/if}
</td>
<td>
    <div
        class="flex"
        style="padding-left:{indent * 8 + (isContainer ? 0 : 16)}px"
    >
        {#if isContainer}
            <Toggle
                bind:toggled={$showingChildren$}
                class="text-red-700 px-1"
            />
        {/if}
        <input type="text" class="flex-1" bind:value={$name} />
    </div>
</td>
<td
    class="text-center"
    on:click={(e) => uses.verified(({ value }) => value <= $maxUses).add(1)}
    on:contextmenu|preventDefault|stopPropagation={(e) =>
        uses.verified(({ value }) => value >= 0).subtract(1)}
>
    {#if $maxUses > 0}
        <span>
            {$uses || 0}/{$maxUses}
        </span>
    {/if}
</td>
<td>
    <input type="number" bind:value={$value} />
</td>
<td>
    <input type="number" bind:value={$weight} />
</td>
<td>
    {#if containedValue > 0}
        {containedValue}
    {/if}
</td>
<td>
    {#if containedWeight > 0}
        {containedWeight}
    {/if}
</td>
<td contenteditable="true" bind:textContent={$reference} />

<style lang="postcss">
    input[type="number"] {
        min-width: 4rem;
    }
</style>
