import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Pure-TS unit tests for the RADS scoring engines and report text generators.
// No jsdom — engines and report generators are framework-free TypeScript.
// `globals` is intentionally left false so every test imports { describe, it,
// expect } from "vitest" explicitly (tsconfig includes **/*.ts, so global
// vitest types would otherwise leak into the Next build typecheck).
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
