<script>
  import { getContext } from "svelte";
  import { Checkbox, Select, Option } from "@ui/index";
  import JSONEditor from "@ui/components/widgets/JSONEditor";

  const { character } = getContext("app");

  let configEditor;

  function changeConfig() {
    try {
      character.reconfigure(configEditor.editor.get());
    } catch (err) {}
  }
</script>

<style>
</style>

<hr class="w-full gray-700 m4 border-b-2 border-gray-500 border-solid" />
<div class="flex">
  <button
    on:click={changeConfig}
    class="bg-gray-700 text-white font-semibold flex-1 underline hover:bg-red-700"
    type="button">Change Config</button>
  <button
    on:click={() => {
      character.reconfigure(character.defaultConfig);
      configEditor.editor.set(character.config);
    }}
    class="bg-gray-700 text-white font-semibold flex-1 underline hover:bg-red-700"
    type="button">Default Configuration</button>
</div>
<div>
  <JSONEditor data={character.config} bind:this={configEditor} />
</div>
