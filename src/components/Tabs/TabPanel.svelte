<script>
  import { getContext } from "svelte";
  import { fade, slide, blur, crossfade } from "svelte/transition";
  import { TABS } from "./Tabs.svelte";
  const panel = {};
  const { registerPanel, selectedPanel } = getContext(TABS);
  registerPanel(panel);
  let classList = "";
  export { classList as class };
</script>

<div class="tab-panel {classList}" class:hidden={$selectedPanel !== panel}>
  {#if $selectedPanel === panel}
    <slot />
  {/if}
</div>

<style lang="postcss">
  .tab-panel {
    @apply flex-1 px-4;
  }
</style>
