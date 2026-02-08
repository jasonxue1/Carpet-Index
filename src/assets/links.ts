import type { LinksConfig } from "../utils/mods"

const BADGE_STYLE = "flat"

const links = {
  curseforge: {
    downloads: (id) =>
      `https://img.shields.io/curseforge/dt/${id}?style=${BADGE_STYLE}&label=CurseForge%20Downloads`,
    website: (slug) => `https://www.curseforge.com/minecraft/mc-mods/${slug}`,
  },
  github: {
    downloads: (value) =>
      `https://img.shields.io/github/downloads/${value}/total?style=${BADGE_STYLE}&label=Github%20Downloads`,
    stars: (value) =>
      `https://img.shields.io/github/stars/${value}?style=${BADGE_STYLE}&label=Github%20Stars`,
    website: (value) => `https://github.com/${value}`,
  },
  gitea: {
    stars: (baseUrl, user, repo) =>
      `https://img.shields.io/gitea/stars/${user}/${repo}?gitea_url=${encodeURIComponent(baseUrl)}&style=${BADGE_STYLE}&label=Gitea%20Stars`,
  },
  mcmod: (value) => `https://www.mcmod.cn/class/${value}.html`,
  modrinth: {
    downloads: (value) =>
      `https://img.shields.io/modrinth/dt/${value}?style=${BADGE_STYLE}&label=Modrinth%20Downloads`,
    website: (value) => `https://modrinth.com/project/${value}`,
  },
} satisfies LinksConfig

export default links
