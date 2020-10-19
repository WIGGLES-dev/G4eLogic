<script>
  import { getContext } from "svelte";
  import { derived } from "svelte/store";
  import { List, Tabs, Tab, TabList, TabPanel } from "@ui/index";

  import EquipmentEditor from "@ui/components/editors/EquipmentEditor";
  import Equipment from "@ui/components/entities/Equipment";
  import { capitalize } from "@utils/string_utils";

  const { character } = getContext("app");

  $: displayedItems = $character.equipmentList.itemsByLocation(
    displayedLocation
  );
  $: equippedWeight = $character.equipmentList.totalWeight();

  let displayedLocation;

  function createEquipment() {
    $character.equipmentList.addListItem().location = displayedLocation;
  }
</script>

<List
  on:additem={createEquipment}
  title="Equipment"
  component={Equipment}
  editor={EquipmentEditor}
  list={displayedItems}
  display="table">
  <colgroup slot="colgroup">
    <col />
    <col />
    <col class="w-full" />
    <col span="6" class="" />
  </colgroup>
  <tr slot="header">
    <th scope="col">E</th>
    <th scope="col">#</th>
    <th scope="col">
      <select
        class="outline-none bg-gray-700 w-1/3 text-white"
        name=""
        id=""
        bind:value={displayedLocation}>
        {#each [...$character.equipmentList.locations] as location, i (i)}
          <option value={location}>{capitalize(location)}</option>
        {/each}
      </select>
      Equipped Weight:
      {equippedWeight}
    </th>
    <th scope="col">Uses</th>
    <th scope="col">Value</th>
    <th scope="col">Weight</th>
    <th scope="col">EValue</th>
    <th scope="col">EWeight</th>
    <th scope="col">Ref</th>
  </tr>
</List>
