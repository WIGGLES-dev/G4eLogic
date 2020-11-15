<script>
  import List from "@ui/lists/List";
  import TraitModifier from "@ui/entities/TraitModifier";
  import TraitModifierEditor from "@ui/editors/TraitModifierEditor";

  export let entity = null;

  $: modifiers = [...entity.modifiers];

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
