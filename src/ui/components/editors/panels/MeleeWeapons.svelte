<script>
  import { List } from "@ui/index";

  import { MeleeWeapon } from "@ui/index";
  import MeleeWeaponEditor from "@ui/components/editors/MeleeWeaponEditor";

  export let entity = null;

  $: weapons = [...($entity.weapons || [])].filter(
    (weapon) => weapon.getType() === "melee_weapon"
  );
</script>

<style>
</style>

<List
  list={weapons}
  title="Melee Weapons"
  editor={MeleeWeaponEditor}
  component={MeleeWeapon}
  on:additem={() => $entity.addWeapon('melee_weapon')}>
  <tr slot="header">
    <th class="w-full">Melee Weapons</th>
    <th>Usage</th>
    <th>Lvl</th>
    <th>Parry</th>
    <th>Block</th>
    <th>Damage</th>
    <th>Reach</th>
    <th>ST</th>
  </tr>
</List>
