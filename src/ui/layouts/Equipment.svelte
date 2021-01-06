<script lang="ts">
  import { getContext } from "svelte";
  import EquipmentList from '@ui/datatables/Equipment.svelte';
  import { Equipment, Character } from "@internal";

  const character = getContext<Character>("sheet");
  
  $: displayedLocation = "carried";
</script>

<EquipmentList {character} />