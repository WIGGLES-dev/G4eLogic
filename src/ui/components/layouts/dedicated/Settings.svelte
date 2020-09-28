<script>
  import { getContext } from "svelte";
  import { Checkbox, Select, Option } from "@ui/index";

  const { character } = getContext("app");
</script>

<style>
</style>

<div class="flex-col">
  <Checkbox>Enable Developer Mode</Checkbox>
  
  <Checkbox>Thrust = Swing-2</Checkbox>
  <Checkbox>Reduced Swing in Dungeon Fantasy</Checkbox>
  <Checkbox>Knowing Your Own Strength</Checkbox>
  <Checkbox>Use Multiplicative Modifiers</Checkbox>
  <Checkbox>Use Modifing Dice + Adds</Checkbox>
</div>
