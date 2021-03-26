const { typescript, postcss } = require('svelte-preprocess');
module.exports = {
    preprocess: [
        typescript(),
        postcss()
    ],
}