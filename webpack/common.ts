import * as path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { typescript, postcss } from "svelte-preprocess";

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
}
export const svelteLoaderConfig = {
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
                    ]
                })
            ]
        }
    }
}
export const tsLoaderConfig = {
    test: /\.(ts|tsx)$/i,
    use: {
        loader: 'awesome-typescript-loader',
    },
}
export const urlLoaderConfig = {
    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
    loader: 'url-loader',
    options: {
        limit: 8192,
    },
}
export const htmlLoaderConfig = {
    test: /\.html$/i,
    loader: 'html-loader',
}