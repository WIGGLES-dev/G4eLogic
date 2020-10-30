<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<style>
  .semantic-box {
    @apply relative;
  }
  .box-interface {
    @apply absolute top-0 right-0 text-sm;
  }
  li {
    @apply border-b border-black border-dotted pb-2;
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
