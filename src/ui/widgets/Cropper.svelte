<script>
    import Cropper from "cropperjs";
    import { Valor } from "@internal";

    export let src;
    export let cropped;

    let portrait;
    let cropper;
    let circular = false;

    function getRoundedCanvas(sourceCanvas) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const width = sourceCanvas.width;
        const height = sourceCanvas.height;
        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = "destination-in";
        context.beginPath();
        context.arc(
            width / 2,
            height / 2,
            Math.min(width, height) / 2,
            0,
            2 * Math.PI,
            true
        );
        context.fill();
        return canvas;
    }

    function cropPortrait() {
        if (!cropper) {
            cropper = new Cropper(portrait);
        } else if (cropper) {
            const canvas = cropper.getCroppedCanvas();
            cropper.destroy();
            cropper = null;
            cropped = circular
                ? getRoundedCanvas(canvas).toDataURL()
                : canvas.toDataURL();
        }
    }
    function reset() {
        cropped = null;
    }

    function cancel(e) {
        if (e && e.which != "3" && !cropper) return;
        cropper.destroy();
        cropper = null;
    }

    async function newImage() {
        let files = await Valor.upload();
        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
            src = e.target.result;
        });
        cropped = null;
        if (files[0]) reader.readAsDataURL(files[0]);
    }
</script>

<style>
    :global(.cropper-view-box + .circular) {
        box-shadow: 0 0 0 1px #39f;
        border-radius: 50%;
        outline: 0;
        outline: inherit !important;
    }
    :global(.cropper-face + .circular) {
        background-color: inherit !important;
    }
</style>

<section class:circular class="flex flex-col">
    <div class="bg-gray-700 text-white px-4 mb-2">
        {#if cropper}
            <span
                title="cancel"
                on:click={cancel}
                class="fas fa-window-close" />
        {/if}
        <span
            title="crop"
            on:click={cropPortrait}
            class="fas"
            class:fa-crop={!cropper}
            class:fa-check={cropper} />
        <span title="upload" on:click={newImage} class="fas fa-images" />
        <span title="uncrop" on:click={reset} class="fas fa-undo" />
    </div>
    <img
        class="object-contain object-center"
        style="max-height: 80vh;"
        src={cropped || src}
        alt="profile"
        bind:this={portrait} />
</section>
