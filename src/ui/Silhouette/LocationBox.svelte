<script lang="ts">
    import { HitLocation } from "@app/gurps/resources/character";
    import Meter from "@components/Form/Meter.svelte";
    import { getContext } from "svelte";
    export let location: HitLocation;
    const state = getContext<any>("sheet");
    const dt = state.sub("hitLocationDamage", location.name);
</script>

<div class="location" class:crippled={location.isCrippled}>
    <div class="location-name">{location.name}</div>
    <div class="flex justify-center py-1">
        <span class="text-xs">DR:{location.damageResistance}</span>
    </div>
    <input
        type="number"
        class="damage-input"
        placeholder="0"
        bind:value={$dt}
    />
    <Meter max={location.crippleThreshold} value={$dt} />
</div>

<style lang="postcss">
    .location {
        @apply bg-gray-700 text-white text-center text-xs max-w-full truncate;
    }
    .location-name {
        @apply break-all text-lg;
    }
    .location.crippled {
        @apply bg-red-700;
    }
    .damage-input {
        @apply w-full outline-none block;
    }
    input {
        @apply text-center bg-transparent;
    }
</style>
