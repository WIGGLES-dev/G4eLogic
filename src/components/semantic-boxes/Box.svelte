<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let classList = "";
  export { classList as class };
</script>

<li class="box {classList}">
  <div class="box-content flex-1">
    <slot />
  </div>
  <div class="box-controls">
    <i class="fas fa-minus" on:click={() => dispatch("deletebox")} />
    <i class="fas fa-plus" on:click={() => dispatch("addbox")} />
  </div>
</li>

<style lang="postcss">
</style>
