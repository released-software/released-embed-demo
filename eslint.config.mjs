import js from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // Generated files and build output.
    ignores: ["dist/**", ".wrangler/**", ".astro/**", "worker-configuration.d.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs["flat/recommended"],
  {
    languageOptions: { globals: { ...globals.browser } },
  },
);
