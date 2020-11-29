import * as path from "path";
import rxPaths from "rxjs/_esm5/path-mapping"
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { GenerateSW } from "workbox-webpack-plugin";
import { postcss, typescript } from "svelte-preprocess";

function config(env): webpack.Configuration {
    const mode = env?.production ?? "development";
    const prod = mode === "production"
    const output = env?.output ?? path.resolve(__dirname, "./server");

    return {
        devServer: {
            writeToDisk: true,
            contentBase: output + "/server",
            compress: false,
            port: 5000,
            hot: false
        },
        entry: {
            'test': [path.resolve(__dirname, 'test.ts')],
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
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    { from: path.resolve(__dirname, "./public"), to: path.resolve(__dirname, "./server") }
                ]
            }),
            new MiniCssExtractPlugin(),
            // new GenerateSW(),
        ],
        devtool: prod ? false : 'source-map'
    }
}

export default config;