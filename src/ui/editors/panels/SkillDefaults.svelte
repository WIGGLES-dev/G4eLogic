<script>
    import Boxes from "@ui/semantic-boxes/Boxes.svelte";
    import Box from "@ui/semantic-boxes/Box";
    import AttributeOptions from "@ui/options/AttributeOptions.svelte";

    export let entity = null;
    $: defaults = $entity.keys.defaults || [];

    function addDefault() {
        entity.pathUpdate(`keys.defaults`, [...defaults, {}]);
    }
    function removeDefault(i) {
        entity.pathUpdate(
            `keys.defaults`,
            defaults.filter((skillDefault, i1) => i !== i1)
        );
    }
</script>

<style>
    input {
        @apply border-b border-solid border-black;
    }
</style>

<Boxes on:addbox={addDefault}>
    {#each defaults as skillDefault, i (i)}
        <Box on:addbox={addDefault} on:deletebox={() => removeDefault(i)}>
            <div class="flex">
                <AttributeOptions
                    {entity}
                    bind:attribute={$entity.keys.defaults[i].type}>
                    <option value="Skill">Skill Named</option>
                </AttributeOptions>

                {#if skillDefault.type !== 'Skill'}
                    <input
                        type="number"
                        placeholder="modifier"
                        bind:value={$entity.keys.defaults[i].type} />
                {/if}
            </div>
            {#if skillDefault.type === 'Skill'}
                <div class="flex">
                    <input
                        type="text"
                        placeholder="name"
                        bind:value={$entity.keys.defaults[i].name} />
                    <input
                        type="text"
                        placeholder="specialization"
                        bind:value={$entity.keys.defaults[i].specialization} />
                    <input
                        type="number"
                        placeholder="modifier"
                        bind:value={$entity.keys.defaults[i].modifier} />
                </div>
            {/if}
        </Box>
    {/each}
</Boxes>
