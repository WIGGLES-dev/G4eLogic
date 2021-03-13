<script lang="ts">
    import { Resource, Character, AttributeData } from "@internal";
    import { map, mergeMap } from "rxjs/operators";

    export let attribute: string;
    export let entity: Resource;
    export let signaturesOnly = false;

    const host$ = entity.root$<Character>()
    const attributes$ = host$.pipe(
        mergeMap((c) => c.sub("config").sub("attributes")),
        map((i) => Object.entries(i || {})),
        map((i) => {
            if (i.length === 0) {
                return ([
                    ["dexterity", { abbreviation: "DX" }],
                    ["strength", { abbreviation: "ST" }],
                ] as [string, AttributeData][]).map((set) => {
                    set[1].skillSignature = true;
                    return set;
                });
            }
            return i;
        })
    );
</script>

<select bind:value={attribute}>
    <option value={undefined} />
    {#each $attributes$ as [signature, { skillSignature, abbreviation }], i (i)}
        {#if signaturesOnly ? skillSignature : true}
            <option value={signature}>{signature}</option>
        {/if}
    {/each}
    <slot />
</select>

<style lang="postcss">
    select {
        @apply text-black bg-white;
    }
</style>
