<script lang="ts">
    import { getContext } from "svelte";
    import Skills from "@ui/datatables/Skill.svelte";
    import { Skill, Technique, Character, mapEach } from "@internal";
    import { Observable } from "rxjs";
    import { map } from "rxjs/operators";

    const character = getContext<Character>("sheet");
</script>

<style>
</style>

<Skills {character} />