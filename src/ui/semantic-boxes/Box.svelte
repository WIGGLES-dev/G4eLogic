<script lang='ts'>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<style>
  .semantic-box {
    @apply relative p-1;
  }
  .box-interface {
    @apply absolute top-0 right-0 text-sm;
  }
  li {
    @apply py-2 my-2 border-b border-solid;
  }
</style>

<li class="semantic-box">
  <div class="box-interface">
    <span
      class="fas fa-minus hover:text-red-700"
      on:click={() => dispatch('deletebox')} />
    <span
      class="fas fa-plus hover:text-red-700"
      on:click={() => dispatch('addbox')} />
  </div>
  <slot />
</li>
