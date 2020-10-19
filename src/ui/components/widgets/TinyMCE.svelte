<script>
    import { onMount, createEventDispatcher, afterUpdate } from "svelte";
    const dispatch = createEventDispatcher();

    export let options = {};
    export let content = "";

    let textarea;
    export let tinyMCE;

    async function createTinyMCE() {
        if (!tinyMCE)
            tinyMCE = await tinymce.init({
                options,
                target: textarea,
                setup,
            })[0];
    }

    function setup(editor) {
        editor.on("change", (e) => {
            content = e.target.getContent();
            dispatch("change", e);
        });
        editor.on("init", (e) => {
            e.target.setContent(content);
        });
    }

    onMount(createTinyMCE);
</script>

<style>
</style>

<textarea name="" id="" class="w-full h-full" bind:this={textarea} />
