import * as path from "path";
import rxPaths from "rxjs/_esm5/path-mapping"
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FileManagerPlugin from "filemanager-webpack-plugin";
import { typescript, postcss } from "svelte-preprocess";
export const svelteLoaderConfig = {
    test: /\.svelte$/,
    use: {
        loader: 'svelte-loader',
        options: {
            dev: false,
            onwarn: () => false,
            emitCss: true,
            preprocess: [
                typescript({
                    tsconfigFile: "tsconfig.json"
                }),
                postcss({
                    plugins: [
                        require("tailwindcss"),
                        require("postcss-nested"),
                    ]
                })
            ]
        }
    }
};
export const cssLoaderConfig = {
    test: /\.css$/,
    use: [
        process.env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
        'css-loader',
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    ident: "postcss",
                    plugins: [
                        require("tailwindcss"),
                        require("postcss-nested"),
                        require("autoprefixer")
                    ]
                }
            }
        }
    ],
};
export const tsLoaderConfig = {
    test: /\.(ts|tsx)$/i,
    use: {
        loader: 'awesome-typescript-loader',
    },
};
export const urlLoaderConfig = {
    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
    loader: 'url-loader',
    options: {
        limit: 8192,
    },
};
export const htmlLoaderConfig = {
    test: /\.html$/i,
    loader: 'html-loader',
};
export const yamlLoaderConfig = {
    test: /\.ya?ml$/,
    type: 'json' as const,
    use: 'yaml-loader'
};
export const workerLoaderConfig = {
    test: /\.worker\.ts$/i,
    loader: "worker-loader",
    options: {
        inline: "fallback"
    }
};
const cwd = process.cwd();
const mode = process.env.prod ? "production" : "development";
const prod = mode === "production";
const output = path.resolve(cwd, "public");
export default {
    devServer: {
        contentBase: output,
        compress: true,
        port: 3000,
        writeToDisk: true,
        hot: false
    },
    entry: {
        valor: path.resolve(cwd, 'src/gurps/system.ts'),
        foundryValor: path.resolve(cwd, 'src/plugins/foundry/init.ts')
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
        extensions: ['.mjs', '.ts', '.js', '.wasm', '.json', '.svelte', '.vue'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
        path: output,
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            workerLoaderConfig,
            cssLoaderConfig,
            svelteLoaderConfig,
            tsLoaderConfig,
            urlLoaderConfig,
            htmlLoaderConfig,
            yamlLoaderConfig,
        ]
    },
    mode,
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: "assets",
                to: output
            }, {
                from: "src/plugins/foundry/static",
                to: output
            }]
        }),
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [{
                        source: "public",
                        destination: "C:/Users/Ian/AppData/Local/FoundryVTT/Data/systems/GURPS"
                    }]
                }
            }
        }),
        // new BundleAnalyzerPlugin(),
        // new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new webpack.ProvidePlugin({}),
    ],
    devtool: prod ? false : 'source-map'
}