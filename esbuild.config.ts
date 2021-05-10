import { build } from "esbuild";
import esBuildSveltePlugin from "esbuild-svelte";
import { typescript, postcss } from "svelte-preprocess";

process.env.NODE_ENV = "development";

build({
  plugins: [
    esBuildSveltePlugin({
      preprocess: [
        typescript({
          tsconfigFile: "tsconfig.json",
        }),
        postcss({
          configFilePath: "postcss.config.js",
        }),
      ],
    }),
  ],
  entryPoints: ["src/gurps/system.ts", "src/plugins/foundry/init.ts"],
  outdir: "dist",
  bundle: true,
});
