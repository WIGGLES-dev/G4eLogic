<script>
    import Form from "@ui/form/Form";
    import { Tabs, Tab, TabPanel, TabList } from "@ui/tabs/tabs";

    import SkillDefaults from "./panels/SkillDefaults";

    export let entity = {};
</script>

<style>
</style>

<Tabs>
    <TabList>
        <Tab>Data</Tab>
        <Tab>Defaults</Tab>
    </TabList>
    <TabPanel>
        <Form>
            <div class="flex">
                <label for="">Usage
                    <input type="text" bind:value={$entity.usage} />
                </label>
                <label for="">
                    <input type="text" bind:value={$entity.info} />
                </label>
            </div>
            <div class="flex">
                <label for="">Damage
                    <input type="text" bind:value={$entity.damage} /></label>
                <label for="">Damage Type
                    <input
                        type="text"
                        bind:value={$entity.damageType} /></label>
                <label for="">AD<input type="number" min="0" /></label>
            </div>
            <div class="flex">
                <label for="">Parry
                    <input type="number" bind:value={$entity.parry} /></label>
                <label for="">Block
                    <input type="number" bind:value={$entity.block} /></label>
            </div>
            <label for="">Reach
                <input type="text" bind:value={$entity.reach} /></label>
            <label for="">Strength
                <input type="text" bind:value={$entity.strength} /></label>
        </Form>
    </TabPanel>
    <TabPanel>
        <SkillDefaults {entity} bind:defaults={$entity.defaults} />
    </TabPanel>
</Tabs>
