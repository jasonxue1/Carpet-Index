export type LinkValue = string | { slug?: string; id?: string } | null | undefined
export type GiteaValue = { url: string; user: string; repo: string } | null | undefined

export type ModInput = {
  name: string
  website?: string
  docs?: string
  rules?: string
  modrinth?: LinkValue
  curseforge?: LinkValue
  mcmod?: LinkValue
  github?: string
  gitea?: GiteaValue
}

export type ModViewModel = {
  name: string
  slug: string
  website?: string
  docsUrl?: string
  docsLabel?: string
  modrinthUrl: string | null
  curseforgeUrl: string | null
  mcmodUrl: string | null
  githubUrl: string | null
  sourceUrl: string | null
  modrinthBadge: string | null
  curseforgeBadge: string | null
  githubDownloadsBadge: string | null
  githubStarsBadge: string | null
  giteaStarsBadge: string | null
}

type NormalizedLink = {
  id?: string
  slug?: string
  value?: string
}

export type LinksConfig = {
  modrinth: { website: (value: string) => string; downloads: (value: string) => string }
  curseforge: { website: (slug: string) => string; downloads: (id: string) => string }
  mcmod: (value: string) => string
  github: {
    website: (value: string) => string
    downloads: (value: string) => string
    stars: (value: string) => string
  }
  gitea: {
    stars: (baseUrl: string, user: string, repo: string) => string
  }
}

const normalizeLink = (value: LinkValue): NormalizedLink | null => {
  if (!value) return null
  if (typeof value === "string") return { value, slug: value, id: value }
  const slug = value.slug ?? value.id
  const id = value.id ?? value.slug
  return { id, slug, value: id ?? slug }
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")

export const toModViewModel = (mod: ModInput, links: LinksConfig): ModViewModel => {
  const githubValue = mod.github
  const giteaValue = mod.gitea
  const giteaBaseUrl = giteaValue?.url.replace(/\/+$/, "")
  const docsUrl = mod.docs ?? mod.rules
  const docsLabel = mod.docs ? "Docs" : mod.rules ? "Rules" : undefined
  const modrinth = normalizeLink(mod.modrinth)
  const curseforge = normalizeLink(mod.curseforge)
  const mcmod = normalizeLink(mod.mcmod)

  return {
    name: mod.name,
    slug: slugify(mod.name),
    website: mod.website,
    docsUrl,
    docsLabel,
    modrinthUrl: modrinth?.value ? links.modrinth.website(modrinth.value) : null,
    curseforgeUrl: curseforge?.slug ? links.curseforge.website(curseforge.slug) : null,
    mcmodUrl: mcmod?.value ? links.mcmod(mcmod.value) : null,
    githubUrl: githubValue ? links.github.website(githubValue) : null,
    sourceUrl: giteaValue ? `${giteaBaseUrl}/${giteaValue.user}/${giteaValue.repo}` : null,
    modrinthBadge: modrinth?.value ? links.modrinth.downloads(modrinth.value) : null,
    curseforgeBadge: curseforge?.id ? links.curseforge.downloads(curseforge.id) : null,
    githubDownloadsBadge: githubValue ? links.github.downloads(githubValue) : null,
    githubStarsBadge: githubValue ? links.github.stars(githubValue) : null,
    giteaStarsBadge:
      giteaValue && giteaBaseUrl
        ? links.gitea.stars(giteaBaseUrl, giteaValue.user, giteaValue.repo)
        : null,
  }
}

export const normalizeMods = (input: ModInput[]): ModInput[] => input
