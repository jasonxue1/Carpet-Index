#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"
import prettier from "prettier"

const cliArgs = process.argv.slice(2)
const checkOnly = cliArgs.includes("--check")
const targetFile = cliArgs.find((arg) => !arg.startsWith("--")) ?? "src/assets/extensions.ts"
const absPath = path.resolve(process.cwd(), targetFile)

const ENTRY_ORDER = ["name", "rules", "website", "modrinth", "curseforge", "mcmod", "github"]
const CURSEFORGE_ORDER = ["slug", "id"]

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

const run = async () => {
  const source = await fs.readFile(absPath, "utf8")
  const anchor = "const extensions ="
  const start = source.indexOf(anchor)
  if (start < 0) throw new Error(`Could not find "${anchor}" in ${targetFile}`)
  const open = source.indexOf("[", start)
  if (open < 0) throw new Error("Could not find opening bracket for extensions array.")
  const close = scanRange(source, open, "[", "]")

  const rawArray = source.slice(open, close + 1)
  const parsed = Function(`"use strict"; return (${rawArray});`)()
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

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
