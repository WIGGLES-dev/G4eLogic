<script>
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";

  export let component = null;
  export let props = {};

  const panel = {};
  const { registerPanel, selectedPanel } = getContext(TABS);
  registerPanel(panel);
</script>

<style>
</style>

<div class="flex flex-col h-full" class:hidden={!($selectedPanel === panel)}>
  {#if component}
    <svelte:component this={component} {...props} />
  {:else}
    <slot />
  {/if}
</div>
