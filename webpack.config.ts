import * as path from "path";
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { GenerateSW } from "workbox-webpack-plugin";
import { postcss } from "svelte-preprocess";

const mode = "development" || "production";
const prod = mode === 'production';

const config: webpack.Configuration = {
    devServer: {
        writeToDisk: true,
        contentBase: path.join(__dirname, "lib/test"),
        compress: false,
        port: 5000,
        hot: false
    },
    entry: {
        'test/test': [path.resolve(__dirname, 'src/test/index.ts')],
    },
    resolve: {
        plugins: [
            new TsConfigPathsPlugin({ configFileName: "tsconfig.json" })
        ],
        extensions: ['.mjs', '.ts', '.js', '.wasm', '.json', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                use: {
                    loader: 'awesome-typescript-loader',
                },
                exclude: /node_modules/
            },
            {
                test: /\.(html|svelte)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        emitCss: true,
                        preprocess: [
                            postcss({
                                plugins: [
                                    require("tailwindcss"),
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
                    prod ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                ident: "postcss",
                                plugins: [
                                    require("tailwindcss"),
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
        ]
    },
    mode,
    plugins: [
        new webpack.ProvidePlugin({
            tinymce: 'tinymce'
        }),
        new GenerateSW(),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'src/test/public', to: "./test" }
            ]
        }),
        new MiniCssExtractPlugin()
    ],
    devtool: prod ? false : 'source-map'
}

export default config;