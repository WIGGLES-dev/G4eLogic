<script>
  import { onMount, onDestroy, tick } from "svelte";
  import { createPopper } from "@popperjs/core";
  import { popperVirtualElement } from "@ui/utils/popper";

  import { slide } from "svelte/transition";

  import ContextMenuOption from "./ContextMenuOption.svelte";

  export let options = [];

  export let rendered = false;

  let HTMLUListElement;

  function moveToBody(node) {
    document.body.appendChild(node);
  }

  let virtualElement = popperVirtualElement();
  let popper;

  onMount(() => {});

  export async function render({
    contextMenuOptions = [],
    e: { clientX, clientY },
  } = {}) {
    rendered = true;
    await tick();
    popper = createPopper(virtualElement, HTMLUListElement, {
      placement: "bottom-start",
      strategy: "fixed",
    });
    virtualElement.update(clientX, clientY);
    await popper.update();
    options = contextMenuOptions;
  }
  export async function close() {
    rendered = false;
    await tick();
    await popper.destroy();
  }
</script>

<style>
  .context-menu {
    @apply list-none select-none bg-gray-700 rounded;
    z-index: 2000;
  }
</style>

<svelte:window
  on:scroll={() => {
    if (rendered) close();
  }}
  on:click={(e) => {
    if (rendered) close();
  }} />

{#if rendered}
  <ul use:moveToBody bind:this={HTMLUListElement} class="context-menu">
    {#each options as option, i (i)}
      <ContextMenuOption {...option} />
    {/each}
  </ul>
{/if}
