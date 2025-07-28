import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  // ⛔ Ignorer tous les fichiers .js
  {
    ignores: ["dist/**"]
  },

  // ✔️ Appliquer les règles aux fichiers supportés
  {
    files: ["**/*.{mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"]
  },
  {
    files: ["**/*.{mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser
    }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "import/first": "off"
    }
  }
]);
