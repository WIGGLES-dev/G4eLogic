<script>
  import { List } from "@ui/index";
  import { RangedWeapon } from "@ui/index";
  export let entity = null;

  $: weapons = [...$entity.weapons].filter(
    (weapon) => weapon.getType() === "ranged_weapon"
  );
</script>

<style>
</style>

<List list={weapons} title="Melee Weapons" component={RangedWeapon}>
  <tr slot="head">
    <th>Ranged Weapons</th>
    <th>Usage</th>
    <th>Lvl</th>
    <th>Acc</th>
    <th>Damage</th>
    <th>Range</th>
    <th>RoF</th>
    <th>Shots</th>
    <th>Bulk</th>
    <th>Rcl</th>
    <th>ST</th>
  </tr>
</List>
