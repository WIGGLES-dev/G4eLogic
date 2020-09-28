<script>
  import { onMount, onDestroy } from "svelte";

  export let value = null;
  export let selected = false;
  export let disabled = false;

  function setSelected(e) {
    selected = Boolean(HTMLOptionElement.selected);
  }

  onMount(() => {
    HTMLOptionElement.closest("select").addEventListener("change", setSelected);
  });
  onDestroy(() => {
    HTMLOptionElement.closest("select").removeEventListener(
      "change",
      setSelected
    );
  });

  let HTMLOptionElement;
</script>

<style>
</style>

<option {value} {disabled} bind:this={HTMLOptionElement}>
  <slot />
</option>
