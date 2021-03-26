<script>
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";
  export let component = null;
  const panel = {};
  const { registerPanel, selectedPanel } = getContext(TABS);
  registerPanel(panel);
</script>

{#if $selectedPanel === panel}
  <div class="tab-panel">
    <slot>
      <svelte:component this={component} {...$$props} />
    </slot>
  </div>
{/if}

<style lang="postcss">
  .tab-panel {
    @apply flex-1;
  }
</style>
