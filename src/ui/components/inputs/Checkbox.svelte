<script>
  export let checked = null;
  export let disabled = false;
  export let name = null;
</script>

<style>
</style>

<label for={name}>
  <slot />
  <input type="checkbox" bind:checked {disabled} {name} /></label>
