import { execSync } from "node:child_process";

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

function diffNameOnly(range) {
  const out = run(`git diff --name-only ${range}`);
  return out ? out.split("\n").map((s) => s.trim()).filter(Boolean) : [];
}

/**
 * Regras:
 * - Se `prisma/schema.prisma` mudou, deve haver mudança em `prisma/migrations/**`.
 * - No PR: compara `origin/<base>...HEAD`.
 * - Fora de PR: tenta `origin/main...HEAD`, senão compara `HEAD~1..HEAD`.
 */
const baseRef = process.env.GITHUB_BASE_REF;
let files = [];

try {
  if (baseRef) {
    files = diffNameOnly(`origin/${baseRef}...HEAD`);
  } else {
    try {
      files = diffNameOnly("origin/main...HEAD");
    } catch {
      files = diffNameOnly("HEAD~1..HEAD");
    }
  }
} catch (e) {
  console.error("❌ Failed to compute git diff:", e?.message ?? e);
  process.exit(1);
}

const schemaChanged = files.includes("prisma/schema.prisma");
if (!schemaChanged) {
  console.log("✅ Prisma schema unchanged.");
  process.exit(0);
}

const migrationTouched = files.some((p) => p.startsWith("prisma/migrations/"));
if (!migrationTouched) {
  console.error("\n❌ prisma/schema.prisma changed but no migration was added/updated.");
  console.error("Expected changes under: prisma/migrations/**");
  console.error("\nFix:");
  console.error("- Run: pnpm db:migrate (or prisma migrate dev)");
  console.error("- Commit the generated migration folder under prisma/migrations/");
  process.exit(1);
}

console.log("✅ Prisma schema changed and migration detected.");
