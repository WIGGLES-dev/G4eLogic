<script lang="ts">
    import { getContext } from "svelte";
    import { tooltip, Character } from "@internal";
    const character = getContext<Sheet>("sheet");
    const basicLift$ = character.selectBasicLift();
    $: lift = $basicLift$;
</script>

<style>
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

<section>
    <table class="text-sm">
        <colgroug>
            <col class="" />
            <col class="" />
        </colgroug>
        <thead>
            <tr>
                <th colspan="2" scope="col">Lifting & Moving</th>
            </tr>
        </thead>
        <tbody>
            <tr
                use:tooltip={{ tipclass: 'text-sm', tooltip: 'Governs the weight you can pick up and move. Ref. BS352.' }}>
                <td>{lift}</td>
                <td>Simple Lift</td>
            </tr>
            <tr
                use:tooltip={{ tipclass: 'text-sm', tooltip: 'The weight you can lift overhead with one hands in two seconds. Equals Basic Lift * 2.' }}>
                <td>{lift * 2}</td>
                <td>One-Handed-Lift</td>
            </tr>
            <tr
                use:tooltip={{ tipclass: 'text-sm', tooltip: 'The weight you can lift overhead with two hands in four seconds. Equals Basic Lift * 8.' }}>
                <td>{lift * 8}</td>
                <td>Two-Handed-Lift</td>
            </tr>
            <tr
                use:tooltip={{ tipclass: 'text-sm', tooltip: 'The weight you can shove and knock over from a standing position. Equals Basic Lift * 12.' }}>
                <td>{lift * 12}</td>
                <td>Shove & Knock Over</td>
            </tr>
            <tr
                use:tooltip={{ tipclass: 'text-sm', tooltip: 'The weight you can shove and knock over from a running start. Equals Basic Lift * 24.' }}>
                <td>{lift * 24}</td>
                <td>Running Shove & Knock Over</td>
            </tr>
            <tr
                use:tooltip={{ tipclass: 'text-sm', tooltip: `
                    The maximum weight you can carry on your back. Equals Basic Lift * 15.<br />
                    If this puts you over Basic Lift * 10 (Extra-Heavy encumbrance), you lose 1 FP per second until you put the weight down.<br/>
                    ` }}>
                <td>{lift * 15}</td>
                <td>Carry on Back</td>
            </tr>
            <tr
                use:tooltip={{ tipclass: 'text-sm', tooltip: 'The maximum weight you can move in any way over any period of time. Equals Basic Lift * 50.' }}>
                <td>{lift * 50}</td>
                <td>Shift Slightly</td>
            </tr>
        </tbody>
    </table>
</section>
