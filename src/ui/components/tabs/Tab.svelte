<script>
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";
  export let index = null;
  export let identifier = null;
  const tab = { index, identifier };
  const { registerTab, selectTab, selectedTab } = getContext(TABS);
  registerTab(tab);

  $: selected = $selectedTab === tab;
</script>

<style>
</style>

<div
  class="text-center flex-1 select-none p-2 pt-0 pb-0 text-lg"
  data-tab="n/a"
  on:mouseover={(e) => {
    if (e.which == 1) {
      selectTab(tab);
    }
  }}
  on:dragenter={(e) => {
    selectTab(tab);
  }}
  class:underline={selected}
  class:text-red-700={selected}
  class:hover:bg-gray-700={!selected}
  class:hover:text-white={!selected}
  on:click={() => selectTab(tab)}>
  <slot />
</div>
