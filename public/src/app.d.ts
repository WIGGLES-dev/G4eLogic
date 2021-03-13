import Home from "@ui/Home.svelte";
declare const routes: {
    "/": typeof Home;
    "/edit/:type/:id/:embed?": import("svelte-spa-router").WrappedComponent;
};
export default routes;
