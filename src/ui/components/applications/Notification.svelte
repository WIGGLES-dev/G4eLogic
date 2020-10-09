<script>
    import Application from "./Application.svelte";

    export let type = "message";
    export let message = "";
</script>

<style>
    section {
        @apply absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>

<Application>
    <section class="p-3 absolute"><span>{message}</span></section>
</Application>