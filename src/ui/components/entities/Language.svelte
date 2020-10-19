<script>
    export let entity;
</script>

<style>
</style>

<td class="text-left">
    <div>{entity.name}</div>
    <div class="text-xs italic pl-2">
        {#each [...entity.modifiers].filter((modifier) => modifier.enabled) as modifier, i (modifier.id)}
            {modifier.name}
            {#if modifier.notes}({modifier.notes}){/if};
        {/each}
    </div>
</td>
<td>{entity.adjustedPoints()}</td>
<td>{entity.reference}</td>
