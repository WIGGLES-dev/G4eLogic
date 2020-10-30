<script>
  import List from "@ui/lists/List";
  import RangedWeapon from "@ui/entities/RangedWeapon";
  import RangedWeaponEditor from "@ui/editors/RangedWeaponEditor";
  export let entity = null;

  $: weapons = entity.getRangedWeapons();
</script>

<style>
</style>

<List
  list={weapons}
  title="Ranged Weapons"
  component={RangedWeapon}
  editor={RangedWeaponEditor}
  on:additem={() => entity.addRangedWeapon()}>
  <tr slot="header">
    <th class="w-full">Ranged Weapons</th>
    <th>Usage</th>
    <th>Lvl</th>
    <th>Damage</th>
    <th>Acc</th>
    <th>Range</th>
    <th>RoF</th>
    <th>Shots</th>
    <th>Bulk</th>
    <th>Rcl</th>
    <th>ST</th>
  </tr>
</List>
