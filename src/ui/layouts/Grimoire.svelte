<script lang="ts">
  import { getContext } from "svelte";
  import { Spell, Character } from "@internal";
  const character = getContext<Character>("sheet");
  import SpellList from '@ui/datatables/Spell.svelte';
</script>

<style>
</style>

<SpellList 
  {character}
/>