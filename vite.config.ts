import type { UserConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import checker from "vite-plugin-checker";
import path from "path";
import { name } from "./public/system.json";
import react from "@vitejs/plugin-react";

// guide to using Vite for Foundry from the Lancer guys:
// https://foundryvtt.wiki/en/development/guides/vite

const config: UserConfig = {
  root: "src/",
  base: `/systems/${name}/`,
  publicDir: path.resolve(__dirname, "public"),
  server: {
    port: 40009,
    open: "http://localhost:40009",
    proxy: {
      [`^(?!/systems/${name})`]: "http://localhost:30009/",
      "/socket.io": {
        target: "ws://localhost:30009",
        ws: true,
      },
    },
  },
  css: {

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
        lintCommand: "eslint src",
      },
    }),
    visualizer({
      gzipSize: true,
      template: "treemap",
    }),
  ],
};

export default config;
