<script>
    import { Tabs, Tab, TabPanel, TabList } from "@ui/index";

    import TinyMCE from "@ui/components/widgets/TinyMCE";

    import Features from "./panels/Features";
    import MeleeWeapons from "./panels/MeleeWeapons.svelte";
    import RangedWeapons from "./panels/RangedWeapons.svelte";
    import SkillDefaults from "./panels/SkillDefaults";

    export let entity = null;
</script>

<style>
    label {
        @apply flex p-2;
    }

    div.flex label,
    input {
        @apply flex-1;
    }

    input,
    select {
        @apply border-b border-black border-solid outline-none ml-1;
    }

    input {
        @apply h-full pl-1;
    }

    textarea {
        @apply outline-none border border-black border-solid rounded mt-2 w-full;
    }
</style>

<Tabs>
    <TabList>
        <Tab>Data</Tab>
        <Tab disabled={true}>Prerequisites</Tab>
        <Tab>Features</Tab>
        <Tab>MeleeWeapons</Tab>
        <Tab>RangedWeapons</Tab>
        <Tab disabled={true}>User Description</Tab>
    </TabList>
    <TabPanel>
        <form action="" class="p-3">
            <div class="flex">
                <label for="">Name<input
                        class="flex-1"
                        type="text"
                        bind:value={entity.name} /></label>
                <label for="">Specialization<input
                        type="text"
                        bind:value={entity.specialization} /></label>
            </div>
            <div class="flex">
                <label for="">
                    Defaults To
                    <select name="" id="" bind:value={entity.default.type}>
                        {#each Object.values(entity
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
                </label>

                {#if entity.default.type === 'Skill'}
                    <label for="">
                        <input
                            type="text"
                            bind:value={entity.default.name}
                            placeholder="name" />
                    </label>
                    <label for="">
                        <input
                            type="text"
                            bind:value={entity.default.specialization}
                            placeholder="Specialization" />
                    </label>
                {/if}
                <label for="">
                    <input
                        type="number"
                        bind:value={entity.default.modifier}
                        placeholder="Modifier" />
                </label>

                <label for="">Limit
                    <input type="number" bind:value={entity.limit} /></label>
            </div>

            <div class="flex">
                <label for="">
                    Difficulty
                    <select bind:value={entity.difficulty}>
                        <option value="A">A</option>
                        <option value="H">H</option>
                    </select>
                </label>
                <label for="">Points
                    <input type="number" bind:value={entity.points} />
                </label>
                <label for="">Final Level
                    <input
                        type="number"
                        disabled
                        value={entity.calculateLevel()} /></label>
                <label for="">Disabled<input
                        type="checkbox"
                        bind:checked={entity.disabled} /></label>
            </div>

            <div class="flex">
                <label for="">Categories
                    <input
                        on:change={(e) => (entity.categories = new Set(e.target.value.split(',')))}
                        type="text"
                        value={[...entity.categories].join(',')} /></label>

                <label for="">Reference
                    <input
                        type="number"
                        bind:value={entity.reference} /></label>
            </div>
            <label for="">Notes </label>
            <textarea bind:value={entity.notes} name="" id="" rows="3" />
        </form>
    </TabPanel>
    <TabPanel />
    <TabPanel component={Features} props={{ entity }} />
    <TabPanel component={MeleeWeapons} props={{ entity }} />
    <TabPanel component={RangedWeapons} props={{ entity }} />
    <TabPanel component={TinyMCE} props={{}} />
</Tabs>
