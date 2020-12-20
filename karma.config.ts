import { TsConfigPathsPlugin } from "awesome-typescript-loader"
import {
    cssLoaderConfig,
    htmlLoaderConfig,
    svelteLoaderConfig,
    tsLoaderConfig,
    urlLoaderConfig
} from "./webpack/common";

module.exports = function (config) {
    config.set({
        client: {
            runInParent: true,
            clearContext: false,
            captureConsole: true
        },
        frameworks: ['mocha'],
        reporters: ['mocha'],
        files: [
            { pattern: 'test/*.test.ts', watched: false },
            { pattern: 'test/**/*.test.ts', watched: false }
        ],
        preprocessors: {
            'test/*.test.ts': ['webpack', 'sourcemap'],
            'test/**/*.test.ts': ['webpack', 'sourcemap']
        },
        webpack: {
            devtool: 'inline-source-map',
            resolve: {
                alias: {},
                plugins: [
                    new TsConfigPathsPlugin({
                        config: "tsconfig.json"
                    })
                ],
                extensions: ['.mjs', '.ts', '.js', '.wasm', '.json', '.svelte'],
                mainFields: ['svelte', 'browser', 'module', 'main']
            },
            module: {
                rules: [
                    tsLoaderConfig,
                    svelteLoaderConfig,
                    cssLoaderConfig,
                    urlLoaderConfig,
                    htmlLoaderConfig,
                ]
            },
            mode: 'development'
        }
    })
}