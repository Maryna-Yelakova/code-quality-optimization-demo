import js from "@eslint/js";
import globals from "globals";

/*
  What these lines mean and where they come from:

  1) import js from "@eslint/js";
     - "@eslint/js" is the official package maintained by the ESLint team.
     - It provides built-in JavaScript rule presets in Flat Config format (ESLint v9+).
     - "js" here is just a local variable name pointing to that package export.
     - We use "js.configs.recommended" below to get ESLint's standard recommended
       set of core JavaScript rules (for example: catch undefined variables, etc.).

  2) import globals from "globals";
     - "globals" is a community package that contains ready-made lists of global
       variables for different runtimes/environments (browser, node, jest, etc.).
     - Instead of manually defining every global (window, document, process, ...),
       we spread these lists into ESLint languageOptions.globals.

  3) export default [ ... ]:
     - This file uses ESLint Flat Config (an array of config objects).
     - Each object in the array is applied in order.

  4) js.configs.recommended inside the array:
     - This inserts ESLint's official "recommended" rule preset as a base layer.
     - Think of it as: "start with safe default lint rules, then add project-specific
       settings and rule overrides in the next config objects."
*/
export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
    }
  },
  {
    ignores: [
      "dist/**",
      "build/**",
      "coverage/**",
      "node_modules/**"
    ]
  }
];
