<script lang="ts" context="module">
    export interface TemplatePart {
        path?: (string | number)[];
        processed?: string;
        type: "text" | "number" | "select";
        options?: [label: string, value?: string];
        class?: string;
        style?: string;
    }
    export type Template = TemplatePart[];
</script>

<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { bind } from "@utils/use";
    import type { TreeNode } from "@components/Tree.svelte";
    import { getEditorContext } from "@app/ui/Editor.svelte";
    const { processed$, state } = getEditorContext<any>();
    export let node: TreeNode;
    export let template = [] as Template;
</script>

{#each template as part, i (i)}
    <td
        contenteditable={part.type === "text"}
        style={part.style}
        class={part.class}
        use:bind={node.state.sub(...part.path)}
    >
        {#if part.type === "number"}
            <input type={part.type} use:bind={node.state.sub(...part.path)} />
        {:else if part.type === "select"}
            <select use:bind={node.state.sub(...part.path)}>
                {#each part.options as option}
                    <option value={option[1] || option[0]}>
                        {option[0] || option[1]}
                    </option>
                {/each}
            </select>
        {/if}
    </td>
{/each}
