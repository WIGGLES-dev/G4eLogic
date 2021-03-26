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
  ul > :global(li) {
    @apply relative m-1 border-b border-solid flex;
  }
  ul > :global(.fas) {
    @apply text-sm;
  }
  ul > :global(.fas):hover {
    @apply text-red-700;
  }
</style>
