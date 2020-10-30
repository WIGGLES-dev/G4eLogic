<script>
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";

  export let disabled = false;
  export let identifier = null;
  const tab = { identifier };
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
  class="text-center flex-1 select-none p-2 pt-0 pb-0 text-lg mx-2"
  data-tab="n/a"
  on:mouseover={(e) => {
    if (e.which == 1) {
      selectTab(tab);
    }
  }}
  on:dragenter={(e) => {
    selectTab(tab);
  }}
  class:selected
  class:disabled
  class:hovered={!selected && !disabled}
  on:click={() => {
    if (!disabled) selectTab(tab);
  }}>
  <slot />
</div>
