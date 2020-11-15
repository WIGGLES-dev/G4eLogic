<script>
  import { getContext } from "svelte";
  import { string } from "@ui/utils/formatting";
  import { TraitModifierType, TraitModifierAffects } from "@internal";
  
  export let entity = null;

  const { display, config } = getContext("list");
</script>

<style>
</style>

{#if $display === 'table'}
  <td><input type="checkbox" bind:value={entity.enabled} /></td>
  <td>
    <div>{string(entity.name)}</div>
    <div class="italic text-sm">{string(entity.notes)}</div>
  </td>
  <td>
    {#if entity.type === TraitModifierType.points}
      +
    {:else if entity.type === TraitModifierType.multiplier}x{/if}
    {entity.costModifier()}
    {#if entity.type === TraitModifierType.percentage}%{/if}
  </td>
  <td class="w-full"><input type="text" bind:value={entity.reference} /></td>
{/if}
