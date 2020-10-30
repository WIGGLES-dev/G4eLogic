<script>
    export let dice = [{}];
</script>

<style>
    @keyframes spin {
        0% {
            transform: rotate(360deg);
            margin-top: -300px;
        }
        100% {
            transform: rotate();
            margin-top: 500px;
        }
    }
    @keyframes move-origin {
        0% {
            perspective-origin: 0% 0%;
        }
        25% {
            perspective-origin: 100% 0%;
        }
        50% {
            perspective-origin: 300% 100%;
        }
        75% {
            perspective-origin: 0% 300%;
        }
        100% {
            perspective-origin: 0% 0%;
        }
    }
    .box {
        @apply absolute;
        width: min-content;
        left: 50%;
        animation: spin infinite 2s;
    }
    .cube {
        @apply text-lg w-8 h-8;
        margin: 80px auto;
        transform-style: preserve-3d;
        perspective: 1000px;
        animation: move-origin infinite 4s;
    }
    .side {
        @apply absolute h-8 w-8 bg-red-700 border border-black border-solid text-white text-center leading-8;
        transform: translateZ(2em);
    }
    .front {
        transform: rotateX(0deg);
    }
    .back {
        transform: rotateY(-180deg);
    }
    .right {
        transform: rotateY(90deg);
    }
    .left {
        transform: rotateY(-90deg);
    }
    .top {
        transform: rotateX(90deg);
    }
    .bottom {
        transform: rotateX(-90deg);
    }
</style>

<section class="fixed w-screen h-screen z-50">
    {#each dice as die, i (i)}
        <div class="box">
            <div class="cube ">
                {#each new Array(6) as empty, i (i)}
                    <div
                        class:front={i === 0}
                        class:back={i === 5}
                        class:right={i === 3}
                        class:left={i === 2}
                        class:top={i === 4}
                        class:bottom={i === 1}
                        class="side">
                        {i + 1}
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</section>
