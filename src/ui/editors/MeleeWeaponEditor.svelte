<script lang='ts'>
    import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
    import SkillDefaults from "./panels/SkillDefaults.svelte";
    import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
    import { MeleeWeapon } from '@internal';
    export let id: string
    export let entity: MeleeWeapon = new MeleeWeapon({id, type: MeleeWeapon.type});
</script>

<style>

</style>

{#if entity.exists}
    <Tabs>
        <TabList>
            <Tab>Data</Tab>
            <Tab>Defaults</Tab>
            <Tab>User Description</Tab>
        </TabList>
        <TabPanel>
            <form>
                <fieldset>
                    <div class="field">
                        <label for="">Usage</label>
                        <input type="text" bind:value={$entity.usage} />
                    </div>
                    <div class="field">
                        <label for=""></label>
                        <input type="text" bind:value={$entity.info} />
                    </div>
                </fieldset>
                <fieldset>
                    <div class="field">
                        <label for="">Damage</label>
                        <input type="text" bind:value={$entity.damage} />
                    </div>
                    <div class="field">
                        <label for="">Damage Type</label>
                        <input
                            type="text"
                            bind:value={$entity.damageType} />
                    </div>
                    <div class="field">
                        <label for="">AD</label>
                        <input type="number" min="0" />
                    </div>
                </fieldset>
                <fieldset>
                    <div class="field">
                        <label for="">Parry</label>
                        <input type="number" bind:value={$entity.parry} />
                    </div>
                    <div class="field">
                        <label for="">Block</label>
                        <input type="number" bind:value={$entity.block} />
                    </div>
                </fieldset>
                <div class="field">
                    <label for="">Reach</label>
                    <input type="text" bind:value={$entity.reach} />
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
{/if}