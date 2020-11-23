<script>
  import List from "@ui/lists/List";
  import MeleeWeaponEntity from "@ui/entities/MeleeWeapon";

  import { MeleeWeapon } from "@internal";

  export let entity = {};
  $: ({ meleeWeapons$ } = entity);

  function addWeapon() {
    entity.splice(new MeleeWeapon(null, null));
  }

  $: props = {
    addItem: true,
    component: MeleeWeaponEntity,
    list: $meleeWeapons$,
  };
</script>

<style>
</style>

<List on:additem={addWeapon} {...props}>
  <tr slot="header">
    <th>Melee Weapons</th>
    <th class="w-full">Usage</th>
    <th>Lvl</th>
    <th>Parry</th>
    <th>Block</th>
    <th>Damage</th>
    <th>Reach</th>
    <th>Info</th>
    <th>ST</th>
  </tr>
</List>
