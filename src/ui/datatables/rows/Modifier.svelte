<script lang="ts">
    import type { TreeNode } from "@components/Tree/Tree.svelte";
    export let node: TreeNode;
    $: ({ isContainer$, showingChildren$, state, id } = node);
    $: type = $state.type;
</script>

<td>
    <input type="checkbox" bind:checked={$state.enabled} />
</td>
<td contenteditable="true" bind:textContent={$state.name} />
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
<td contenteditable="true" bind:textContent={$state.reference} />
