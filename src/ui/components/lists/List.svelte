<script>
  import { setContext, createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import ContextMenu from "../context-menu/ContextMenu.svelte";

  import ListItem from "./ListItem";

  export let display = "table";

  let defaultConfig = { flat: false, addItem: true };
  export let config = {};
  config = Object.assign(defaultConfig, config);

  export let title = null;

  export let component = null;
  export let editor = null;
  export let list = [];

  export let selected = writable(null);

  const dispatch = createEventDispatcher();
  setContext("list", {
    display: writable(display),
    component: writable(component),
    editor: writable(editor),
    headers: writable(0),
    length: writable(0),
    config: writable(config),
    selected,
  });
</script>

<style>
  table :global(td) {
  }
  thead :global(th) {
    @apply bg-gray-700 text-white text-lg px-3;
  }
  tbody :global(tr):nth-child(even) {
    @apply bg-gray-100;
  }
</style>

<section
  class:mx-4={display === 'table'}
  class="select-none mb-2 border-b border-gray-700 border-solid rounded-r-md"
  class:border-red-700={config.addItem}
  on:contextmenu={(e) => e.preventDefault()}
  data-list-type={display}>
  {#if display === 'table'}
    <table class="text-sm whitespace-no-wrap text-left">
      <caption />
      <slot name="colgroup" />
      <thead>
        <slot name="header" />
      </thead>
      <tbody>
        {#each list as entity, i (entity.id)}
          <ListItem {entity} {i} on:select={(e) => selected.set(e.detail)} />
        {/each}
      </tbody>
      <tfoot>
        <slot name="footer" />
      </tfoot>
    </table>
  {:else if display === 'list'}
    <div class="bg-gray-700 text-center text-white">{title}</div>
    <ul class="pb-1">
      {#each list as entity, i (entity.id)}
        <ListItem {entity} />
      {/each}
    </ul>
  {:else if display === 'grid'}
    <div class="w-full">{title}</div>
    <slot />
    {#each list as entity, i (entity.id)}
      <ListItem {entity} />
    {/each}
  {/if}
  {#if config.addItem}
    <div class="flex w-full relative">
      <span
        class="fas fa-plus text-red-700 hover:bg-red-700 hover:text-white p-1"
        on:click={() => dispatch('additem')} />
    </div>
  {/if}
</section>
