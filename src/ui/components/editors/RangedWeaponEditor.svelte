<script>
    import { Tabs, Tab, TabPanel, TabList } from "@ui/index";
    import SkillDefaults from "./panels/SkillDefaults";
    export let entity;
</script>

<style>
    label {
        @apply flex p-2;
    }

    div.flex label,
    input {
        @apply flex-1;
    }

    div.flex {
        @apply flex-wrap;
    }

    input,
    select {
        @apply border-b border-black border-solid outline-none ml-1;
    }

    input {
        @apply h-full pl-1;
    }

    textarea {
        @apply outline-none border border-black border-solid rounded mt-2 w-full;
    }
</style>

<Tabs>
    <TabList>
        <Tab>Data</Tab>
        <Tab>Defaults</Tab>
    </TabList>
    <TabPanel>
        <form action="">
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
        </form>
    </TabPanel>
    <TabPanel component={SkillDefaults} props={{ entity }} />
</Tabs>
