<script>
  import { getContext } from "svelte";
  import { string } from "@ui/utils/formatting";
  import Toggle from "./Toggle";
  export let depth;
  export let entity = {};
  $: ({
    equipped$,
    extendedValue$,
    extendedWeight$,
    exists,
    id,
    disabled,
    hidden,
  } = entity);
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
    <td>
      <input
        type="checkbox"
        on:change={(e) => entity.update((entity) => {
            entity.keys.disabled = !e.target.checked;
          })}
        checked={$equipped$} />
    </td>
    <td><input class="w-10" type="number" bind:value={$entity.quantity} /></td>
    <td class="w-full">
      <div class="flex">
        <span
          class="h-full"
          style="padding-left:{depth * 2}rem;">&thinsp;</span>
        <Toggle
          visible={$entity.ui.canContainChildren}
          bind:off={$entity.ui.hidden} />
        <input class="flex-1" type="text" bind:value={$entity.name} />
      </div>
    </td>
    <td>
      <input class="w-10" type="number" bind:value={$entity.uses} min="0" />
    </td>
    <td>
      <input type="number" class="w-12" min="0" bind:value={$entity.value} />
    </td>
    <td>
      <input type="number" class="w-12" min="0" bind:value={$entity.weight} />
    </td>
    <td>{string($extendedValue$, { beforeStart: '$' })}</td>
    <td>{string($extendedWeight$, { afterEnd: ' lb.' })}</td>
    <td><input class="w-12" type="text" bind:value={$entity.reference} /></td>
  {:else if display === 'list'}<span>{$entity.name}</span>{/if}
{/if}
