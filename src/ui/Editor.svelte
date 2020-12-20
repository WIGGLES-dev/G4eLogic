<script lang='ts'>
    import {onMount, onDestroy} from "svelte";
    import {fromEvent, Subscription} from "rxjs";
    import {map} from "rxjs/operators"
    
    export let fields = [];

    const subscriptions: Set<Subscription> = new Set();
    function unsubscribe() {
        subscriptions.forEach(sub => sub.unsubscribe());
    }
    onDestroy(unsubscribe);

    function change(e: Event) {
        const target = e.target as HTMLElement;
        if (target instanceof HTMLInputElement) {
            const {value} = target;
        } else if (target instanceof HTMLSelectElement) {
            const {value} = target
        } else if (target instanceof HTMLTextAreaElement) {
            const {} = target
        }
    }

    function positionLabel(label: HTMLLabelElement, {} = {}) {
        
    }
</script>

<style>
</style>

<form>
    {#each fields as {
        id,
        type,
        width,
        classes,
        name,
        label,
        options,
    }, i (i)}
        {#if type === 'textarea'}
            <label use:positionLabel for="{name}">{label}</label>
            <textarea on:change={e => change(e)} {name} {id} cols="30" rows="10" class={classes} />
        {:else if type === 'select'}
            <label for="{name}">{label}</label>
            <select on:blur={e => change(e)} {name} {id}>
                {#each options as {
                    value,
                    label
                }, i (i)}
                    <option {value}>{label}</option>
                {/each}
            </select>
        {:else if type ==='radio'}
            {#each options as {
                value, 
                id,
                label
            }, i (i)}
                <label for="{id}">{label}</label>
                <input on:change={e => change(e)} type="radio" {id} {name} {value}/>
            {/each}
        {:else}
            <label use:positionLabel for="{name}">{label}</label>
            <input {name} {id} on:change={e => change(e)} {type} style="width:${width};" />
        {/if}
    {/each}
</form>
