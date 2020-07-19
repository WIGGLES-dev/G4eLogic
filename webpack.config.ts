import * as path from "path";
import webpack from "webpack";

type production = "development" | "production" | "none"
const mode = process.env.NODE_ENV as production || 'development';
const prod = mode === 'production';

const config: webpack.Configuration = {
    devServer: {
        contentBase: path.join(__dirname, "test/public"),
        compress: false,
        port: 5000,
        hot: true,
    },
    entry: {
        bundle: [path.resolve(__dirname, 'test/index.ts')]
    },
    resolve: {
        extensions: ['.mjs', '.ts', '.js', '.wasm', '.json'],
        mainFields: ['svelte', 'browser', 'module', 'main'],
        alias: {
            "@character": path.resolve(__dirname, "src/character"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@gcs": path.resolve(__dirname, "src/gcs")
        }
    },
    output: {
        path: __dirname + 'test/public',
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                use: {
                    loader: 'ts-loader',
                },
                exclude: /node_modules/
            }
        ]
    },
    mode,
    plugins: [],
    devtool: prod ? false : 'source-map'
}

export default config;