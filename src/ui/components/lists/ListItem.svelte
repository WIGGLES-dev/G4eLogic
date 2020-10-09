<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";

  export let entity = null;
  const proxy = entity;

  export let depth = 0;

  $: children = [...(entity.children || [])];

  const dispatch = createEventDispatcher();

  const {
    display,
    component,
    editor,
    headers,
    length,
    config,
    selected,
  } = getContext("list");

  const { components, character } = getContext("app");

  let dragover = false;

  function onContextMenu(e) {
    e.preventDefault();
    selected.set(entity);
    components.contextMenu.render({ contextMenuOptions, e });
  }

  function onDragstart(e) {
    e.dataTransfer.setData("text/plain", entity.id);
  }

  function onDragenter(e) {
    dragover = true;
    if (e.target.closest("[data-id]").dataset.id) e.preventDefault();
  }

  function onDrop(e) {
    const { id } = e.target.closest("[data-id]").dataset;
    const selectedId = e.dataTransfer.getData("text/plain");

    const selectedEntity = character.getElement(selectedId);
    const targetEntity = character.getElement(id);

    selectedEntity.addAfter(targetEntity);
  }

  function edit() {
    components.modals.render(`${entity.constructor.name} Editor`, $editor, {
      entity: proxy,
    });
  }

  const contextMenuOptions = [
    {
      label: "Edit",
      callback: () => edit(),
      show: () => Boolean($editor),
    },
    {
      label: "Collapse",
      callback: () => (entity.isOpen = false),
      show: () => entity.isOpen && entity.canContainChildren,
    },
    {
      label: "Expand",
      callback: () => (entity.isOpen = true),
      show: () => !entity.isOpen && entity.canContainChildren,
    },
    {
      label: "Delete",
      callback: () => {
        entity.delete();
      },
      show: () => true,
    },
    {
      label: "Log",
      callback: () => {
        console.log(entity);
      },
      show: () => true,
    },
  ];
</script>

<style>
  tr > :global(td) {
    @apply relative border-b border-gray-300 border-solid;
  }
  .disabled > :global(td:before) {
    @apply border-b-2 border-solid border-red-700 absolute left-0 w-full mt-auto border-opacity-50;
    content: " ";
    top: 50%;
  }
  tr :global(div.flex .fas) {
    @apply self-center;
  }
</style>

{#if $display === 'table'}
  <tr
    data-id={$proxy.id}
    data-i={$proxy.listWeight}
    draggable={true}
    on:dragstart={onDragstart}
    on:dragenter={onDragenter}
    on:dragleave={() => (dragover = false)}
    on:dragover={onDragenter}
    on:drop={onDrop}
    on:contextmenu={onContextMenu}
    class:disabled={$entity.disabled}
    class:dragover
    on:dblclick={() => dispatch('select', entity)}>
    <svelte:component
      this={$component}
      entity={proxy}
      {depth}
      selected={$selected === $entity} />
  </tr>
  {#if $proxy.isOpen && !$config.flat}
    {#each children as entity, i (entity.id)}
      <svelte:self {entity} depth={depth + 1} on:select />
    {/each}
  {/if}
{:else if $display === 'list'}
  <li on:contextmenu={onContextMenu}>
    <svelte:component this={$component} entity={proxy} {depth} />
    {#if children.length > 0 && entity.isOpen && !$config.flat}
      <ul>
        {#each children as entity, i (entity.id)}
          <svelte:self {entity} depth={depth + 1} />
        {/each}
      </ul>
    {/if}
  </li>
{:else if $display === 'grid'}
  <div
    data-id={$proxy.id}
    draggable={true}
    on:dragstart={onDragstart}
    on:dragenter={onDragenter}
    on:dragleave={() => (dragover = false)}
    on:dragover={onDragenter}
    on:drop={onDrop}
    on:contextmenu={onContextMenu}
    class:disabled={$proxy.disabled}
    class="flex border-solid border-black border-b hover:bg-black
      hover:text-white">
    <svelte:component this={$component} entity={proxy} {depth} />
  </div>
  {#if !$config.flat}
    {#each children as entity, i (entity.id)}
      <svelte:self {entity} depth={depth + 1} />
    {/each}
  {/if}
{/if}
