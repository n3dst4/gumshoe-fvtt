import type { UserConfig } from "vite";
import { name } from "./public/system.json";
import path from "path";

const log = console.log.bind(console, "[vite config]");
const publicDir = path.join(__dirname, "public");
log(`publicDir: ${publicDir}`);

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
