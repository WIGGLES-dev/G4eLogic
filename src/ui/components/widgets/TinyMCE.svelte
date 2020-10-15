<script>
    import { create } from "@svgdotjs/svg.js";

    import { onMount } from "svelte";
    import tinymce from "tinymce";

    let textarea;
    let tinyMCE;

    async function createTinyMCE() {
        tinyMCE = await tinymce.init({
            target: textarea,
        });
        console.log(tinyMCE);
    }

    onMount(createTinyMCE);
</script>

<style>
</style>

<textarea name="" id="" class="w-full h-full" bind:this={textarea} />
