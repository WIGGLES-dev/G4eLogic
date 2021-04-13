<script lang="ts">
    import { from } from "rxjs";
    import { switchAll } from "rxjs/operators";
    import { fetchTable } from "@internal";
    const libraries$ = from(fetchTable<any>("libraries"));
    const value$ = libraries$.pipe(switchAll());
</script>
