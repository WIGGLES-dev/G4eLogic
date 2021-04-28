<script>
  import { getContext } from "svelte";
  import { fade, slide, blur, crossfade } from "svelte/transition";
  import { TABS } from "./Tabs.svelte";
  const panel = {};
  const { registerPanel, selectedPanel } = getContext(TABS);
  registerPanel(panel);
</script>

{#if $selectedPanel === panel}
  <slot />
{/if}

<style lang="postcss">
</style>
