// Checks what npm would publish. Run with: node --test cli/package.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function packedFiles() {
  const r = spawnSync("npm", ["pack", "--dry-run", "--json"], { cwd: ROOT, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout)[0].files.map((f) => f.path);
}

test("the package contains no project decisions, specs, evidence, feature docs, ADRs or handoff files", () => {
  const leaked = packedFiles().filter((p) =>
    /^(docs\/(decisions\.md|spec\/|features\/|adr\/|evidence\/|backlog\.md)|tasks\/|CLAUDE\.md)/.test(p),
  );
  assert.deepEqual(leaked, []);
});

test("the package still ships the user-facing docs, skills and the cleanup script", () => {
  const files = packedFiles();
  for (const must of [
    "docs/configuration.md",
    "docs/example-decisions-log.md",
    "skills/ship-slice/SKILL.md",
    "skills/ship-slice/scripts/cleanup-slice.sh",
  ]) {
    assert.ok(files.includes(must), `missing ${must}`);
  }
});
