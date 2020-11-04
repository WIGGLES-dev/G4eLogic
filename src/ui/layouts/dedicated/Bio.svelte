<script>
    import { getContext } from "svelte";
    import { Appearance } from "@sheet/keys";
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
                <input type="text" bind:value={$character.profile.name} /></label>
            <label for="">Nickname
                <input type="text" bind:value={$character.profile.nickName} /></label>
            <div class="flex">
                <label for="">Sex
                    <input type="text" bind:value={$character.profile.sex} /></label>
                <label for="">Gender
                    <input type="text" bind:value={$character.profile.gender} /></label>
            </div>
            <div class="flex">
                <label for="" class="flex-1">Race<input
                        type="text"
                        bind:value={$character.profile.race} /></label>
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
                        bind:value={$character.profile.handedness} /></label>
                <label for="" class="flex-1">Reach <input type="text" /></label>
            </div>
            <label class="w-full text-center" for="">Reaction
                <textarea
                    name=""
                    id=""
                    rows="4"
                    bind:value={$character.profile.reaction} /></label>
        </div>
        <div class="row-span-2">
            <Cropper bind:src={$character.profile.portrait.href} />
        </div>
        <div class="flex flex-col">
            <div class="section-header">PHYSICAL</div>
            <div class="flex">
                <label for="">Age
                    <input type="text" bind:value={$character.profile.age} /></label>
                <label for="">Appearance
                    <select name="" id="" bind:value={$character.profile.appearance}>
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
                    <input type="text" bind:value={$character.profile.weight} /></label>
                <label for="" class="flex-1">Height
                    <input type="text" bind:value={$character.profile.height} /></label>
            </div>
            <div class="flex">
                <label for="">Build
                    <input type="text" bind:value={$character.profile.build} /></label>
                <label for="">Skin
                    <input type="text" bind:value={$character.profile.skin} /></label>
            </div>

            <div class="flex">
                <label for="">Hair
                    <input type="text" bind:value={$character.profile.hair} /></label>
                <label for="">Facial Hair
                    <input
                        type="text"
                        bind:value={$character.profile.facialHair} /></label>
            </div>

            <div class="flex">
                <label for="">Eyes
                    <input type="text" bind:value={$character.profile.eyes} /></label>
                <label for="">Voice
                    <input type="text" bind:value={$character.profile.voice} /></label>
            </div>

            <label class="text-center" for="">Features<textarea
                    name=""
                    id=""
                    rows="4"
                    bind:value={$character.profile.appearanceFeatures} /></label>
        </div>
        <div class="flex flex-col">
            <div class="section-header">BACKGROUND</div>
            <div class="flex">
                <label for="">Birthday
                    <input type="text" bind:value={$character.profile.birthday} /></label>
                <label for="">Birthplace
                    <input
                        type="text"
                        bind:value={$character.profile.birthPlace} /></label>
            </div>
            <div class="flex">
                <label for="">Status<input
                        type="text"
                        bind:value={$character.profile.status} /></label>
                <label for="">Wealth<input
                        type="text"
                        bind:value={$character.profile.wealth} /></label>
            </div>
            <div class="flex">
                <label for="">Income<input
                        type="text"
                        bind:value={$character.profile.income} /></label>
                <label for="">Expenses<input
                        type="text"
                        bind:value={$character.profile.expenses} /></label>
            </div>
            <div class="flex">
                <label for="">Affiliation<input
                        type="text"
                        bind:value={$character.profile.affiliation} /></label>
                <label for="">Base<input
                        type="text"
                        bind:value={$character.profile.base} /></label>
            </div>
            <label class="text-center" for="">Family
                <textarea
                    name=""
                    id=""
                    rows="4"
                    bind:value={$character.profile.family} /></label>
        </div>
        <div class="flex flex-col">
            <div class="section-header">MISC</div>
            <label for="">Religion<input
                    type="text"
                    bind:value={$character.profile.religion} /></label>
            <label for="">Education<input
                    type="text"
                    bind:value={$character.profile.education} /></label>
            <label for="">Citizenship<input
                    type="text"
                    bind:value={$character.profile.citizenship} /></label>
            <label for="">Orientation<input
                    type="text"
                    bind:value={$character.profile.orientation} /></label>
            <label class="text-center" for="">Other<textarea
                    name=""
                    id=""
                    rows="4"
                    bind:value={$character.profile.other} /></label>
        </div>
    </div>
</section>
