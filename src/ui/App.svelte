<script>
  import { setContext, onMount } from "svelte";
  import { Tabs, Tab, TabList, TabPanel } from "@ui/index";

  import TitleBar from "@ui/components/menus/TitleBar";
  import Menu from "@ui/components/menus/Menu";

  import Traits from "@ui/components/layouts/dedicated/Traits";
  import Bio from "@ui/components/layouts/dedicated/Bio";
  import Skills from "@ui/components/layouts/dedicated/Skills";
  import Equipment from "@ui/components/layouts/dedicated/Equipment";
  import Settings from "@ui/components/layouts/dedicated/Settings";
  import General from "@ui/components/layouts/dedicated/General";
  import Grimoire from "@ui/components/layouts/dedicated/Grimoire";
  import Combat from "@ui/components/layouts/dedicated/Combat";

  import ContextMenu from "@ui/components/context-menu/ContextMenu";
  import Tooltips from "@ui/components/tooltips/Tooltip";
  import Applications from "@ui/components/applications/ApplicationManager.svelte";

  export let character = null;
  export let config = {};

  let contextMenu;
  let modals;
  let tooltips;

  const components = {};

  let filePicker;

  async function loadCharacter(e) {
    const file = e.target.files[0];
    const text = await file.text();
    const object = JSON.parse(text);
    character.load(object, "GCSJSON");
  }

  function saveCharacter() {}

  onMount(() => {
    Object.assign(components, {
      contextMenu,
      modals,
    });
  });

  setContext("app", {
    components,
    character,
    config,
  });
</script>

<style>
  main {
    min-width: 800px;
  }
</style>

<svelte:head>
  <title>Genecrafter</title>
</svelte:head>
<template style="" />

<main class="bg-white">
  <ContextMenu bind:this={contextMenu} />
  <Applications bind:this={modals} />
  <Tooltips bind:this={tooltips} />

  <!-- <div class="flex" style="padding-bottom: 3px;">
      <span class="tool fas fa-undo" on:click={character.State.undo()} />
      <span class="tool fas fa-redo" on:click={character.State.redo()} />
    </div> -->

  <TitleBar>
    <span slot="title">
      <button class="outline-none" on:click={() => console.log(character)}>Log Character</button>
    </span>
    <input on:change={loadCharacter} bind:this={filePicker} type="file" hidden />
    <span on:click={() => filePicker.click()} class="fas fa-file-upload"></span>
  </TitleBar>

  <Tabs>
    <TabList>
      <Tab>General</Tab>
      <Tab>Traits</Tab>
      <Tab>Bio</Tab>
      <Tab>Equipment</Tab>
      <Tab>Skills</Tab>
      <Tab>Grimoire</Tab>
      <Tab>Combat</Tab>
      <Tab><span class="fas fa-cogs" /></Tab>
    </TabList>
    <TabPanel component={General} />
    <TabPanel component={Traits} />
    <TabPanel component={Bio} />
    <TabPanel component={Equipment} />
    <TabPanel component={Skills} />
    <TabPanel component={Grimoire} />
    <TabPanel component={Combat} />
    <TabPanel component={Settings} />
  </Tabs>
</main>
