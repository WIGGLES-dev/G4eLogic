<script>
  import { getContext } from "svelte";
  import { string } from "@ui/utils/formatting";

  export let entity = null;
  const { level$, relativeLevel$ } = entity;
  export let depth;

  const { display, config } = getContext("list");
</script>

<style>
  .invalid {
    @apply text-white bg-red-700;
  }
  .hidden {
    @apply hidden;
  }
</style>

{#if entity.exists}
  {#if $display === 'table'}
    <td>
      <input class="w-12" type="text" bind:value={$entity.keys.reference} />
    </td>
    <td>
      {#if !entity.isContainer()}
        <input
          class="text-center w-10"
          type="number"
          bind:value={$entity.keys.points} />
      {/if}
    </td>
    <td class="text-center">
      {$entity.keys.signature || '10'}{$relativeLevel$ > -1 ? '+' : ''}{Math.floor($relativeLevel$)}
    </td>
    <td>
      <input
        class="w-10 text-center"
        type="number"
        bind:value={$entity.keys.mod} />
    </td>
    <td class="text-center">{Math.floor($level$)}</td>
    <td class="w-full">
      <span class="h-full" style="padding-left:{depth * 2}rem;">&thinsp;</span>
      <span
        data-container-toggle
        on:click={() => (entity.isOpen = !entity.isOpen)}
        class="fas text-red-700"
        class:fa-angle-right={!entity.isOpen}
        class:fa-angle-down={entity.isOpen}
        class:hidden={!entity.isContainer()} />

      {string($entity.keys.name)}{string($entity.keys.techLevel, {
        beforeStart: '/',
        toFixed: false,
      })}
      {#if $entity.keys.specialization}
        {string($entity.keys.specialization, {
          beforeStart: ' (',
          afterEnd: ')',
        })}
      {/if}
    </td>
  {/if}
{/if}
