<script>
  import { setContext } from "svelte";

  export let value;
  export let name;
</script>

<style>
</style>

<label for={name}>
  <slot name="label" />
  <select bind:value {name}>
    <slot />
  </select>
</label>
