<script context="module" lang="ts">
    import { getContext } from "svelte";
    import { State } from "rxdeep";
    import Tree, { TreeSymbol, TreeNode } from "./Tree.svelte";
</script>

<script lang="ts">
    let classList: string;
    export { classList as class };
    export let style: string;
    export let sub: string | string[];
    export let contenteditable = true;
    const treectx = getContext<TreeNode>(TreeSymbol);
    const { state: node } = treectx;
    function getSub(sub: string | string[]): string[] {
        return sub instanceof Array
            ? sub
            : sub.includes(".")
            ? sub.split(".")
            : [sub];
    }
    const state = node.sub(...getSub(sub));
    function blur(e: Event) {
        const target = e.target as HTMLElement;
        if (state.value !== target.innerHTML) {
            state.value = target.innerHTML;
        }
    }
</script>

<slot {state} value={$state}>
    <div
        data-sub={sub}
        value={$state}
        class={classList}
        {style}
        {contenteditable}
        on:blur={blur}
    >
        {@html $state || ""}
    </div>
</slot>
