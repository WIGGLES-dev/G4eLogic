<script lang="ts">
    import { load } from "js-yaml";
    import { Remote } from "comlink";
    import { iif, Observable } from "rxjs";
    import { map, mergeMap, startWith, switchMap } from "rxjs/operators";
    import { getContext } from "svelte";
    import { State } from "rxdeep";
    export let attribute: string;
    export let signaturesOnly = false;
    export let optionsOnly = false;
    const record = getContext<State<any>>("record");
    const worker = getContext<Observable<Remote<any>>>("worker");
    const attributes$ = worker.pipe(
        mergeMap(async (worker) => {
            const { type, config } = await worker.getValue();
            //console.log(worker.getType());
            if (type === "character") {
                return config?.attributes;
            } else {
                const request = await fetch(
                    "schemas/gurps/defaultCharacterConfig.yaml"
                );
                const text = await request.text();
                const config = load(text);
                return config?.attributes;
            }
        }),
        map(Object.entries),
        startWith([])
    );
</script>

{#if optionsOnly}
    <option value={undefined} />
    {#each $attributes$ as [signature, { skillSignature, abbreviation }], i (i)}
        {#if signaturesOnly ? skillSignature : true}
            <option value={signature}>{abbreviation || signature}</option>
        {/if}
    {/each}
    <slot />
{:else}
    <select bind:value={attribute}>
        <option value={undefined} />
        {#each $attributes$ as [signature, { skillSignature, abbreviation }], i (i)}
            {#if signaturesOnly ? skillSignature : true}
                <option value={signature}>{abbreviation || signature}</option>
            {/if}
        {/each}
        <slot />
    </select>
{/if}

<style lang="postcss">
    select {
        @apply text-black bg-white;
    }
</style>
