<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { derived } from "svelte/store";

  import { Equipment } from "@character/equipment/equipment";

  export let entity = null;
  const proxy = derived(entity, (store) => entity);

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

  function handleOverToggle(e) {
    if (e.target.matches("[data-container-toggle]")) {
      e.target.classList.add("text-3xl");
    } else {
      e.target
        .closest("[data-id]")
        .querySelector("[data-container-toggle]")
        .classList.remove("text-3xl");
    }
  }

  function onDragstart(e) {
    // const image = new Image();
    // image.src = "drag.gif";
    // e.dataTransfer.setDragImage(image, 0, 0);
    e.dataTransfer.setData("text/plain", entity.id);
  }

  function onDragenter(e) {
    dragover = true;
    const row = e.target.closest("[data-id]");
    if (row.dataset.id) e.preventDefault();
    handleOverToggle(e);
  }

  function onDrop(e) {
    const { id } = e.target.closest("[data-id]").dataset;
    const selectedId = e.dataTransfer.getData("text/plain");

    const selectedEntity = $character.getElement(selectedId);
    const targetEntity = $character.getElement(id);

    const isOnToggle = e.target.matches("[data-container-toggle]");
    selectedEntity.addAfter(targetEntity);
    if (isOnToggle) {
      selectedEntity.containedBy = targetEntity;
      e.target.classList.remove("text-3xl");
    }
  }

  function edit() {
    components.modals.render(`Editor`, $editor, {
      entity,
    });
  }

  function handleItemClick(e) {
    console.log(entity);
    if (e.target.matches("input")) return;
    e.target.closest("[data-id]").querySelector("input").focus();
  }

  const contextMenuOptions = [
    {
      label: "Edit",
      callback: () => edit(),
      show: () => Boolean($editor),
    },
    {
      label: `Move To ${entity.location === "carried" ? "Other" : "Carried"}`,
      callback: () => {
        entity.location = entity.location === "carried" ? "other" : "carried";
      },
      show: () => entity instanceof Equipment,
    },
    {
      label: "Collapse",
      callback: () => (entity.isOpen = false),
      show: () => entity.isOpen && entity.canContainChildren === true,
    },
    {
      label: "Expand",
      callback: () => (entity.isOpen = true),
      show: () => !entity.isOpen && entity.canContainChildren === true,
    },
    {
      label: "Make Container",
      callback: () => (entity.canContainChildren = true),
      show: () => {
        if (entity.isContainer) return !entity.isContainer();
      },
    },
    {
      label: "Delete",
      callback: () => {
        entity.delete();
      },
      show: () => true,
      classes: [
        "bg-red-700",
        "text-white",
        "hover:bg-red-700",
        "hover:text-white",
        "rounded-b",
      ],
    },
  ];
</script>

<style>
  tr > :global(td) {
    @apply relative border-b border-gray-300 border-solid;
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
    on:click={handleItemClick}
    on:dblclick={() => dispatch('select', entity)}>
    <svelte:component
      this={$component}
      entity={$proxy}
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
    <svelte:component this={$component} entity={$proxy} {depth} />
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
    <svelte:component this={$component} entity={$proxy} {depth} />
  </div>
  {#if !$config.flat}
    {#each children as entity, i (entity.id)}
      <svelte:self {entity} depth={depth + 1} />
    {/each}
  {/if}
{/if}
