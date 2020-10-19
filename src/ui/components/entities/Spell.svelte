<script>
  import { getContext } from "svelte";
  import { string, formatRSL } from "@ui/utils/formatting";

  export let entity = null;
  export let depth;
  const { display, config } = getContext("list");
</script>

<style>
  .hidden {
    @apply hidden;
  }
</style>

{#if $display === 'table'}
  <td>
    <div class="flex">
      <span class="h-full" style="padding-left:{depth * 2}rem;">&thinsp;</span>
      <span
        data-container-toggle
        on:click={() => (entity.isOpen = !entity.isOpen)}
        class="fas text-red-700"
        class:hidden={!entity.isContainer()}
        class:fa-angle-right={!entity.isOpen}
        class:fa-angle-down={entity.isOpen} />
      <input class="flex-1" type="text" bind:value={entity.name} />
    </div>
  </td>
  <td><input type="text" class="w-24" bind:value={entity.resist} /></td>
  <td><input type="text" class="w-24" bind:value={entity.class} /></td>
  <td><input type="text" class="w-24" bind:value={entity.castingCost} /></td>
  <td>
    <input type="Text" class="w-24" bind:value={entity.maintenanceCost} />
  </td>
  <td><input type="text" class="w-24" bind:value={entity.castingTime} /></td>
  <td><input type="text" class="w-24" bind:value={entity.duration} /></td>
  <td>{string(entity.calculateLevel(), { toFixed: 0 })}</td>
  <td>{formatRSL(entity)}</td>
  <td>
    {#if !entity.isContainer()}
      <input class="w-10" type="number" bind:value={entity.points} />
    {/if}
  </td>
  <td><input class="w-12" type="text" bind:value={entity.reference} /></td>
{/if}
