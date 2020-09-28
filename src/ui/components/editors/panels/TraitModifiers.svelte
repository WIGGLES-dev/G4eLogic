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
</script>

<style>
</style>

<List
  title="Trait Modifier"
  list={modifiers}
  component={TraitModifier}
  editor={TraitModifierEditor}>
  <tr slot="header">
    <th>Enabled</th>
    <th>Modifier</th>
    <th>Cost Modifier</th>
    <th>Ref</th>
  </tr>
</List>
