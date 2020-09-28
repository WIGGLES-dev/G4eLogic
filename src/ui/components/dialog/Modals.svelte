<script context="module">
  import { writable } from "svelte/store";
  export const APPS = writable([]);
</script>

<script>
    import Dialog from "./Modal";
</script>

<style>
</style>

{#each $APPS as modal, i (i)}
  {modal}
{/each}
