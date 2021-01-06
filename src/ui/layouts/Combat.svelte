<script lang="ts">
  import { Tab, TabList, TabPanel, Tabs } from "@components/Tabs/tabs";
  import { getContext } from "svelte";
  import Silhouette from "@ui/Silhouette/Silhouette.svelte";
  import SizeRange from "@ui/SizeRange.svelte"
  import MeleeWeapons from '@ui/datatables/MeleeWeapon.svelte';
  import RangedWeapons from '@ui/datatables/RangedWeapon.svelte';
  import { Character } from "@internal";

  const character = getContext<Character>("sheet");
  const encumbranceLevel$ = character.selectEncumbranceLevel();
  const attributes$ = character.selectAttributes();

  const dodge$ = character.selectAttribute("dodge");
  $: dodge = $dodge$?.calculateLevel() ?? 5;
  $: encumberedDodge = dodge + ($encumbranceLevel$ || 0);
</script>
<style>
  .button {
    @apply bg-gray-700 text-white;
  }
</style>

<div class="flex">
  <div class="px-4">
    <MeleeWeapons resource={character} maxDepth={Number.POSITIVE_INFINITY} />
    <RangedWeapons resource={character} maxDepth={Number.POSITIVE_INFINITY} />
    <div class="grid gap-2 auto-rows-min">
      <button class='button'>Dodge ({encumberedDodge})</button>
      <button class="button">Dodge+ ({encumberedDodge + 3})</button>
    </div>
  </div>
  <Silhouette maxHeight="650px" minWidth="400px" viewBox="200 0 400 800" />
  <SizeRange />
</div>