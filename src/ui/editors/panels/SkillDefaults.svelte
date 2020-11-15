<script>
    import Boxes from "@ui/semantic-boxes/Boxes.svelte";
    import Box from "@ui/semantic-boxes/Box";
    import AttributeOptions from "@ui/options/AttributeOptions";

    export let entity;
    export let defaults = [];

    function addDefault() {
        defaults = [...defaults, {}];
    }
    function removeDefault(i) {
        defaults = defaults.filter((skillDefault, i1) => i !== i1);
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
                <AttributeOptions {entity} bind:attribute={skillDefault.type}>
                    <option value="Skill">Skill Named</option>
                </AttributeOptions>

                {#if skillDefault.type !== 'Skill'}
                    <input
                        type="number"
                        placeholder="modifier"
                        bind:value={skillDefault.modifier} />
                {/if}
            </div>
            {#if skillDefault.type === 'Skill'}
                <div class="flex">
                    <input
                        type="text"
                        placeholder="name"
                        bind:value={skillDefault.name} />
                    <input
                        type="text"
                        placeholder="specialization"
                        bind:value={skillDefault.specialization} />
                    <input
                        type="number"
                        placeholder="modifier"
                        bind:value={skillDefault.modifier} />
                </div>
            {/if}
        </Box>
    {/each}
</Boxes>
