import * as path from "path";
import rxPaths from "rxjs/_esm5/path-mapping"
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import {
    cssLoaderConfig,
    htmlLoaderConfig,
    svelteLoaderConfig,
    tsLoaderConfig,
    urlLoaderConfig,
    yamlLoaderConfig,
} from "./common";

const cwd = process.cwd();
const mode = process.env.prod as "production" || "development" || "none";
const prod = mode === "production";
const output = path.resolve(cwd, "public");

const config: webpack.Configuration = {
    context: cwd,
    devServer: {
        contentBase: output,
        compress: true,
        port: 3000,
        writeToDisk: true,
        hot: true
    },
    entry: {
        'gurps': 'src/gurps/system.ts',
        //'foundryxss': 'src/valor/plugins/xss/foundry/init.ts'
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
    },
    module: {
        rules: [
            svelteLoaderConfig,
            cssLoaderConfig,
            tsLoaderConfig,
            urlLoaderConfig,
            htmlLoaderConfig,
            yamlLoaderConfig
        ]
    },
    mode,
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'assets', to: output }
            ]
        }),
        // new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new webpack.ProvidePlugin({})
    ],
    devtool: prod ? false : 'source-map'
}

export default config;