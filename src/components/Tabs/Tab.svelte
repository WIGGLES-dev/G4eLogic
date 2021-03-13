<script>
  import { getContext } from "svelte";
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
  class="text-center flex-1 select-none"
  data-tab="n/a"
  class:selected
  class:disabled
  class:hovered={!selected && !disabled}
  on:click={select}
>
  <slot />
</div>

<style lang="postcss">
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
