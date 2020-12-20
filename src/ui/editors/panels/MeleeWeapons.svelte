<script lang="ts">
  import List from "@ui/lists/List.svelte";
  import MeleeWeaponEntity from "@ui/entities/MeleeWeapon.svelte";

  import { MeleeWeapon, Resource } from "@internal";

  export let entity: Resource;
  const meleeWeapons$ = entity.embedsOfType$(MeleeWeapon.type, MeleeWeapon);

  function addWeapon() {
    entity.embed();
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
