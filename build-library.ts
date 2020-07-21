import * as path from "path";
import webpack from "webpack";

type production = "development" | "production" | "none"
const mode = process.env.NODE_ENV as production || 'development';
const prod = mode === 'production';

const config: webpack.Configuration = {
    entry: {
        'index': [path.resolve(__dirname, 'src/index.ts')],
        'lib-min': [path.resolve(__dirname, 'src/index.ts')]
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
        path: path.resolve(__dirname, 'lib'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: "lib",
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'awesome-typescript-loader',
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