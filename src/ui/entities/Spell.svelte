<script>
  import { getContext } from "svelte";
  import { string, formatRSL } from "@ui/utils/formatting";
  import Toggle from "./Toggle";

  export let depth;
  export let entity = {};
  $: ({ level$, relativeLevel$, exists, id, disabled, hidden } = entity);
  export let display = "table";
  export let addItem = false;
  export let list = [];
  export let getRoot = (list) => list;
  export let accessChildren = () => [];
  export let contextMenuOptions = () => [];
  export let component = null;
</script>

<style>
  .hidden {
    @apply hidden;
  }
</style>

{#if exists}
  {#if display === 'table'}
    <td><input class="w-12" type="text" bind:value={$entity.reference} /></td>
    <td><input class="w-10" type="number" bind:value={$entity.points} /></td>
    <td>
      {$entity.signature || '10'}{$relativeLevel$ > -1 ? '+' : ''}{Math.floor($relativeLevel$)}
    </td>
    <td><input type="number" bind:value={$entity.mod} /></td>
    <td>{Math.floor($level$)}</td>
    <td>
      <div class="flex">
        <span
          class="h-full"
          style="padding-left:{depth * 2}rem;">&thinsp;</span>
        <Toggle
          visible={$entity.ui.canContainChildren}
          bind:toggled={$entity.ui.hidden} />
        <input class="flex-1" type="text" bind:value={$entity.name} />
      </div>
    </td>
    <td><input type="text" class="w-24" bind:value={$entity.resist} /></td>
    <td><input type="text" class="w-24" bind:value={$entity.class} /></td>
    <td><input type="text" class="w-24" bind:value={$entity.castingCost} /></td>
    <td>
      <input type="Text" class="w-24" bind:value={$entity.maintenanceCost} />
    </td>
    <td><input type="text" class="w-24" bind:value={$entity.castingTime} /></td>
    <td><input type="text" class="w-24" bind:value={$entity.duration} /></td>
  {/if}
{/if}
