<script>
    import { getContext } from "svelte";
    const { character } = getContext("app");
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

<div class="p-2" />
<section class="px-4">
    <div class="grid gap-2">
        <div class="flex flex-col">
            <div class="section-header">GENERAL</div>
            <label for="">Name <input type="text" /></label>
            <label for="">Nickname <input type="text" /></label>
            <div class="flex">
                <label for="">Sex <input type="text" /></label>
                <label for="">Gender <input type="text" /></label>
            </div>
            <div class="flex">
                <label for="" class="flex-1">Race<input type="number" /></label>
                <label for="" class="flex-1">Size
                    <input type="number" /></label>
            </div>
            <div class="flex">
                <label for="">Handedness <input type="text" /></label>
                <label for="" class="flex-1">Reach <input type="text" /></label>
            </div>
            <label class="w-full text-center" for="">Reaction
                <textarea name="" id="" rows="4" /></label>
        </div>
        <div class="row-span-2">
            <img
                class="m-auto"
                src="data:image/png;base64,{character.profile.portrait}"
                alt="" />
        </div>
        <div class="flex flex-col">
            <div class="section-header">PHYSICAL</div>
            <div class="flex">
                <label for="">Age <input type="text" /></label>
                <label for="">Appearance
                    <select name="" id="">
                        <option value="">Horrific</option>
                        <option value="">Mounstrous</option>
                        <option value="">Hideous</option>
                        <option value="">Unattractive</option>
                        <option value="" selected>Average</option>
                        <option value="">Attractive</option>
                        <option value="">Handsome/Beautiful</option>
                        <option value="">Very Handsome/Beauitiful</option>
                        <option value="">Transcendent</option>
                    </select></label>
            </div>
            <div class="flex">
                <label for="" class="flex-1">Weight
                    <input type="text" /></label>
                <label for="" class="flex-1">Height
                    <input type="text" /></label>
            </div>
            <div class="flex">
                <label for="">Build <input type="text" /></label>
                <label for="">Skin <input type="text" /></label>
            </div>

            <div class="flex">
                <label for="">Hair <input type="text" /></label>
                <label for="">Facial Hair <input type="text" /></label>
            </div>

            <div class="flex">
                <label for="">Eyes <input type="text" /></label>
                <label for="">Voice <input type="text" /></label>
            </div>

            <label class="text-center" for="">Features<textarea
                    name=""
                    id=""
                    rows="4" /></label>
        </div>
        <div class="flex flex-col">
            <div class="section-header">BACKGROUND</div>
            <div class="flex">
                <label for="">Birthday <input type="text" /></label>
                <label for="">Birthplace <input type="text" /></label>
            </div>
            <div class="flex">
                <label for="">Status<input type="text" /></label>
                <label for="">Wealth<input type="text" /></label>
            </div>
            <div class="flex">
                <label for="">Income<input type="text" /></label>
                <label for="">Expenses<input type="text" /></label>
            </div>
            <div class="flex">
                <label for="">Affiliation<input type="text" /></label>
                <label for="">Base<input type="text" /></label>
            </div>
            <label class="text-center" for="">Family
                <textarea name="" id="" rows="4" /></label>
        </div>
        <div class="flex flex-col">
            <div class="section-header">MISC</div>
            <label for="">Religion<input type="text" /></label>
            <label for="">Education<input type="text" /></label>
            <label for="">Citizenship<input type="text" /></label>
            <label for="">Orientation<input type="text" /></label>
            <label class="text-center" for="">Other<textarea
                    name=""
                    id=""
                    rows="4" /></label>
        </div>
    </div>
</section>
