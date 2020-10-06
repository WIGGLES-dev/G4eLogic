<script>
    import Cropper from "cropperjs";
    import { onMount } from "svelte";

    export let src = "";

    let portrait;
    let cropper;
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
            const roundedCanvas = getRoundedCanvas(canvas);

            src = roundedCanvas.toDataURL();

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
</style>

<section class="h-full flex flex-col">
    <img
        crossorigin="use-credentials"
        class="block max-w-full h-full object-cover"
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
