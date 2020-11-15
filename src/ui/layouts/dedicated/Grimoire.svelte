<script>
  import { getContext } from "svelte";

  import List from "@ui/lists/List";
  import SpellEntity from "@ui/entities/Spell";
  import { Spell } from "@internal";

  const { character } = getContext("editor");
  const { spells$ } = character;

  function addSpell() {
    new Spell().mount(character.id);
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
