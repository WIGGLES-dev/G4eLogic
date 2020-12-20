<script lang="ts">
  import { getContext } from "svelte";
  import { Tabs, Tab, TabPanel, TabList } from "@ui/tabs/tabs";
  import List from "@ui/lists/List.svelte";

  import EquipmentEntity from "@ui/entities/Equipment.svelte";
  import { Equipment, capitalize, FeatureType, Sheet, Valor } from "@internal";

  const sheet = getContext<Sheet>("sheet");
  const { equipment$, carriedWeight$ } = sheet;

  $: displayedItems = $equipment$.filter((item) => {
    return item.keys.storedLocation === displayedLocation;
  });
  $: displayedLocation = "carried";

  function createEquipment() {
    sheet.embed(new Equipment(null).wrapData());
  }
  function getRoot(entities) {
    return entities
      .filter((entity) => entity.owner == null)
      .sort((a, b) => a.listWeight - b.listWeight);
  }
  function accessChildren(entity) {
    return entity.sameChildren.sort((a, b) => a.listWeight - b.listWeight);
  }

  $: props = {
    draggable: true,
    addItem: true,
    component: EquipmentEntity,
    list: displayedItems,
    getRoot,
    accessChildren,
  };
</script>

<List on:additem={createEquipment} {...props}>
  <colgroup slot="colgroup">
    <col />
    <col />
    <col />
    <col span="6" class="" />
  </colgroup>
  <tr slot="header">
    <th scope="col">E</th>
    <th scope="col">#</th>
    <th scope="col" class="w-full">
      <select
        class="outline-none bg-gray-700 w-1/3 text-white"
        bind:value={displayedLocation}>
        {#each ['carried', 'other'] as location, i (i)}
          <option value={location}>{capitalize(location)}</option>
        {/each}
      </select>
      Equipped Weight:
      {$carriedWeight$}
    </th>
    <th scope="col">Uses</th>
    <th scope="col">Value</th>
    <th scope="col">Weight</th>
    <th scope="col">EValue</th>
    <th scope="col">EWeight</th>
    <th scope="col">Ref</th>
  </tr>
</List>
