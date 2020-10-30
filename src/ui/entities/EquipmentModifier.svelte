<script>
  import { getContext } from "svelte";
  import { string } from "@ui/utils/formatting";

  export let entity = null;
  const { display, config } = getContext("list");
</script>

<style>
</style>

{#if $display === 'table'}
  <td><input type="checkbox" bind:checked={entity.enabled} /></td>
  <td>{string(entity.name)}</td>
  <td>{string(entity.techLevel)}</td>
  <td>{string(entity.costType)}</td>
  <td>{string(entity.weightType)}</td>
  <td class="w-full"><input type="text" bind:value={entity.reference} /></td>
{/if}
