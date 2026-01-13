import { execSync } from "node:child_process";
import fs from "node:fs";

const HARD_LIMIT = Number(process.env.FILE_HARD_LIMIT ?? 400);

const INCLUDED_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".md",
  ".json",
  ".yml",
  ".yaml",
]);

const ALLOW_PATTERNS = [
  /^node_modules\//,
  /^dist\//,
  /^coverage\//,
  /^\.turbo\//,

  // Prisma migrations tendem a ser verbosas/geradas
  /^prisma\/migrations\//,

  // arquivos gerados
  /^.*\/generated\//,
  /^.*\.gen\..*$/,
  /^.*\.generated\..*$/,

  // tipos e configs
  /^.*\.d\.ts$/,
  /^.*\.config\..*$/,
  /^.*\/vite\.config\..*$/,
  /^.*\/playwright\.config\..*$/,
  /^.*\/tailwind\.config\..*$/,
];

function hasIgnoreHeader(filePath) {
  try {
    const firstLine = fs.readFileSync(filePath, "utf8").split("\n")[0] ?? "";
    return firstLine.includes("@file-length-ignore");
  } catch {
    return false;
  }
}

function isAllowed(relPath) {
  return ALLOW_PATTERNS.some((re) => re.test(relPath));
}

function getChangedFilesFromPR() {
  const baseRef = process.env.GITHUB_BASE_REF;
  if (!baseRef) return null;

  const out = execSync(`git diff --name-only origin/${baseRef}...HEAD`, { encoding: "utf8" });
  return out
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function getAllTrackedFiles() {
  const out = execSync("git ls-files", { encoding: "utf8" });
  return out
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function countLines(filePath) {
  return fs.readFileSync(filePath, "utf8").split("\n").length;
}

const files = getChangedFilesFromPR() ?? getAllTrackedFiles();
const failures = [];

for (const relPath of files) {
  if (isAllowed(relPath)) continue;

  const dot = relPath.lastIndexOf(".");
  if (dot === -1) continue;
  const ext = relPath.slice(dot);
  if (!INCLUDED_EXT.has(ext)) continue;

  if (!fs.existsSync(relPath)) continue; // deletado/renomeado
  if (hasIgnoreHeader(relPath)) continue;

  const lines = countLines(relPath);
  if (lines > HARD_LIMIT) failures.push({ relPath, lines });
}

if (failures.length) {
  console.error(`\n❌ File length hard limit exceeded (${HARD_LIMIT} lines):`);
  for (const f of failures.sort((a, b) => b.lines - a.lines)) {
    console.error(`- ${f.relPath}: ${f.lines} lines`);
  }
  console.error(
    `\nFix: refatore (composition/extrair helpers/handlers). ` +
      `Se for EXCEPCIONAL, adicione na 1ª linha do arquivo:\n// @file-length-ignore`,
  );
  process.exit(1);
}

console.log(`✅ File length check passed (hard limit ${HARD_LIMIT}).`);
