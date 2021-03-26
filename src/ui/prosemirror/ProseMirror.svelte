<script context="module">
    import { EditorState } from "prosemirror-state";
    import { Schema, DOMParser } from "prosemirror-model";
    import { schema } from "prosemirror-schema-basic";
    import { addListNodes } from "prosemirror-schema-list";

    import { keymap } from "prosemirror-keymap";
    import { history } from "prosemirror-history";
    import { baseKeymap } from "prosemirror-commands";
    import { Plugin } from "prosemirror-state";
    import { dropCursor } from "prosemirror-dropcursor";
    import { gapCursor } from "prosemirror-gapcursor";
    import { menuBar } from "prosemirror-menu";

    import { buildMenuItems } from "./menu";
    import { buildKeymap } from "./keymap";
    import { buildInputRules } from "./inputrules";

    // Mix the nodes from prosemirror-schema-list into the basic schema to
    // create a schema with list support.
    const mySchema = new Schema({
        nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
        marks: schema.spec.marks,
    });

    const plugins = [
        buildInputRules(mySchema),
        keymap(buildKeymap(mySchema)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        menuBar({
            floating: false,
            content: buildMenuItems(mySchema).fullMenu,
        }),
        //history(),
        new Plugin({
            props: {
                attributes: {
                    class: "ProseMirror-example-setup-style",
                },
            },
        }),
    ];
    const state = EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(""),
        plugins,
    });
</script>

<script>
    import { onMount } from "svelte";
    import ProsemirrorEditor from "prosemirror-svelte";
    import { toJSON, fromJSON } from "prosemirror-svelte/state";

    export let content;

    let view;
    let prosemirror;
    let editorState = state;

    $: if (
        view &&
        typeof view.hasFocus === "function" &&
        !view.hasFocus() &&
        content
    ) {
        try {
            editorState = fromJSON(content, mySchema, plugins);
        } catch (err) {
            console.log(err);
        }
    }

    function handleChange(event) {
        try {
            editorState = event.detail.editorState;
            content = toJSON(editorState);
        } catch (err) {
            console.log(err);
        }
    }

    onMount(() => {
        try {
            editorState = fromJSON(content, mySchema, plugins);
        } catch (err) {
            console.log(err);
            editorState = state;
        }
    });
</script>

<svelte:window
    on:keydown|capture={(e) => {
        if (view.hasFocus()) {
            e.stopImmediatePropagation();
        }
    }}
/>

<ProsemirrorEditor
    debounceChangeEventsInterval={2000}
    bind:view
    bind:this={prosemirror}
    placeholder="Go ahead and type something"
    {editorState}
    on:change={handleChange}
/>

<style>
</style>
