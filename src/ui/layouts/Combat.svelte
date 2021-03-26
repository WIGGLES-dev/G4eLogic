<script lang="ts">
  import { Tab, TabList, TabPanel, Tabs } from "@components/Tabs/tabs";
  import { getContext } from "svelte";
  import Silhouette from "@ui/Silhouette/Silhouette.svelte";
  import SizeRange from "@ui/SizeRange.svelte";
  // import MeleeWeapons from '@ui/datatables/MeleeWeapon.svelte';
  // import RangedWeapons from '@ui/datatables/RangedWeapon.svelte';

  import { Character as CharacterWorker } from "@app/gurps/resources/character";
  import { map, mergeMap, pluck, tap } from "rxjs/operators";
  import { State } from "rxdeep";
  import { Observable } from "rxjs";
  import { Remote } from "comlink";
  const state = getContext<State<any>>("sheet");
  const character$ = getContext<Observable<Remote<CharacterWorker>>>("worker");
  const dodge$ = character$.pipe(
    mergeMap((c) => c.getAttribute("dodge")),
    pluck("level")
  );
  const encumbranceLevel$ = character$.pipe(
    mergeMap((c) => c.getEncumbranceLevel())
  );
  $: encumberedDodge = $dodge$ + $encumbranceLevel$;
</script>

<div class="flex">
  <div class="px-4">
    <!-- <MeleeWeapons resource={character} maxDepth={Number.POSITIVE_INFINITY} />
    <RangedWeapons resource={character} maxDepth={Number.POSITIVE_INFINITY} /> -->
    <div class="grid gap-2 auto-rows-min">
      <button class="button">Dodge ({encumberedDodge})</button>
      <button class="button">Dodge+ ({encumberedDodge + 3})</button>
    </div>
  </div>
  <Silhouette maxHeight="650px" minWidth="400px" viewBox="200 0 400 800" />
  <SizeRange />
</div>

<style lang="postcss">
  .button {
    @apply bg-gray-700 text-white;
  }
</style>
