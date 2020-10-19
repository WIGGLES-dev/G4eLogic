<script>
  import {
    List,
    Boxes,
    Box,
    Text,
    Checkbox,
    Number,
    Select,
    Option,
  } from "@ui/index";

  import EquipmentModifier from "@ui/components/entities/EquipmentModifier";
  import EquipmentModifierEditor from "@ui/components/editors/EquipmentModifierEditor";

  export let entity = null;

  $: modifiers = [...$entity.modifiers];
  function addModifier() {
    entity.addModifier();
  }
</script>

<style>
</style>

<List
  on:additem={addModifier}
  title="Trait Modifier"
  list={modifiers}
  component={EquipmentModifier}
  editor={EquipmentModifierEditor}>
  <tr slot="header">
    <th>Enabled</th>
    <th>Modifier</th>
    <th>TL</th>
    <th>Cost Adjustment</th>
    <th>Weight Adjustment</th>
    <th class="w-full">Ref</th>
  </tr>
</List>
