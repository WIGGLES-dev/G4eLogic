<script>
  import { getContext, tick } from "svelte";

  const { display = null } = getContext("list") || {};
  const modal = getContext("modal") || {};

  let HTMLInputElement;
  let editing = false;

  async function onClickToEdit(e) {
    editing = true;
    await tick();
    HTMLInputElement.focus();
  }

  export let disabled = null;
  export let value = null;
  export let min = null;
  export let max = null;
  export let step = "1";
  export let path = null;
  export let name = null;

  export let config = {};
</script>

<style>
</style>

{#if editing || modal.isModal}
  <label for={name}>
    <slot />
    <input
      bind:this={HTMLInputElement}
      {name}
      type="number"
      {disabled}
      {step}
      {min}
      {max}
      bind:value
      data-path={path}
      on:blur={() => (editing = false)} />
  </label>
{:else if !editing}
  <span on:click={onClickToEdit}>
    {#if value === null || value === undefined}&nbsp;{/if}
    {value}
  </span>
{/if}

