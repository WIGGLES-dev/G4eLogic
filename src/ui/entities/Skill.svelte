<script>
  import { getContext } from "svelte";
  import { string } from "@ui/utils/formatting";
  import Toggle from "./Toggle";

  export let i;
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
</style>

{#if exists}
  {#if display === 'table'}
    <td><input class="w-12" type="text" bind:value={$entity.reference} /></td>
    <td>
      {#if !entity.isContainer()}
        <input
          class="text-center w-10"
          type="number"
          bind:value={$entity.points} />
      {/if}
    </td>
    <td class="text-center">
      {$entity.signature || '10'}{$relativeLevel$ > -1 ? '+' : ''}{Math.floor($relativeLevel$)}
    </td>
    <td>
      <input class="w-10 text-center" type="number" bind:value={$entity.mod} />
    </td>
    <td class="text-center">{Math.floor($level$)}</td>
    <td class="w-full">
      <span class="h-full" style="padding-left:{depth * 2}rem;">&thinsp;</span>
      <Toggle
        visible={$entity.ui.canContainChildren}
        bind:toggled={$entity.ui.hidden} />
      {string($entity.name)}{string($entity.techLevel, {
        beforeStart: '/',
        toFixed: false,
      })}
      {#if $entity.specialization}
        {string($entity.specialization, { beforeStart: ' (', afterEnd: ')' })}
      {/if}
    </td>
  {/if}
{/if}
