// Tests for the installer CLI. Run with: node --test cli/index.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const CLI = join(dirname(fileURLToPath(import.meta.url)), "index.mjs");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS = readdirSync(join(ROOT, "skills")).sort();
const AGENTS = readdirSync(join(ROOT, "agents")).filter((f) => f.endsWith(".md")).sort();

function run(args, { cwd, home } = {}) {
  const env = { ...process.env, HOME: home ?? mkdtempSync(join(tmpdir(), "dbs-home-")) };
  return spawnSync(process.execPath, [CLI, ...args], { cwd, env, encoding: "utf8" });
}

function tempProject() {
  return mkdtempSync(join(tmpdir(), "dbs-proj-"));
}

test("install copies every skill and agent into the project's .claude folder", () => {
  const proj = tempProject();
  const res = run(["install"], { cwd: proj });
  assert.equal(res.status, 0, res.stderr);
  for (const skill of SKILLS) {
    assert.ok(existsSync(join(proj, ".claude", "skills", skill, "SKILL.md")), `missing skill ${skill}`);
  }
  for (const agent of AGENTS) {
    assert.ok(existsSync(join(proj, ".claude", "agents", agent)), `missing agent ${agent}`);
  }
  // references and assets come along
  assert.ok(existsSync(join(proj, ".claude", "skills", "discover", "assets", "prd.md")));
});

test("install --user writes into the home directory, not the project", () => {
  const proj = tempProject();
  const home = mkdtempSync(join(tmpdir(), "dbs-home-"));
  const res = run(["install", "--user"], { cwd: proj, home });
  assert.equal(res.status, 0, res.stderr);
  assert.ok(existsSync(join(home, ".claude", "skills", "decide", "SKILL.md")));
  assert.ok(!existsSync(join(proj, ".claude")));
});

test("install never overwrites an existing skill or agent and reports it as skipped", () => {
  const proj = tempProject();
  const mine = join(proj, ".claude", "skills", "decide");
  mkdirSync(mine, { recursive: true });
  writeFileSync(join(mine, "SKILL.md"), "my own decide skill");
  mkdirSync(join(proj, ".claude", "agents"), { recursive: true });
  writeFileSync(join(proj, ".claude", "agents", "code-reviewer.md"), "my reviewer");

  const res = run(["install"], { cwd: proj });
  assert.equal(res.status, 0, res.stderr);
  assert.equal(readFileSync(join(mine, "SKILL.md"), "utf8"), "my own decide skill");
  assert.equal(readFileSync(join(proj, ".claude", "agents", "code-reviewer.md"), "utf8"), "my reviewer");
  assert.match(res.stdout, /skipped.*decide/i);
  assert.match(res.stdout, /skipped.*code-reviewer/i);
  assert.ok(existsSync(join(proj, ".claude", "skills", "discover", "SKILL.md")));
});

test("install --dry-run writes nothing and lists what it would do", () => {
  const proj = tempProject();
  const res = run(["install", "--dry-run"], { cwd: proj });
  assert.equal(res.status, 0, res.stderr);
  assert.ok(!existsSync(join(proj, ".claude")));
  assert.match(res.stdout, /would install/i);
});

test("install --skills-only skips the agents", () => {
  const proj = tempProject();
  const res = run(["install", "--skills-only"], { cwd: proj });
  assert.equal(res.status, 0, res.stderr);
  assert.ok(existsSync(join(proj, ".claude", "skills", "decide")));
  assert.ok(!existsSync(join(proj, ".claude", "agents")));
});

test("list prints every skill and agent", () => {
  const res = run(["list"]);
  assert.equal(res.status, 0, res.stderr);
  for (const skill of SKILLS) assert.match(res.stdout, new RegExp(`\\b${skill}\\b`));
  for (const agent of AGENTS) assert.match(res.stdout, new RegExp(`\\b${agent.replace(".md", "")}\\b`));
});

test("plugin prints the marketplace install commands", () => {
  const res = run(["plugin"]);
  assert.equal(res.status, 0, res.stderr);
  assert.match(res.stdout, /plugin marketplace add RohitBind123\/decide-build-ship/);
  assert.match(res.stdout, /plugin install decide-build-ship@decide-build-ship/);
});

test("--version prints the package version, which matches the plugin manifest", () => {
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const plugin = JSON.parse(readFileSync(join(ROOT, ".claude-plugin", "plugin.json"), "utf8"));
  const res = run(["--version"]);
  assert.equal(res.status, 0, res.stderr);
  assert.equal(res.stdout.trim(), pkg.version);
  assert.equal(pkg.version, plugin.version);
});

test("help is shown with no arguments; unknown commands and flags fail with exit 2", () => {
  assert.match(run([]).stdout, /Usage/);
  const bad = run(["frobnicate"]);
  assert.equal(bad.status, 2);
  assert.match(bad.stderr, /unknown command/i);
  const badFlag = run(["install", "--nope"]);
  assert.equal(badFlag.status, 2);
  assert.match(badFlag.stderr, /unknown option/i);
});

test("install --dir targets another project folder", () => {
  const proj = tempProject();
  const other = tempProject();
  const res = run(["install", "--dir", other], { cwd: proj });
  assert.equal(res.status, 0, res.stderr);
  assert.ok(existsSync(join(other, ".claude", "skills", "decide", "SKILL.md")));
  assert.ok(!existsSync(join(proj, ".claude")));
});
