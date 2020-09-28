<script>
  export let label = "";
  export let callback = () => {};
  export let show = () => {};
  export let options = [];
</script>

<style>
  .context-menu-option {
    color: white;
    padding: 5px;
  }
  .context-menu-option:hover {
    background-color: gray;
  }
</style>

{#if show()}
  <li class="context-menu-option" on:click={callback}>
    {label}
    {#if options.length > 0}
      <ul>
        {#each options as option, i (i)}
          <svelte:self {...option} />
        {/each}
      </ul>
    {/if}
  </li>
{/if}
