<script>
    import CategoryList from "@ui/form/CategoryList";
    import Form from "@ui/form/Form";
    import { Tabs, Tab, TabPanel, TabList } from "@ui/tabs/tabs";

    import AttributeOptions from "@ui/options/AttributeOptions";

    import TinyMCE from "@ui/widgets/TinyMCE";
    import Features from "./panels/Features";
    import MeleeWeapons from "./panels/MeleeWeapons.svelte";
    import RangedWeapons from "./panels/RangedWeapons.svelte";
    import SkillDefaults from "./panels/SkillDefaults";

    export let entity = null;
    const { level$ } = entity;
</script>

<style>
</style>

{#if entity.exists}
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
            <Form>
                <div class="flex">
                    <label for="">Name<input
                            class="flex-1"
                            type="text"
                            bind:value={$entity.name} /></label>
                    <label for="">Specialization<input
                            type="text"
                            bind:value={$entity.specialization} /></label>
                </div>
                <div class="flex">
                    <label for="">
                        Defaults To
                        <AttributeOptions
                            {entity}
                            signaturesOnly={true}
                            bind:attribute={$entity.signature}>
                            <option value="Skill">Skill Named</option>
                        </AttributeOptions>
                    </label>

                    {#if $entity.default.type === 'Skill'}
                        <label for="">
                            <input
                                type="text"
                                bind:value={$entity.default.name}
                                placeholder="Name" />
                        </label>
                        <label for="">
                            <input
                                type="text"
                                bind:value={$entity.default.specialization}
                                placeholder="Specialization" />
                        </label>
                    {/if}
                    <label for="">
                        <input
                            type="number"
                            bind:value={$entity.default.modifier}
                            placeholder="Modifier" />
                    </label>

                    <label for="">Limit
                        <input
                            type="number"
                            bind:value={$entity.limit} /></label>
                </div>

                <div class="flex">
                    <label for="">
                        Difficulty
                        <select bind:value={$entity.difficulty}>
                            <option value="A">A</option>
                            <option value="H">H</option>
                        </select>
                    </label>
                    <label for="">Points
                        <input type="number" bind:value={$entity.points} />
                    </label>
                    <label for="">Final Level
                        <input type="number" disabled value={$level$} /></label>
                    <label for="">Disabled<input
                            type="checkbox"
                            bind:checked={$entity.disabled} /></label>
                </div>

                <div class="flex">
                    <CategoryList {entity} />
                    <label for="">Reference
                        <input
                            type="number"
                            bind:value={$entity.reference} /></label>
                </div>
                <label for="">Notes </label>
                <textarea
                    bind:value={$entity.notes}
                    name=""
                    id=""
                    rows="3" />
            </Form>
        </TabPanel>
        <TabPanel />
        <TabPanel component={Features} props={{ entity }} />
        <TabPanel component={MeleeWeapons} props={{ entity }} />
        <TabPanel component={RangedWeapons} props={{ entity }} />
        <TabPanel component={TinyMCE} props={{}} />
    </Tabs>
{/if}
