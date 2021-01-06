<script>
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";

  export let disabled = false;
  export let identifier = null;
  const tab = { identifier, disabled };
  const { registerTab, selectTab, selectedTab } = getContext(TABS);
  registerTab(tab);

  $: selected = $selectedTab === tab && !disabled;
</script>

<style>
  .disabled {
    @apply text-red-700 line-through;
  }
  .selected {
    @apply bg-gray-700 text-white;
  }
  .hovered:hover {
    @apply bg-gray-300;
  }
</style>

<div
  class="text-center flex-1 select-none truncate"
  data-tab="n/a"
  on:mouseover={(e) => {}}
  on:dragenter={(e) => {
    if (!disabled) selectTab(tab);
  }}
  class:selected
  class:disabled
  class:hovered={!selected && !disabled}
  on:click={() => {
    if (!disabled) selectTab(tab);
  }}>
  <slot />
</div>