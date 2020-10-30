<script>
  import { getContext } from "svelte";
  import { formatRSL, string } from "@ui/utils/formatting";

  export let entity = null;
  export let depth;

  const { display, config } = getContext("list");

  $: invalidPoints = !pointsValid(entity.points);

  function pointsValid(points) {
    return true;
    return points === 1 || points === 2 || points % 4 === 0;
  }
</script>

<style>
  .invalid {
    @apply text-white bg-red-700;
  }
  .hidden {
    @apply hidden;
  }
</style>

{#if $display === 'table'}
  <td><input class="w-12" type="text" bind:value={entity.reference} /></td>
  <td>
    {#if !entity.isContainer()}
      <input
        class="text-center w-10"
        class:invalid={invalidPoints}
        type="number"
        bind:value={entity.points} />
    {/if}
  </td>
  <td class="text-center">{formatRSL(entity)}</td>
  <td>
    <input class="w-10 text-center" type="number" bind:value={entity.mod} />
  </td>
  <td class="text-center">{string(entity.calculateLevel(), { toFixed: 0 })}</td>
  <td class="w-full">
    <span class="h-full" style="padding-left:{depth * 2}rem;">&thinsp;</span>
    <span
      data-container-toggle
      on:click={() => (entity.isOpen = !entity.isOpen)}
      class="fas text-red-700"
      class:fa-angle-right={!entity.isOpen}
      class:fa-angle-down={entity.isOpen}
      class:hidden={!entity.isContainer()} />

    {string(entity.name)}{string(entity.techLevel, {
      beforeStart: '/',
      toFixed: false,
    })}
    {#if entity.specialization}
      {string(entity.specialization, { beforeStart: ' (', afterEnd: ')' })}
    {/if}
  </td>
{/if}
