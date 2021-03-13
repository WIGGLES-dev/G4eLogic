<script lang='ts'>
    import { onMount } from 'svelte';
    export let modal: HTMLDialogElement;
    export let rendered = false;
    export let width: string
    export let height: string
    let classList: string
    export { classList as class }
    function apply() {
        rendered = false;
    }
    function cancel() {
        rendered = false;
    }
    $: if (modal) rendered ? modal.show() : modal.close()
    $: style =  `
        width: ${width};
        height: ${height}
    `
</script>

<dialog bind:this={modal} {style} class='{classList}'>
    <section class='h-full flex flex-col'>
        <div class="flex-1">
            <slot >
                
            </slot>
        </div>
        <menu class='flex'>
            <button on:click={apply}>Apply</button>
            <button on:click={cancel}>Cancel</button>
        </menu>
    </section>   
</dialog>