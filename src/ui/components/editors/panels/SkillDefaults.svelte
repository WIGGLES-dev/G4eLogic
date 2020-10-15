<script>
    import { Boxes, Box, Text, Number, Select, Option } from "@ui/index";
    import { StringCompare } from "@utils/string_utils";

    export let entity = null;

    $: defaults = [...$entity.defaults];
</script>

<style>
    input,
    select {
        @apply border-b border-solid border-black;
    }
</style>

<Boxes>
    {#each defaults as skillDefault, i (skillDefault.id)}
        <Box>
            <div class="flex topmost">
                <select name="" id="" bind:value={skillDefault.type}>
                    {#each Object.values($entity
                            .getCharacter()
                            .config.getConfig().attributes) as signature, i}
                        {#if signature.can_be_signature}
                            <option value={signature.signature}>
                                {signature.signature}
                            </option>
                        {/if}
                    {/each}
                    <option value="Skill">Skill Named</option>
                </select>
                {#if skillDefault.type !== 'Skill'}
                    <input type="number" bind:value={skillDefault.modifier} />
                {/if}
            </div>
            {#if skillDefault.type === 'Skill'}
                <div class="flex">
                    <input type="text" bind:value={skillDefault.name} />
                    <input
                        type="text"
                        placeholder="specialization"
                        bind:value={skillDefault.specialization} />
                    <input type="text" bind:value={skillDefault.modifier} />
                </div>
            {/if}
        </Box>
    {/each}
</Boxes>
