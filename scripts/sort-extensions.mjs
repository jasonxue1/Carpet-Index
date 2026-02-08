#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"
import prettier from "prettier"

const cliArgs = process.argv.slice(2)
const checkOnly = cliArgs.includes("--check")
const targetFiles = ["src/assets/extensions.ts", "src/assets/official.ts"]

const ENTRY_ORDER = [
  "name",
  "rules",
  "website",
  "modrinth",
  "curseforge",
  "mcmod",
  "github",
  "gitea",
]
const CURSEFORGE_ORDER = ["slug", "id"]
const GITEA_ORDER = ["url", "user", "repo"]

const ciCompare = (a, b) =>
  a.localeCompare(b, "en", {
    sensitivity: "base",
    numeric: false,
  })

const scanRange = (source, from, openChar, closeChar) => {
  let depth = 0
  let inString = false
  let quote = ""
  let escaped = false
  for (let i = from; i < source.length; i += 1) {
    const ch = source[i]
    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }
      if (ch === "\\") {
        escaped = true
        continue
      }
      if (ch === quote) {
        inString = false
        quote = ""
      }
      continue
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true
      quote = ch
      continue
    }
    if (ch === openChar) depth += 1
    if (ch === closeChar) {
      depth -= 1
      if (depth === 0) return i
    }
  }
  throw new Error(`Failed to find closing ${closeChar}.`)
}

const orderKeys = (keys, preferred) => {
  const head = preferred.filter((k) => keys.includes(k))
  const tail = keys.filter((k) => !head.includes(k)).sort(ciCompare)
  return [...head, ...tail]
}

const sortAny = (value, keyPath = []) => {
  if (Array.isArray(value)) {
    const sortedItems = value.map((v) => sortAny(v, keyPath))
    if (keyPath.length === 0) {
      return sortedItems.sort((a, b) => ciCompare(String(a?.name ?? ""), String(b?.name ?? "")))
    }
    return sortedItems
  }
  if (!value || typeof value !== "object") return value

  const entries = Object.entries(value)
  const keys = entries.map(([k]) => k)
  let orderedKeys

  if (keyPath.at(-1) === "curseforge") {
    orderedKeys = orderKeys(keys, CURSEFORGE_ORDER)
  } else if (keyPath.at(-1) === "gitea") {
    orderedKeys = orderKeys(keys, GITEA_ORDER)
  } else if (keys.includes("name")) {
    orderedKeys = orderKeys(keys, ENTRY_ORDER)
  } else {
    orderedKeys = [...keys].sort(ciCompare)
  }

  const out = {}
  for (const key of orderedKeys) {
    out[key] = sortAny(value[key], [...keyPath, key])
  }
  return out
}

const printValue = (value, indent = 0) => {
  const pad = "  ".repeat(indent)
  if (value === null) return "null"
  if (typeof value === "string") return JSON.stringify(value)
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  if (Array.isArray(value)) {
    if (!value.length) return "[]"
    const items = value.map((v) => `${"  ".repeat(indent + 1)}${printValue(v, indent + 1)}`)
    return `[\n${items.join(",\n")}\n${pad}]`
  }

  const entries = Object.entries(value)
  if (!entries.length) return "{}"
  const formatKey = (key) => (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key))
  const lines = entries.map(
    ([k, v]) => `${"  ".repeat(indent + 1)}${formatKey(k)}: ${printValue(v, indent + 1)}`,
  )
  return `{\n${lines.join(",\n")}\n${pad}}`
}

const runOne = async (targetFile) => {
  const absPath = path.resolve(process.cwd(), targetFile)
  const source = await fs.readFile(absPath, "utf8")
  const declMatch = source.match(/const\s+\w+\s*=/)
  if (!declMatch || declMatch.index == null) {
    throw new Error(`Could not find constant assignment in ${targetFile}`)
  }
  const start = declMatch.index
  const eqIndex = source.indexOf("=", start)
  const afterEq = source.slice(eqIndex + 1)
  const firstStruct = afterEq.search(/[[{]/)
  if (firstStruct < 0) throw new Error(`Could not find object/array literal in ${targetFile}`)
  const open = eqIndex + 1 + firstStruct
  const openChar = source[open]
  const closeChar = openChar === "[" ? "]" : "}"
  const close = scanRange(source, open, openChar, closeChar)

  const rawValue = source.slice(open, close + 1)
  const parsed = Function(`"use strict"; return (${rawValue});`)()
  const sorted = sortAny(parsed)
  const printed = printValue(sorted, 0)

  const nextRaw = `${source.slice(0, open)}${printed}${source.slice(close + 1)}`
  const prettierConfig = (await prettier.resolveConfig(absPath, { editorconfig: true })) ?? {}
  const next = await prettier.format(nextRaw, { ...prettierConfig, filepath: absPath })
  if (checkOnly) {
    if (next !== source) {
      console.error(`${targetFile} is not sorted. Run: pnpm sort:apply`)
      process.exit(1)
    }
    return
  }
  await fs.writeFile(absPath, next)
}

const run = async () => {
  for (const file of targetFiles) {
    await runOne(file)
  }
}

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
