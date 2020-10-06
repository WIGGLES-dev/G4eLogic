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
  export let height = 600;
  export let width = 1200;
  export let zIndex = 200;

  let dragging = false;

  let dialog;
  let header;

  let dLeft = innerWidth / 2 - width / 2;
  let dTop = innerHeight / 2 - height / 2;

  function moveToBody(node) {
    document.body.appendChild(node);
  }

  function onDrag({ movementX, movementY, which }) {
    if (which != 1 || !dragging) return;
    const { top, left, bottom, right } = dialog.getBoundingClientRect();

    if (
      (bottom + movementY > innerHeight && bottom > 0) ||
      (right + movementX > innerWidth && right > 0)
    ) {
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
  section::-webkit-scrollbar {
    @apply w-2 h-2;
  }
  section::-webkit-scrollbar-thumb {
    @apply outline-none bg-gray-700;
  }
  section::-webkit-scrollbar-track {
    box-shadow: 0 0 1px #999 inset;
  }
</style>

<svelte:window
  on:mousemove={onDrag}
  on:mouseup={() => (dragging = false)}
  on:keydown={keyDown} />

{#if rendered}
  <div
    on:mousedown={() => dispatch('focus')}
    class="flex flex-col overflow-hidden absolute border border-gray-700 border-solid resize bg-white"
    bind:this={dialog}
    use:moveToBody
    style="
  z-index: {zIndex};
  height: {height}px;
  width: {width}px;
  left: {dLeft}px;
  top: {dTop}px;
  ">
    <header
      class="bg-gray-700 flex p-2 text-white"
      bind:this={header}
      on:mousedown={() => (dragging = true)}>
      <span class="flex-1">{title}</span>
      <span
        class="close fas fa-window-close"
        on:click={() => dispatch('close')} />
    </header>
    <section class="flex-1 overflow-scroll">
      <svelte:component this={component} {...props} />
    </section>
  </div>
{/if}
