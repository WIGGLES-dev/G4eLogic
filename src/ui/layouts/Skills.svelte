<script lang="ts">
    import { getContext } from "svelte";
    import SkillList from "@ui/datatables/Skill.svelte";
    import TechniqueList from '@ui/datatables/Technique.svelte';
    import { Skill, Technique, Character, mapEach } from "@internal";
    import { Observable } from "rxjs";
    import { map } from "rxjs/operators";

    const character = getContext<Character>("sheet");
</script>

<style>
</style>

<TechniqueList {character} />
<SkillList {character} />