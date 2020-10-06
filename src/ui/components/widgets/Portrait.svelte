<script>
    export let src;

    export let clip = {
        x: 0,
        y: 0,
        width: null,
        height: null,
    };

    export let centered = true;
    export let contained = true;

    let width;
    let height;

    function changeSource() {
        src = prompt("new url") || src;
    }

    $: cropContext = {
        cropping: false,
        lastCrop: null,
        topLeft: {
            top: 0,
            left: 0,
            dragging: false,
        },
        topRight: {
            top: 0,
            right: 0,
            dragging: false,
        },
        bottomRight: {
            bottom: 0,
            right: 0,
            dragging: false,
        },
        bottomLeft: {
            bottom: 0,
            right: 0,
            dragging: false,
        },
    };

    function cancelHandleDrag(e) {
        e.preventDefault();
    }

    function setCrop(e) {
        if (!cropContext.cropping) return;
        const cropHandle = e.target.closest("[data-crop]");
        if (!cropHandle) return;
        cropContext[cropHandle.dataset.crop].dragging = true;
        cropContext.lastCrop = cropHandle.dataset.crop;
    }

    function onDragCrop(e) {
        if (!cropContext.cropping) return;
        const cropObject = cropContext[cropContext.lastCrop];
        if (!cropObject) return;
        if (!cropObject.dragging) return;
        const { movementX, movementY } = e;
        if (cropContext.lastCrop.includes("Left")) {
            console.log("left");
            cropContext[cropContext.lastCrop].left = Math.max(
                cropObject.left + movementX,
                0
            );
            //clip.x = Math.max(clip.x + movementX, 0);
        }
        if (cropContext.lastCrop.includes("Right")) {
            cropObject.right = Math.max(cropObject.right - movementX, 0);
        }
        if (cropContext.lastCrop.includes("top")) {
            cropObject.top = Math.max(cropObject.top + movementY, 0);
        }

        if (cropContext.lastCrop.includes("bottom")) {
            cropObject.bottom = Math.max(cropObject.bottom - movementY, 0);
        }
    }
</script>

<style>
    #portrait {
        clip-path: url(#portrait_mask);
    }
    label {
        @apply select-none;
    }
    .crop {
        @apply absolute w-5 h-5 border-solid border-black cursor-move;
    }
    .cropping {
        @apply bg-red-700;
    }
</style>

<svelte:window
    on:mousemove={onDragCrop}
    on:mousedown={setCrop}
    on:mouseup={() => {
        if (cropContext.cropping) cropContext[cropContext.lastCrop].dragging = false;
    }} />

<section class="flex flex-col h-full">
    <svg height="0" width="0">
        <defs>
            <clipPath id="portrait_mask">
                <rect
                    x={clip.x || 0}
                    y={clip.y || 0}
                    width={clip.width || width}
                    height={clip.height || height} />
            </clipPath>
        </defs>
    </svg>
    <div
        id="portrait"
        bind:offsetHeight={height}
        bind:offsetWidth={width}
        class="relative h-full w-full bg-no-repeat"
        class:bg-center={centered}
        class:bg-contain={contained}
        style="background-image: url({src});">
        {#if cropContext.cropping}
            <div
                on:dragstart={cancelHandleDrag}
                class:cropping={cropContext.topLeft.dragging}
                data-crop="topLeft"
                class="crop border-t border-l"
                style="top:{Math.max(cropContext.topLeft.top, 0)}; left:{Math.max(cropContext.topLeft.left, 0)};" />
            <div
                on:dragstart={cancelHandleDrag}
                class:cropping={cropContext.bottomLeft.dragging}
                data-crop="bottomLeft"
                class="crop border-b border-l"
                style="bottom:{Math.max(cropContext.bottomLeft.bottom, 0)}; left:{Math.max(cropContext.bottomLeft.left, 0)};" />
            <div
                on:dragstart={cancelHandleDrag}
                class:cropping={cropContext.topRight.dragging}
                data-crop="topRight"
                class="crop border-t border-r"
                style="top:{Math.max(cropContext.topRight.top, 0)}; right:{Math.max(cropContext.topRight.right, 0)};" />
            <div
                on:dragstart={cancelHandleDrag}
                class:cropping={cropContext.bottomRight.dragging}
                data-crop="bottomRight"
                class="crop border-b border-r"
                style="bottom: {Math.max(cropContext.bottomRight.bottom, 0)}; right: {Math.max(cropContext.bottomRight.right, 0)};" />
        {/if}
    </div>
    <div class="bg-white flex pt-2">
        <span
            class="fas fa-crop"
            on:click={() => (cropContext.cropping = !cropContext.cropping)} />
        <label>Center <input type="checkbox" bind:checked={centered} /></label>
        <label>Contain<input type="checkbox" bind:checked={contained} /></label>
        <svg
            on:click={changeSource}
            class="h-6 w-6"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 883 883">
            <g>
                <path
                    d="M20,0C8.954,0,0,8.954,0,20v294.205c0,11.046,8.954,20,20,20h35c11.046,0,20-8.954,20-20V95c0-11.046,8.954-20,20-20
    		h219.206c11.046,0,20-8.954,20-20V20c0-11.046-8.954-20-20-20H20z" />
                <path
                    d="M883,192.104v-36.721V20c0-11.046-8.954-20-20-20h-99.5h-18H568.795c-11.046,0-20,8.954-20,20v35c0,11.046,8.954,20,20,20
    		H745.5h18H788c11.046,0,20,8.954,20,20v60.383v36.721v122.103c0,11.046,8.954,20,20,20h35c11.046,0,20-8.954,20-20V192.104z" />
                <path
                    d="M20,883h294.205c11.046,0,20-8.953,20-20v-35c0-11.047-8.954-20-20-20H95c-11.046,0-20-8.953-20-20V568.795
    		c0-11.047-8.954-20-20-20H20c-11.046,0-20,8.953-20,20V863C0,874.047,8.954,883,20,883z" />
                <path
                    d="M568.794,883H863c11.046,0,20-8.953,20-20V568.795c0-11.047-8.954-20-20-20h-35c-11.046,0-20,8.953-20,20V788
    		c0,11.047-8.954,20-20,20H568.794c-11.046,0-20,8.953-20,20v35C548.794,874.047,557.748,883,568.794,883z" />
                <path
                    d="M664.562,757.566c11.046,0,20-8.955,20-20v-62.955c0-34.557-10.621-68.605-29.988-97.199
    		c-21.743-32.102-52.152-48.205-85.088-65.865c-21.21-11.373-40.93-27.947-50.469-49.57c60.982-29.013,103.14-91.189,103.14-163.216
    		c-0.001-99.774-80.884-180.656-180.657-180.656S260.844,198.986,260.844,298.76c0,72.027,42.157,134.203,103.14,163.216
    		c-9.539,21.623-29.259,38.197-50.469,49.57c-32.937,17.66-63.346,33.764-85.088,65.865c-19.367,28.594-29.988,62.645-29.988,97.199
    		v62.955c0,11.045,8.954,20,20,20H441.5H664.562L664.562,757.566z" />
            </g>
        </svg>
    </div>
</section>
