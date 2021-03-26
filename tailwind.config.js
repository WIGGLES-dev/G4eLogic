module.exports = {
    purge: [
        './assets/**/*.html',
        './src/**/*.{svelte,html}'
    ],
    theme: {},
    plugins: [
        require('tailwindcss-children')
    ]
}