<script lang="ts">
    import type { TreeNode } from "@components/Tree.svelte";
    export let node: TreeNode;
    $: ({ isContainer$, showingChildren$, state, id } = node);
    $: type = $state.type;

    $: enabled = state.sub("enabled");
    $: name = state.sub("name");
    $: reference = state.sub("reference");
</script>

<td>
    <input type="checkbox" bind:checked={$enabled} />
</td>
<td contenteditable="true" bind:textContent={$name} />
{#if type === "trait modifier"}
    <td>
        <!--  -->
    </td>
{:else if type === "equipment modifier"}
    <td>
        <!--  -->
    </td>
    <td>
        <!--  -->
    </td>
{/if}
<td contenteditable="true" bind:textContent={$reference} />
