import * as path from "path";
import rxPaths from "rxjs/_esm5/path-mapping"
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FileManagerPlugin from "filemanager-webpack-plugin";
import HTMLWebpackPlugin from "html-webpack-plugin";
import { HtmlWebpackSkipAssetsPlugin } from "html-webpack-skip-assets-plugin";
import HtmlWebpackTagsPlugin from 'html-webpack-tags-plugin';
import WorkerPlugin from "worker-plugin";
import WorkboxPlugin from "workbox-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import { typescript, postcss } from "svelte-preprocess";
const cwd = process.cwd();
const mode = process.env.prod === "true" ? "production" : "development";
const prod = mode === "production";
const output = path.resolve(cwd, "public");
export const svelteLoaderConfig = {
    test: /\.svelte$/,
    use: {
        loader: 'svelte-loader',
        options: {
            dev: !prod,
            onwarn: (warning, handler) => { },
            emitCss: true,
            preprocess: [
                typescript({
                    tsconfigFile: "tsconfig.json",
                }),
                postcss({
                    configFilePath: "postcss.config.js"
                })
            ]
        }
    }
};
export const cssLoaderConfig = {
    test: /\.css$/,
    use: [
        prod ? MiniCssExtractPlugin.loader : 'style-loader',
        {
            loader: 'css-loader',
        },
        'postcss-loader'
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
const config: webpack.Configuration = {
    devServer: {
        contentBase: output,
        compress: true,
        port: 3000,
        writeToDisk: true,
        hot: false
    },
    entry: {
        valor: path.resolve(cwd, 'src/gurps/system.ts'),
        ["plugins/foundry/foundry-valor"]: path.resolve(cwd, 'src/plugins/foundry/init.ts'),
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
    },
    target: "webworker",
    module: {
        rules: [
            cssLoaderConfig,
            svelteLoaderConfig,
            tsLoaderConfig,
            urlLoaderConfig,
            htmlLoaderConfig,
            yamlLoaderConfig,
        ]
    },
    mode,
    watch: false,
    optimization: {
        concatenateModules: false,
        usedExports: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            title: "Valor",
            favicon: "static/favicon.png",
            hash: true,
            skipAssets: [
                asset => {
                    const src = asset?.attributes?.src;
                    const isPlugin = src && src.includes("plugin");
                    const isWorker = src && src.includes("worker");
                    return isPlugin || isWorker
                }
            ]
        }),
        new HtmlWebpackTagsPlugin({
            tags: [
                "https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
            ]
        }),
        new HtmlWebpackSkipAssetsPlugin(),
        new FileManagerPlugin({
            events: {
                onEnd: {
                    delete: [
                        {
                            source: "C:/Users/Ian/AppData/Local/FoundryVTT/Data/systems/GURPS",
                            options: {
                                force: true
                            }
                        }
                    ],
                    copy: [
                        {
                            source: "static",
                            destination: output
                        },
                        {
                            source: "src/plugins/foundry/static",
                            destination: path.resolve(output, "plugins/foundry/static")
                        },
                        {
                            source: "src/plugins/foundry/static",
                            destination: "C:/Users/Ian/AppData/Local/FoundryVTT/Data/systems/GURPS"
                        }
                    ],
                    archive: [
                        {
                            source: "src/plugins/foundry/static",
                            destination: "public/plugins/foundry/static/GURPS.zip",
                            format: "zip",
                        }
                    ]
                }
            }
        }),
        new WorkerPlugin({
            sharedWorker: true
        }),
        new MiniCssExtractPlugin(),
        new webpack.ProvidePlugin({}),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        }),
        //new BundleAnalyzerPlugin(),
        //new CompressionPlugin()
    ],
    devtool: prod ? false : 'source-map'
}
export default config