<script>
  import { getContext } from "svelte";
  import { string } from "@ui/utils/formatting";

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
      <input type="text" class="truncate flex-1" bind:value={entity.name} />
      {#if entity.categories.size > 0}
        <span class="fas fa-user-tag bg-g text-gray-700" />
      {/if}
    </div>
  </td>
  <td>
    <input
      type="number"
      class="w-6 text-center"
      bind:value={entity.levels}
      disabled={!entity.hasLevels} />
  </td>
  <td class="text-center">{string(entity.adjustedPoints())}</td>
  <td>
    <input class="w-10 text-center" type="text" bind:value={entity.reference} />
  </td>
{:else if $display === 'grid'}
  <div
    data-offset
    data-column="name"
    data-main
    class="flex-1 pl-3 pl-{depth * 5}">
    {string(entity.name, {
      afterEnd: string(entity.hasLevels ? entity.levels : null),
    })}
  </div>
  <div data-column="pts" class="w-1/12">{string(entity.adjustedPoints())}</div>
  <div data-column="ref" class="w-1/12">{string(entity.reference)}</div>
{/if}
