<script lang="ts">
    import { onMount, tick } from "svelte";
    import { slide } from "svelte/transition";
    let element: HTMLDialogElement;
    export let style = "";
    let classList = "";
    export { classList as class };
    export async function showModal() {
        element.showModal();
    }
    export async function close() {
        function hideAndClose() {
            element.classList.remove("hide");
            element.close();
            element.removeEventListener("webkitAnimationEnd", hideAndClose);
        }
        element.classList.add("hide");
        element.addEventListener("webkitAnimationEnd", hideAndClose);
    }
    function handleKeyDown(e: KeyboardEvent) {
        switch (e.key) {
            case "Escape": {
                close();
            }
        }
    }
    onMount(() => {});
</script>

<svelte:window on:keydown={handleKeyDown} />

<dialog bind:this={element} class="dialog {classList}" {style}>
    <slot {close} />
</dialog>

<style lang="postcss">
    :global(dialog[open]) {
        -webkit-animation: show 1s ease normal;
    }
    @-webkit-keyframes show {
        from {
            transform: translateY(-100vh);
        }
        to {
            transform: translateY(0%);
        }
    }
    dialog.hide {
        -webkit-animation: hide 1s ease normal;
    }
    @-webkit-keyframes hide {
        to {
            transform: translateY(-100vh);
        }
    }
    .dialog::backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-animation: none;
    }
    .dialog[open]::backdrop {
        -webkit-animation: show-backdrop 0.5s ease 0.2s normal;
    }
    .dialog.hide::backdrop {
        -webkit-animation: hide-backdrop 0.5s ease 0.2s normal;
    }
    @-webkit-keyframes show-backdrop {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @-webkit-keyframes hide-backdrop {
        to {
            opacity: 0;
        }
    }
</style>
