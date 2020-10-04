<script>
  import { getContext, tick } from "svelte";

  const { display } = getContext("list") || {};
  const modal = getContext("modal") || {};

  export let value;
  export let disabled;
  export let name = null;

  let HTMLInputElement;
  let editing = false;

  async function onClickToEdit(e) {
    editing = true;
    await tick();
    HTMLInputElement.focus();
  }

  export let config = {
    clickToEdit: $display === "table" && !modal.isModal,
  };
</script>

<style>
</style>

{#if editing || !config.clickToEdit}
  <label for={name}>
    <slot />
    <input
      bind:this={HTMLInputElement}
      type="text"
      {name}
      bind:value
      {disabled}
      on:blur={() => (editing = false)} />
  </label>
{:else if !editing}
  <span on:click={onClickToEdit}>
    {#if value === null || value === undefined}&nbsp;{/if}
    {value}
  </span>
{/if}
