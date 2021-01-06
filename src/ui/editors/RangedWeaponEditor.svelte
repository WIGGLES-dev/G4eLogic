<script lang='ts'>
    import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
    import SkillDefaults from "./panels/SkillDefaults.svelte";
    import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
    import { RangedWeapon } from '@internal';
    export let id: string
    export let entity = new RangedWeapon({id, type: RangedWeapon.type});
</script>

<style>

</style>

<Tabs>
    <TabList>
        <Tab>Data</Tab>
        <Tab>Defaults</Tab>
        <Tab>User Description</Tab>
    </TabList>
    <TabPanel>
        <form>
            <div class="field">
                <label for="">Usage</label>
                <input type="text" bind:value={$entity.usage} />
            </div>
            <fieldset>
                <div class="field">
                    <label for="">Damage</label>
                    <input type="text" bind:value={$entity.damage} />
                </div>
                <div class="field">
                    <label for="">Damage Type</label>
                    <input type="text" />
                </div>
                <div class="field">
                    <label for="">AD</label>
                    <input type="number" min="0" />
                </div>
            </fieldset>
            <div class="field">
                <label for="">ROF</label>
                <input type="text" bind:value={$entity.rateOfFire} />
            </div>
            <div class="field">
                <label for="">Range</label>
                <input type="text" bind:value={$entity.range} />
            </div>
            <div class="field">
                <label for=''>Acc</label>
                <input
                    type="text"
                    bind:value={$entity.accuracy} />
            </div>
            <div class="field">
                <label for="">Shots</label>
                <input type="text" bind:value={$entity.shots} />
            </div>
            <div class="field">
                <label for="">Bulk</label>
                <input type="number" bind:value={$entity.bulk} />
            </div>
            <div class="field">
                <label for="">Recoil</label>
                <input
                    type="text"
                    bind:value={$entity.recoil} />
            </div>
            <div class="field">
                <label for="">Strength</label>
                <input type="text" bind:value={$entity.strength} />
            </div>
        </form>
    </TabPanel>
    <TabPanel>
        <SkillDefaults {entity} bind:defaults={$entity.defaults} />
    </TabPanel>
    <TabPanel>
        <ProseMirror bind:content={$entity.userDescription} />
    </TabPanel>
</Tabs>
