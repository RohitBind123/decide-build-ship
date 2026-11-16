// Tests for the slice cleanup script. Run with: node --test cli/cleanup-slice.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync, existsSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "..", "skills", "ship-slice", "scripts", "cleanup-slice.sh");

function sh(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8" });
  assert.equal(r.status, 0, `${cmd} ${args.join(" ")}: ${r.stderr}`);
  return r.stdout.trim();
}
const git = (cwd, ...a) =>
  sh("git", ["-c", "user.email=t@t", "-c", "user.name=t", "-c", "commit.gpgsign=false", ...a], cwd);

function repo() {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "dbs-clean-")));
  git(dir, "init", "-q", "-b", "main");
  writeFileSync(join(dir, "a.txt"), "a\n");
  writeFileSync(join(dir, ".gitignore"), "node_modules/\n");
  git(dir, "add", ".");
  git(dir, "commit", "-qm", "init");
  return dir;
}

function slice(dir, name, { commit = true } = {}) {
  const wt = join(dir, "..", `${name}-wt-${Date.now()}${Math.random().toString(36).slice(2, 6)}`);
  git(dir, "worktree", "add", "-q", "-b", name, wt);
  mkdirSync(join(wt, "node_modules"), { recursive: true });
  writeFileSync(join(wt, "node_modules", "big.bin"), "x".repeat(2048));
  if (commit) {
    writeFileSync(join(wt, `${name}.txt`), name);
    git(wt, "add", `${name}.txt`);
    git(wt, "commit", "-qm", name);
  }
  return wt;
}

const run = (dir, ...args) => spawnSync("sh", [SCRIPT, ...args], { cwd: dir, encoding: "utf8" });

test("dry run lists a merged slice and removes nothing", () => {
  const dir = repo();
  const wt = slice(dir, "slice-1");
  git(dir, "merge", "-q", "--ff-only", "slice-1");
  const r = run(dir);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /would remove/);
  assert.match(r.stdout, /slice-1/);
  assert.ok(existsSync(wt));
});

test("--apply removes a merged slice worktree with its build output and deletes the branch", () => {
  const dir = repo();
  const wt = slice(dir, "slice-1");
  git(dir, "merge", "-q", "--ff-only", "slice-1");
  const r = run(dir, "--apply");
  assert.equal(r.status, 0, r.stderr);
  assert.ok(!existsSync(wt));
  assert.equal(git(dir, "branch", "--list", "slice-1"), "");
});

test("keeps an unmerged slice", () => {
  const dir = repo();
  const wt = slice(dir, "slice-2");
  const r = run(dir, "--apply");
  assert.equal(r.status, 0, r.stderr);
  assert.ok(existsSync(wt));
  assert.match(r.stdout, /keep.*slice-2.*not merged/s);
});

test("keeps a merged slice with uncommitted work", () => {
  const dir = repo();
  const wt = slice(dir, "slice-3");
  git(dir, "merge", "-q", "--ff-only", "slice-3");
  writeFileSync(join(wt, "wip.txt"), "wip");
  const r = run(dir, "--apply");
  assert.ok(existsSync(wt));
  assert.match(r.stdout, /keep.*slice-3.*uncommitted/s);
});

test("--abandon removes an unmerged slice only when named", () => {
  const dir = repo();
  const keep = slice(dir, "slice-4");
  const drop = slice(dir, "slice-5");
  const r = run(dir, "--apply", "--abandon", "slice-5");
  assert.equal(r.status, 0, r.stderr);
  assert.ok(existsSync(keep));
  assert.ok(!existsSync(drop));
});

test("prunes a worktree record whose folder is gone", () => {
  const dir = repo();
  const wt = slice(dir, "slice-6");
  spawnSync("rm", ["-rf", wt]);
  const r = run(dir, "--apply");
  assert.equal(r.status, 0, r.stderr);
  assert.equal(git(dir, "worktree", "list").split("\n").length, 1);
});

test("never touches the main checkout and refuses to run from a linked worktree", () => {
  const dir = repo();
  const wt = slice(dir, "slice-7");
  const r = run(wt, "--apply");
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /main checkout/);
  assert.ok(existsSync(dir));
});

test("rejects unknown arguments", () => {
  const r = run(repo(), "--nope");
  assert.notEqual(r.status, 0);
});
