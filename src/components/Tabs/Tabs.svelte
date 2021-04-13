<script context="module">
  export const TABS = {};
</script>

<script>
  import { setContext, onDestroy, onMount, tick } from "svelte";
  import { writable } from "svelte/store";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let initTab = 0;
  let tabIndex = initTab;
  const tabs = [];
  const panels = [];
  const selectedTab = writable(tabIndex);
  const selectedPanel = writable(tabIndex);
  onMount(() => {
    tabIndex = tabIndex || 0;
    selectedTab.set(tabs[tabIndex]);
    selectedPanel.set(panels[tabIndex]);
  });
  setContext(TABS, {
    registerTab: (tab) => {
      tabs.push(tab);
      selectedTab.update((current) => current || tab);
      onDestroy(() => {
        const i = tabs.indexOf(tab);
        tabs.splice(i, 1);
        selectedTab.update((current) =>
          current === tab ? tabs[i] || tabs[tabs.length - 1] : current
        );
      });
    },
    registerPanel(panel) {
      panels.push(panel);
      selectedPanel.update((current) => current || panel);

      onDestroy(() => {
        const i = panels.indexOf(panel);
        panels.splice(i, 1);
        selectedPanel.update((current) =>
          current === panel ? panels[i] || panels[panels.length - 1] : current
        );
      });
    },
    async selectTab(tab) {
      const i = tabs.indexOf(tab);
      selectedPanel.set(null);
      selectedTab.set(tabs[i]);
      selectedPanel.set(panels[i]);
      tabIndex = i;
      initTab = i;
      dispatch("tabchange", i);
    },
    selectedTab,
    selectedPanel,
  });

  export function selectTab() {}
</script>

<div class="tabs">
  <slot />
</div>

<style lang="postcss">
  .tabs {
    @apply flex flex-col h-full w-full;
  }
</style>
