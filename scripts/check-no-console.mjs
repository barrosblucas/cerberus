import { execSync } from "node:child_process";
import fs from "node:fs";

const INCLUDED_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs"]);

const ALLOW_PATTERNS = [
  /^node_modules\//,
  /^dist\//,
  /^coverage\//,
  /^\.turbo\//,

  // scripts podem precisar logar
  /^scripts\//,

  // (opcional) permitir logs em testes:
  // /^.*\.(test|spec)\.(ts|tsx|js|mjs|cjs)$/,
];

const CONSOLE_REGEX = /\bconsole\.(log|info|warn|error|debug)\s*\(/g;

// Escape hatch (primeira linha): // @allow-console
function hasAllowHeader(filePath) {
  try {
    const firstLine = fs.readFileSync(filePath, "utf8").split("\n")[0] ?? "";
    return firstLine.includes("@allow-console");
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

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function extOf(path) {
  const dot = path.lastIndexOf(".");
  return dot === -1 ? "" : path.slice(dot);
}

const files = getChangedFilesFromPR() ?? getAllTrackedFiles();

const violations = [];

for (const relPath of files) {
  if (isAllowed(relPath)) continue;

  const ext = extOf(relPath);
  if (!INCLUDED_EXT.has(ext)) continue;

  if (!fs.existsSync(relPath)) continue; // deletado/renomeado
  if (hasAllowHeader(relPath)) continue;

  const content = readText(relPath);
  const matches = [...content.matchAll(CONSOLE_REGEX)];
  if (matches.length === 0) continue;

  // opcional: permitir console.error só em backend? (não recomendado)
  violations.push({
    relPath,
    count: matches.length,
  });
}

if (violations.length) {
  console.error("\n❌ console.* encontrado em arquivos commitados:");
  for (const v of violations) {
    console.error(`- ${v.relPath} (${v.count} ocorrência(s))`);
  }
  console.error(
    "\nFix:\n- Remova o console.* (use Pino no backend) ou troque por tratamento adequado.\n" +
      "- Em caso EXCEPCIONAL, adicione na 1ª linha: // @allow-console\n",
  );
  process.exit(1);
}

console.log("✅ No-console check passed.");
