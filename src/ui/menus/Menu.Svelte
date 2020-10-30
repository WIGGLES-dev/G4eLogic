<script>
  export let label = "";
  export let callback = () => {};

  let focused;

  let menu;

  function handleCloseClick(e) {
    if (!menu.contains(e.target)) {
      focused = false;
    }
  }
</script>

<style>
</style>

<svelte:window on:click={handleCloseClick} />

<ul
  class="list-none z-50 select-none text-white bg-black"
  on:click={() => {
    focused = true;
  }}
  bind:this={menu}>
  <div
    on:click={() => {
      focused = false;
      callback();
    }}>
    {label}
  </div>
  {#if focused}
    <li class="hover:bg-black hover:text-white">
      <slot />
    </li>
  {/if}
</ul>
