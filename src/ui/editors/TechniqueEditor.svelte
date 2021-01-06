<script lang="ts">
    import CategoryList from "@components/Form/CategoryList.svelte";
    import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
    import AttributeOptions from "@ui/options/AttributeOptions.svelte";
    import DifficultyOptions from "@ui/options/DifficultyOptions.svelte";
    import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
    import Features from "./panels/Features.svelte";
    import MeleeWeapons from "./panels/MeleeWeapons.svelte";
    import RangedWeapons from "./panels/RangedWeapons.svelte";
    import SkillDefaults from "./panels/SkillDefaults.svelte";
    import { Technique } from "@internal";
    export let entity = {} as Technique;
    $: ({ 
        exists,
        level$
    } = entity);
</script>

<style>
</style>

{#if exists}
    <Tabs>
        <TabList>
            <Tab>Data</Tab>
            <Tab disabled={true}>Prerequisites</Tab>
            <Tab>Features</Tab>
            <Tab>MeleeWeapons</Tab>
            <Tab>RangedWeapons</Tab>
            <Tab>User Description</Tab>
        </TabList>
        <TabPanel>
            <form>
                <fieldset>
                    <div class="field">
                        <label for="name">Name</label>
                        <input
                            name='name'
                            class="flex-1"
                            type="text"
                            bind:value={$entity.name} />
                    </div>
                    <div class="field">
                        <label for="specialization">Specialization</label>
                        <input
                            type="text"
                            bind:value={$entity.specialization} />
                    </div>
                </fieldset>
                <fieldset>
                    <div class="field">
                        <label for="defaults to">Defaults To</label>
                        <AttributeOptions
                            {entity}
                            signaturesOnly={true}
                            bind:attribute={$entity.default.type}>
                            <option value="Skill">Skill Named</option>
                        </AttributeOptions>
                    </div>
                </fieldset>
                <fieldset>
                    {#if $entity.default.type === 'Skill'}
                        <div class="field">
                            <label for=""></label>
                            <input
                                type="text"
                                bind:value={$entity.default.name}
                                placeholder="Name" />
                        </div>
                        <div class="field">
                            <label for=""></label>
                            <input
                                type="text"
                                bind:value={$entity.default.specialization}
                                placeholder="Specialization" />
                        </div>
                    {/if}
                        <div class="field">
                            <label for=""></label>
                            <input
                                type="number"
                                bind:value={$entity.default.modifier}
                                placeholder="Modifier" />
                        </div>
                        <div class="field">
                            <label for="">Limit</label>
                            <input
                                type="number"
                                bind:value={$entity.limit} />
                        </div>
                </fieldset>
                <fieldset>
                    <label for="">
                        Difficulty
                        <DifficultyOptions
                            technique={true}
                            bind:difficulty={$entity.difficulty} />
                    </label>
                    <label for="">Points
                        <input type="number" bind:value={$entity.points} />
                    </label>
                    <div class="field">
                        <label for="">Final Level</label>
                        <output>{Math.floor($level$)}</output>
                    </div>
                    <div class="field">
                        <label for="">Disabled</label>
                        <input
                            type="checkbox"
                            bind:checked={$entity.disabled} />
                    </div>
                </fieldset>
                <fieldset>
                    <div class="field">
                        <CategoryList bind:categories={$entity.categories} />
                    </div>
                    <div class="field">
                        <label for="">Reference</label>
                        <input
                            type="number"
                            bind:value={$entity.reference} />
                    </div>
                </fieldset>
                <fieldset>
                    <div class="field">
                        <label for="">Notes</label>
                        <textarea bind:value={$entity.notes} name="" id="" rows="3" />
                    </div>
                </fieldset>
            </form>
        </TabPanel>
        <TabPanel />
        <TabPanel>
            <Features {entity} bind:features={$entity.features} />
        </TabPanel>
        <TabPanel component={MeleeWeapons} props={{ entity }} />
        <TabPanel component={RangedWeapons} props={{ entity }} />
        <TabPanel>
            <ProseMirror bind:content={$entity.userDescription} />
        </TabPanel>
    </Tabs>
{/if}
