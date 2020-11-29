<script>
  import { getContext } from "svelte";
  import JSONEditor from "@ui/widgets/JSONEditor";
  import { config } from "@internal";
  const sheet = getContext("sheet");
  let editor;
</script>

<style>
</style>

<div class="flex flex-col">
  <div style="height: 70vh;">
    <JSONEditor bind:data={$sheet.config} bind:editor />
  </div>
  <div class="flex">
    <button
      on:click={() => {
        sheet.update((data) => {
          data.keys.config = config;
        });
        editor.set(config);
      }}
      class="bg-gray-700 text-white font-semibold flex-1 underline hover:bg-red-700"
      type="button">Default Configuration</button>
  </div>
</div>
