import tseslint from "typescript-eslint";

// biome-ignore lint/style/noDefaultExport: ESLint flat config requires a default export.
export default tseslint.config(
  {
    ignores: ["dist", "coverage", "node_modules"],
  },
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
          allowBoolean: false,
          allowNullish: false,
          allowAny: false,
        },
      ],
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/prefer-nullish-coalescing": [
        "error",
        {
          ignoreConditionalTests: true,
          ignoreMixedLogicalExpressions: true,
        },
      ],
      "@typescript-eslint/prefer-reduce-type-parameter": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-enum-comparison": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/strict-boolean-expressions": ["error", { allowNullableBoolean: false }],
    },
  },

  // Global ban on try/catch - allow-list via file-based overrides below
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "TryStatement",
          message: "Use neverthrow Result helpers instead of try/catch.",
        },
      ],
    },
  },

  // Forbid direct process.env usage in application code; allow in config and env scripts
  {
    files: ["src/**/*.ts"],
    rules: {
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message: "Use loadConfig()/Env/Flags only.",
        },
      ],
    },
  },
  {
    files: ["src/config/**/*.ts", "scripts/env/*.ts"],
    rules: { "no-restricted-properties": "off" },
  },
  {
    files: ["src/index.test.ts"],
    rules: { "no-restricted-properties": "off" },
  },
  {
    files: ["src/**/*.test.ts", "src/index.test.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off",
    },
  },

  // Prevent deep relative imports; prefer path aliases
  {
    files: ["src/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", { patterns: ["../*", "../../*"] }],
    },
  },

  // Kill stray console usage in runtime sources; allow in scripts and tests
  {
    files: ["src/**/*.ts"],
    rules: { "no-console": "error" },
  },
  {
    files: ["scripts/**/*.ts", "src/index.test.ts"],
    rules: { "no-console": "off" },
  },
  {
    files: ["scripts/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
      },
    },
  },
  {
    files: ["src/index.ts", "src/lifecycle.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
);
