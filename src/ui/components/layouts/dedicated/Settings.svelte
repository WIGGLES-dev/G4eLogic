<script>
  import { getContext } from "svelte";
  import { Checkbox, Select, Option } from "@ui/index";

  const { character } = getContext("app");
</script>

<style>
</style>

<Checkbox>Enable Developer Mode</Checkbox>
<Checkbox>Thrust = Swing-2</Checkbox>
<Checkbox>Reduced Swing in Dungeon Fantasy</Checkbox>
<Checkbox>Knowing Your Own Strength</Checkbox>
<Checkbox>Use Multiplicative Modifiers</Checkbox>
<Checkbox>Use Modifing Dice + Adds</Checkbox>

<hr class="w-full gray-700 m4 border-b-2 border-gray-500 border-solid" />

<textarea
  value={JSON.stringify(character.config, null, '  ')}
  class="w-full outline-none"
  rows="20" />
<button class="bg-gray-700 text-white font-semibold" type="button">Change Config</button>
