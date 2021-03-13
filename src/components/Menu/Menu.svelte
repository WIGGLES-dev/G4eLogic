<script context="module" lang="ts">
    import Popper from "@components/Popper.svelte";
    import { createEventDispatcher } from "svelte";
    import Option from "./Option.svelte";
    export interface MenuOption {
        label: string;
        callback?: () => void;
        show?: () => boolean;
        options?: MenuOption[];
        interactive?: boolean;
        class: string
        style: string
    }
</script>

<script lang="ts">
    const dispatch = createEventDispatcher();
    export let reference: HTMLElement | MouseEvent;
    export let rendered = false;
    export let options: MenuOption[];
    let uList: HTMLUListElement;
    const modifiers = [
        {
            name: "offset",
            options: {
                offset: [-2, -2],
            },
        },
    ];
    export function close(e: Event) {
        const target = e?.target as HTMLElement;
        if (rendered && uList && !uList.contains(target)) {
            dispatch("close");
            rendered = false;
        }
    }
</script>

<svelte:window
    on:scroll={close}
    on:click|capture={close}
    on:contextmenu|capture={close}
/>
{#if options instanceof Array && rendered}
    <Popper bind:reference placement="right-start" strategy="fixed" {modifiers}>
        <slot name="menu">
            <ul
                class="select-none shadow bg-white"
                bind:this={uList}
                on:contextmenu|preventDefault
            >
                <slot name="menu-before" />
                {#each options as option, i (i)}
                    <Option {...option} on:close={close}>
                        <slot
                            label={option.label}
                            callback={option.callback || (() => {})}
                            show={option.show || (() => true)}
                            options={option.options}
                            interactive={option.interactive || false}
                        />
                    </Option>
                {/each}
                <slot name="menu-after" />
            </ul>
        </slot>
    </Popper>
{/if}

<style>
</style>
