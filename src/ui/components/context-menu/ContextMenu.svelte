<script>
  import { onDestroy } from "svelte";
  import { createPopper } from "@popperjs/core";

  import ContextMenuOption from "./ContextMenuOption.svelte";

  export let options = [];

  export let rendered = false;

  let HTMLUListElement;

  function moveToBody(node) {
    document.body.appendChild(node);
  }

  function popperVirtualElement() {
    return {
      getBoundingClientRect() {
        return this.generateGetBoundingClientRect();
      },
      generateGetBoundingClientRect(x = 0, y = 0) {
        return () => ({
          width: 0,
          height: 0,
          top: y,
          right: x,
          bottom: y,
          left: x,
        });
      },
      update(x, y) {
        this.getBoundingClientRect = this.generateGetBoundingClientRect(x, y);
      },
    };
  }

  let virtualElement = popperVirtualElement();
  let popper;

  export async function render({
    contextMenuOptions = [],
    e: { clientX, clientY },
  } = {}) {
    virtualElement.update(clientX, clientY);
    popper = createPopper(virtualElement, HTMLUListElement);
    await popper.update();
    options = contextMenuOptions;
    rendered = true;
  }
  export function close() {
    rendered = false;
  }
</script>

<style>
  .context-menu {
    user-select: none;
    z-index: 2000;
    background-color: black;
  }
</style>

<svelte:window
  on:click={(e) => {
    if (rendered) close();
  }} />

<ul
  bind:this={HTMLUListElement}
  use:moveToBody
  class:hide={!rendered}
  class="context-menu">
  {#each options as option, i (i)}
    <ContextMenuOption {...option} />
  {/each}
</ul>
