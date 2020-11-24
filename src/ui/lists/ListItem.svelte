<script lang="ts">
  import { resolveWeights, Feature } from "@internal";

  export let entity = {} as Feature;
  $: ({ exists = true, id, hidden = false, disabled = false } = entity);

  export let depth = 0;

  export let display = "table";
  export let addItem = false;
  export let draggable = false;
  export let list = [];
  export let getRoot = (list) => list;
  export let accessChildren = (entity) => [];
  export let component = null;

  $: props = {
    display,
    addItem,
    draggable,
    list,
    getRoot,
    accessChildren,
    component,
  };

  function handleOverToggle(e: MouseEvent) {
    const target = e.target as HTMLElement;
    try {
      if (target.matches("[data-container-toggle]")) {
        target.classList.add("text-3xl");
      } else {
        target
          .closest("[data-id]")
          .querySelector("[data-container-toggle]")
          .classList.remove("text-3xl");
      }
    } catch (err) {}
  }

  function onDragstart(e: DragEvent) {
    try {
      e.dataTransfer.setData("text/plain", id);
      resolveWeights(list);
    } catch (err) {
      console.log(err);
    }
  }

  function onDragenter(e: DragEvent) {
    const target = e.target as HTMLElement;
    try {
      const row = target.closest<HTMLElement>("[data-id]");
      if (row.dataset.id) e.preventDefault();
      handleOverToggle(e);
    } catch (err) {}
  }

  function onDrop(e) {
    try {
      const selectedId = e.dataTransfer.getData("text/plain");
      const isOnToggle = e.target.matches("[data-container-toggle]");
      if (entity.isContainer()) {
        entity.slot(entity.type, selectedId);
      }
      const target = entity.createThis(selectedId);
      resolveWeights(list, target, entity.listWeight);
      e.target.classList.remove("text-3xl");
    } catch (err) {
      console.log(err);
    }
  }
  function handleItemClick(e) {
    try {
      console.log(entity);
      if (e.target.matches("input")) return;
      e.target.closest("[data-id]").querySelector("input").focus();
    } catch (err) {}
  }
</script>

<style>
  tr > :global(td) {
    @apply relative border-b border-gray-300 border-solid px-2;
  }
  tr :global(td:not(:last-child)) {
    @apply border-r border-gray-300 border-solid;
  }
  .disabled > :global(td:before) {
    @apply border-b-2 border-solid border-red-700 absolute left-0 w-full mt-auto border-opacity-50 pointer-events-none;
    content: " ";
    top: 50%;
  }
  tr :global(div.flex .fas) {
    @apply self-center;
  }
  tr:nth-child(even) {
    @apply bg-gray-100;
  }
  tr:hover {
    @apply bg-gray-700 text-white;
  }
</style>

{#if exists}
  {#if display === 'table'}
    <tr
      data-id={id}
      {draggable}
      on:dragstart={onDragstart}
      on:dragenter={onDragenter}
      on:dragover={onDragenter}
      on:drop={onDrop}
      on:contextmenu={(e) => {
        entity.renderContextMenu(e);
      }}
      class:disabled
      on:click={handleItemClick}
      on:dblclick={(e) => {
        entity.edit();
      }}>
      <svelte:component this={component} {depth} {entity} {...props} />
      <slot {entity} />
    </tr>
    {#if !hidden}
      {#each accessChildren(entity) as entity, i (entity.id || i)}
        <svelte:self depth={depth + 1} {entity} {...props} />
      {/each}
    {/if}
  {:else if display === 'list'}
    <li
      on:contextmenu={(e) => {
        entity.renderContextMenu(e);
      }}
      on:dblclick={(e) => {
        entity.edit();
      }}>
      <svelte:component this={component} {depth} {entity} {...props} />
      <slot {entity} />
      {#if !hidden}
        <ul>
          {#each accessChildren(entity) as entity, i (entity.id || i)}
            <svelte:self depth={depth + 1} {entity} {...props} />
          {/each}
        </ul>
      {/if}
    </li>
  {/if}
{/if}
