import type {
  HttpProxy,
  // ServerOptions,
  UserConfig,
} from "vite";
// import { createServer as createViteServer } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import checker from "vite-plugin-checker";
import path from "path";
import { name } from "./public/system.json";
import react from "@vitejs/plugin-react";
// import { JSDOM } from "jsdom";

// guide to using Vite for Foundry from the Lancer guys:
// https://foundryvtt.wiki/en/development/guides/vite

// export const viteServer = await createViteServer({
//   server: { middlewareMode: true },
//   // plugins: [
//   //   react({
//   //     jsxImportSource: "@emotion/react",
//   //     babel: {
//   //       plugins: ["@emotion/babel-plugin"],
//   //     },
//   //   }),
//   // ],
//   appType: "custom",
// });

const config: UserConfig = {
  root: "src/",
  base: `/systems/${name}/`,
  publicDir: path.resolve(__dirname, "public"),
  server: {
    port: 40009,
    open: "http://localhost:40009",
    proxy: {
      "/game": {
        selfHandleResponse: true,
        target: "http://localhost:30009",
        configure: (proxy: HttpProxy.Server) => {
          proxy.on("proxyRes", function (proxyRes, req, res) {
            const body: Uint8Array[] = [];
            proxyRes.on("data", function (chunk) {
              body.push(chunk);
            });
            proxyRes.on("end", async function () {
              const html = Buffer.concat(body).toString();
              // const fixedHtml = html;// await viteServer.transformIndexHtml(req.url, html);
              const chunk = '<script type="module">\n' +
                `import RefreshRuntime from "/systems/${name}/@react-refresh";\n` +
                "RefreshRuntime.injectIntoGlobalHook(window);\n" +
                "window.$RefreshReg$ = () => {};\n" +
                "window.$RefreshSig$ = () => (type) => type;\n" +
                "window.__vite_plugin_react_preamble_installed__ = true;\n" +
                "</script>\n";

              const fixedHtml = html.replace("<head>", `<head>\n${chunk}`);
              console.log("res from proxied server:", fixedHtml);
              res.statusCode = proxyRes.statusCode;
              res.headers = proxyRes.headers;
              res.end(html);
            });
          });
        },
      },
      [`^(?!/systems/${name})`]: {
        target: "http://localhost:30009/",

      },
      "/socket.io": {
        target: "ws://localhost:30009",
        ws: true,
      },
    },
  },

  // resolve: {
  //   alias: [
  //     {
  //       find: "./runtimeConfig",
  //       replacement: "./runtimeConfig.browser",
  //     },
  //   ],
  // },
  // optimizeDeps: {
  //   // machine-mind triggers https://github.com/evanw/esbuild/issues/1433
  //   exclude: ["machine-mind"],
  //   // machine-mind's cjs dependencies
  //   include: ["lancer-data", "jszip", "axios", "readonly-proxy"],
  // },

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
          if (assetInfo.name === "style.css") { return `${name}.css`; }
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
