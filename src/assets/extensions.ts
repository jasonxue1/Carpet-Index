import type { ModInput } from "../utils/mods"
// blob/HEAD/src/main/resources/fabric.mod.json
const extensions = [
  {
    name: "Carpet Addons Not Founded",
    rules: "https://github.com/Gilly7CE/Carpet-Addons-Not-Found/wiki/Available-Rules",
    website: "https://github.com/Gilly7CE/Carpet-Addons-Not-Found/wiki",
    modrinth: "iIPoKpIW",
    github: "Gilly7CE/Carpet-Addons-Not-Found",
  },
  {
    name: "Carpet AMS Addition",
    rules: "https://carpet.mcams.club/Rules",
    website: "https://carpet.mcams.club",
    modrinth: "q4fx1eTg",
    curseforge: {
      slug: "carpet-ams-addition",
      id: "1002635",
    },
    mcmod: "8937",
    github: "Minecraft-AMS/Carpet-AMS-Addition",
  },
  {
    name: "Carpet Discarpet",
    modrinth: "m00L1GVJ",
    github: "replaceitem/carpet-discarpet",
  },
  {
    name: "Carpet Extra",
    rules: "https://github.com/gnembon/carpet-extra#carpet-extra-features",
    modrinth: "VX3TgwQh",
    curseforge: {
      slug: "carpet-extra",
      id: "349240",
    },
    mcmod: "3325",
    github: "gnembon/carpet-extra",
  },
  {
    name: "Carpet Extra Extras",
    rules: "https://github.com/Thedustbustr/Carpet-Extra-Extras#carpet-extra-extras-rules",
    modrinth: "2O3YTVOd",
    github: "Carpet-Extra-Extras",
  },
  {
    name: "Carpet Igny Addition",
    rules: "https://github.com/liuyuexiaoyu1/Carpet-Igny-Addition/blob/HEAD/docs/rules.md",
    modrinth: "7PCm6yD1",
    mcmod: "23368",
    github: "liuyuexiaoyu1/Carpet-Igny-Addition",
  },
  {
    name: "Carpet LMS Addition",
    rules: "https://carpet.lms.nm.cn/docs/rules",
    website: "https://carpet.lms.nm.cn",
    modrinth: "fcv5tQYp",
    curseforge: {
      slug: "carpet-lms-addition",
      id: "1450056",
    },
    mcmod: "24639",
    github: "Citrus-Union/Carpet-LMS-Addition",
  },
  {
    name: "Carpet MCT Addition",
    rules: "https://github.com/MCTown/Carpet-MCT-Addition#rules",
    modrinth: "pY40IXqI",
    github: "MCTown/Carpet-MCT-Addition",
  },
  {
    name: "Carpet Org Addition",
    rules: "https://github.com/fcsailboat/Carpet-Org-Addition/blob/HEAD/docs/rules.md",
    modrinth: "L0bOPIqR",
    mcmod: "12237",
    github: "fcsailboat/Carpet-Org-Addition",
  },
  {
    name: "Carpet ROF Addition",
    github: "Melationin/ROF-Carpet-Addition",
  },
  {
    name: "Carpet Sky Additions Revised",
    modrinth: "Hi4jcyg4",
    github: "TreeOfSelf/CarpetSkyAdditions-Reborn",
  },
  {
    name: "Carpet Takeneko Addition",
    rules: "https://github.com/ZhuRuoLing/takeneko-carpet-addition#rules",
    modrinth: "F04n6rCD",
    curseforge: {
      slug: "carpet-takeneko-addition",
      id: "1171753",
    },
    github: "ZhuRuoLing/takeneko-carpet-addition",
  },
  {
    name: "Carpet TIS Addition",
    rules: "https://carpet.tis.world/docs/rules",
    website: "https://carpet.tis.world",
    modrinth: "jE0SjGuf",
    curseforge: {
      slug: "carpet-tis-addition",
      id: "397510",
    },
    mcmod: "5664",
    github: "TISUnion/Carpet-TIS-Addition",
  },
] satisfies ModInput[]

export default extensions
