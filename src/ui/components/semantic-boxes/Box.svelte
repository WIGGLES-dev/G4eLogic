<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<style>
  .semantic-box {
    position: relative;
  }
  .box-interface {
    @apply absolute top-0 right-0 text-sm;
  }
  li {
    padding: 5px;
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
