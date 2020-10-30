<script>
    import { Valor } from "@valor/valor";
    export let attribute;
    export let entity;
    export let signaturesOnly = false;

    let attributes = Object.entries(Valor.getConfig(entity).attributes);
</script>

<style>
</style>

<select name="" id="" bind:value={attribute}>
    <option value="" />
    {#each attributes as [signature, attribute], i (i)}
        {#if signaturesOnly ? attribute.skillSignature : true}
            <option value={signature}>{signature}</option>
        {/if}
    {/each}
    <slot />
</select>
