/// <reference types="vitest" />
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { HttpProxy } from "vite";
import { defineConfig } from "vite";
// import { visualizer } from "rollup-plugin-visualizer";
import checker from "vite-plugin-checker";

import { id as name } from "./public/system.json";

// guide to using Vite for Foundry from the Lancer guys:
// https://foundryvtt.wiki/en/development/guides/vite

let foundryUrl = "http://localhost:30009";
try {
  foundryUrl = (await import("./foundryconfig.json")).url;
} catch (e) {
  console.log("No foundryconfig.json found, we're probably in CI");
}

const port = 40000;

// this is lifted from https://github.com/vitejs/vite-plugin-react-swc/blob/main/src/index.ts
const preambleCode = `
  import { injectIntoGlobalHook } from "__PATH__";
  injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type) => type;`;
const preambleHtml =
  '\n<script type="module">\n' +
  preambleCode.replace("__PATH__", `/systems/${name}/@react-refresh`) +
  "\n</script>\n";
const headTag = "<head>";

const config = defineConfig(({ mode }) => {
  console.log(mode);
  return {
    root: "src/",
    base: `/systems/${name}/`,
    publicDir: path.resolve(__dirname, "public"),

    // configure vitest
    test: {
      // fix "document is not defined"
      environment: "happy-dom",
      // equivalent to jest.setup.js
      setupFiles: ["../vitest.setup.js"],
    },

    server: {
      port,
      open: `http://localhost:${port}`,
      proxy: {
        // In dev mode, plugin-react needs a preamble inserted in the head. When
        // you run a "normal" vite app, each plugin gets a chance to transform the
        // `index.html`, so the react plugin can add the preamble. But when you
        // run a Foundry app, the `index.html` comes direct from Foundry itself
        // and the React plugin doesn't get a chance to transform it. So we need
        // to add the preamble ourselves. We do this by singling out the proxy
        // rule for `/game` and using `configure` to add some hooks to manually
        // insert the preamble ourselves.
        "/game": {
          // see https://github.com/http-party/node-http-proxy#modify-response
          selfHandleResponse: true,
          target: foundryUrl,
          configure: (proxy: HttpProxy.Server) => {
            proxy.on("proxyRes", function (proxyRes, req, res) {
              const body: Uint8Array[] = [];
              proxyRes.on("data", function (chunk) {
                body.push(chunk);
              });
              proxyRes.on("end", async function () {
                const html = Buffer.concat(body).toString();
                // this is the most future-proof way to get the preamble code.
                const fixedHtml = html.replace(
                  headTag,
                  `${headTag}${preambleHtml}`,
                );
                res.statusCode = proxyRes.statusCode ?? 200;
                // copy the headers from the proxy response to the real response
                for (const [name, value] of Object.entries(proxyRes.headers)) {
                  res.setHeader(name, value as unknown as string);
                }
                console.log(proxyRes.headers);
                res.end(fixedHtml);
              });
            });
          },
        },
        [`^(?!/systems/${name})`]: {
          target: foundryUrl,
        },
        "/socket.io": {
          target: foundryUrl.replace(/^https?/, "ws"),
          ws: true,
        },
      },
    },

    // vite's correct way to get env vars is through import.meta.env. however lots
    // of code relies on process.env, so we'll just fake that in here.
    // https://vitejs.dev/guide/env-and-mode.html
    // https://github.com/vitejs/vite/issues/1973#issuecomment-787571499
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },

    // see https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
    // see also https://github.com/vitejs/vite/pull/8674 (this PR should have
    // fixed it, but maybe it's not in the version we're using?)
    // discussion: https://github.com/vitejs/vite/discussions/8640?sort=old
    esbuild: {
      logOverride: { "this-is-undefined-in-esm": "silent" },
    },

    build: {
      outDir: path.resolve(__dirname, "build"),
      emptyOutDir: true,
      sourcemap: mode !== "production",
      minify: mode === "production",
      // by default vite will generate "style.css". For Foundry, we want to have
      // the name of the system in the filename.
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === "style.css") {
              return `${name}.css`;
            }
            return assetInfo.name ?? "";
          },
        },
      },
      lib: {
        name,
        entry: `${name}.ts`,
        formats: ["es"],
        fileName: name,
      },
      optimizeDeps: {
        // https://stackoverflow.com/a/75922488/212676
        entries: ["src/index.ts"],
      },
    },

    plugins: [
      react({
        jsxImportSource: "@emotion/react",
        plugins: [
          [
            "@swc/plugin-emotion",
            {
              autoLabel: "always",
            },
          ],
        ],
      }),
      // don't run checker in test mode, because it's slow and we are checking
      // types and linting elsewhere. Also there's a weird interaction where
      // *under vitest watch mode only*, eslint-plugin-react throws a zillion
      // deprecation warnings. See
      // https://github.com/jsx-eslint/eslint-plugin-react/issues/3602
      // and
      // https://typescript-eslint.io/linting/troubleshooting/#the-key-property-is-deprecated-on-type-nodes-use-key-instead-warnings
      // I can't work out why we don't see these warnings in any other mode
      // (vite dev, vite built, vitest --run, eslint directly etc.) but the
      // solution here is to not run checker in test mode.
      mode === "test" || (process.env.CHECKER ?? "").toLowerCase() === "no"
        ? null
        : checker({
            typescript: true,
            eslint: {
              lintCommand: `eslint "${path.join(
                __dirname,
                "/src/**/*.{ts,tsx}",
              )}"`,
            },
          }),
      // visualizer({
      //   gzipSize: true,
      //   template: "treemap",
      //   filename: "stats/treemap.html",
      // }),
      // visualizer({
      //   gzipSize: true,
      //   template: "sunburst",
      //   filename: "stats/sunburst.html",
      // }),
      // visualizer({
      //   gzipSize: true,
      //   template: "network",
      //   filename: "stats/network.html",
      // }),
    ],
  };
});

export default config;
