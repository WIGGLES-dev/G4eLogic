<script>
  import { getContext } from "svelte";
  import {} from "@ui/utils/formatting";
  import { Number, Text, Select, Option, OptGroup, Checkbox } from "@ui/index";
  import {
    TraitModifierType,
    TraitModifierAffects,
  } from "@character/trait/trait";
  export let entity = null;
  const { display, config } = getContext("list");
</script>

<style>
</style>

{#if $display === 'table'}
  <td>
    <Checkbox bind:checked={$entity.enabled} />
  </td>
  <td>
    <div class="table-cell-inner">{$entity.name}</div>
  </td>
  <td>
    <div class="table-cell-inner">{$entity.costModifier()}</div>
  </td>
  <td>
    <div class="table-cell-inner">
      <Text bind:value={$entity.reference} />
    </div>
  </td>
{/if}
