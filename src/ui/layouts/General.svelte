<script lang="ts">
  import { getContext } from "svelte";

  import AttributeList from "@ui/AttributeList.svelte";
  import Pools from "@ui/Pools.svelte"
  import EncumbranceTable from "@ui/EncumbranceTable.svelte";
  import LiftingTable from "@ui/LiftingTable.svelte"
  import PointTotals from "@ui/PointTotals.svelte"
  import Combat from "@ui/Combat.svelte";
  import Silhouette from "@ui/Silhouette/Silhouette.svelte";

  import { Character } from "@internal";
  const sheet = getContext<Character>("sheet");
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
      <Silhouette minWidth="200px" viewBox="200 0 400 800" />
    </div>
    <!-- <List {...rangedWeaponProps}><span slot="title">Ranged Weapons</span></List>
    <List {...meleeWeaponProps}><span slot="title">Melee Weapons</span></List> -->
  </div>
  <PointTotals />
  <div class="p-1" />
</div>
