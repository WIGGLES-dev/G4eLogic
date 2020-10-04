<script>
  import { onMount, onDestroy } from "svelte";

  export let value = null;
  export let selected = false;
  export let disabled = false;

  function setSelected(e) {
    selected = Boolean(HTMLOptionElement.selected);
  }

  function listenForOptionSelect(node) {
    node.closest("select").addEventListener("change", setSelected);
    return {
      destroy() {
        node.closest("select").removeEventListener("change", setSelected);
      },
    };
  }

  let HTMLSelectELement;
  let HTMLOptionElement;
</script>

<style>
</style>

<option
  use:listenForOptionSelect
  {selected}
  {value}
  {disabled}
  bind:this={HTMLOptionElement}>
  <slot />
</option>
