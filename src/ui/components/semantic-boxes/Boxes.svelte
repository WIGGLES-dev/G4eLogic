<script>
  import { createEventDispatcher, onMount, afterUpdate } from "svelte";
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
    position: relative;
  }
  .box-interface {
    position: absolute;
    top: 15px;
    right: 15px;
  }
  ul {
    list-style-type: none;
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
