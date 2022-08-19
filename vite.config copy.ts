import type { UserConfig } from "vite";
import { name } from "./public/system.json";
import path from "path";

const log = console.log.bind(console, "[vite config]");
const publicDir = path.join(__dirname, "public");
log(`publicDir: ${publicDir}`);

// guide to using Vite for Foundry from the Lancer guys:
// https://foundryvtt.wiki/en/development/guides/vite
const config: UserConfig = {
  root: "src/",
  publicDir,
  base: `/systems/${name}/`,
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
    lib: {
      name,
      entry: `${name}.ts`,
      formats: ["es"],
      fileName: name,
    },
  },
};

export default config;
