<script lang="ts">
  import { getContext } from "svelte";
  import EquipmentList from "@ui/datatables/Equipment.svelte";
  const character = getContext<any>("sheet");
  $: displayedLocation = "carried";
</script>

<EquipmentList {character} />
