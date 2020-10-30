<script>
    import Form from "@ui/form/Form";
    import { Tabs, Tab, TabPanel, TabList } from "@ui/tabs/tabs";
    import SkillDefaults from "./panels/SkillDefaults";
    export let entity;
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
            <label for="">Usage
                <input type="text" bind:value={$entity.usage} /></label>
            <div class="flex">
                <label for="">Damage
                    <input type="text" bind:value={$entity.damage} /></label>
                <label for="">Damage Type <input type="text" /></label>
                <label for="">AD<input type="number" min="0" /></label>
            </div>
            <label for="">ROF
                <input type="text" bind:value={$entity.rateOfFire} /></label>
            <label for="">Range
                <input type="text" bind:value={$entity.range} /></label>
            <label>Acc<input
                    type="text"
                    bind:value={$entity.accuracy} /></label>
            <label for="">Shots
                <input type="text" bind:value={$entity.shots} /></label>
            <label for="">Bulk
                <input type="number" bind:value={$entity.bulk} /></label>
            <label for="">Recoil<input
                    type="text"
                    bind:value={$entity.recoil} /></label>
            <label for="">Strength
                <input type="text" bind:value={$entity.strength} /></label>
        </Form>
    </TabPanel>
    <TabPanel component={SkillDefaults} props={{ entity: $entity }} />
</Tabs>
