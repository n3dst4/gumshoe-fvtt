/// <reference types="vitest" />
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

import { name } from "./package.json";

const config = defineConfig(({ mode }) => {
  console.log(mode);
  return {
    root: "src/",
    publicDir: path.resolve(__dirname, "public"),

    // configure vitest
    test: {
      // fix "document is not defined"
      environment: "happy-dom",
      // equivalent to jest.setup.js
      setupFiles: ["../vitest.setup.js"],
    },

    build: {
      outDir: path.resolve(__dirname, "build"),
      emptyOutDir: true,
      sourcemap: mode !== "production",
      minify: mode === "production",
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
        plugins: [
          [
            "@swc/plugin-emotion",
            {
              autoLabel: "always",
            },
          ],
        ],
      }),
    ],
  };
});

export default config;
