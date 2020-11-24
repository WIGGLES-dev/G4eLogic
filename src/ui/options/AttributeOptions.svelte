<script lang="ts">
    import { Feature } from "@internal";

    export let attribute: string;
    export let entity: Feature;
    export let signaturesOnly = false;

    const { config$ } = entity;
    $: attributes = Object.entries($config$.attributes);
</script>

<style>
</style>

<select bind:value={attribute}>
    <option value={undefined} />
    {#each attributes as [signature, attribute], i (i)}
        {#if signaturesOnly ? attribute.skillSignature : true}
            <option value={signature}>{signature}</option>
        {/if}
    {/each}
    <slot />
</select>
