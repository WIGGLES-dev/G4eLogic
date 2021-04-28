<script lang="ts">
    import { getContext } from "svelte";
    import { mergeMap } from "rxjs/operators";
    import Popper from "@components/Popper.svelte";
    import { Character } from "@internal";
    import { getEditorContext } from "@app/ui/Editor.svelte";
    const { state, processed$ } = getEditorContext<Character>();
    $: lift = $processed$.basicLift;
</script>

<table>
    <caption class="underline">Lifting & Moving</caption>
    <tbody>
        <Popper
            display="hovered virtual"
            offset={[16, 16]}
            let:reference
            let:popper
        >
            <tr use:reference>
                <td>{lift}</td>
                <td>Simple Lift</td>
            </tr>
            <div class="tooltip" use:popper>
                <p>Governs the weight you can pick up and move. Ref. BS352.</p>
            </div>
        </Popper>
        <Popper
            display="hovered virtual"
            offset={[16, 16]}
            let:reference
            let:popper
        >
            <tr use:reference>
                <td>{lift * 2}</td>
                <td>One-Handed-Lift</td>
            </tr>
            <div class="tooltip" use:popper>
                <p>
                    The weight you can lift overhead with one hands in two
                    seconds. Equals Basic Lift * 2.
                </p>
            </div>
        </Popper>
        <Popper
            display="hovered virtual"
            offset={[16, 16]}
            let:reference
            let:popper
        >
            <tr use:reference>
                <td>{lift * 8}</td>
                <td>Two-Handed-Lift</td>
            </tr>
            <div class="tooltip" use:popper>
                <p>
                    The weight you can lift overhead with two hands in four
                    seconds. Equals Basic Lift * 8.
                </p>
            </div>
        </Popper>
        <Popper
            display="hovered virtual"
            offset={[16, 16]}
            let:popper
            let:reference
        >
            <tr use:reference>
                <td>{lift * 12}</td>
                <td>Shove & Knock Over</td>
            </tr>
            <div class="tooltip" use:popper>
                <p>
                    The weight you can shove and knock over from a standing
                    position. Equals Basic Lift * 12.
                </p>
            </div>
        </Popper>
        <Popper
            display="hovered virtual"
            offset={[16, 16]}
            let:popper
            let:reference
        >
            <tr use:reference>
                <td>{lift * 24}</td>
                <td>Running Shove & Knock Over</td>
            </tr>
            <div class="tooltip" use:popper>
                <p>
                    The weight you can shove and knock over from a running
                    start. Equals Basic Lift * 24.
                </p>
            </div>
        </Popper>
        <Popper
            display="hovered virtual"
            offset={[16, 16]}
            let:popper
            let:reference
        >
            <tr use:reference>
                <td>{lift * 15}</td>
                <td>Carry on Back</td>
            </tr>
            <div class="tooltip" use:popper>
                <p>
                    The maximum weight you can carry on your back. Equals Basic
                    Lift * 15. If this puts you over Basic Lift * 10
                    (Extra-Heavy encumbrance), you lose 1 FP per second until
                    you put the weight down.
                </p>
            </div>
        </Popper>
        <Popper
            display="hovered virtual"
            offset={[16, 16]}
            let:popper
            let:reference
        >
            <tr use:reference>
                <td>{lift * 50}</td>
                <td>Shift Slightly</td>
            </tr>
            <div class="tooltip" use:popper>
                <p>
                    The maximum weight you can move in any way over any period
                    of time. Equals Basic Lift * 50.
                </p>
            </div>
        </Popper>
    </tbody>
</table>

<style lang="postcss">
    table {
        @apply text-sm;
    }
    td:first-child {
        @apply text-center text-lg pr-3;
    }
    td:nth-child(2) {
        @apply text-left;
    }
    tr {
        @apply border-b border-gray-500 border-solid;
    }
</style>
