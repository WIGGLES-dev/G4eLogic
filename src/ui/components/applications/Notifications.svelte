<script>
    import { onMount, onDestroy } from "svelte";
    import { toTop } from "@ui/utils/use";

    $: messages = new Set();

    onMount(() => {});
    onDestroy(() => {});

    export function postMessage(message) {
        if (!message) return;
        const { type = "message", text } = message;
        message.date = new Date();
        messages = messages.add(message);
        // setTimeout(() => {
        //     messages = messages.slice(0, -1);
        // }, 5000);
    }

    function deleteMessage(message) {
        messages.delete(message);
        messages = messages;
    }
</script>

<style>
    section {
        @apply fixed right-0 bottom-0 mt-32 z-50 overflow-y-scroll bg-gray-700;
        max-height: 40vh;
    }
    .message {
        @apply m-2 p-1 border border-white border-solid rounded-md text-white text-center break-words align-middle;
        width: 150px;
        max-width: 150px;
    }
</style>

<section use:toTop>
    {#each [...messages].reverse() as message, i (i)}
        <div on:click={() => deleteMessage(message)} class="message">
            <span
                class="text-sm italic underline">{message.date.toLocaleTimeString()}</span>
            <div>{message.text}</div>
        </div>
    {/each}
</section>
