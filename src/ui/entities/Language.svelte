<script>
    export let entity;
    $: ({ adjustedPoints$, exists, id, disabled, hidden } = entity);
    import { string } from "@ui/utils/formatting";
</script>

<style>
</style>

{#if exists}
    <td class="text-left">
        <div>{$entity.name}</div>
        <div class="text-xs italic pl-2">
            <!-- {#each [...entity.modifiers].filter((modifier) => modifier.enabled) as modifier, i (modifier.id)}
                {string(modifier.name)}{string(modifier.notes, {
                    beforeStart: '(',
                    afterEnd: ')',
                })}
            {/each} -->
        </div>
    </td>
    <td>{string($adjustedPoints$)}</td>
    <td>{string($entity.reference)}</td>
{/if}
