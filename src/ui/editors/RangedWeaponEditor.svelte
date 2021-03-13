<script context="module" lang="ts">
    import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
    import SkillDefaults from "./panels/SkillDefaults.svelte";
    import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
    import { RangedWeapon } from "@internal";
    import { State } from "rxdeep";
</script>

<script lang="ts">
    export let state$: RangedWeapon;
    const defaults$ = state$.sub("defaults");
    const userDescription$ = state$.sub("userDescription");
</script>

<Tabs>
    <TabList>
        <Tab>Data</Tab>
        <Tab>Defaults</Tab>
        <Tab>User Description</Tab>
    </TabList>
    <TabPanel>
        <form>
            <label>
                <span>Usage</span>
                <input type="text" bind:value={$state$.usage} />
            </label>
            <fieldset>
                <label>
                    <span>Damage</span>
                    <input type="text" bind:value={$state$.damage} />
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
                <input type="text" bind:value={$state$.rateOfFire} />
            </label>
            <label>
                <span>Range</span>
                <input type="text" bind:value={$state$.range} />
            </label>
            <label>
                <span>Acc</span>
                <input type="text" bind:value={$state$.accuracy} />
            </label>
            <label>
                <span>Shots</span>
                <input type="text" bind:value={$state$.shots} />
            </label>
            <label>
                <span>Bulk</span>
                <input type="number" bind:value={$state$.bulk} />
            </label>
            <label>
                <span>Recoil</span>
                <input type="text" bind:value={$state$.recoil} />
            </label>
            <label>
                <span>Strength</span>
                <input type="text" bind:value={$state$.strength} />
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
