<script>
    import { onMount, getContext } from "svelte";
    import { createTooltip } from "@ui/utils/popper";
    import { hitLocationTemplate } from "@ui/tooltips/templates/HitLocation";
    import { frameInViewbox } from "@ui/utils/silhouette";
    import Bar from "./Bar";

    import {
        SVG,
        extend as SVGextend,
        Element as SVGElement,
    } from "@svgdotjs/svg.js";

    const { character, components } = getContext("editor");
    const { hitLocations$ } = character;
    export let height = "100%";
    export let width = "100%";
    export let scale = "1";

    const silhouette = {
        total: null,
        head: {
            skull: null,
            face: null,
            eyes: {
                left: null,
                right: null,
            },
            ears: {
                left: null,
                right: null,
            },
            nose: null,
        },
        torso: {
            neck: null,
            chest: null,
            abdomen: null,
            vitals: null,
            abdomen: null,
        },
        arms: {
            left: {
                shoulder: null,
                upperArm: null,
                elbow: null,
                forearm: null,
            },
            right: {
                shoulder: null,
                upperArm: null,
                elbow: null,
                forearm: null,
            },
        },
        legs: {
            left: {
                thigh: null,
                knee: null,
                shin: null,
            },
            right: {
                thigh: null,
                knee: null,
                shin: null,
            },
        },
        hands: {
            left: null,
            right: null,
        },
        feet: {
            left: null,
            right: null,
        },
    };
    const hud = {};
    const tooltips = {};

    let focusedLocation = null;
    let hiddenNodes = [];

    function hideAllUnfocusedNodes() {
        let nodes = draw.find(
            `[data-location-group]:not([data-location-group="${focusedLocation.location
                .split(" ")
                .join("-")}"])`
        );
        nodes.forEach((node) => {
            node.css("opacity", "0");
            setTimeout(() => {
                node.hide();
            }, 300);
            hiddenNodes.push(node);
        });
    }

    function showAllHiddenNodes() {
        hiddenNodes.forEach((node) => {
            node.show();
            node.css("opacity", "100");
        });
        hiddenNodes = [];
    }

    function createTooltips() {
        draw.find(`[data-location-group]`).forEach((svg) => {
            const name = svg.node.dataset.locationGroup.split("-").join(" ");
            const location = $hitLocations$[name];
            const tooltip = hitLocationTemplate(location);
            tooltips[location ? location.key : ""] = createTooltip(svg.node, {
                tooltip,
            });
        });
    }

    async function focusLocation(e) {
        const locationGroup = e.target.closest("[data-location-group]");
        if (!locationGroup) return;
        let newLocation =
            $hitLocations$[
                locationGroup.dataset.locationGroup.split("-").join(" ")
            ];
        if (
            focusedLocation &&
            focusedLocation.location === newLocation.location
        )
            return;
        focusedLocation = newLocation;
        let node = draw.find(
            `[data-location-group="${focusedLocation.location
                .split(" ")
                .join("-")}"]`
        )[0];
        node.addClass("focused");
        hideAllUnfocusedNodes();
        frameInViewbox(node, {
            scale: +locationGroup.dataset.scale || 0.7,
        });
    }

    function unfocusAll() {
        draw.find(`[data-location-group]`).forEach((node) => {
            node.removeClass("focused");
        });
        showAllHiddenNodes();
        focusedLocation = null;
    }

    async function onClickSVG(e) {
        if (e.target.closest("[data-location-group],[data-location]")) {
        } else {
            revertViewbox();
        }
    }

    async function revertViewbox() {
        const { x, y, width, height } = originalView;
        draw.animate(300).viewbox(x, y, width, height).after(unfocusAll);
    }

    let draw;
    let originalView;

    function createSVG() {
        draw = SVG(silhouette.total);
        originalView = draw.viewbox();
    }

    onMount(() => {
        createSVG();
        createTooltips();
    });

    $: [...Object.values($hitLocations$)].forEach((location) => {
        if (!draw) return;
        const svg = draw.find(
            `[data-location-group="${location.location
                .split(" ")
                .join("-")}"],[data-location="${location.location
                .split(" ")
                .join("-")}"]`
        );
        if (!svg) return;
        if (location.isCrippled()) {
            svg.addClass("crippled");
        } else {
            svg.removeClass("crippled");
        }
    });

    $: getLocations = () => {
        const left = ["head", "left arm", "left leg"];
        const right = ["torso", "right arm", "right leg"];
        const allSilhoueteLocations = [...left, ...right]
            .map((location) => {
                const hitLocation = $hitLocations$[location];
                return [hitLocation, ...hitLocation.subLocations];
            })
            .flat()
            .filter((value) => value);
        const mapLocations = (list) => {
            return [
                ...list.reduce((locations, location) => {
                    if (
                        focusedLocation &&
                        focusedLocation.location === location
                    ) {
                        focusedLocation.subLocations.forEach((location) =>
                            locations.add(location)
                        );
                    } else if (!focusedLocation) {
                        locations.add($hitLocations$[location]);
                    }
                    return locations;
                }, new Set()),
            ].filter((value) => value);
        };
        return {
            left: mapLocations(left),
            right: mapLocations(right),
            other: [...Object.values($hitLocations$)].filter(
                (location) =>
                    !allSilhoueteLocations.filter(
                        (silhouetteLocation) =>
                            silhouetteLocation !== location.location
                    )
            ),
        };
    };
</script>

<style>
    svg {
        @apply flex-1;
        fill: white;
        stroke: #4a5568;
        stroke-width: 2;
    }
    [data-location-group] {
        @apply transition-opacity duration-300;
    }
    [data-location-group]:not(.focused):hover,
    :global([data-location-group].focused) [data-location]:hover {
        fill: #4a5568;
        stroke: #4a5568;
    }
    :global([data-location-group].crippled, [data-location].crippled) {
        fill: red;
        stroke: #4a5568;
    }
    [data-location-group]:not(.focused) [data-location="vitals"] {
    }
    .amputated {
    }
    .location-bar {
        @apply flex flex-col flex-wrap max-h-full w-20;
    }
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
        @apply w-5 outline-none text-black;
    }
    .cripple-threshold {
        @apply w-5 outline-none;
    }
</style>

<svelte:window />

<section class="relative">
    <div class="flex">
        <div class="location-bar">
            {#each getLocations().left as location, i (location.location)}
                <div
                    class="location"
                    class:crippled={location.isCrippled()}
                    bind:this={hud[location.location]}>
                    <div class="location-name">{location.location}</div>
                    <div>
                        <span class="fas fa-shield">{location.armor}</span>
                        <input
                            type="number"
                            class="damage-input"
                            bind:value={location.damageTaken} />
                        <input
                            class="cripple-threshold"
                            type="number"
                            disabled
                            value={Math.ceil(location.crippleThreshold())} />
                    </div>

                    <div class="h-2">
                        <Bar
                            max={location.crippleThreshold()}
                            current={location.damageTaken} />
                    </div>
                </div>
            {/each}
        </div>
        <svg
            on:click={onClickSVG}
            bind:this={silhouette.total}
            {height}
            {width}
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 800 800"
            style="
                enable-background:new 0 0 800 800; 
                transition: scale({scale});
            "
            xml:space="preserve"><style type="text/css">
                .st0 {
                    fill: #ffffff;
                }
            </style>
            <g on:click={focusLocation} data-location-group="torso">
                <path
                    bind:this={silhouette.torso.chest}
                    data-location="chest"
                    d="M450.55,152.24c-3.25-4.74-18.25-10.36-21.5-12.55c-0.52-0.35-0.99-0.76-1.45-1.2c-3.1,1.13-13.83,4.64-27.6,4.64
                            s-24.5-3.51-27.6-4.64c-0.46,0.44-0.94,0.85-1.45,1.2c-3.25,2.19-18.25,7.81-21.5,12.55c0,0,8.43,45.46-13.34,100.58
                            c0,0,2.24,12.55,6.85,25.45c0,0,21.06-16.39,56.67-12.64h0.75c35.61-3.75,56.67,12.64,56.67,12.64c4.61-12.9,6.85-25.45,6.85-25.45
                            C442.13,197.7,450.55,152.24,450.55,152.24z" />
                <path
                    bind:this={silhouette.torso.vitals}
                    data-location="vitals"
                    class="st0"
                    d="M393.61,200.89c1.44-1.87,2.03-3.75,2.22-5.77c0.55-5.92,0.71-11.86,0.66-17.8c-0.02-2.39,0-2.39,2.41-2.4
                            c1.01,0,2.02,0.05,3.03-0.01c1.19-0.07,1.58,0.48,1.54,1.6c-0.17,5.05,0.13,10.09,0.35,15.13c0.13,3.05,0.25,6.16,2.38,9.07
                            c0.64-2.61,1.21-4.96,1.79-7.32c0.64-2.59,1.63-5.03,3.59-6.92c3.13-3.01,8.23-3.36,12.5-0.8c5.96,3.56,10.86,8.28,14.84,13.96
                            c6.37,9.1,9.81,19.33,11.64,30.17c1.07,6.31,1.6,12.68,1.34,19.08c-0.16,3.88-0.76,7.69-2.34,11.29
                            c-1.77,4.03-5.35,7.47-11.32,6.18c-15.13-3.25-26.56-11.19-32.05-26.13c-2.2-5.99-2.49-12.38-2.03-18.75
                            c0.28-3.85,0.5-7.71,0.83-11.56c0.11-1.33-0.47-1.83-1.63-2.29c-2.65-1.04-5.14-0.68-7.66,0.35c-0.65,0.27-0.99,0.6-0.92,1.37
                            c0.39,4.57,0.9,9.14,1.07,13.73c0.36,9.31-0.41,18.49-5.97,26.4c-7.04,10-16.7,16.09-28.8,18.13c-4.74,0.8-8.54-1.53-10.61-6.14
                            c-1.54-3.43-2.25-7.08-2.36-10.77c-0.41-14.01,1.64-27.61,7.51-40.45c4.33-9.49,10.64-17.35,19.53-23.01
                            c2.4-1.52,4.99-2.36,7.81-2.07c4.44,0.46,7.01,3.27,8.35,7.27C392.18,195.08,392.78,197.82,393.61,200.89z" />
                <path
                    bind:this={silhouette.torso.neck}
                    data-location="neck"
                    d="M376.18,130.67l0.03-0.06c0,0,10.71,3.73,23.79,3.73s23.79-3.73,23.79-3.73l0.03,0.06c-0.17-1.04-0.29-2.14-0.3-3.35
                            c-0.09-6.23,1.4-15.56,1.4-15.56c-1.58,3.49-7.33,7.5-10.73,7.68c-3.38,0.18-5.47,1.58-14.21,1.33
                            c-8.74,0.25-10.81-1.15-14.18-1.33c-3.4-0.18-9.15-4.19-10.73-7.68c0,0,1.49,9.32,1.4,15.56
                            C376.46,128.53,376.34,129.63,376.18,130.67z" />
                <path
                    bind:this={silhouette.torso.abdomen}
                    data-location="abdomen"
                    d="M400.37,265.63c0,0,30.01-4.67,56.67,12.64c0,0-2.11,12.99,0.35,22.64c2.46,9.65,5.27,14.39,3.51,34.75
                            c0,0,4.26,20.32,6.49,29.66c0,0-22.64-0.7-40.02,16.15c0,0-4.52-24.75-27.01-24.75h-0.75c-22.49,0-27.01,24.75-27.01,24.75
                            c-17.38-16.85-40.02-16.15-40.02-16.15c2.24-9.35,6.49-29.66,6.49-29.66c-1.76-20.36,1.05-25.1,3.51-34.75
                            c2.46-9.65,0.35-22.64,0.35-22.64c26.66-17.31,56.67-12.64,56.67-12.64H400.37z" />
                <path
                    bind:this={silhouette.torso.groin}
                    data-location="groin"
                    d="M400.37,356.73c22.49,0,27.01,24.75,27.01,24.75s-21.6,23.03-24.22,36.16c0,0-1.36,0.31-2.79,0.31h-0.75
                            c-1.43,0-2.79-0.31-2.79-0.31c-2.62-13.12-24.22-36.16-24.22-36.16s4.52-24.75,27.01-24.75H400.37z" />
            </g>

            <g on:click={focusLocation} data-location-group="right-leg">
                <path
                    bind:this={silhouette.legs.right.thigh}
                    data-location="right-thigh"
                    d="M462.74,526.35c0,0-12.77-5.86-23.56-4.54c-10.79,1.32-22.12,9.08-22.12,9.08h0.36c0,0-3.03-14.61-3.73-22.16
                            c-0.7-7.55-5.97-32.65-8.95-45.46c-2.98-12.81-2.81-34.93-2.81-34.93c29.51-42.83,67.23-48.44,67.23-48.44
                            c1.58,8.78,5.79,34.4,4.91,57.05c-0.88,22.64-3.33,58.98-8.07,69.51s-2.9,19.9-2.9,19.9H462.74z" />

                <path
                    bind:this={silhouette.legs.right.knee}
                    data-location="right-knee"
                    d="M417.42,530.89c0,0,11.32-7.77,22.12-9.08c10.79-1.32,23.56,4.54,23.56,4.54s2.5,13.89,2.11,21.13s0.04,17.25,0.04,17.25
                            s-22.29,13.16-42.04,1.97c0,0-2.37-11.45-4.74-16.85S417.42,530.89,417.42,530.89z" />
                <path
                    bind:this={silhouette.legs.right.shin}
                    data-location="right-shin"
                    d="M465.25,564.72c10.13,31.95,1.14,74.11-2.15,87.41c-3.29,13.3-5.79,40.41-5.79,40.41c-13.56-5.27-26.33-1.05-26.33-1.05
                                c0.79-5.27,0.53-12.37-1.05-22.38c-1.58-10-8.03-31.33-10-49.89c-1.97-18.56,4.08-31.86,4.74-39.1c0.66-7.24-1.45-13.43-1.45-13.43
                                C442.96,577.89,465.25,564.72,465.25,564.72z" />
                <path
                    bind:this={silhouette.feet.right}
                    data-location="right-foot"
                    d="M430.28,698.56c0,0-3.6,3.95-4.12,8.69c-0.53,4.74,1.4,12.81,1.4,12.81s-0.35,8.34-0.09,11.41
                                c0.26,3.07,2.11,5.27,2.11,6.41c0,1.14-3.07,7.37-2.28,11.5s4.12,6.49,4.12,6.49s2.98,5.18,5.62,6.41
                                c2.63,1.23,7.55,1.67,10.09-2.81c0,0,1.56,1.4,3.99,1.6c2.44,0.2,4.61-1.78,4.61-1.78s1.84,0.86,3.42,0.2
                                c1.58-0.66,1.65-1.51,1.65-1.51s0.99,1.05,2.57,0.39c1.58-0.66,2.11-2.11,2.11-2.11s3.16,0.2,4.54-1.12
                                c1.38-1.32,2.7-6.25,0.86-10.73c-1.84-4.48-7.57-10.73-10.33-13.95c-2.76-3.23-5-8.36-3.16-11.32c1.84-2.96,2.04-6.32,1.65-8.82
                                s-2.04-8.43-2.04-8.43S445.77,693.91,430.28,698.56z" />
            </g>

            <g on:click={focusLocation} data-location-group="left-leg">
                <path
                    bind:this={silhouette.legs.left.thigh}
                    data-location="left-thigh"
                    d="M337.26,526.35c0,0,12.77-5.86,23.56-4.54c10.79,1.32,22.12,9.08,22.12,9.08h-0.36c0,0,3.03-14.61,3.73-22.16
                            c0.7-7.55,5.97-32.65,8.95-45.46c2.98-12.81,2.81-34.93,2.81-34.93c-29.51-42.83-67.23-48.44-67.23-48.44
                            c-1.58,8.78-5.79,34.4-4.91,57.05c0.88,22.64,3.33,58.98,8.07,69.51s2.9,19.9,2.9,19.9H337.26z" />
                <path
                    bind:this={silhouette.legs.left.knee}
                    data-location="left-knee"
                    d="M382.58,530.89c0,0-11.32-7.77-22.12-9.08c-10.79-1.32-23.56,4.54-23.56,4.54s-2.5,13.89-2.11,21.13s-0.04,17.25-0.04,17.25
                            s22.29,13.16,42.04,1.97c0,0,2.37-11.45,4.74-16.85S382.58,530.89,382.58,530.89z" />
                <path
                    bind:this={silhouette.legs.left.shin}
                    data-location="left-shin"
                    d="M334.75,564.72c-10.13,31.95-1.14,74.11,2.15,87.41c3.29,13.3,5.79,40.41,5.79,40.41c13.56-5.27,26.33-1.05,26.33-1.05
                            c-0.79-5.27-0.53-12.37,1.05-22.38c1.58-10,8.03-31.33,10-49.89c1.97-18.56-4.08-31.86-4.74-39.1c-0.66-7.24,1.45-13.43,1.45-13.43
                            C357.04,577.89,334.75,564.72,334.75,564.72z" />
                <path
                    bind:this={silhouette.feet.left}
                    data-location="left-foot"
                    d="M369.72,698.56c0,0,3.6,3.95,4.12,8.69c0.53,4.74-1.4,12.81-1.4,12.81s0.35,8.34,0.09,11.41c-0.26,3.07-2.11,5.27-2.11,6.41
                                c0,1.14,3.07,7.37,2.28,11.5s-4.12,6.49-4.12,6.49s-2.98,5.18-5.62,6.41c-2.63,1.23-7.55,1.67-10.09-2.81c0,0-1.56,1.4-3.99,1.6
                                c-2.44,0.2-4.61-1.78-4.61-1.78s-1.84,0.86-3.42,0.2c-1.58-0.66-1.65-1.51-1.65-1.51s-0.99,1.05-2.57,0.39
                                c-1.58-0.66-2.11-2.11-2.11-2.11s-3.16,0.2-4.54-1.12c-1.38-1.32-2.7-6.25-0.86-10.73c1.84-4.48,7.57-10.73,10.33-13.95
                                c2.76-3.23,5-8.36,3.16-11.32c-1.84-2.96-2.04-6.32-1.65-8.82s2.04-8.43,2.04-8.43S354.23,693.91,369.72,698.56z" />
            </g>

            <g on:click={focusLocation} data-location-group="right-arm">
                <path
                    bind:this={silhouette.arms.right.shoulder}
                    data-location="right-shoulder"
                    d="M450.55,152.24c0,0-8.43,45.46,13.34,100.58l1.71-9.43c0,0-3.82-7.24-4.61-14.61c0,0,6.58-18.69,39.76-17.9
                        c0,0,4.08-30.94-11.85-46.73S450.55,152.24,450.55,152.24z" />
                <path
                    bind:this={silhouette.arms.right.upperArm}
                    data-location="right-upperarm"
                    d="M510.93,265.06c-2.46-3.03-6.49-10.31-6.32-21.19c0.18-10.88-4.91-23.17-4.91-23.17c-32.65,0.53-37,15.61-37,15.61
                            s3.48,9.66,6.46,14.93s12.29,28.08,12.29,28.08C488.55,266.25,510.93,265.06,510.93,265.06z" />
                <path
                    bind:this={silhouette.arms.right.elbow}
                    data-location="right-elbow"
                    d="M481.44,279.32c0,0-0.7,9.48,1.05,20.71c0.15,0.96,0.48,2.19,0.97,3.66c13.48-13.41,42.87-14.46,42.87-14.46
                            c-4.9-14.16-13.4-21.7-15.4-24.17C510.93,265.06,488.55,266.25,481.44,279.32z" />
                <path
                    bind:this={silhouette.arms.right.forearm}
                    data-location="right-forearm"
                    d="M526.33,289.23c0,0-29.39,1.05-42.87,14.46c5.2,15.66,27.94,57.34,31.15,63.92c3.51,7.2,2.81,13.87,2.81,13.87
                                c10.88-8.25,27.73-9.13,27.73-9.13s-2.28-5.44-4.21-11.41c-1.93-5.97-8.6-39.67-11.94-60.91
                                C528.39,296.07,527.45,292.47,526.33,289.23z" />
                <path
                    bind:this={silhouette.hands.right}
                    data-location="right-hand"
                    d="M546.56,379.46c0,0,8.78,6.23,13.6,7.46s7.02,4.12,7.99,7.11c0.97,2.98,8.78,12.29,11.15,14.04
                            c2.37,1.76,3.25,4.83,1.93,6.76c-1.32,1.93-6.49,1.23-9.3-1.32c-2.81-2.55-6.67-8.95-9.74-10.44c0,0-0.61,2.55,0.88,5.09
                            c1.49,2.55,2.11,7.77,2.11,7.77s3.33,8.9,4.65,11.45c1.32,2.55,5.53,11.76,5.62,14.31c0.09,2.55-4.12,4.3-6.58,0
                            c-2.46-4.3-6.85-13.6-8.69-15.45c-1.84-1.84-2.98-4.39-3.42-4.48c-0.44-0.09-1.4,0.44,0.18,3.86s6.41,18.96,7.28,21.76
                            s0.18,5.09-2.19,5.35c-2.37,0.26-4.12-1.58-5.7-5.88s-5.18-12.81-6.14-14.22c-0.97-1.4-3.6-8.43-3.6-8.43l-1.67-0.26
                            c0,0,1.76,12.11,2.9,15.97c1.14,3.86,4.3,14.66,0.97,15.88c-3.33,1.23-5.88-1.4-6.76-5.18c-0.88-3.77-2.46-10.36-3.86-14.92
                            c-1.4-4.56-2.37-10.88-2.37-10.88l-1.14-0.7c0,0-0.7,12.02-0.61,14.92s0.26,7.81-3.33,8.16c-3.6,0.35-4.04-3.86-3.86-7.81
                            s-0.06-16.41-0.03-18.17c0.03-1.76-2.86-7.46-4.79-13.6c-1.93-6.14-1.84-15.1-2.02-16.67s0-3.25,0-3.25S526.73,380.51,546.56,379.46
                            z" />
            </g>

            <g on:click={focusLocation} data-location-group="left-arm">
                <path
                    bind:this={silhouette.arms.left.shoulder}
                    data-location="left-shoulder"
                    d="M349.45,152.24c0,0,8.43,45.46-13.34,100.58l-1.71-9.43c0,0,3.82-7.24,4.61-14.61c0,0-6.58-18.69-39.76-17.9
                        c0,0-4.08-30.94,11.85-46.73S349.45,152.24,349.45,152.24z" />
                <path
                    bind:this={silhouette.arms.left.upperArm}
                    data-location="left-upperarm"
                    d="M289.07,265.06c2.46-3.03,6.49-10.31,6.32-21.19c-0.18-10.88,4.91-23.17,4.91-23.17c32.65,0.53,37,15.61,37,15.61
                        s-3.48,9.66-6.46,14.93s-12.29,28.08-12.29,28.08C311.45,266.25,289.07,265.06,289.07,265.06z" />
                <path
                    bind:this={silhouette.arms.left.elbow}
                    data-location="left-elbow"
                    d="M318.56,279.32c0,0,0.7,9.48-1.05,20.71c-0.15,0.96-0.48,2.19-0.97,3.66c-13.48-13.41-42.87-14.46-42.87-14.46
                            c4.9-14.16,13.4-21.7,15.4-24.17C289.07,265.06,311.45,266.25,318.56,279.32z" />
                <path
                    bind:this={silhouette.arms.left.forearm}
                    data-location="left-forearm"
                    d="M273.67,289.23c0,0,29.39,1.05,42.87,14.46c-5.2,15.66-27.94,57.34-31.15,63.92c-3.51,7.2-2.81,13.87-2.81,13.87
                                c-10.88-8.25-27.73-9.13-27.73-9.13s2.28-5.44,4.21-11.41c1.93-5.97,8.6-39.67,11.94-60.91
                                C271.61,296.07,272.55,292.47,273.67,289.23z" />
                <path
                    bind:this={silhouette.hands.left}
                    data-location="left-hand"
                    d="M253.44,379.46c0,0-8.78,6.23-13.6,7.46c-4.83,1.23-7.02,4.12-7.99,7.11c-0.97,2.98-8.78,12.29-11.15,14.04
                                c-2.37,1.76-3.25,4.83-1.93,6.76c1.32,1.93,6.49,1.23,9.3-1.32c2.81-2.55,6.67-8.95,9.74-10.44c0,0,0.61,2.55-0.88,5.09
                                c-1.49,2.55-2.11,7.77-2.11,7.77s-3.33,8.9-4.65,11.45c-1.32,2.55-5.53,11.76-5.62,14.31c-0.09,2.55,4.12,4.3,6.58,0
                                c2.46-4.3,6.85-13.6,8.69-15.45c1.84-1.84,2.98-4.39,3.42-4.48s1.4,0.44-0.18,3.86s-6.41,18.96-7.28,21.76s-0.18,5.09,2.19,5.35
                                c2.37,0.26,4.12-1.58,5.7-5.88s5.18-12.81,6.14-14.22c0.97-1.4,3.6-8.43,3.6-8.43l1.67-0.26c0,0-1.76,12.11-2.9,15.97
                                c-1.14,3.86-4.3,14.66-0.97,15.88c3.33,1.23,5.88-1.4,6.76-5.18c0.88-3.77,2.46-10.36,3.86-14.92c1.4-4.56,2.37-10.88,2.37-10.88
                                l1.14-0.7c0,0,0.7,12.02,0.61,14.92s-0.26,7.81,3.33,8.16c3.6,0.35,4.04-3.86,3.86-7.81c-0.18-3.95,0.06-16.41,0.03-18.17
                                c-0.03-1.76,2.86-7.46,4.79-13.6c1.93-6.14,1.84-15.1,2.02-16.67c0.18-1.58,0-3.25,0-3.25S273.27,380.51,253.44,379.46z" />
            </g>

            <g
                on:click={focusLocation}
                data-location-group="head"
                data-scale="0.5">
                <path
                    bind:this={silhouette.head.skull}
                    data-location="skull"
                    d="M400.06,36.9c0,0,10.78-0.53,20.45,8.12c6.21,5.55,11.36,14.25,9.27,32.45c-0.02,0.13-0.03,0.27-0.05,0.4
                            c0,0-2.8-13.65-29.83-12.33c-27.02-1.32-29.63,12.33-29.63,12.33c-0.02-0.13-0.03-0.27-0.05-0.4c-2.09-18.19,3.06-26.9,9.27-32.45
                            C389.16,36.38,400.06,36.9,400.06,36.9L400.06,36.9z" />
                <path
                    bind:this={silhouette.head.face}
                    data-location="face"
                    d="M399.9,65.54c27.2-1.45,29.83,12.33,29.83,12.33l0.2,1.9c-1.73,1.94-2.19,4.99-2.19,4.99l0.09,4.83
                            c-1.4,4.04-1.18,11.5-1.18,11.5s-0.13,7.2-1.71,10.68s-7.33,7.5-10.73,7.68c-3.38,0.18-5.47,1.58-14.21,1.33
                            c-8.74,0.25-10.81-1.15-14.18-1.33c-3.4-0.18-9.15-4.19-10.73-7.68s-1.71-10.68-1.71-10.68s0.22-7.46-1.18-11.5l0.09-4.83
                            c0,0-0.46-3.04-2.19-4.99l0.2-1.9C370.27,77.87,372.7,64.09,399.9,65.54z" />
                <path
                    bind:this={silhouette.head.ears.left}
                    data-location="left-ear"
                    d="M372.27,84.76c0,0-0.52-4.51-3.31-6.02c-2.47-1.34-4.11,0.16-4.94,3.39c-0.82,3.23,0.13,7.37,1.84,9.84
                        c1.71,2.47,3.29,6.94,3.03,8.52s2.53,3.65,4.48,0.59c0,0,0.3-6.01-0.49-8.57C372.08,89.94,372.27,84.76,372.27,84.76z" />
                <path
                    bind:this={silhouette.head.ears.right}
                    data-location="right-ear"
                    d="M427.73,84.76c0,0,0.57-4.32,3.31-6.02c2.39-1.48,4.11,0.16,4.94,3.39c0.82,3.23-0.13,7.37-1.84,9.84
                            c-1.71,2.47-3.29,6.94-3.03,8.52s-2.53,3.65-4.48,0.59c0,0-0.48-6.01,0.31-8.58S427.73,84.76,427.73,84.76z" />
                <path
                    class="st0"
                    d="M407.46,98.67c-1.54-0.97-3.47-2.41-5.13-2.5c-1.05-0.06-2.33,0.35-2.33,0.35s-1.27-0.41-2.33-0.35
                            c-1.67,0.09-3.6,1.54-5.13,2.5c-1.54,0.97-4.34,3.25-4.34,3.25s3.03-0.57,4.43,1.05c1.4,1.62,3.62,2.94,7.36,2.85
                            c3.74,0.09,5.98-1.23,7.38-2.85c1.4-1.62,4.43-1.05,4.43-1.05S409,99.63,407.46,98.67z M406.57,100.46
                            c-0.35-0.04-0.71-0.04-1.06-0.01c-0.34,0.04-0.69,0.12-1.06,0.17c-0.72,0.11-1.45,0.21-2.17,0.29c-0.73,0.08-2.28,0.15-2.28,0.18
                            c0-0.03-1.55-0.11-2.28-0.18c-0.73-0.08-1.45-0.17-2.17-0.29c-0.37-0.05-0.72-0.14-1.06-0.17c-0.35-0.03-0.7-0.03-1.06,0.01
                            c-0.71,0.08-1.42,0.26-2.09,0.53c0.64-0.35,1.33-0.61,2.05-0.77c0.36-0.08,0.73-0.13,1.11-0.14c0.39-0.01,0.75,0.05,1.1,0.08
                            c0.72,0.07,1.44,0.11,2.16,0.15c0.72,0.03,2.24,0.06,2.24,0.04c0,0.01,1.52-0.01,2.24-0.04c0.72-0.03,1.44-0.08,2.16-0.15
                            c0.36-0.03,0.72-0.09,1.1-0.08c0.38,0.01,0.75,0.05,1.11,0.14c0.72,0.16,1.41,0.42,2.05,0.77
                            C407.99,100.72,407.28,100.54,406.57,100.46z" />
                <g data-location="nose" bind:this={silhouette.head.nose}>
                    <path
                        class="st0"
                        d="M406.3,87.5c-0.75-1.18-1.55-1.69-1.55-1.69c1.61,1.48,1.29,3.45,0.59,3.33c-1.1-0.19-1.65-0.04-2.6,0.81
                                c-0.95,0.86-2.75,0.69-2.75,0.69s-1.78,0.16-2.73-0.69c-0.95-0.86-1.5-1-2.6-0.81c-0.69,0.12-1.02-1.85,0.59-3.33
                                c0,0-0.8,0.5-1.55,1.69c-0.67,1.06-0.86,2.29-0.03,2.62c0.82,0.33,2.17-0.79,3.09,0.39c0.92,1.18,2.36,1.28,3.23,1.22
                                c0.86,0.07,2.33-0.03,3.25-1.22c0.92-1.18,2.27-0.07,3.09-0.39C407.15,89.79,406.96,88.56,406.3,87.5z" />
                    <path
                        class="st0"
                        d="M402.33,79.64c0,0,0.7,5.8,0.15,7.09c0,0,0.2-0.42,0.72-0.42c0.53,0,0.75,0.42,0.75,0.42s-0.11-0.88-0.59-1.12
                                C402.87,85.37,402.74,80.53,402.33,79.64z" />
                    <path
                        class="st0"
                        d="M397.67,79.64c0,0-0.7,5.8-0.15,7.09c0,0-0.2-0.42-0.72-0.42c-0.53,0-0.75,0.42-0.75,0.42s0.11-0.88,0.59-1.12
                                C397.13,85.37,397.26,80.53,397.67,79.64z" />
                </g>
                <g
                    data-location="right-eye"
                    bind:this={silhouette.head.eyes.right}>
                    <path
                        class="st0"
                        d="M409.92,74.41c1.47-0.55,5.4-0.61,7.44-0.05c2.04,0.56,3.58,3.07,3.58,3.07s-0.53,1.85-5.07,2.48
                                c0,0,2.84-0.84,4.33-2.38c0,0-1.39-2.12-2.99-2.52c-1.6-0.39-4.78-0.83-6.74-0.2c-1.95,0.64-3.44,2.34-3.44,2.34
                                s1.25,2.08,3.75,2.48c0,0-2.49-0.09-4.36-2.29C406.42,77.35,407.66,75.26,409.92,74.41z" />
                    <circle class="st0" cx="413.61" cy="77.16" r="2.48" />
                </g>
                <g
                    data-location="left-eye"
                    bind:this={silhouette.head.eyes.left}>
                    <path
                        class="st0"
                        d="M390.1,74.41c-1.47-0.55-5.4-0.61-7.44-0.05c-2.04,0.56-3.58,3.07-3.58,3.07s0.53,1.85,5.07,2.48
                                c0,0-2.84-0.84-4.33-2.38c0,0,1.39-2.12,2.99-2.52s4.78-0.83,6.74-0.2c1.95,0.64,3.44,2.34,3.44,2.34s-1.25,2.08-3.75,2.48
                                c0,0,2.49-0.09,4.36-2.29C393.6,77.35,392.37,75.26,390.1,74.41z" />
                    <circle class="st0" cx="386.42" cy="77.16" r="2.48" />
                </g>
            </g>
        </svg>
        <div class="location-bar">
            {#each getLocations().right as location, i (location.location)}
                <div
                    class="location"
                    class:crippled={location.isCrippled()}
                    bind:this={hud[location.key]}>
                    <div class="location-name">{location.location}</div>
                    <div>
                        <span class="fas fa-shield">{location.armor}</span>
                        <input
                            type="number"
                            class="w-5 outline-none text-black"
                            bind:value={location.damageTaken} />
                        <input
                            class="w-5 outline-none"
                            type="number"
                            disabled
                            value={Math.ceil(location.crippleThreshold())} />
                    </div>

                    <div class="h-2">
                        <Bar
                            max={location.crippleThreshold()}
                            current={location.damageTaken} />
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <div class="w-full grid grid-cols-6">
        {#each getLocations().other as location, i (location.location)}
            <div
                class="location"
                class:crippled={location.isCrippled()}
                bind:this={hud[location.key]}>
                <div class="location-name">{location.location}</div>
                <div>
                    <span class="fas fa-shield">{location.armor}</span>
                    <input
                        type="number"
                        class="damage-taken"
                        bind:value={location.damageTaken} />
                    <input
                        class="cripple-threshold"
                        type="number"
                        disabled
                        value={Math.ceil(location.crippleThreshold())} />
                </div>

                <div class="h-2">
                    <Bar
                        max={location.crippleThreshold()}
                        current={location.damageTaken} />
                </div>
            </div>
        {/each}
    </div>
</section>
