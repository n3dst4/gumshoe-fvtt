import type { HttpProxy, UserConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import checker from "vite-plugin-checker";
import path from "path";
import { name } from "./public/system.json";
import react from "@vitejs/plugin-react";

// guide to using Vite for Foundry from the Lancer guys:
// https://foundryvtt.wiki/en/development/guides/vite

const port = 40000;
const foundryPort = 30009;

const config: UserConfig = {
  root: "src/",
  base: `/systems/${name}/`,
  publicDir: path.resolve(__dirname, "public"),

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
      // rule for /game, using `configure` to add some hooks to manually insert
      // the proxy ourselves.
      "/game": {
        // see https://github.com/http-party/node-http-proxy#modify-response
        selfHandleResponse: true,
        target: `http://localhost:${foundryPort}`,
        configure: (proxy: HttpProxy.Server) => {
          proxy.on("proxyRes", function (proxyRes, req, res) {
            const body: Uint8Array[] = [];
            proxyRes.on("data", function (chunk) {
              body.push(chunk);
            });
            proxyRes.on("end", async function () {
              const html = Buffer.concat(body).toString();
              // this is the most future-proof way to get the preambnle code.
              const preambleHtml =
                '<script type="module">\n' +
                react.preambleCode.replace("__BASE__", `/systems/${name}/`) +
                "\n</script>\n";
              const fixedHtml = html.replace(
                "<head>",
                `<head>\n${preambleHtml}`,
              );
              res.statusCode = proxyRes.statusCode;
              res.headers = proxyRes.headers;
              res.end(fixedHtml);
            });
          });
        },
      },
      [`^(?!/systems/${name})`]: {
        target: `http://localhost:${foundryPort}/`,
      },
      "/socket.io": {
        target: `ws://localhost:${foundryPort}`,
        ws: true,
      },
    },
  },

  // vite's correct way to get env vars is through import.meta.env.
  // however lots of code relies on process.meta.env, so we'll just
  // fake that in here.
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
    sourcemap: true,
    minify: process.env.NODE_ENV === "production",
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
  },

  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: `eslint "${path.join(__dirname, "/src/**/*.{ts,tsx}")}"`,
      },
    }),
    visualizer({
      gzipSize: true,
      template: "treemap",
    }),
  ],
};

export default config;
