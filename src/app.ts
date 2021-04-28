import { wrap } from "svelte-spa-router/wrap";
import Home from "@ui/Home.svelte";
import Editor from "@app/ui/Editor.svelte";
const routes = {
    "/": Home,
    "/edit/:type/:id/:embed?": wrap({
        component: Editor,
        conditions: [
            detail => {
                return true
            }
        ]
    })
}
export default routes;