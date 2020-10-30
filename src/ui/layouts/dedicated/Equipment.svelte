<script>
  import { getContext } from "svelte";
  import { Tabs, Tab, TabPanel, TabList } from "@ui/tabs/tabs";
  import List from "@ui/lists/List";

  import EquipmentEditor from "@ui/editors/EquipmentEditor";
  import Equipment from "@ui/entities/Equipment";
  import { capitalize } from "@utils/strings";

  const { character } = getContext("editor");

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
    <col />
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
