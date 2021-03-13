<script context="module" lang="ts">
    import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
    import SkillDefaults from "./panels/SkillDefaults.svelte";
    import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
    import { MeleeWeapon } from "@internal";
    import { State } from "rxdeep";
</script>

<script lang="ts">
    export let state$: MeleeWeapon;
</script>

<Tabs>
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
                    <input type="text" bind:value={$state$.usage} />
                </label>
                <label>
                    <span>Info</span>
                    <input type="text" bind:value={$state$.info} />
                </label>
            </fieldset>
            <fieldset>
                <label>
                    <span>Damage</span>
                    <input type="text" bind:value={$state$.damage} />
                </label>
                <label>
                    <span>Damage Type</span>
                    <input type="text" bind:value={$state$.damageType} />
                </label>
                <label>
                    <span>AD</span>
                    <input type="number" min="0" />
                </label>
            </fieldset>
            <fieldset>
                <label>
                    <span>Parry</span>
                    <input type="number" bind:value={$state$.parry} />
                </label>
                <label>
                    <span>Block</span>
                    <input type="number" bind:value={$state$.block} />
                </label>
            </fieldset>
            <label>
                <span>Reach</span>
                <input type="text" bind:value={$state$.reach} />
            </label>
            <label>
                <span>Strength</span>
                <input type="text" bind:value={$state$.strength} />
            </label>
        </form>
    </TabPanel>
    <TabPanel>
        <SkillDefaults bind:defaults={$state$.defaults} />
    </TabPanel>
    <TabPanel>
        <ProseMirror bind:content={$state$.userDescription} />
    </TabPanel>
</Tabs>

<style>
</style>
