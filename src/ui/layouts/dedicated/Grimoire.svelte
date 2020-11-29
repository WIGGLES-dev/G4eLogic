<script lang="ts">
  import { getContext } from "svelte";

  import List from "@ui/lists/List.svelte";
  import SpellEntity from "@ui/entities/Spell.svelte";
  import { Spell, FeatureType, Valor, Sheet } from "@internal";

  const sheet = getContext<Sheet>("sheet");
  const { spells$ } = sheet;

  async function addSpell() {
    Valor.addEntities(FeatureType.Spell, [
      sheet.embed(new Spell(null).wrapData()),
    ]);
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
    component: SpellEntity,
    list: $spells$,
    getRoot,
    accessChildren,
  };
</script>

<style>
</style>

<List on:additem={addSpell} {...props}>
  <tr slot="header">
    <th scope="col">Ref</th>
    <th scope="col">Pts</th>
    <th scope="col">Rsl</th>
    <th scope="col">Mod</th>
    <th scope="col">Lvl</th>
    <th class="w-full" scope="col">Spells</th>
    <th scope="col">Resist</th>
    <th scope="col">Class</th>
    <th scope="col">Cost</th>
    <th scope="col">Maintain</th>
    <th scope="col">Time</th>
    <th scope="col">Duration</th>
  </tr>
</List>
