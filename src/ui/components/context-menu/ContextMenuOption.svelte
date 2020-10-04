<script>
  export let label = "";
  export let callback = () => {};
  export let show = () => {};
  export let options = [];
</script>

<style>
</style>

{#if show()}
  <li class="text-white p-3 hover:bg-white hover:text-black hover:shadow" on:click={callback}>
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
