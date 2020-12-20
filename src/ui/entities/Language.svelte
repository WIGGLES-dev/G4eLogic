<script>
    export let entity;
    $: ({ adjustedPoints$, exists, id, disabled, hidden } = entity);
    import { string } from "@internal";
</script>

<style>
</style>

{#if exists}
    <td class="text-left">
        <div>{$entity.name}</div>
        <div class="text-xs italic pl-2">
            {@html $entity.notes || ''}
        </div>
    </td>
    <td>{string($adjustedPoints$)}</td>
    <td>{string($entity.reference)}</td>
{/if}
