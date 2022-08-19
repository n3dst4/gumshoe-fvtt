import type { UserConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import checker from "vite-plugin-checker";
import path from "path";
import { name } from "./public/system.json";
import react from "@vitejs/plugin-react";

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
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },

  build: {
    outDir: path.resolve(__dirname, "build"),
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      name,
      entry: `${name}.ts`,
      formats: ["es"],
      fileName: name,
    },
  },
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
    visualizer({
      gzipSize: true,
      template: "treemap",
    }),
  ],
};

export default config;
