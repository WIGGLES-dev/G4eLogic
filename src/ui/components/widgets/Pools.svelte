<script>
    import { getContext } from "svelte";
    import { createTooltip } from "@ui/utils/popper";
    import Bar from "./Bar";

    const { character } = getContext("app");

    $: attributes = [...$character.attributeList.attributes.values()];

    $: pools = attributes.filter((attr) => isPool(attr));

    function isPool(attr) {
        return attr.hasTag("pool");
    }
</script>

<style>
    .grid {
        height: min-content;
    }
    .pool {
        @apply duration-300;
        transition-property: width;
    }
    .overflow {
    }
    .low {
    }
</style>

<section class="grid grid-cols-4 gap-y-1">
    <span class="text-center text-white bg-gray-700">POOL</span>
    <span class="text-center text-white bg-gray-700">CUR</span>
    <span class="text-center text-white bg-gray-700">MAX</span>
    <span class="text-center text-white bg-gray-700">MOD</span>
    {#each pools as attr, i (attr.id)}
        <div class="col-span-2">
            <div class="w-full flex">
                <span
                    use:createTooltip={{ context: attr, placement: 'bottom-start', tipclass: 'text-sm', tooltip: `${attr.ui.tooltip}` }}
                    class="text-center w-1/2 inline-block font-semibold uppercase">{attr.abbreviation}
                    {#if attr.costPerLevel}[{attr.pointsSpent()}]{/if}</span>
                <input
                    class="bg-transparent w-10 m-auto text-sm border-b border-gray-700 border-solid text-center outline-none"
                    type="number"
                    bind:value={attr.currentValue} />
            </div>
        </div>
        <input
            class="w-10 m-auto text-sm border-b border-gray-700 border-solid text-center outline-none"
            type="number"
            bind:value={attr.displayLevel} />
        <input
            type="number"
            bind:value={attr.modifier}
            class="w-10 m-auto text-sm border-b border-gray-700 border-solid text-center outline-none" />
        <div
            class="col-span-4 relative h-3 rounded-r-md border-b border-solid border-gray-700">
            <Bar
                max={attr.displayLevel}
                current={attr.currentValue}
                color={attr.color} />
        </div>
    {/each}
</section>
