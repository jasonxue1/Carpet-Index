/** @type {import("prettier").Config} */
module.exports = {
  plugins: ["prettier-plugin-astro"],
  semi: false,
  singleQuote: false,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  overrides: [
    {
      files: "*.astro",
      options: { parser: "astro" },
    },
    {
      files: "*.mdx",
      options: { parser: "mdx" },
    },
    {
      files: ["*.yaml", "*.yml"],
      options: { parser: "yaml" },
    },
  ],
}
