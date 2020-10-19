<script>
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import JSONEditor from "jsoneditor";

    const dispatch = createEventDispatcher();

    export let editor;
    let editorElement;
    export let data = {};
    export let options = {
        modes: ["code", "tree"],
        onChange() {
            dispatch("onChange", { editor });
        },
        onChangeJSON(json) {
            dispatch("onChangeJSON", { editor, json });
        },
        onChangeText(jsonString) {
            dispatch("onChangeText", { editor, jsonString });
        },
    };

    onMount(() => {
        editor = new JSONEditor(editorElement, options);
        editor.set(data);
    });
</script>

<style>
</style>

<svelte:options accessors={true} />

<section class="h-full" data-json-editor bind:this={editorElement} />
