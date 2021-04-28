module.exports = {
    purge: [
        './assets/**/*.html',
        './src/**/*.{svelte,html,ts}'
    ],
    theme: {
        extend: {

        }
    },
    plugins: [
        require('tailwindcss-children')
    ]
}