import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const hook = join(dirname(fileURLToPath(import.meta.url)), "..", "hooks", "session-start.sh");
const git = (cwd, ...args) =>
  spawnSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...args], { cwd, encoding: "utf8" });

// Temp repo on branch main with a CLAUDE.md; settings go inside the Build workflow section.
function makeProject({ section = true, settings = "" } = {}) {
  const root = mkdtempSync(join(tmpdir(), "dbs-s3-"));
  const repo = join(root, "repo");
  git(root, "init", "-q", "-b", "main", repo);
  const body = section ? `# P\n\n## Build workflow\n\n${settings}\n` : "# P\n";
  writeFileSync(join(repo, "CLAUDE.md"), body);
  git(repo, "add", "CLAUDE.md");
  git(repo, "commit", "-q", "-m", "init");
  return { root, repo };
}

function addWorktree(p, name, { extraCommit = false } = {}) {
  const dir = join(p.root, name);
  git(p.repo, "worktree", "add", "-q", "-b", name, dir);
  if (extraCommit) {
    writeFileSync(join(dir, "f.txt"), "x");
    git(dir, "add", "f.txt");
    git(dir, "commit", "-q", "-m", "work");
  }
}

function runIn(dir) {
  const r = spawnSync("sh", [hook], {
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir },
    encoding: "utf8",
  });
  return { out: r.stdout, code: r.status };
}
const run = (p) => runIn(p.repo);

const LINE = /merged worktrees? (is|are) still on disk/;

test("merged worktree: report line with count appears", () => {
  const p = makeProject();
  try {
    addWorktree(p, "done-a");
    const r = run(p);
    assert.match(
      r.out,
      /1 merged worktree is still on disk \(about \d+ MB\)\. Run the ship-slice cleanup script \(dry run first\)\./,
    );
    addWorktree(p, "done-b");
    assert.match(run(p).out, /2 merged worktrees are still on disk/);
    assert.equal(r.code, 0);
  } finally {
    rmSync(p.root, { recursive: true, force: true });
  }
});

test("unmerged worktree: no report line", () => {
  const p = makeProject();
  try {
    addWorktree(p, "wip", { extraCommit: true });
    const r = run(p);
    assert.doesNotMatch(r.out, LINE);
    assert.match(r.out, /decide-build-ship workflow/);
    assert.equal(r.code, 0);
  } finally {
    rmSync(p.root, { recursive: true, force: true });
  }
});

test("Cleanup: off prints no worktree line; auto and ask do", () => {
  const off = makeProject({ settings: "- Cleanup: off" });
  const auto = makeProject({ settings: "- Cleanup: auto" });
  const ask = makeProject({ settings: "- Cleanup: ask" });
  try {
    for (const p of [off, auto, ask]) addWorktree(p, "done");
    const r = run(off);
    assert.doesNotMatch(r.out, LINE);
    assert.equal(r.code, 0);
    assert.match(run(auto).out, LINE);
    assert.match(run(ask).out, LINE);
  } finally {
    for (const p of [off, auto, ask]) rmSync(p.root, { recursive: true, force: true });
  }
});

test("no Build workflow section: no output", () => {
  const p = makeProject({ section: false });
  try {
    addWorktree(p, "done");
    const r = run(p);
    assert.equal(r.out, "");
    assert.equal(r.code, 0);
  } finally {
    rmSync(p.root, { recursive: true, force: true });
  }
});

test("exit code is 0 for removed worktree folder, non-git dir and missing CLAUDE.md", () => {
  const p = makeProject();
  const plain = mkdtempSync(join(tmpdir(), "dbs-s3-plain-"));
  const empty = mkdtempSync(join(tmpdir(), "dbs-s3-empty-"));
  try {
    addWorktree(p, "gone");
    rmSync(join(p.root, "gone"), { recursive: true, force: true });
    const r = run(p);
    assert.doesNotMatch(r.out, LINE);
    assert.equal(r.code, 0);

    writeFileSync(join(plain, "CLAUDE.md"), "## Build workflow\n");
    const r2 = runIn(plain);
    assert.equal(r2.code, 0);
    assert.doesNotMatch(r2.out, LINE);

    assert.equal(runIn(empty).code, 0);
  } finally {
    for (const d of [p.root, plain, empty]) rmSync(d, { recursive: true, force: true });
  }
});
