import _Tabs from "./Tabs.svelte";
import _TabList from "./TabList.svelte";
import _TabPanel from "./TabPanel.svelte";
import _Tab from "./Tab.svelte";

export { default as Tabs } from './Tabs.svelte';
export { default as TabList } from './TabList.svelte';
export { default as TabPanel } from './TabPanel.svelte';
export { default as Tab } from './Tab.svelte';

export default class Tabs {
    static Tabs = _Tabs
    static TabList = _TabList
    static TabPanel = _TabPanel
    static Tab = _Tab

    static tabs = new Set()


}