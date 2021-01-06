<script>
    import { SSRT } from "gurps-foundry-ssrt-lib/src/js/SSRT";

    const measures = [
        "2 inch",
        "3 inch",
        "5 inch",
        "8 inch",
        "1 feet",
        "18 inch",
        "2 feet",
        "54 inch",
        "2 yard",
        "3 yard",
        "5 yard",
        "7 yard",
        "10 yard",
        "15 yard",
        "20 yard",
        "30 yard",
        "50 yard",
        "70 yard",
        "100 yard",
        "200 yard",
        "300 yard",
        "500 yard",
        "700 yard",
        "1000 yard",
    ];
</script>

<style>
    tbody tr:nth-child(even) {
        @apply bg-gray-100;
    }
    table {
        @apply m-0;
    }
</style>

<section>
    <table>
        <thead>
            <tr>
                <th>Speed/Range</th>
                <th>Size</th>
                <th>Linear Measure</th>
            </tr>
        </thead>
        <tbody>
            {#each measures as expression, i (i)}
                <tr>
                    <td class="text-center">
                        {SSRT.speedRangeFromExpression({ expression })}
                    </td>
                    <td>{i - 9}</td>
                    <td>{expression}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</section>
