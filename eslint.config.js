import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import prettier from "eslint-config-prettier"
import markdown from "@eslint/markdown"
import astro from "eslint-plugin-astro"
import jsonc from "eslint-plugin-jsonc"
import yml from "eslint-plugin-yml"
import globals from "globals"
import tseslint from "typescript-eslint"

const astroConfigs = astro.configs["flat/recommended"].map((config) => {
  if (
    !config.files &&
    config.rules &&
    Object.keys(config.rules).some((rule) => rule.startsWith("astro/"))
  ) {
    return { ...config, files: ["**/*.astro"] }
  }
  return config
})

const jsonConfigs = jsonc.configs["flat/recommended-with-jsonc"].map((config) => {
  if (!config.files && config.rules) {
    return { ...config, files: ["**/*.json", "**/*.jsonc", "**/*.json5"] }
  }
  return config
})

const yamlConfigs = yml.configs["flat/recommended"].map((config) => {
  if (!config.files && config.rules) {
    return { ...config, files: ["**/*.yaml", "**/*.yml"] }
  }
  return config
})

export default defineConfig([
  {
    ignores: [".vscode", ".idea", "dist/", ".astro/", "node_modules/", "pnpm-lock.yaml"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,astro}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended,
  },
  ...tseslint.configs.recommended,
  ...astroConfigs,
  ...markdown.configs.recommended,
  {
    files: ["**/*.mdx"],
    plugins: { markdown },
    language: "markdown/commonmark",
    rules: { ...markdown.configs.recommended[0].rules },
  },
  ...jsonConfigs,
  {
    files: ["**/*.json"],
    rules: {
      "jsonc/sort-keys": [
        "error",
        {
          pathPattern: "^scripts$",
          order: [
            "build",
            "dev",
            "preview",
            {
              keyPattern: "^(?!apply$|check$)(?!.*:(apply|check)$).*$",
              order: { caseSensitive: false, type: "asc" },
            },
            {
              keyPattern: ".*:apply$",
              order: { caseSensitive: false, type: "asc" },
            },
            {
              keyPattern: ".*:check$",
              order: { caseSensitive: false, type: "asc" },
            },
            {
              keyPattern: "^apply$",
              order: { caseSensitive: false, type: "asc" },
            },
            {
              keyPattern: "^check$",
              order: { caseSensitive: false, type: "asc" },
            },
          ],
        },
        {
          pathPattern: "^\\[[^\\]]+\\]\\.curseforge$",
          order: ["slug", "id", { keyPattern: ".*", order: { caseSensitive: false, type: "asc" } }],
        },
        {
          pathPattern: "^\\[[^\\]]+\\]$",
          order: [
            "rules",
            "website",
            "modrinth",
            "curseforge",
            "mcmod",
            "github",
            { keyPattern: ".*", order: { caseSensitive: false, type: "asc" } },
          ],
        },
        {
          order: { caseSensitive: false, type: "asc" },
          pathPattern: "^$",
        },
        {
          order: { caseSensitive: false, type: "asc" },
          pathPattern: ".*",
        },
      ],
    },
  },
  ...yamlConfigs,
  prettier,
])
