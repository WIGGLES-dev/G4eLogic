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
            <div class="flex">
                <label for="">Parry
                    <input type="text" bind:value={$entity.parry} /></label>
                <label for="">Block
                    <input type="text" bind:value={$entity.block} /></label>
            </div>
            <label for="">Reach
                <input type="text" bind:value={$entity.reach} /></label>
            <label for="">Strength
                <input type="text" bind:value={$entity.strength} /></label>
        </form>
    </TabPanel>
    <TabPanel component={SkillDefaults} props={{ entity }} />
</Tabs>
