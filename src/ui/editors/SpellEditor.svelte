<script lang='ts'>
    import CategoryList from "@components/Form/CategoryList.svelte";
    import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";

    import AttributeOptions from "@ui/options/AttributeOptions.svelte";
    import DifficultyOptions from "@ui/options/DifficultyOptions.svelte";

    import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";

    import Features from "./panels/Features.svelte";
    import MeleeWeapons from "./panels/MeleeWeapons.svelte";
    import RangedWeapons from "./panels/RangedWeapons.svelte";

    import { Spell } from '@internal';

    export let id: string
    export let entity = new Spell({id, type: Spell.type})
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
            <Tab>Defaults</Tab>
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
                        <label for="">Name</label>
                        <input
                            class="flex-1"
                            type="text"
                            bind:value={$entity.name} />
                    </div>
                    <div class="field">
                        <label for="">Specialization</label>
                        <input
                            type="text"
                            bind:value={$entity.specialization} />
                    </div>
                </fieldset>
                <fieldset>
                    <div class="field">
                        <label for="">Signature</label>
                        <AttributeOptions
                            {entity}
                            signaturesOnly={true}
                            bind:attribute={$entity.signature} />
                    </div>
                    <div class="field">
                        <label for="">Difficulty</label>
                        <DifficultyOptions
                            bind:difficulty={$entity.difficulty} />
                    </div>
                    <div class="field">
                        <label for="">Points</label>
                        <input type="number" bind:value={$entity.points} />
                    </div>
                    <div class="field">
                        <label for="">Final Level</label>
                        <output>{Math.floor($level$)}</output>
                    </div>
                </fieldset>
                <fieldset>
                    <div class="field">
                        <label for="">TL</label>
                        <input
                            type="text"
                            bind:value={$entity.techLevel} />
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
                        <label for="">Resist</label>
                        <input
                            type="text"
                            bind:value={$entity.resist} />
                    </div>
                    <div class="field">
                        <label for="">Class</label>
                        <input
                                type="text"
                                bind:value={$entity.class} />
                    </div>
                    <div class="field">
                        <label for="">Cost</label>
                        <input
                            type="text"
                            bind:value={$entity.castingCost} />
                    </div>
                    <div class="field">
                        <label for="">Maintain</label>
                        <input
                                type="text"
                                bind:value={$entity.maintenanceCost} />
                    </div>
                    <div class="field">
                        <label for="">Time</label>
                        <input
                                type="text"
                                bind:value={$entity.castingTime} />
                    </div>
                    <div class="field">
                        <label for="">Duration</label>
                        <input
                            type="text"
                            bind:value={$entity.durations} />
                    </div>
                </fieldset>
                <fieldset>
                    <CategoryList bind:categories={$entity.categories} />
                    <div class="field">
                        <label for="">Reference</label>
                        <input
                            type="text"
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
