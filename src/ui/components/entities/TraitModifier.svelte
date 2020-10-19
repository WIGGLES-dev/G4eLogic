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
    <Checkbox bind:checked={entity.enabled} />
  </td>
  <td>
    <div>{entity.name}</div>
    <div>{entity.notes}</div>
  </td>
  <td>
    {#if entity.type === TraitModifierType.points}
      +
    {:else if entity.type === TraitModifierType.multiplier}x{/if}
    {entity.costModifier()}
    {#if entity.type === TraitModifierType.percentage}%{/if}
  </td>
  <td class="w-full">
    <Text bind:value={entity.reference} />
  </td>
{/if}
