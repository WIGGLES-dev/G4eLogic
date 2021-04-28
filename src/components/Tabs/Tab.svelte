<script>
  import { getContext, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import { TABS } from "./Tabs.svelte";
  export let disabled = false;
  export let identifier = null;
  const tab = { identifier, disabled };
  const {
    registerTab,
    selectTab,
    selectedTab,
    addPrefetch,
    removePrefetch,
  } = getContext(TABS);
  registerTab(tab);
  export function select() {
    if (!disabled) selectTab(tab);
  }
  $: selected = $selectedTab === tab && !disabled;
</script>

<div
  class="tab"
  data-tab="n/a"
  class:selected
  class:disabled
  class:hovered={!selected && !disabled}
  on:click={select}
>
  <slot />
</div>

<style lang="postcss">
  .tab {
    @apply text-center flex-1 select-none font-semibold p-3 underline bg-white;
  }
  .disabled {
    @apply text-red-700 line-through;
  }
  .selected {
    @apply bg-red-700 text-white;
  }
  .hovered:hover {
    @apply bg-gray-500 text-white;
  }
</style>
