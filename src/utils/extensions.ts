export type LinkValue = string | { slug?: string; id?: string } | null | undefined

export type ExtensionInput = {
  name: string
  website?: string
  docs?: string
  rules?: string
  modrinth?: LinkValue
  curseforge?: LinkValue
  mcmod?: LinkValue
  github?: string
}

export type ExtensionViewModel = {
  name: string
  slug: string
  website?: string
  docsUrl?: string
  docsLabel?: string
  modrinthUrl: string | null
  curseforgeUrl: string | null
  mcmodUrl: string | null
  sourceUrl: string | null
  modrinthBadge: string | null
  curseforgeBadge: string | null
  githubDownloadsBadge: string | null
  githubStarsBadge: string | null
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

export const toExtensionViewModel = (
  ext: ExtensionInput,
  links: LinksConfig,
): ExtensionViewModel => {
  const githubValue = ext.github
  const docsUrl = ext.docs ?? ext.rules
  const docsLabel = ext.docs ? "Docs" : ext.rules ? "Rules" : undefined
  const modrinth = normalizeLink(ext.modrinth)
  const curseforge = normalizeLink(ext.curseforge)
  const mcmod = normalizeLink(ext.mcmod)

  return {
    name: ext.name,
    slug: slugify(ext.name),
    website: ext.website,
    docsUrl,
    docsLabel,
    modrinthUrl: modrinth?.value ? links.modrinth.website(modrinth.value) : null,
    curseforgeUrl: curseforge?.slug ? links.curseforge.website(curseforge.slug) : null,
    mcmodUrl: mcmod?.value ? links.mcmod(mcmod.value) : null,
    sourceUrl: githubValue ? links.github.website(githubValue) : null,
    modrinthBadge: modrinth?.value ? links.modrinth.downloads(modrinth.value) : null,
    curseforgeBadge: curseforge?.id ? links.curseforge.downloads(curseforge.id) : null,
    githubDownloadsBadge: githubValue ? links.github.downloads(githubValue) : null,
    githubStarsBadge: githubValue ? links.github.stars(githubValue) : null,
  }
}

export const normalizeExtensions = (input: ExtensionInput[]): ExtensionInput[] => input
