<svelte:options accessors={true} />

<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import JSONEditor, { JSONEditorOptions } from "jsoneditor";
    const dispatch = createEventDispatcher();
    let classList = "";
    export { classList as class };
    export let editor: JSONEditor;
    let editorElement;
    export let data = {};
    $: if (editor) editor.set(data);
    export let options: JSONEditorOptions = {
        modes: ["tree", "code"],
        onChange() {
            try {
                let dataChanges = editor.get();
                data = null;
                data = dataChanges;
            } catch (err) {}
        },
    };
    onMount(() => {
        editor = new JSONEditor(editorElement, options);
        editor.set(data);
        const meta = document.querySelector("meta");
        if (!meta) {
            const meta = document.createElement("meta");
            meta.setAttribute("charset", "utf-8");
            editorElement.ownerDocument.head.append(meta);
        } else {
            const charset = meta.getAttribute("charset");
            if (charset !== "utf-8") {
                meta.setAttribute("charset", "utf-8");
            }
        }
        return () => editor.destroy();
    });
</script>

<slot {editor} />
<section class={classList} data-json-editor bind:this={editorElement} />

<style>
</style>
