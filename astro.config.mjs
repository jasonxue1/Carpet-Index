import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import sitemap from "@astrojs/sitemap"
import { SITE } from "./src/config/site.ts"

export default defineConfig({
  site: SITE.url,

  integrations: [
    sitemap(),
    starlight({
      title: "Carpet Index",
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/jasonxue1/Carpet-Index" },
      ],
      sidebar: [
        {
          label: "Index",
          link: "/",
        },
        {
          label: "Extensions",
          link: "/extensions/",
        },
      ],
      components: {
        Head: "./src/components/Head.astro",
      },
    }),
  ],
})
