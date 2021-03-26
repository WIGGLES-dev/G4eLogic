<script lang="ts">
    import { SkillDifficulty } from "@app/gurps/resources/skill";
    import { TechniqueDifficulty } from "@app/gurps/resources/technique";
    export let technique: boolean = false;
    export let difficulty: TechniqueDifficulty | SkillDifficulty;
</script>

<select bind:value={difficulty}>
    <option value={undefined} />
    {#if technique}
        <option value={SkillDifficulty.Average}>
            {SkillDifficulty.Average}
        </option>
        <option value={SkillDifficulty.Hard}>{SkillDifficulty.Hard}</option>
    {:else}
        {#each Object.values(SkillDifficulty) as difficulty, i (i)}
            <option value={difficulty}>{difficulty}</option>
        {/each}
    {/if}
</select>

<style lang="postcss">
</style>
