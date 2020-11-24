import * as path from "path";
import rxPaths from "rxjs/_esm5/path-mapping"
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";
import DeclarationBundlerPlugin from './dts-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { GenerateSW } from "workbox-webpack-plugin";
import { postcss, typescript } from "svelte-preprocess";

const mode = "development";
//@ts-ignore
const prod = mode === 'production';

const paths = [
    path.resolve("E:\\foundryVTT\\GURPS\\node_modules\\g4elogic", "./lib"),
    path.resolve(__dirname, "./lib")
];

const config = (target): webpack.Configuration => ({
    devServer: {
        writeToDisk: true,
        contentBase: target + "/test",
        compress: false,
        port: 5000,
        hot: false
    },
    entry: {
        'test/test': [path.resolve(__dirname, 'src/test/test.ts')],
        'index': [path.resolve(__dirname, 'src/index.ts')]
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
        path: target,
        filename: '[name].js',
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                use: {
                    loader: 'awesome-typescript-loader',
                },
            },
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
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
                                    require("autoprefixer")
                                ]
                            })
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader || 'style-loader',
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
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            }
        ]
    },
    mode,
    plugins: [
        new webpack.ProvidePlugin({
            Svelte: ['svelte'],
            SvelteStore: ['svelte/store']
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'src/test/public', to: "./test" }
            ]
        }),
        new MiniCssExtractPlugin(),
        // new DeclarationBundlerPlugin({
        //     moduleName: 'index',
        //     out: 'index.d.ts',
        // })
        // new GenerateSW(),
    ],
    devtool: prod ? false : 'source-map'
})

export default [
    config(paths[0]),
    // config(paths[1])
];