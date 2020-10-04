<script>
  import { setContext, createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import ContextMenu from "../context-menu/ContextMenu.svelte";

  import ListItem from "./ListItem";

  export let display = "table";
  export let config = {
    flat: false,
  };
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
  class="select-none"
  on:contextmenu={(e) => e.preventDefault()}
  data-list-type={display}>
  {#if display === 'table'}
    <table class="text-sm whitespace-no-wrap text-left mx-4">
      <caption>
        <div class="flex relative">
          <div class="flex-1 text-center">&ThinSpace;</div>
          <div class="absolute right-0 mr-2">
            <span
              class="fas fa-plus text-gray-700"
              on:click={() => dispatch('additem')} />
          </div>
        </div>
      </caption>
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
    <div>{title}</div>
    <ul>
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
</section>
