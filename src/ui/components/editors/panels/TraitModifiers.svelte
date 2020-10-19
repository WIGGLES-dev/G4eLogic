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

  import TraitModifier from "@ui/components/entities/TraitModifier";
  import TraitModifierEditor from "@ui/components/editors/TraitModifierEditor";

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
  component={TraitModifier}
  editor={TraitModifierEditor}>
  <tr slot="header">
    <th>Enabled</th>
    <th>Modifier</th>
    <th>Cost Modifier</th>
    <th class="w-full">Ref</th>
  </tr>
</List>
