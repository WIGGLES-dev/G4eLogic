<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import ListItem from "./ListItem";

  export let display = "table";
  export let addItem = false;
  export let draggable = false;
  export let list = [];
  export let getRoot = (list) => list;
  export let accessChildren = () => [];
  export let component = null;

  $: root = getRoot(list);

  $: props = {
    display,
    addItem,
    draggable,
    list,
    getRoot,
    accessChildren,
    component,
  };
</script>

<style>
  table :global(input) {
    @apply bg-transparent outline-none;
  }
  table
    :global(input::-webkit-outer-spin-button, input::-webkit-inner-spin-button) {
    @apply m-0;
    -webkit-appearance: none;
  }
  thead :global(th) {
    @apply text-gray-700 mr-2;
  }
  thead {
    @apply border-b border-gray-700 border-solid rounded-r-md;
  }
</style>

<section
  class="mx-4 select-none mb-2 mt-2 border-b border-gray-700 border-solid rounded-r-md"
  class:border-red-700={addItem}
  on:contextmenu={(e) => e.preventDefault()}>
  {#if display === 'table'}
    <table class="text-sm whitespace-no-wrap text-left">
      <caption />
      <slot name="colgroup" />
      <thead>
        <slot name="header" />
      </thead>
      <tbody>
        {#each root as entity, i (entity.id || i)}
          <ListItem {...props} {entity} {i} />
        {/each}
        <slot />
      </tbody>
      <tfoot>
        <slot name="footer" />
      </tfoot>
    </table>
  {:else if display === 'list'}
    <slot name="title" />
    <ul class="pb-1">
      {#each root as entity, i (entity.id || i)}
        <ListItem {...props} {entity} {i} />
        <slot />
      {/each}
    </ul>
  {/if}
  {#if addItem}
    <div class="flex w-full relative">
      <span
        class="fas fa-plus text-red-700 hover:bg-red-700 hover:text-white p-1"
        on:click={() => dispatch('additem')} />
    </div>
  {/if}
</section>
