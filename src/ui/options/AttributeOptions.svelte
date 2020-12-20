<script lang="ts">
    import { SkillLike } from "@internal";

    export let attribute: string;
    export let entity: SkillLike;
    export let signaturesOnly = false;

    const host$ = entity.getNearest("sheet");
    $: attributes = $host$.config.attributes;
</script>

<style>
    select {
        @apply text-black bg-white;
    }
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
