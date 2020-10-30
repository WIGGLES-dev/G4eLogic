<script>
    export let entity;
    import { string } from "@ui/utils/formatting";
</script>

<style>
</style>

<td class="text-left">
    <div>{entity.name}</div>
    <div class="text-xs italic pl-2">
        {#each [...entity.modifiers].filter((modifier) => modifier.enabled) as modifier, i (modifier.id)}
            {string(modifier.name)}{string(modifier.notes, {
                beforeStart: '(',
                afterEnd: ')',
            })}
        {/each}
    </div>
</td>
<td>{string(entity.adjustedPoints())}</td>
<td>{string(entity.reference)}</td>
