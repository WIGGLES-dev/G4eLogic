<script>
  import { onMount, onDestroy, tick, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { createPopper } from "@popperjs/core";
  import { popperVirtualElement } from "@internal";

  import ContextMenuOption from "./ContextMenuOption.svelte";

  export let options = [];
  export let e = {};

  let HTMLUListElement;

  let virtualElement = popperVirtualElement();
  let popper;

  async function render() {
    popper = createPopper(virtualElement, HTMLUListElement, {
      placement: "bottom-start",
      strategy: "fixed",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [5, 5],
          },
        },
      ],
    });
    virtualElement.update(e.clientX, e.clientY);
    popper.update();
  }

  onMount(render);
  onDestroy(() => {
    try {
      popper.destroy();
    } catch (err) {}
  });

  function close() {
    dispatch("close");
  }
</script>

<style>
  .context-menu {
    @apply list-none select-none bg-gray-700 rounded;
    z-index: 2000;
  }
</style>

<svelte:window
  on:scroll={close}
  on:click={close}
  on:contextmenu|capture={close} />

<ul style="margin:0px;" bind:this={HTMLUListElement} class="context-menu">
  {#each options as option, i (i)}
    <ContextMenuOption {...option} />
  {/each}
</ul>
