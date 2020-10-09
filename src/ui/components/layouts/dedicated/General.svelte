<script>
  import { getContext } from "svelte";

  import AttributeList from "@ui/components/widgets/AttributeList";
  import Pools from "@ui/components/widgets/Pools";
  import EncumbranceTable from "@ui/components/widgets/EncumbranceTable";
  import LiftingTable from "@ui/components/widgets/LiftingTable";
  import PointTotals from "@ui/components/widgets/PointTotals";
  import Combat from "@ui/components/widgets/Combat";
  import Silhouette from "@ui/components/widgets/Silhouette.svelte";

  import List from "@ui/components/lists/List";

  import MeleeWeapon from "@ui/components/entities/MeleeWeapon";
  import MeleeWeaponEditor from "@ui/components/editors/MeleeWeaponEditor";

  import RangedWeapon from "@ui/components/entities/RangedWeapon";
  import RangedWeaponEditor from "@ui/components/editors/RangedWeaponEditor";

  const { character, components } = getContext("app");
</script>

<style>
  hr {
    @apply border border-solid border-gray-700 m-4 ml-0 mr-0;
  }
</style>

<div class="flex h-full">
  <div class="p-1" />
  <div>
    <div class="pr-2" />
    <AttributeList />
  </div>
  <div class="p-2" />
  <div>
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
  <div class="ml-4 flex-1 h-full lg:flex md:flex-col lg:flex-row ">
    <div class="order-2">
      <PointTotals />
    </div>
    <hr class="lg:hidden" />
    <div class="flex flex-wrap  flex-1">
      <div>
        <Silhouette />
        <List
          title="Ranged Weapons"
          display="list"
          component={RangedWeapon}
          editor={RangedWeaponEditor}
          config={{ addItem: false }}
          list={$character.rangedWeapons()} />
        <List
          title="Melee Weapons"
          display="list"
          component={MeleeWeapon}
          editor={MeleeWeaponEditor}
          config={{ addItem: false }}
          list={$character.meleeWeapons()} />
      </div>
    </div>
  </div>
  <div class="lg:hidden p-1" />
</div>
