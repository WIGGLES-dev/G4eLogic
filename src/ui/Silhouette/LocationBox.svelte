<script lang='ts'>
    import { HitLocation } from '@internal';
    import Meter from '@components/Form/Meter.svelte';
    export let location: HitLocation;
    const character = location.host;
    const dt = character.sub('hitLocationDamage').sub(location.name);
</script>
<style>
    .location {
        @apply bg-gray-700 text-white text-center text-xs max-w-full truncate;
    }
    .location-name {
        @apply truncate;
    }
    .location.crippled {
        @apply bg-red-700;
    }
    span.fas.fa-shield {
        @apply pr-1;
    }
    .damage-input {
        @apply w-10 outline-none;
    }
    .cripple-threshold {
        @apply w-10 outline-none;
    }
    input {
        @apply text-white text-center;
    }
</style>

<div 
    class="location"
    class:crippled={location.isCrippled()}
>
    <div class="flex">
        <div class="flex flex-col py-2">
            <span class="fas fa-shield">{location.context.armorBonus}</span>
            {#if location.isCrippled()}
                <span class="fas fa-user-injured"></span>
            {/if}
        </div>
        <div class="flex flex-col">
            <div class="location-name">{location.name}</div>
            <input 
                type="number"
                class='damage-input'
                placeholder='0'
                bind:value={$dt}
            >
        </div>
    </div>
    <Meter 
        max={location.crippleThreshold()}
        value={$dt}
    />
</div>