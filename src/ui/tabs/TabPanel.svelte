<script>
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";

  export let component = null;

  const panel = {};
  const { registerPanel, selectedPanel } = getContext(TABS);
  registerPanel(panel);
</script>

<style>
  .tab-panel {
    @apply flex flex-col h-full;
  }
</style>

{#if $selectedPanel === panel}
  <div class="tab-panel" class:hidden={!($selectedPanel === panel)}>
    <slot>
      <svelte:component this={component} {...$$props} />
    </slot>
  </div>
{/if}
