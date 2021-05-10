import * as path from "path";
import rxPaths from "rxjs/_esm5/path-mapping";
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import FileManagerPlugin from "filemanager-webpack-plugin";
import HTMLWebpackPlugin from "html-webpack-plugin";
import { HtmlWebpackSkipAssetsPlugin } from "html-webpack-skip-assets-plugin";
import HtmlWebpackTagsPlugin from "html-webpack-tags-plugin";
import WorkboxPlugin from "workbox-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import { typescript, postcss } from "svelte-preprocess";
import { networkInterfaces } from "os";
const nets = networkInterfaces();
const results = {};
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === "IPv4" && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}
const localIp = results["Wi-Fi"] && results["Wi-Fi"][0];
const cwd = process.cwd();
const mode = process.env.prod === "true" ? "production" : "development";
const prod = mode === "production";
const output = path.resolve(cwd, "public");
export const svelteLoaderConfig = {
  test: /\.svelte$/,
  use: {
    loader: "svelte-loader",
    options: {
      dev: !prod,
      onwarn: (warning, handler) => {},
      emitCss: true,
      preprocess: [
        typescript({
          tsconfigFile: "tsconfig.json",
        }),
        postcss({
          configFilePath: "postcss.config.js",
        }),
      ],
    },
  },
};
export const cssLoaderConfig = {
  test: /\.css$/,
  use: [
    prod ? MiniCssExtractPlugin.loader : "style-loader",
    {
      loader: "css-loader",
    },
    "postcss-loader",
  ],
};
export const tsLoaderConfig = {
  test: /\.(ts|tsx)$/i,
  use: {
    loader: "ts-loader",
  },
};
export const urlLoaderConfig = {
  test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
  loader: "url-loader",
  options: {
    limit: 8192,
  },
};
export const htmlLoaderConfig = {
  test: /\.html$/i,
  loader: "html-loader",
};
export const yamlLoaderConfig = {
  test: /\.ya?ml$/,
  type: "json" as const,
  use: "yaml-loader",
};
const config: webpack.Configuration = {
  devServer: {
    host: localIp,
    contentBase: output,
    compress: true,
    port: 3000,
    writeToDisk: true,
    hot: false,
  },
  entry: {
    valor: path.resolve(cwd, "src/gurps/system.ts"),
    "gurps-worker": path.resolve(cwd, "src/gurps/worker.ts"),
    "plugins/foundry/foundry-valor": path.resolve(
      cwd,
      "src/plugins/foundry/init.ts"
    ),
  },
  resolve: {
    alias: {
      ...rxPaths(),
    },
    plugins: [
      new TsConfigPathsPlugin({
        configFile: "tsconfig.json",
      }),
    ],
    fallback: {},
    extensions: [".mjs", ".ts", ".js", ".wasm", ".json", ".svelte", ".vue"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  output: {
    path: output,
    filename: "[name].js",
    globalObject: "self",
  },
  target: "web",
  module: {
    rules: [
      cssLoaderConfig,
      svelteLoaderConfig,
      {
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: true,
        },
      },
      tsLoaderConfig,
      urlLoaderConfig,
      htmlLoaderConfig,
      yamlLoaderConfig,
    ],
  },
  mode,
  watch: false,
  optimization: {
    concatenateModules: false,
    splitChunks: {
      // cacheGroups: {
      //     vendors: {
      //         test: /[\\/]node_modules[\\/]/,
      //         name: 'vendors',
      //         chunks: 'all',
      //     },
      // },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      title: "Valor",
      favicon: "static/favicon.png",
      hash: true,
      skipAssets: [
        (asset) => {
          const src = asset?.attributes?.src;
          const isPlugin = src && src.includes("plugin");
          const isWorker = src && src.includes("worker");
          return isPlugin || isWorker;
        },
      ],
    }),
    new HtmlWebpackTagsPlugin({
      tags: ["https://pro.fontawesome.com/releases/v5.10.0/css/all.css"],
    }),
    new HtmlWebpackSkipAssetsPlugin(),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: [
            {
              source:
                "C:/Users/Ian/AppData/Local/FoundryVTT/Data/systems/GURPS",
              options: {
                force: true,
              },
            },
          ],
        },
        onEnd: {
          copy: [
            {
              source: "static",
              destination: output,
            },
            {
              source: "src/plugins/foundry/static",
              destination: path.resolve(output, "plugins/foundry"),
            },
            {
              source: "public/plugins/foundry",
              destination:
                "C:/Users/Ian/AppData/Local/FoundryVTT/Data/systems/GURPS",
            },
          ],
          archive: [
            {
              source: "src/plugins/foundry",
              destination: "public/plugins/foundry/GURPS.zip",
              format: "zip",
            },
          ],
        },
      },
    }),
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({}),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
    new NodePolyfillPlugin({}),
    new BundleAnalyzerPlugin(),
    //new CompressionPlugin()
  ],
  devtool: prod ? false : "source-map",
};
export default config;
