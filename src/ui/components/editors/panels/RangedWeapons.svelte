<script>
  import { List } from "@ui/index";
  import { RangedWeapon } from "@ui/index";
  import RangedWeaponEditor from "@ui/components/editors/RangedWeaponEditor";
  export let entity = null;

  $: weapons = [...$entity.weapons].filter(
    (weapon) => weapon.getType() === "ranged_weapon"
  );
</script>

<style>
</style>

<List
  list={weapons}
  title="Ranged Weapons"
  component={RangedWeapon}
  editor={RangedWeaponEditor}
  on:additem={() => $entity.addWeapon('ranged_weapon')}>
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
