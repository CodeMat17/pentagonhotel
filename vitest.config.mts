import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/** The `@/…` alias the app is written against; Next resolves it via tsconfig,
 *  vitest needs telling. */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
});
