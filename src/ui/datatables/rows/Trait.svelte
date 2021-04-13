<script lang="ts">
    import { getContext } from "svelte";
    import type { TreeNode } from "@components/Tree/Tree.svelte";
    import Toggle from "@components/Toggle.svelte";
    import { Character } from "@internal";
    import { pluck } from "rxjs/operators";
    import { getEditorContext } from "@ui/editors/Editor.svelte";
    const { processed$ } = getEditorContext<Character>();
    export let node: TreeNode;
    $: ({ isContainer$, showingChildren$, state, id } = node);
    $: type = $state.type as "skill" | "technique" | "spell";
    $: isContainer = $isContainer$;
    $: showingChildren = $showingChildren$;
    $: embed = processed$.pipe(pluck("embedded", "trait", id));
    $: points = $embed?.adjustedPoints;
</script>

<td>
    <div class="flex" style="padding-left:{node.indent * 30 + 15}px">
        {#if isContainer}
            <Toggle
                bind:toggled={$showingChildren$}
                class="text-red-700 px-1"
            />
        {/if}
        <input type="text" class="flex-1" bind:value={$state.name} />
    </div>
</td>
<td>
    {#if $state.hasLevels}
        <input type="number" bind:value={$state.levels} />
    {/if}
</td>
<td>
    {#if typeof points === "number"}
        {points}
    {/if}
</td>
<td contenteditable="true" bind:textContent={$state.reference} />
