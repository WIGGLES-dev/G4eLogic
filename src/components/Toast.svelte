<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import Hammer from "hammerjs";
    import { _ } from "ajv";
    export let ttl = 2250;
    let classList = "";
    export { classList as class };
    let pending = [] as string[];
    let uList: HTMLOListElement;
    export function notify(message: string) {
        pending = [...pending, message];
    }
    function remove(i: number) {
        let np = [...pending];
        if (typeof i === "number") {
            np = np.filter((_, index) => index !== i);
        }
        pending = np;
    }
    function slideRemove(node: HTMLElement) {
        const hammer = new Hammer(node);
        hammer.get("swipe").set({ direction: Hammer.DIRECTION_HORIZONTAL });
        hammer.on("swipe", (e) => {
            const toast = e.target.closest(`[data-toast-index]`);
            if (toast instanceof HTMLElement) {
                const i = +toast.dataset?.toastIndex;
                remove(i);
            }
        });
        return {
            destroy() {
                hammer.destroy();
            },
        };
    }
</script>

<ul class={classList} use:slideRemove bind:this={uList}>
    {#each pending as notification, i (i)}
        <li data-toast-index={i} transition:slide on:click={(e) => remove(i)}>
            {@html notification}
        </li>
    {/each}
</ul>

<style lang="postcss">
    li {
        @apply p-3 bg-gray-700 m-2 text-lg text-white;
    }
    ol {
        @apply max-h-screen overflow-auto;
    }
</style>
