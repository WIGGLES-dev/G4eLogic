<script context="module" lang="ts">
  import TraitModifierEditor from "@ui/editors/TraitModifierEditor.svelte";
  import Toggle from "@components/Toggle.svelte";
</script>

<script lang="ts">
  export let entity;
  export const modifiers$ = entity.sub("modifiers");
</script>

<style>
</style>
