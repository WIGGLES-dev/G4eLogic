<script>
    import { getContext } from "svelte";
    import { createTooltip } from "@ui/utils/popper";

    const { character } = getContext("app");

    $: attributes = [...$character.attributeList.attributes.values()];

    $: pools = attributes.filter((attr) => isPool(attr));

    function isPool(attr) {
        return attr.hasTag("pool");
    }

    function percentage(attr) {
        let cValue = attr.currentValue;
        let mValue = attr.displayLevel;
        const tValue = attr.tempValue;
        if ((tValue < mValue || tValue > mValue) && tValue !== 0) {
            mValue = tValue;
        }
        return Math.max(cValue / mValue, 0) * 100;
    }

    function transition() {}
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
    <span class="text-center text-white bg-gray-700">TEMP</span>
    {#each pools as attr, i (attr.id)}
        <div class="col-span-2">
            <div class="w-full flex">
                <span
                    class="text-center w-1/2 inline-block font-semibold uppercase"
                    use:createTooltip={{ context: attr, placement: 'bottom-start', tipclass: 'text-sm', tooltip: `${attr.ui.tooltip}` }}>{attr.abbreviation}</span>
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
            bind:value={attr.tempValue}
            min="0"
            class="w-10 m-auto text-sm border-b border-gray-700 border-solid text-center outline-none" />
        <div
            class="col-span-4 relative h-3 rounded-r-md border-b border-solid border-gray-700">
            <div
                style="width: {percentage(attr)}%; background-color:{attr.color};"
                class="absolute h-full max-w-full t-0 l-0 pointer-events-none rounded-r-md pool"
                class:overflow={percentage(attr) > 100}
                class:low={percentage(attr) < 33} />
        </div>
    {/each}
</section>
