<script>
    import { getContext } from "svelte";
    import { Appearance } from "@internal";
    import Cropper from "@ui/widgets/Cropper";
    const { character } = getContext("editor");
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
                <input type="text" bind:value={$character.name} /></label>
            <label for="">Nickname
                <input type="text" bind:value={$character.nickName} /></label>
            <div class="flex">
                <label for="">Sex
                    <input type="text" bind:value={$character.sex} /></label>
                <label for="">Gender
                    <input type="text" bind:value={$character.gender} /></label>
            </div>
            <div class="flex">
                <label for="" class="flex-1">Race<input
                        type="text"
                        bind:value={$character.race} /></label>
                <label for="" class="flex-1">Size
                    <input
                        type="number"
                        placeholder="0"
                        bind:value={$character.sizeModifier} /></label>
            </div>
            <div class="flex">
                <label for="">Handedness
                    <input
                        type="text"
                        bind:value={$character.handedness} /></label>
                <label for="" class="flex-1">Reach <input type="text" /></label>
            </div>
            <label class="w-full text-center" for="">Reaction
                <textarea rows="4" bind:value={$character.reaction} /></label>
        </div>
        <div class="row-span-2">
            <Cropper
                bind:src={$character.profile.portrait}
                bind:cropped={$character.profile.cropped} />
        </div>
        <div class="flex flex-col">
            <div class="section-header">PHYSICAL</div>
            <div class="flex">
                <label for="">Age
                    <input type="text" bind:value={$character.age} /></label>
                <label for="">Appearance
                    <select
                        name=""
                        id=""
                        bind:value={$character.profile.appearance}>
                        <option value={Appearance.Horrific}>Horrific</option>
                        <option value={Appearance.Monstrous}>Monstrous</option>
                        <option value={Appearance.Hideous}>Hideous</option>
                        <option value={Appearance.Unnatractive}>
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
                    <input type="text" bind:value={$character.weight} /></label>
                <label for="" class="flex-1">Height
                    <input type="text" bind:value={$character.height} /></label>
            </div>
            <div class="flex">
                <label for="">Build
                    <input type="text" bind:value={$character.build} /></label>
                <label for="">Skin
                    <input type="text" bind:value={$character.skin} /></label>
            </div>

            <div class="flex">
                <label for="">Hair
                    <input type="text" bind:value={$character.hair} /></label>
                <label for="">Facial Hair
                    <input
                        type="text"
                        bind:value={$character.facialHair} /></label>
            </div>

            <div class="flex">
                <label for="">Eyes
                    <input type="text" bind:value={$character.eyes} /></label>
                <label for="">Voice
                    <input type="text" bind:value={$character.voice} /></label>
            </div>

            <label class="text-center" for="">Features<textarea
                    name=""
                    id=""
                    rows="4"
                    bind:value={$character.appearanceFeatures} /></label>
        </div>
        <div class="flex flex-col">
            <div class="section-header">BACKGROUND</div>
            <div class="flex">
                <label for="">Birthday
                    <input
                        type="text"
                        bind:value={$character.birthday} /></label>
                <label for="">Birthplace
                    <input
                        type="text"
                        bind:value={$character.birthPlace} /></label>
            </div>
            <div class="flex">
                <label for="">Status<input
                        type="text"
                        bind:value={$character.status} /></label>
                <label for="">Wealth<input
                        type="text"
                        bind:value={$character.wealth} /></label>
            </div>
            <div class="flex">
                <label for="">Income<input
                        type="text"
                        bind:value={$character.income} /></label>
                <label for="">Expenses<input
                        type="text"
                        bind:value={$character.expenses} /></label>
            </div>
            <div class="flex">
                <label for="">Affiliation<input
                        type="text"
                        bind:value={$character.affiliation} /></label>
                <label for="">Base<input
                        type="text"
                        bind:value={$character.base} /></label>
            </div>
            <label class="text-center" for="">Family
                <textarea
                    name=""
                    id=""
                    rows="4"
                    bind:value={$character.family} /></label>
        </div>
        <div class="flex flex-col">
            <div class="section-header">MISC</div>
            <label for="">Religion<input
                    type="text"
                    bind:value={$character.religion} /></label>
            <label for="">Education<input
                    type="text"
                    bind:value={$character.education} /></label>
            <label for="">Citizenship<input
                    type="text"
                    bind:value={$character.citizenship} /></label>
            <label for="">Orientation<input
                    type="text"
                    bind:value={$character.orientation} /></label>
            <label class="text-center" for="">Other<textarea
                    name=""
                    id=""
                    rows="4"
                    bind:value={$character.other} /></label>
        </div>
    </div>
</section>
