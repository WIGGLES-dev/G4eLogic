<script lang="ts">
    import Boxes from "@components/semantic-boxes/Boxes.svelte";
    import Box from "@components/semantic-boxes/Box.svelte";
    import AttributeOptions from "@ui/options/AttributeOptions.svelte";
    import type { SkillDefault } from "@app/gurps/resources/skill";
    export let defaults: SkillDefault[] = [];
    export let attributes = [];
    function addDefault() {
        defaults = [...defaults, {} as SkillDefault];
    }
    function removeDefault(i) {
        defaults = defaults.filter((skillDefault, i1) => i !== i1);
    }
</script>

<Boxes on:addbox={addDefault} showInitialAdder={defaults.length === 0}>
    {#each defaults as skillDefault, i (i)}
        <Box on:addbox={addDefault} on:deletebox={() => removeDefault(i)}>
            <fieldset>
                <AttributeOptions bind:attribute={skillDefault.type}>
                    <option value="Skill">Skill Named</option>
                </AttributeOptions>
                {#if skillDefault.type !== "Skill"}
                    <label>
                        <input
                            type="number"
                            placeholder="modifier"
                            bind:value={skillDefault.modifier}
                        />
                    </label>
                {/if}
            </fieldset>
            {#if skillDefault.type === "Skill"}
                <fieldset>
                    <label>
                        <input
                            type="text"
                            placeholder="name"
                            bind:value={skillDefault.name}
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            placeholder="specialization"
                            bind:value={skillDefault.specialization}
                        />
                    </label>
                    <label>
                        <input
                            type="number"
                            placeholder="modifier"
                            bind:value={skillDefault.modifier}
                        />
                    </label>
                </fieldset>
            {/if}
        </Box>
    {/each}
</Boxes>

<style lang="postcss">
    fieldset {
        @apply flex;
    }
</style>
