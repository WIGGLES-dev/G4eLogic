<script lang="ts">
    import { getContext } from "svelte";
    import SkillList from "@ui/datatables/Skill.svelte";
    import TechniqueList from "@ui/datatables/Technique.svelte";
    import { Observable } from "rxjs";
    import { map } from "rxjs/operators";
    const character = getContext<any>("sheet");
</script>

<TechniqueList {character} />
<SkillList {character} />

<style>
</style>
