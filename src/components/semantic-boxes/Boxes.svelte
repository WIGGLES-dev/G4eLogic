<script context="module" lang="ts">
  import { createEventDispatcher, afterUpdate, onMount } from "svelte";
</script>

<script lang="ts">
  const dispatch = createEventDispatcher();
  let boxList;
  export let showInitialAdder = false;
</script>

<ul bind:this={boxList}>
  {#if showInitialAdder}
    <li>
      <div class="flex-1" />
      <div>
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
  ul :global(li) {
    @apply relative m-4 p-2 shadow-md flex;
  }
  ul :global(.fas) {
    @apply text-xs text-red-700 p-1;
  }
  ul :global(.fas:hover) {
    @apply bg-red-700 text-white;
  }
</style>
