<script lang="ts">
    import { getContext } from "svelte";
    import { Appearance, Character, Valor } from "@internal";
    import Cropper from "@components/Cropper.svelte";
    const sheet = getContext<Character>("sheet");
</script>

<style>
    .section-header {
        @apply bg-gray-700 text-center text-white;
    }

    label {
        @apply underline;
    }

    input,
    select {
        @apply w-full border-b border-black border-solid outline-none;
    }

    div.flex > label {
        @apply flex-1;
    }

    textarea {
        @apply outline-none border border-black border-solid rounded mt-2 w-full;
    }

    .grid {
        grid-template-columns: 35% 1fr 35%;
        grid-template-rows: min-content min-content;
    }
</style>

<section class="px-4">
    <div class="grid gap-2">
        <div class="flex flex-col">
            <div class="section-header">GENERAL</div>
            <label for="">Name
                <input type="text" bind:value={$sheet.profile.name} /></label>
            <label for="">Nickname
                <input
                    type="text"
                    bind:value={$sheet.profile.nickName} /></label>
            <div class="flex">
                <label for="">Sex
                    <input
                        type="text"
                        bind:value={$sheet.profile.sex} /></label>
                <label for="">Gender
                    <input
                        type="text"
                        bind:value={$sheet.profile.gender} /></label>
            </div>
            <div class="flex">
                <label for="" class="flex-1">Race<input
                        type="text"
                        bind:value={$sheet.profile.race} /></label>
                <label for="" class="flex-1">Size
                    <input
                        type="number"
                        placeholder="0"
                        bind:value={$sheet.profile.sizeModifier} /></label>
            </div>
            <div class="flex">
                <label for="">Handedness
                    <input
                        type="text"
                        bind:value={$sheet.profile.handedness} /></label>
                <label for="" class="flex-1">Reach <input type="text" /></label>
            </div>
            <label class="w-full text-center" for="">Reaction
                <textarea
                    rows="4"
                    bind:value={$sheet.profile.reaction} /></label>
        </div>
        <div class="row-span-2">
            <Cropper
                fallback={Valor.assets.silhouette}
                bind:src={$sheet.profile.portrait}
                bind:cropped={$sheet.profile.cropped} />
        </div>
        <div class="flex flex-col">
            <div class="section-header">PHYSICAL</div>
            <div class="flex">
                <label for="">Age
                    <input
                        type="text"
                        bind:value={$sheet.profile.age} /></label>
                <label for="">Appearance
                    <select
                        name=""
                        id=""
                        bind:value={$sheet.profile.appearance}>
                        <option value={Appearance.Horrific}>Horrific</option>
                        <option value={Appearance.Monstrous}>Monstrous</option>
                        <option value={Appearance.Hideous}>Hideous</option>
                        <option value={Appearance.Unattractive}>
                            Unattractive
                        </option>
                        <option value={Appearance.Average} selected>
                            Average
                        </option>
                        <option value={Appearance.Attractive}>
                            Attractive
                        </option>
                        <option value={Appearance.Handsome_Beautiful}>
                            Handsome/Beautiful
                        </option>
                        <option value={Appearance.Very_Handsome_Beautiful}>
                            Very Handsome/Beauitiful
                        </option>
                        <option value={Appearance.Transcendent}>
                            Transcendent
                        </option>
                    </select></label>
            </div>
            <div class="flex">
                <label for="" class="flex-1">Weight
                    <input
                        type="text"
                        bind:value={$sheet.profile.weight} /></label>
                <label for="" class="flex-1">Height
                    <input
                        type="text"
                        bind:value={$sheet.profile.height} /></label>
            </div>
            <div class="flex">
                <label for="">Build
                    <input
                        type="text"
                        bind:value={$sheet.profile.build} /></label>
                <label for="">Skin
                    <input
                        type="text"
                        bind:value={$sheet.profile.skin} /></label>
            </div>

            <div class="flex">
                <label for="">Hair
                    <input
                        type="text"
                        bind:value={$sheet.profile.hair} /></label>
                <label for="">Facial Hair
                    <input
                        type="text"
                        bind:value={$sheet.profile.facialHair} /></label>
            </div>

            <div class="flex">
                <label for="">Eyes
                    <input
                        type="text"
                        bind:value={$sheet.profile.eyes} /></label>
                <label for="">Voice
                    <input
                        type="text"
                        bind:value={$sheet.profile.voice} /></label>
            </div>

            <label class="text-center" for="">Features<textarea
                    name=""
                    id=""
                    rows="4"
                    bind:value={$sheet.profile.appearanceFeatures} /></label>
        </div>
        <div class="flex flex-col">
            <div class="section-header">BACKGROUND</div>
            <div class="flex">
                <label for="">Birthday
                    <input
                        type="text"
                        bind:value={$sheet.profile.birthday} /></label>
                <label for="">Birthplace
                    <input
                        type="text"
                        bind:value={$sheet.profile.birthPlace} /></label>
            </div>
            <div class="flex">
                <label for="">Status<input
                        type="text"
                        bind:value={$sheet.profile.status} /></label>
                <label for="">Wealth<input
                        type="text"
                        bind:value={$sheet.profile.wealth} /></label>
            </div>
            <div class="flex">
                <label for="">Income<input
                        type="text"
                        bind:value={$sheet.profile.income} /></label>
                <label for="">Expenses<input
                        type="text"
                        bind:value={$sheet.profile.expenses} /></label>
            </div>
            <div class="flex">
                <label for="">Affiliation<input
                        type="text"
                        bind:value={$sheet.profile.affiliation} /></label>
                <label for="">Base<input
                        type="text"
                        bind:value={$sheet.profile.base} /></label>
            </div>
            <label class="text-center" for="">Family
                <textarea
                    name=""
                    id=""
                    rows="4"
                    bind:value={$sheet.profile.family} /></label>
        </div>
        <div class="flex flex-col">
            <div class="section-header">MISC</div>
            <label for="">Religion<input
                    type="text"
                    bind:value={$sheet.profile.religion} /></label>
            <label for="">Education<input
                    type="text"
                    bind:value={$sheet.profile.education} /></label>
            <label for="">Citizenship<input
                    type="text"
                    bind:value={$sheet.profile.citizenship} /></label>
            <label for="">Orientation<input
                    type="text"
                    bind:value={$sheet.profile.orientation} /></label>
            <label class="text-center" for="">Other<textarea
                    name=""
                    id=""
                    rows="4"
                    bind:value={$sheet.profile.other} /></label>
        </div>
    </div>
</section>
