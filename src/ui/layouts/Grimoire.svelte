<script lang="ts">
  import { getContext } from "svelte";
  const character = getContext<any>("sheet");
  import SpellList from "@ui/datatables/Spell.svelte";
</script>

<SpellList {character} />

<style>
</style>
