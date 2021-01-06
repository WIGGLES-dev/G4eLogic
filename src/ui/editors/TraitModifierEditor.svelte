<script>
  import { TraitModifierAffects, TraitModifierType } from "@internal";
  export let entity = null;
</script>

<style>
</style>

<form>
  <fieldset>
    <label>
      <span>Name</span>
      <input
        class="flex-1"
        type="text"
        bind:value={$entity.name} />
    </label>

    <label>
      <span>Enabled</span>
      <input
        type="checkbox"
        bind:checked={$entity.enabled} />
    </label>
  </fieldset>

  <fieldset>
    <label>
      <span>Cost</span> 
      <input type="number" bind:value={$entity.cost} />
    </label>

    <select bind:value={$entity.type}>
      {#each Object.entries(TraitModifierType) as [key, value], i (i)}
        <option {value}>{key}</option>
      {/each}
    </select>

    <label>
      <span>Level</span>
      <input
        type="number"
        bind:value={$entity.level}
        disabled={!$entity.hasLevels && $entity.type !== TraitModifierType.percentage} />
    </label>

    <label>
      <span>Has Levels</span>
      <input
        type="checkbox"
        bind:checked={$entity.hasLevels}
        disabled={$entity.type !== TraitModifierType.percentage} />
    </label>
  </fieldset>

  <fieldset>
    <label>
      <span>Final Modifier</span>
      <input type="number" value={$entity.costModifier()} />
    </label>

    <label>
      <span>Affects</span>
      <select bind:value={$entity.affects}>
        {#each Object.entries(TraitModifierAffects) as [key, value], i (i)}
          <option {value}>{key}</option>
        {/each}
      </select>
    </label>

    <label>
      <span>Reference</span>
      <input type="text" bind:value={$entity.reference} />
    </label>
  </fieldset>

  <label>
    <span>Notes</span> 
    <textarea bind:value={$entity.notes} />
  </label>
</form>
