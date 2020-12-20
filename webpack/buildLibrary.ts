import * as path from "path";
import rxPaths from "rxjs/_esm5/path-mapping"
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { postcss, typescript } from "svelte-preprocess";
import {
    cssLoaderConfig,
    htmlLoaderConfig,
    svelteLoaderConfig,
    tsLoaderConfig,
    urlLoaderConfig
} from "./common";

const cwd = process.cwd();
const mode = process.env.prod as "production" || "development";
const prod = mode === "production";
const output = path.resolve(cwd, "public");

const config: webpack.Configuration = {
    entry: {
        'index': [path.resolve(cwd, 'src/index.ts')],
    },
    resolve: {
        alias: {
            ...rxPaths(),
        },
        plugins: [
            new TsConfigPathsPlugin({
                config: "tsconfig.json"
            })
        ],
        extensions: ['.mjs', '.ts', '.js', '.wasm', '.json', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
        path: output,
        filename: '[name].js',
        libraryTarget: "umd",
    },
    module: {
        rules: [
            tsLoaderConfig,
            svelteLoaderConfig,
            cssLoaderConfig,
            urlLoaderConfig,
            htmlLoaderConfig
        ]
    },
    mode,
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
    ],
    devtool: prod ? false : 'source-map'
}

export default config;