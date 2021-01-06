<script lang="ts">
  import { Resource } from "@internal";
  import MeleeWeaponList from '@ui/datatables/MeleeWeapon.svelte';
  export let entity: Resource;
</script>

<style>
</style>

<MeleeWeaponList resource={entity} />