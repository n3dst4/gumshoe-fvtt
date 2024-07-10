import { defineWorkspace } from "vitest/config";
import { name } from "./package.json";

// paths are relative to `root` in the main `vite.config.ts`
export default defineWorkspace([
  {
    extends: "./vite.config.ts",
    test: {
      name,
    },
  },
  "../packages/*",
]);
