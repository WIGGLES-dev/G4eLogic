<script lang='ts'>
  import { createEventDispatcher, afterUpdate } from "svelte";
  const dispatch = createEventDispatcher();

  let boxList;

  let showInitialAdder = false;

  function listHasItems() {
    return boxList.querySelectorAll("li").length > 0;
  }

  afterUpdate(() => {
    showInitialAdder = !listHasItems();
  });
</script>

<style>
  .semantic-boxes {
    @apply relative;
  }
  .box-interface {
    @apply absolute top-0 right-0 pt-5 pr-5;
  }
  ul {
    @apply mx-4;
  }
</style>

<ul class="semantic-boxes" bind:this={boxList}>
  {#if showInitialAdder}
    <span
      class="fas fa-plus box-interface"
      on:click={() => dispatch('addbox')} />
  {/if}
  <slot />
</ul>
