<script>
  import { getContext } from "svelte";
  export let depth = 0;

  export let entity = null;
  const { children$ } = entity;
  $: children = children$;

  const {
    display,
    component,
    editor,
    headers,
    length,
    config,
    onDropRow,
  } = getContext("list");

  const { components, character, dispatch } = getContext("editor");

  let dragover = false;

  function onContextMenu(e) {
    e.preventDefault();
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
    // const category = e.target.closest("section").dataset.category;
    // if (!category) return;
    // selectedEntity.categories.add(category);
    // selectedEntity.dispatch();
    onDropRow(selectedEntity);
  }

  let editing = false;
  function edit() {
    dispatch("edit", { entity });
    if (editing) return;
    editing = true;
    components.modals.render(
      `Editor`,
      $editor,
      {
        entity,
      },
      {
        onClose: () => {
          editing = false;
        },
      }
    );
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
      label: "Collapse",
      callback: () => {},
      show: () => false,
    },
    {
      label: "Expand",
      callback: () => {},
      show: () => false,
    },
    {
      label: "Make Container",
      callback: () => {},
      show: () => false,
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
</style>

{#if entity.exists}
  {#if $display === 'table'}
    <tr
      data-id={$entity.id}
      data-i={$entity.ui.listWeight}
      draggable={true}
      on:dragstart={onDragstart}
      on:dragenter={onDragenter}
      on:dragleave={() => (dragover = false)}
      on:dragover={onDragenter}
      on:drop={onDrop}
      on:contextmenu={onContextMenu}
      class:disabled={$entity.keys.disabled}
      class:dragover
      on:click={handleItemClick}
      on:dblclick={() => edit()}>
      <svelte:component this={$component} {entity} {depth} />
    </tr>
    {#if $entity.ui.canCantainChildren && !$config.flat}
      {#each children as entity, i (entity.id)}
        <svelte:self {entity} depth={depth + 1} on:select />
      {/each}
    {/if}
  {:else if $display === 'list'}
    <li on:contextmenu={onContextMenu}>
      <svelte:component this={$component} {entity} {depth} />
      {#if children.length > 0 && $entity.ui.visible && !$config.flat}
        <ul>
          {#each children as entity, i (entity.id)}
            <svelte:self {entity} depth={depth + 1} />
          {/each}
        </ul>
      {/if}
    </li>
  {/if}
{/if}
