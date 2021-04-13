<script context="module" lang="ts">
    import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
    import SkillDefaults from "./panels/SkillDefaults.svelte";
    import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
    import { State } from "rxdeep";
</script>

<script lang="ts">
    export let entity;
    const defaults$ = entity.sub("defaults");
    const userDescription$ = entity.sub("userDescription");
</script>

<Tabs bind:initTab={$entity.initTab}>
    <TabList>
        <Tab>Data</Tab>
        <Tab>Defaults</Tab>
        <Tab>User Description</Tab>
    </TabList>
    <TabPanel>
        <form>
            <label>
                <span>Usage</span>
                <input type="text" bind:value={$entity.usage} />
            </label>
            <fieldset>
                <label>
                    <span>Damage</span>
                    <input type="text" bind:value={$entity.damage} />
                </label>
                <label>
                    <span>Damage Type</span>
                    <input type="text" />
                </label>
                <label>
                    <span>AD</span>
                    <input type="number" min="0" />
                </label>
            </fieldset>
            <label>
                <span>ROF</span>
                <input type="text" bind:value={$entity.rateOfFire} />
            </label>
            <label>
                <span>Range</span>
                <input type="text" bind:value={$entity.range} />
            </label>
            <label>
                <span>Acc</span>
                <input type="text" bind:value={$entity.accuracy} />
            </label>
            <label>
                <span>Shots</span>
                <input type="text" bind:value={$entity.shots} />
            </label>
            <label>
                <span>Bulk</span>
                <input type="number" bind:value={$entity.bulk} />
            </label>
            <label>
                <span>Recoil</span>
                <input type="text" bind:value={$entity.recoil} />
            </label>
            <label>
                <span>Strength</span>
                <input type="text" bind:value={$entity.strengthRequirement} />
            </label>
        </form>
    </TabPanel>
    <TabPanel>
        <SkillDefaults bind:defaults={$defaults$} />
    </TabPanel>
    <TabPanel>
        <ProseMirror bind:content={$userDescription$} />
    </TabPanel>
</Tabs>

<style>
</style>
