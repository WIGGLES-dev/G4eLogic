const sveltePreprocess = require('svelte-preprocess');
module.exports = {
    preprocess: [
        sveltePreprocess.typescript(),
        sveltePreprocess.postcss()
    ],
}