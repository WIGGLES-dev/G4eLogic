<script>
    import Boxes from "@ui/semantic-boxes/Boxes.svelte";
    import Box from "@ui/semantic-boxes/Box";
    import AttributeOptions from "@ui/options/AttributeOptions.svelte";

    export let entity = null;

    $: defaults = [...entity.defaults];
</script>

<style>
    input {
        @apply border-b border-solid border-black;
    }
</style>

<Boxes on:addbox={() => entity.addDefault()}>
    {#each defaults as skillDefault, i (skillDefault.id)}
        <Box
            on:addbox={() => entity.addDefault()}
            on:deletebox={() => skillDefault.delete()}>
            <div class="flex topmost">
                <AttributeOptions bind:attribute={skillDefault.criteria.type}>
                    <option value="Skill">Skill Named</option>
                </AttributeOptions>

                {#if skillDefault.criteria.type !== 'Skill'}
                    <input type="number" bind:value={skillDefault.modifier} />
                {/if}
            </div>
            {#if skillDefault.type === 'Skill'}
                <div class="flex">
                    <input
                        type="text"
                        bind:value={skillDefault.criteria.name} />
                    <input
                        type="text"
                        placeholder="specialization"
                        bind:value={skillDefault.criteria.specialization} />
                    <input type="text" bind:value={skillDefault.modifier} />
                </div>
            {/if}
        </Box>
    {/each}
</Boxes>
