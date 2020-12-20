<script>
  import { getContext } from "svelte";
  import { string } from "@internal";

  import AttributeOptions from "@ui/options/AttributeOptions";
  import DifficultyOptions from "@ui/options/DifficultyOptions.svelte";
  import Toggle from "./Toggle";
  import { FeatureType } from "@internal";

  export let depth;
  export let entity = {};
  $: ({
    metadata$,
    level$,
    relativeLevel$,
    exists,
    id,
    disabled,
    hidden,
  } = entity);

  export let display = "table";
</script>

<style>
</style>

{#if exists}
  {#if display === 'table'}
    <td><input class="w-12" type="text" bind:value={$entity.reference} /></td>
    <td>
      <input
        class="text-center w-10"
        type="number"
        bind:value={$entity.points} />
    </td>
    <td>
      <DifficultyOptions bind:difficulty={$entity.difficulty} />
    </td>
    <td>
      <AttributeOptions
        {entity}
        signaturesOnly={true}
        bind:attribute={$entity.signature} />
    </td>
    <td class="text-center">
      {$relativeLevel$ > -1 ? '+' : ''}{Math.floor($relativeLevel$)}
    </td>
    <td>
      <input class="w-10 text-center" type="number" bind:value={$entity.mod} />
    </td>
    <td
      on:click={() => entity.executeAction('roll', { for: 'skill' })}
      class="text-center cell-click">
      {Math.floor($level$)}
    </td>
    <td class="w-full">
      <span class="h-full" style="padding-left:{depth * 2}rem;">&thinsp;</span>
      <Toggle
        visible={$entity.ui.canContainChildren}
        bind:off={$entity.ui.hidden} />
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
