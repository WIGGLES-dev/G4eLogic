<script>
  import { List } from "@ui/index";
  import { MeleeWeapon } from "@ui/index";

  export let entity = null;

  let weapons = [...($entity.weapons || [])].filter(
    (weapon) => weapon.getType() === "melee_weapon"
  );
</script>

<style>
</style>

<List list={weapons} title="Melee Weapons" component={MeleeWeapon}>
  <tr slot="header">
    <th>Melee Weapons</th>
    <th>Usage</th>
    <th>Lvl</th>
    <th>Parry</th>
    <th>Block</th>
    <th>Damage</th>
    <th>Reach</th>
    <th>ST</th>
  </tr>
</List>
