<script lang="ts">
    import { onMount } from "svelte";
    let element: HTMLDivElement;
    export let tag: string;
    let classList = "";
    export { classList as class };
    $: if (element) {
        const replace = document.createElement(tag);
        const children = Array.from(element.childNodes);
        replace.append(...children);
        element.replaceWith(replace);
    }
</script>

<div bind:this={element}>
    <slot />
</div>
