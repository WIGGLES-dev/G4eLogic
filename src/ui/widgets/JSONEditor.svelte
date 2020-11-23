<script>
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import JSONEditor from "jsoneditor";
    import { transplant } from "@internal";

    const dispatch = createEventDispatcher();
    export let editor;
    let editorElement;
    export let data = {};
    export let options = {
        modes: ["tree", "text"],
        onChange(e) {
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
            editorElement.ownerDocument.head.appendChild(meta);
        } else {
            if (!meta.getAttribute("charset") === "utf-8") {
                meta.setAttribute("charset", "utf-8");
            }
        }
    });
</script>

<style>
</style>

<svelte:options accessors={true} />

<section class="h-full" data-json-editor bind:this={editorElement} />
