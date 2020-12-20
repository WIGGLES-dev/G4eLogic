<script>
  import { getContext } from "svelte";

  import Toggle from "./Toggle";
  import { ControlRating, string } from "@internal";

  export let depth;
  export let entity = {};
  $: ({ adjustedPoints$, exists, id, disabled, hidden } = entity);
  export let display = "table";
</script>

<style>
</style>

{#if exists}
  {#if display === 'table'}
    <td>
      <div class="flex">
        <span
          class="h-full"
          style="padding-left:{depth * 2}rem;">&thinsp;</span>
        <Toggle
          visible={$entity.ui.canContainChildren}
          bind:off={$entity.ui.hidden} />
        <input type="text" class="truncate flex-1" bind:value={$entity.name} />

        {#if ![undefined, 'n/a'].includes($entity.controlRating)}
          <span
            class="cell-click p-1 mx-1"
            on:click={() => entity.executeAction('roll', {
                for: 'control rating',
              })}>{$entity.controlRating}</span>
        {/if}
        {#if $entity.categories instanceof Array && $entity.categories.length > 0}
          <span class="fas fa-user-tag bg-g text-gray-700" />
        {/if}
      </div>
    </td>
    <td>
      <input
        type="number"
        class="w-6 text-center"
        bind:value={$entity.levels}
        disabled={!$entity.hasLevels} />
    </td>
    <td class="text-center">{string($adjustedPoints$)}</td>
    <td>
      <input
        class="w-10 text-center"
        type="text"
        bind:value={$entity.reference} />
    </td>
  {/if}
{/if}
