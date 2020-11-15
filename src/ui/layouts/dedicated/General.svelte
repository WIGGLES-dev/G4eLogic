<script>
  import { getContext } from "svelte";

  import AttributeList from "@ui/widgets/AttributeList";
  import Pools from "@ui/widgets/Pools";
  import EncumbranceTable from "@ui/widgets/EncumbranceTable";
  import LiftingTable from "@ui/widgets/LiftingTable";
  import PointTotals from "@ui/widgets/PointTotals";
  import Combat from "@ui/widgets/Combat";
  import Silhouette from "@ui/widgets/Silhouette.svelte";
  import TinyMCE from "@ui/widgets/TinyMCE";

  import List from "@ui/lists/List";

  import MeleeWeaponEntity from "@ui/entities/MeleeWeapon";

  import RangedWeaponEntity from "@ui/entities/RangedWeapon";

  const { character } = getContext("editor");
  const { rangedWeapons$, meleeWeapons$ } = character;

  $: rangedWeaponProps = {
    display: "list",
    addItem: false,
    component: RangedWeaponEntity,
    list: $rangedWeapons$,
  };
  $: meleeWeaponProps = {
    display: "list",
    addItem: false,
    component: MeleeWeaponEntity,
    list: $meleeWeapons$,
  };
</script>

<style>
  hr {
    @apply border border-solid border-gray-700 m-4 ml-0 mr-0;
  }
</style>

<div class="flex h-full">
  <div class="p-1" />
  <div class="flex-shrink-0">
    <div class="pr-2" />
    <AttributeList />
  </div>
  <div class="p-2" />
  <div class="flex-shrink-0">
    <Pools />
    <hr />
    <Combat />
    <hr />
    <div class="m-auto">
      <EncumbranceTable />
    </div>
    <hr />
    <div class="m-auto">
      <LiftingTable />
    </div>
  </div>
  <div class="flex-shrink-0">
    <div class="mx-4">
      <Silhouette />
    </div>
    <List {...rangedWeaponProps}><span slot="title">Ranged Weapons</span></List>
    <List {...meleeWeaponProps}><span slot="title">Melee Weapons</span></List>
  </div>
  <!-- <div class="flex-1 mx-6 hidden xl:block">
    <TinyMCE bind:content={$character.notes} />
  </div> -->
  <PointTotals />
  <div class="p-1" />
</div>
