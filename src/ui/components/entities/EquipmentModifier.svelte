<script>
  import { getContext } from "svelte";
  import {} from "@ui/utils/formatting";
  import { Number, Text, Select, Option, OptGroup, Checkbox } from "@ui/index";

  export let entity = null;
  const { display, config } = getContext("list");
</script>

<style>
</style>

{#if $display === 'table'}
  <td><input type="checkbox" bind:checked={$entity.enabled} /></td>
  <td>{$entity.name}</td>
  <td>{$entity.techLevel}</td>
  <td>{$entity.costType}</td>
  <td>{$entity.weightType}</td>
  <td class="w-full"><input type="text" bind:value={$entity.reference} /></td>
{/if}
