import * as path from "path";
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

type mode = "development" | "production"
const mode = process.argv[process.argv.indexOf("--mode") >= 0 ? process.argv.indexOf("--mode") + 1 : null] as mode || "development";
const prod = mode === 'production';

const config: webpack.Configuration = {
    devServer: {
        writeToDisk: true,
        open: 'chrome',
        contentBase: path.join(__dirname, "lib/test"),
        compress: false,
        port: 5000,
        hot: true,
    },
    entry: {
        'index': [path.resolve(__dirname, 'src/index.ts')],
        'externals': [path.resolve(__dirname, 'src/externals/index.ts')],
        'ui': [path.resolve(__dirname, 'src/ui/index.ts')],
        'test/test': [path.resolve(__dirname, 'src/test/index.ts')],
        'lib-min': [path.resolve(__dirname, 'src/index.ts')]
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
        publicPath: 'lib/',
        filename: '[name].js',
        libraryTarget: 'umd',
        library: "lib",
        umdNamedDefine: true,
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
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    /**
                     * MiniCssExtractPlugin doesn't support HMR.
                     * For developing, use 'style-loader' instead.
                     * */
                    prod ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    /**
                     * MiniCssExtractPlugin doesn't support HMR.
                     * For developing, use 'style-loader' instead.
                     * */
                    prod ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {}
                        }
                    }
                ]
            }
        ]
    },
    mode,
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'src/test/public', to: "./test" }
            ]
        }),
    ],
    devtool: prod ? false : 'source-map'
}

export default config;