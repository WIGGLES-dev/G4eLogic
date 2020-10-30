<script>
    import Cropper from "cropperjs";
    import { onMount } from "svelte";

    export let src = "silhouette.png";

    let portrait;
    let cropper;
    let circular = false;
    let filePicker;

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
        } else {
            const canvas = cropper.getCroppedCanvas();
            src = circular
                ? getRoundedCanvas(canvas).toDataURL()
                : canvas.toDataURL();
            cropper.destroy();
            cropper = null;
        }
    }

    function newImage() {
        filePicker.click();
    }

    function changeImage(e) {
        let file = e.target.files[0];
        let url = URL.createObjectURL(file);
        src = url;
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
    <img
        class="object-contain"
        style="max-height: 80vh;"
        {src}
        alt="profile"
        bind:this={portrait} />
    <div>
        <span
            on:click={cropPortrait}
            class="fas"
            class:fa-crop={!cropper}
            class:fa-check={cropper} />
        <span on:click={newImage} class="fas fa-images" />
        <input
            on:change={changeImage}
            type="file"
            hidden
            bind:this={filePicker} />
    </div>
</section>
