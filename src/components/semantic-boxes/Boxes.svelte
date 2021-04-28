<script context="module" lang="ts">
  import { createEventDispatcher, afterUpdate, onMount } from "svelte";
</script>

<script lang="ts">
  const dispatch = createEventDispatcher();
  let boxList;
  let classList = "";
  export { classList as class };
  export let showInitialAdder = false;
</script>

<ul bind:this={boxList} class={classList}>
  {#if showInitialAdder}
    <li class="box">
      <div class="box-content" />
      <div class="box-controls">
        <i class="fas fa-plus" on:click={() => dispatch("addbox")} />
      </div>
    </li>
  {/if}
  <slot />
</ul>

<style lang="postcss">
  ul {
    @apply mx-2;
  }
  ul > :global(.box) {
    @apply relative m-4 shadow-md flex;
  }
  ul :global(.box-content) {
    @apply p-2 flex-1;
  }
  ul :global(.box-controls) {
    @apply flex flex-col bg-white;
  }
  ul :global(.fas) {
    @apply text-xs text-red-700 p-2 flex-1;
  }
  ul :global(.fas:hover) {
    @apply bg-red-700 text-white;
  }
</style>
