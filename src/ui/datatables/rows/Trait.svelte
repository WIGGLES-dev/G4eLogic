<script lang="ts">
    import { getContext } from "svelte";
    import type { TreeNode } from "@components/Tree.svelte";
    import Toggle from "@components/Toggle.svelte";
    import { Character } from "@internal";
    import { pluck } from "rxjs/operators";
    import { getEditorContext } from "@app/ui/Editor.svelte";
    const { processed$ } = getEditorContext<Character>();
    export let node: TreeNode;
    $: ({ isContainer$, showingChildren$, state, id, indent } = node);
    $: type = $state.type as "skill" | "technique" | "spell";
    $: isContainer = $isContainer$;
    $: showingChildren = $showingChildren$;
    $: embed = processed$.pipe(pluck("embedded", "trait", id));
    $: points = $embed?.adjustedPoints;

    $: name = state.sub("name");
    $: levels = state.sub("levels");
    $: reference = state.sub("reference");
</script>

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
<td>
    {#if $state.hasLevels}
        <input type="number" bind:value={$levels} />
    {/if}
</td>
<td>
    {#if typeof points === "number"}
        {points}
    {/if}
</td>
<td contenteditable="true" bind:textContent={$reference} />
