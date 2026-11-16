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
  const wt = join(dir, "..", `${name.replace(/\//g, "-")}-wt-${Date.now()}${Math.random().toString(36).slice(2, 6)}`);
  git(dir, "worktree", "add", "-q", "-b", name, wt);
  mkdirSync(join(wt, "node_modules"), { recursive: true });
  writeFileSync(join(wt, "node_modules", "big.bin"), "x".repeat(2048));
  if (commit) {
    const file = `${name.replace(/\//g, "-")}.txt`;
    writeFileSync(join(wt, file), name);
    git(wt, "add", file);
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

// Squash-merge detection (offline, git merge-tree --write-tree).
function squashMerge(dir, branch) {
  git(dir, "merge", "-q", "--squash", branch);
  git(dir, "commit", "-qm", `squash ${branch}`);
}

test("squash-merged slice is removed with --apply", () => {
  const dir = repo();
  const wt = slice(dir, "slice-8");
  squashMerge(dir, "slice-8");
  const r = run(dir, "--apply");
  assert.equal(r.status, 0, r.stderr);
  assert.ok(!existsSync(wt), r.stdout);
  assert.equal(git(dir, "branch", "--list", "slice-8"), "");
});

test("squash-merged slice is still detected after the base moved on", () => {
  const dir = repo();
  const wt = slice(dir, "slice-8b");
  squashMerge(dir, "slice-8b");
  writeFileSync(join(dir, "later.txt"), "later");
  git(dir, "add", "later.txt");
  git(dir, "commit", "-qm", "later");
  const r = run(dir, "--apply");
  assert.ok(!existsSync(wt), r.stdout);
});

test("slice with an extra commit after the squash is kept as not merged", () => {
  const dir = repo();
  const wt = slice(dir, "slice-9");
  squashMerge(dir, "slice-9");
  writeFileSync(join(wt, "extra.txt"), "extra");
  git(wt, "add", "extra.txt");
  git(wt, "commit", "-qm", "extra");
  const r = run(dir, "--apply");
  assert.ok(existsSync(wt));
  assert.match(r.stdout, /keep.*slice-9.*not merged/s);
});

test("conflicting slice is kept", () => {
  const dir = repo();
  const wt = slice(dir, "slice-10");
  writeFileSync(join(wt, "a.txt"), "from slice\n");
  git(wt, "add", "a.txt");
  git(wt, "commit", "-qm", "slice edits a");
  writeFileSync(join(dir, "a.txt"), "from main\n");
  git(dir, "add", "a.txt");
  git(dir, "commit", "-qm", "main edits a");
  const r = run(dir, "--apply");
  assert.ok(existsSync(wt));
  assert.match(r.stdout, /keep.*slice-10.*not merged/s);
});

test("uncommitted-work message names the dirty files", () => {
  const dir = repo();
  const wt = slice(dir, "slice-11");
  git(dir, "merge", "-q", "--ff-only", "slice-11");
  writeFileSync(join(wt, "wip.txt"), "wip");
  writeFileSync(join(wt, "wip2.txt"), "wip");
  const r = run(dir, "--apply");
  assert.ok(existsSync(wt));
  assert.match(r.stdout, /2 untracked or modified files \(first: wip2?\.txt\)/);
});

test("a tag named like the slice branch cannot make an unmerged branch look merged", () => {
  const dir = repo();
  const wt = slice(dir, "slice-tag"); // has its own commit, not merged
  git(dir, "tag", "slice-tag-merged", "main");
  git(dir, "tag", "-f", "slice-tag", "main");
  const r = run(dir, "--apply");
  assert.equal(r.status, 0, r.stderr);
  assert.ok(existsSync(wt));
  assert.notEqual(git(dir, "branch", "--list", "slice-tag"), "");
});

test("keeps a merged worktree that holds an ignored secret file and names it", () => {
  const dir = repo();
  const wt = slice(dir, "slice-env");
  git(dir, "merge", "-q", "--ff-only", "slice-env");
  writeFileSync(join(dir, ".git", "info", "exclude"), "node_modules/\n.env\n", { flag: "a" });
  writeFileSync(join(wt, ".env"), "TOKEN=x");
  const r = run(dir, "--apply");
  assert.ok(existsSync(wt));
  assert.match(r.stdout, /^keep.*slice-env.*ignored.*\.env/m);
});

test("handles a slice branch with a slash in its name", () => {
  const dir = repo();
  const wt = slice(dir, "feat/slice-12");
  git(dir, "merge", "-q", "--ff-only", "feat/slice-12");
  const r = run(dir, "--apply");
  assert.equal(r.status, 0, r.stderr);
  assert.ok(!existsSync(wt));
  assert.equal(git(dir, "branch", "--list", "feat/slice-12"), "");
});

test("keeps a freshly created worktree that has no commits of its own yet", () => {
  const dir = repo();
  const wt = slice(dir, "slice-new", { commit: false });
  const r = run(dir, "--apply");
  assert.equal(r.status, 0, r.stderr);
  assert.ok(existsSync(wt));
  assert.match(r.stdout, /^keep.*slice-new.*no commits of its own/m);
});

test("keeps a fresh worktree even after the base branch moved on", () => {
  const dir = repo();
  const wt = slice(dir, "slice-new2", { commit: false });
  writeFileSync(join(dir, "b.txt"), "b");
  git(dir, "add", "b.txt");
  git(dir, "commit", "-qm", "more");
  run(dir, "--apply");
  assert.ok(existsSync(wt));
});
