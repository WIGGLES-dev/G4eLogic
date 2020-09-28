<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<style>
  .semantic-box {
    position: relative;
  }
  .box-interface {
    position: absolute;
    top: 0px;
    right: 15px;
  }
  li {
    padding: 5px;
  }
</style>

<li class="semantic-box">
  <div class="box-interface">
    <span class="fas fa-minus" on:click={() => dispatch('deletebox')} />
    <span class="fas fa-plus" on:click={() => dispatch('addbox')} />
  </div>
  <slot />
</li>
