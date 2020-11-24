<script context="module">
  const modals = new Set();
  function modalToTop(modal) {
    const highestIndex = [...modals].reduce(
      (z, modal) => Math.max(z, modal.zIndex),
      0
    );
    modal.zIndex = highestIndex + 1;
  }
</script>

<script>
  import { get_current_component } from "svelte/internal";
  import {
    createEventDispatcher,
    getContext,
    setContext,
    onMount,
    onDestroy,
  } from "svelte";

  const dispatch = createEventDispatcher();

  import { toTop } from "@ui/utils/use";

  const modal = get_current_component();

  onMount(() => {
    modals.add(modal);
    return modals.delete(modal);
  });
  onDestroy(() => {
    modals.delete(modal);
  });

  export let component;

  export let title = null;
  export let height = 600;
  export let width = 1200;
  export let zIndex = 200;

  height = Math.max(innerHeight / 2, height);
  width = Math.max(innerWidth / 2, width);

  let dragDisabled = false;
  let dragging = false;

  let minify = false;
  let lastDimensions = {
    height,
    width,
  };

  let dialog;
  let header;

  if (innerWidth < width) {
    width = innerWidth;
  }
  if (innerHeight < height) {
    height = innerHeight;
  }

  let dLeft;
  let dTop;

  setCenter();

  function handleScreenSize() {
    if (innerWidth < 768) {
      dragDisabled = true;
      dLeft = 0;
      dTop = 0;
      height = innerHeight;
      width = innerWidth;
    } else {
      dragDisabled = false;
    }
  }

  function onDrag({ movementX, movementY, which }) {
    if (which != 1 || !dragging || dragDisabled) return onFailDrag();
    const { top, left, bottom, right } = dialog.getBoundingClientRect();

    if (
      (bottom + movementY > innerHeight && bottom > 0) ||
      (right + movementX > innerWidth && right > 0)
    ) {
      return onFailDrag();
    }

    dLeft = Math.max(0, left + movementX);
    dTop = Math.max(0, top + movementY);
  }

  function setCenter() {
    dLeft = innerWidth / 2 - width / 2;
    dTop = innerHeight / 2 - height / 2;
  }

  function onFailDrag() {}

  function keyDown({ key }) {
    switch (key) {
      case "Esc":
      case "Escape":
        dispatch("close");
        break;
      default:
    }
  }

  function minifyModal() {
    if (minify) {
      minify = false;
      width = lastDimensions.width;
      height = lastDimensions.height;
    } else {
      minify = true;
      lastDimensions.width = width;
      lastDimensions.height = height;
      width = 250;
      height = 32;
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

<svelte:options accessors={true} />
<svelte:window
  on:resize={handleScreenSize}
  on:mousemove={onDrag}
  on:mouseup={() => (dragging = false)}
  on:keydown={keyDown} />

<div
  use:handleScreenSize
  bind:offsetHeight={height}
  bind:offsetWidth={width}
  class:resize={!minify}
  on:mousedown={() => modalToTop(modal)}
  class="flex flex-col overflow-hidden fixed border border-gray-700 border-solid bg-white"
  bind:this={dialog}
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
    on:dblclick={minifyModal}
    on:dragstart={(e) => e.preventDefault()}
    on:mousedown={() => (dragging = true)}>
    <span class="flex-1">{title}</span>
    <span
      class="hover:text-red-700 close fas fa-window-close"
      on:click={() => dispatch('close')} />
  </header>
  <section class:hidden={minify} class="flex-1 overflow-scroll">
    <slot>
      <svelte:component this={component} {...$$props} />
    </slot>
  </section>
</div>
