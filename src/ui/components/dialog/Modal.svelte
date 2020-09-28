<script>
  import { APPS } from "./Modals";
  import {
    createEventDispatcher,
    getContext,
    setContext,
    onMount,
    onDestroy,
  } from "svelte";
  const dispatch = createEventDispatcher();

  setContext("modal", {
    isModal: true,
  });

  const {
    components: { modals },
  } = getContext("app");

  onMount(() => {});
  onDestroy(() => {});

  export let rendered = false;

  export let component;
  export let props = {};

  export let title = null;
  export let height = 500;
  export let width = 800;

  let dragging = false;

  let dialog;
  let header;

  let zIndex = 200;
  $: dLeft = innerWidth / 2 - height / 2;
  $: dTop = innerHeight / 2 - width / 2;

  function moveToBody(node) {
    document.body.appendChild(node);
  }

  function onDrag({ movementX, movementY, which }) {
    if (which != 1 || !dragging) return;
    const { top, left, bottom, right } = dialog.getBoundingClientRect();

    if (bottom + movementY > innerHeight || right + movementX > innerWidth) {
      return;
    }

    dLeft = Math.max(0, left + movementX);
    dTop = Math.max(0, top + movementY);
  }

  function keyDown({ key }) {
    switch (key) {
      case "Esc":
      case "Escape":
        dispatch("close");
        break;
      default:
    }
  }
</script>

<style>
  .dialog {
    user-select: none;
    overflow-y: scroll;
    position: absolute;
    border: 1px solid black;
    background-color: white;
    resize: both;
  }
  .resize {
    bottom: 0px;
    right: 0px;
    position: absolute;
    background-color: black;
    color: white;
  }
  header {
    display: flex;
    cursor: grab;
    background-color: black;
    color: white;
    padding: 10px;
  }
  .dialog-title {
    flex: 1;
  }
  section {
    padding: 5px;
  }
  .dialog::-webkit-scrollbar {
    width: 5px;
    background-color: black;
  }
</style>

<svelte:window
  on:mousemove={onDrag}
  on:mouseup={() => (dragging = false)}
  on:keydown={keyDown} />
{#if rendered}
  <div
    on:click={() => zIndex++}
    class="dialog"
    bind:this={dialog}
    use:moveToBody
    style="
  z-index: {zIndex};
  height: {height}px;
  width: {width}px;
  left: {dLeft}px;
  top: {dTop}px;
  ">
    <header bind:this={header} on:mousedown={() => (dragging = true)}>
      <span class="dialog-title">{title}</span>
      <span
        class="close fas fa-window-close"
        on:click={() => dispatch('close')} />
    </header>
    <section>
      <svelte:component this={component} {...props} />
    </section>
  </div>
{/if}
