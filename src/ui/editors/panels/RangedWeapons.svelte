<script lang="ts">
  import { Resource } from "@internal";
  import RangedWeaponList from "@ui/datatables/RangedWeapon.svelte";
  export let entity: Resource;
</script>

<style>
</style>

<RangedWeaponList resource={entity} />