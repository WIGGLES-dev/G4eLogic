<script>
  import { getContext } from "svelte";
  import { fixed6 } from "@ui/utils/formatting";

  export let entity = null;
  export let depth;

  const { display, config } = getContext("list");
  const {
    components: { contextMenu, modals },
  } = getContext("app");

  const contextMenuOptions = [{}];
</script>

<style>
  .hidden {
    @apply hidden;
  }
</style>

{#if $display === 'table'}
  <td><input type="checkbox" bind:checked={entity.equipped} /></td>
  <td><input class="w-10" type="number" bind:value={entity.quantity} /></td>
  <td class="w-full">
    <div class="flex">
      <span class="h-full" style="padding-left:{depth * 2}rem;">&thinsp;</span>
      <span
        data-container-toggle
        on:click={() => (entity.isOpen = !entity.isOpen)}
        class="fas text-red-700"
        class:fa-angle-right={!entity.isOpen}
        class:fa-angle-down={entity.isOpen}
        class:hidden={!entity.isContainer()} />
      <input class="flex-1" type="text" bind:value={entity.name} />
    </div>
  </td>
  <td><input class="w-10" type="number" bind:value={entity.uses} min="0" /></td>
  <td>
    <input type="number" class="w-12" min="0" bind:value={entity.value} />
  </td>
  <td>
    <input type="number" class="w-12" min="0" bind:value={entity.weight} />
  </td>
  <td>${fixed6(entity.extendedValue())}</td>
  <td>{fixed6(entity.extendedWeight())} lb.</td>
  <td><input class="w-12" type="text" bind:value={entity.reference} /></td>
{:else if $display === 'list'}
  <span>{entity.name}</span>
{:else if $display === 'grid'}
  <div style="padding-left:{entity.getItemDepth() * 10}px">{entity.name}</div>
{/if}
