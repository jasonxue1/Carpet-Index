import type { LinksConfig } from "../utils/extensions"

const links = {
  curseforge: {
    downloads: (id) =>
      `https://img.shields.io/curseforge/dt/${id}?style=flat&label=CurseForge%20Downloads`,
    website: (slug) => `https://www.curseforge.com/minecraft/mc-mods/${slug}`,
  },
  github: {
    downloads: (value) =>
      `https://img.shields.io/github/downloads/${value}/total?style=flat&label=Github%20Downloads`,
    stars: (value) =>
      `https://img.shields.io/github/stars/${value}?style=flat&label=Github%20Stars`,
    website: (value) => `https://github.com/${value}`,
  },
  mcmod: (value) => `https://www.mcmod.cn/class/${value}.html`,
  modrinth: {
    downloads: (value) =>
      `https://img.shields.io/modrinth/dt/${value}?style=flat&label=Modrinth%20Downloads`,
    website: (value) => `https://modrinth.com/project/${value}`,
  },
} satisfies LinksConfig

export default links
