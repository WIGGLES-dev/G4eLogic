<script>
  import { getContext } from "svelte";
  import JsonEditor from "@components/JsonEditor.svelte";
  const sheet = getContext("sheet");
  let editor;
</script>

<div class="flex flex-col">
  <div style="height: 70vh;">
    <JsonEditor bind:data={$sheet.config} bind:editor />
  </div>
  <div class="flex">
    <button
      on:click={() => {}}
      class="bg-gray-700 text-white font-semibold flex-1 underline hover:bg-red-700"
      type="button">Default Configuration</button
    >
  </div>
</div>

<style>
</style>
