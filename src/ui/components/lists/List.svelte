<script>
  import { setContext, createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import ContextMenu from "../context-menu/ContextMenu.svelte";

  import ListItem from "./ListItem";

  export let display = "table";
  export let config = {};
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
    config: writable(config),
    selected,
  });
</script>

<style>
  section {
    user-select: none;
  }
  caption {
    padding: 5px;
    border-bottom: 2px solid white;
  }
  thead :global(th) {
    padding: 3px;
  }
  :global(td) {
    padding: 0px;
  }
  :global(.table-cell-inner) {
    padding: 3px;
  }
  :global(.main-col) {
    width: 100%;
  }
  :global(.table-cell-inner) {
    display: flex;
  }
  .table-caption-inner {
    position: relative;
    display: flex;
  }
  .table-title {
    text-align: center;
    flex: 1;
  }
  .table-tools {
    position: absolute;
    max-width: 30%;
    right: 0;
  }
</style>

{#if display === 'table'}
  <section on:contextmenu={(e) => e.preventDefault()}>
    <table>
      <caption>
        <div class="table-caption-inner">
          <div class="table-title">{title}</div>
          <div class="table-tools">
            <span
              class="tool fas fa-plus"
              on:click={() => dispatch('additem')} />
          </div>
        </div>
      </caption>
      <colgroup>
        <slot name="colgroup" />
      </colgroup>
      <thead>
        <slot name="header" />
      </thead>
      {#each list as entity, i (entity.id)}
        <ListItem {entity} on:select={(e) => selected.set(e.detail)} />
      {/each}
      <tfoot>
        <slot name="footer" />
      </tfoot>
    </table>
  </section>
{:else if display === 'list'}
  <section>
    <div>{title}</div>
    <ul>
      {#each list as entity, i (entity.id)}
        <ListItem {entity} />
      {/each}
    </ul>
  </section>
{:else if display === 'grid'}
  <section>
    <div>{title}</div>
    <div
      style="
        display: grid;
        grid-auto-flow: row dense;
        grid-template-columns: repeat({config.templateColumns || '5'}, 1fr);
      ">
      {#each list as entity, i (entity.id)}
        <ListItem {entity} />
      {/each}
    </div>
  </section>
{/if}
