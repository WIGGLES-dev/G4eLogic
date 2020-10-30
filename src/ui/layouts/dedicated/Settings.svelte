<script>
  import { getContext } from "svelte";
  import JSONEditor from "@ui/widgets/JSONEditor";

  const { character } = getContext("editor");

  let configEditor;

  function changeConfig() {
    try {
      $character.config.reconfigure(configEditor.editor.get());
    } catch (err) {}
  }
</script>

<style>
</style>

<div class="flex flex-col">
  <div style="height: 70vh;">
    <JSONEditor data={$character.config.getConfig()} bind:this={configEditor} />
  </div>
  <div class="flex">
    <button
      on:click={changeConfig}
      class="bg-gray-700 text-white font-semibold flex-1 underline hover:bg-red-700"
      type="button">Change Config</button>
    <button
      on:click={() => {
        configEditor.editor.set($character.config.setDefault());
      }}
      class="bg-gray-700 text-white font-semibold flex-1 underline hover:bg-red-700"
      type="button">Default Configuration</button>
  </div>
</div>
