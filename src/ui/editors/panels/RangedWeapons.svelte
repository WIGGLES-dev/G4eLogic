<script>
  import List from "@ui/lists/List";
  import RangedWeaponEntity from "@ui/entities/RangedWeapon";
  import RangedWeaponEditor from "@ui/editors/RangedWeaponEditor";

  import { WeaponType, RangedWeapon } from "@internal";
  export let entity = null;
  $: ({ rangedWeapons$ } = entity);

  function addWeapon() {
    const weapon = new RangedWeapon();
    entity.slot(weapon.id);
  }
  
  $: props = {
    addItem: true,
    editor: MeleeWeaponEditor,
    component: MeleeWeaponEntity,
    list: $rangedWeapons$,
    contextMenuOptions: contextActions("Delete"),
  };
</script>

<style>
</style>

<List on:additem={addWeapon} {...props}>
  <tr slot="header">
    <th>Ranged Weapons</th>
    <th class="w-full">Usage</th>
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
