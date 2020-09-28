<script>
  import { createPopper } from "@popperjs/core";

  import { getContext } from "svelte";

  import { Number } from "@ui/index";

  const { character, components } = getContext("app");
</script>

<ul>
  {#each Array.from(character.attributeList.attributes.values()) as attribute, i (attribute.signature)}
    <li>
      [{attribute.pointsSpent()}] {attribute.name} ~
      <Number bind:value={attribute.displayLevel} />
    </li>
  {/each}
</ul>

{character.getThrustDamage()}
{character.getSwingDamage()}
