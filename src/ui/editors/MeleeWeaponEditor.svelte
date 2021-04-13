<script context="module" lang="ts">
    import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
    import SkillDefaults from "./panels/SkillDefaults.svelte";
    import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
    import { State } from "rxdeep";
</script>

<script lang="ts">
    export let entity;
</script>

<Tabs bind:initTab={$entity.initTab}>
    <TabList>
        <Tab>Data</Tab>
        <Tab>Defaults</Tab>
        <Tab>User Description</Tab>
    </TabList>
    <TabPanel>
        <form>
            <fieldset>
                <label>
                    <span>Usage</span>
                    <input type="text" bind:value={$entity.usage} />
                </label>
                <label>
                    <span>Info</span>
                    <input type="text" bind:value={$entity.info} />
                </label>
            </fieldset>
            <fieldset>
                <label>
                    <span>Damage</span>
                    <input type="text" bind:value={$entity.damage} />
                </label>
                <label>
                    <span>Damage Type</span>
                    <input type="text" bind:value={$entity.damageType} />
                </label>
                <label>
                    <span>AD</span>
                    <input type="number" min="0" />
                </label>
            </fieldset>
            <fieldset>
                <label>
                    <span>Parry</span>
                    <input type="number" bind:value={$entity.parryBonus} />
                </label>
                <label>
                    <span>Block</span>
                    <input type="number" bind:value={$entity.blockBonus} />
                </label>
            </fieldset>
            <label>
                <span>Reach</span>
                <input type="text" bind:value={$entity.reach} />
            </label>
            <label>
                <span>Strength</span>
                <input type="text" bind:value={$entity.strengthRequirement} />
            </label>
        </form>
    </TabPanel>
    <TabPanel>
        <SkillDefaults bind:defaults={$entity.defaults} />
    </TabPanel>
    <TabPanel>
        <ProseMirror bind:content={$entity.userDescription} />
    </TabPanel>
</Tabs>

<style>
</style>
