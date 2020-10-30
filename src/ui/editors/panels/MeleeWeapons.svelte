<script>
  import List from "@ui/lists/List";
  import MeleeWeapon from "@ui/entities/MeleeWeapon";
  import MeleeWeaponEditor from "@ui/editors/MeleeWeaponEditor";

  export let entity = null;

  $: weapons = entity.getMeleeWeapons();
</script>

<style>
</style>

<List
  list={weapons}
  title="Melee Weapons"
  editor={MeleeWeaponEditor}
  component={MeleeWeapon}
  on:additem={() => entity.addMeleeWeapon()}>
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
