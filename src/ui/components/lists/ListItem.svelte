<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { Modal } from "@ui/index";
  import App from "../App.svelte";

  const dispatch = createEventDispatcher();

  const { display, component, editor, headers, config, selected } = getContext(
    "list"
  );

  const { components } = getContext("app");

  let modalEditor;
  let editing = false;

  let dragover = false;

  function launchEditor() {
    modalEditor.render();
  }

  function onContextMenu(e) {
    selected.set(entity);
    components.contextMenu.render({ contextMenuOptions, e });
  }
  function onDragstart() {
    selected.set(entity);
    console.log(entity);
  }
  function onDragenter(e) {
    dragover = true;
    if (e.target.closest("[data-id]").dataset.id) e.preventDefault();
  }
  function onDrop(e) {
    let targetEntity = entity.list.getByUUID(
      e.target.closest("[data-id]").dataset.id
    );
    if (!targetEntity) return;

    $selected.setContainedBy(targetEntity);
    console.log($selected, targetEntity);
  }

  const contextMenuOptions = [
    {
      label: "Edit",
      callback: () => (editing = true),
      show: () => Boolean(editor),
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

  export let entity = null;

  $: children = [...($entity.children || [])];

  function toggle() {
    entity.isOpen = !$entity.isOpen;
  }
</script>

<style>
  tr > :global(td) {
    position: relative;
    border: 1px solid black;
  }
  tr:hover {
    background-color: grey;
    color: white;
  }
  .ui {
    position: absolute;
  }
  .hide {
    display: none;
  }
  .dragover,
  .selected {
    background-color: grey;
    color: white;
  }
  tr > :global(td) {
    position: relative;
  }

  .disabled :global(td:before) {
    content: " ";
    position: absolute;
    top: 50%;
    left: 0;
    border-bottom: 2px solid red;
    width: 100%;
  }
</style>

{#if $display === 'table'}
  <tr
    data-id={$entity.id}
    draggable={true}
    on:dragstart={onDragstart}
    on:dragenter={onDragenter}
    on:dragleave={() => (dragover = false)}
    on:dragover={onDragenter}
    on:drop={onDrop}
    on:contextmenu={onContextMenu}
    class:disabled={$entity.disabled}
    class:selected={$entity === $selected}
    class:dragover
    on:dblclick={() => dispatch('select', entity)}>
    <svelte:component
      this={$component}
      {entity}
      selected={$selected === $entity}>
      <span
        style="left:{$entity.getItemDepth() * 20}px;"
        class="ui fas"
        class:fa-angle-right={!$entity.isOpen && $entity.canContainChildren}
        class:fa-angle-down={$entity.isOpen && $entity.canContainChildren}
        class:hide={!$entity.canContainChildren}
        slot="toggle"
        on:click={toggle} />
    </svelte:component>
  </tr>
  {#if $entity.isOpen}
    {#each children as entity, i (entity.id)}
      <svelte:self {entity} on:select />
    {/each}
  {/if}
{:else if $display === 'list'}
  <li>
    <svelte:component this={$component} {entity} />
    {#if children.length > 0 && entity.isOpen}
      <ul>
        {#each children as entity, i (entity.id)}
          <svelte:self {entity} />
        {/each}
      </ul>
    {/if}
  </li>
{:else if $display === 'grid'}
  <div
    style="
    grid-column-end: {entity.getItemDepth() === 0 ? `span ${entity.getDepthToBottom()}` : null};
    ">
    <svelte:component this={$component} {entity} />
    {#each children as entity, i (entity.id)}
      <svelte:self {entity} />
    {/each}
  </div>
{/if}

<Modal
  rendered={editing}
  on:close={() => (editing = false)}
  bind:this={modalEditor}
  component={$editor}
  props={{ entity }}
  title="{$entity.constructor.name} Editor" />
