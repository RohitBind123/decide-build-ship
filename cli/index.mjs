#!/usr/bin/env node
// Installer for the decide-build-ship skills and agents.
// Zero dependencies. `install` copies into .claude/ and never overwrites anything that already exists.
// `plugin` keeps its own copy of the full plugin in ~/.decide-build-ship/plugin and replaces only that copy.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(PACKAGE_ROOT, "skills");
const AGENTS_DIR = join(PACKAGE_ROOT, "agents");
const PLUGIN_NAME = "decide-build-ship";
const PLUGIN = `${PLUGIN_NAME}@${PLUGIN_NAME}`;
// Everything Claude Code needs to load the package as a plugin.
const PLUGIN_PARTS = [".claude-plugin", "skills", "agents", "hooks", "README.md", "LICENSE"];
const INSTALL_FLAGS = new Set(["--user", "--dry-run", "--skills-only", "--dir"]);

const USAGE = `decide-build-ship: a decision-first product workflow for Claude Code

Usage:
  npx @rohit_1/decide-build-ship install [options]   copy skills and agents into .claude/
  npx @rohit_1/decide-build-ship list                list the skills and agents
  npx @rohit_1/decide-build-ship plugin [--dry-run]  copy the full plugin to ~/.decide-build-ship/plugin
                                                     and print the commands to install it
  npx @rohit_1/decide-build-ship --version | --help

Install options:
  --user          install into ~/.claude (all your projects) instead of ./.claude
  --dir <path>    install into <path>/.claude
  --skills-only   install the skills but not the agents
  --dry-run       show what would be installed; write nothing

Existing skills and agents with the same name are never overwritten.
The plugin install (see "plugin") also adds the SessionStart resume hook.`;

class UsageError extends Error {}
class InstallError extends Error {}

function readVersion() {
  return JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8")).version;
}

function listSkills() {
  return readdirSync(SKILLS_DIR)
    .filter((name) => statSync(join(SKILLS_DIR, name)).isDirectory())
    .sort();
}

function listAgents() {
  return readdirSync(AGENTS_DIR)
    .filter((name) => name.endsWith(".md"))
    .sort();
}

function describe(file) {
  const match = readFileSync(file, "utf8").match(/^description:\s*(.+)$/m);
  if (!match) return "";
  const text = match[1].trim();
  const firstSentence = text.split(/(?<=\.)\s| - /)[0];
  return firstSentence.length > 110 ? `${firstSentence.slice(0, 107)}...` : firstSentence;
}

function parseInstallOptions(args) {
  const options = { user: false, dryRun: false, skillsOnly: false, dir: null };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!INSTALL_FLAGS.has(arg)) throw new UsageError(`unknown option: ${arg}`);
    if (arg === "--user") options.user = true;
    if (arg === "--dry-run") options.dryRun = true;
    if (arg === "--skills-only") options.skillsOnly = true;
    if (arg === "--dir") {
      const value = args[i + 1];
      if (!value || value.startsWith("--")) throw new UsageError("--dir needs a path");
      options.dir = value;
      i += 1;
    }
  }
  if (options.user && options.dir) throw new UsageError("use either --user or --dir, not both");
  return options;
}

function targetRoot(options) {
  if (options.user) return join(homedir(), ".claude");
  return join(resolve(options.dir ?? process.cwd()), ".claude");
}

function planCopies(root, options) {
  const skills = listSkills().map((name) => ({
    kind: "skill",
    name,
    from: join(SKILLS_DIR, name),
    to: join(root, "skills", name),
  }));
  const agents = options.skillsOnly
    ? []
    : listAgents().map((file) => ({
        kind: "agent",
        name: file.replace(/\.md$/, ""),
        from: join(AGENTS_DIR, file),
        to: join(root, "agents", file),
      }));
  return [...skills, ...agents].map((item) => ({ ...item, exists: existsSync(item.to) }));
}

function install(args) {
  const options = parseInstallOptions(args);
  const root = targetRoot(options);
  const plan = planCopies(root, options);
  const verb = options.dryRun ? "would install" : "installed";

  console.log(`${options.dryRun ? "Dry run: " : ""}target ${root}`);
  for (const item of plan) {
    if (item.exists) {
      console.log(`  skipped ${item.kind} ${item.name} (already exists; yours is kept)`);
      continue;
    }
    if (!options.dryRun) {
      mkdirSync(dirname(item.to), { recursive: true });
      cpSync(item.from, item.to, { recursive: true, errorOnExist: true, force: false });
    }
    console.log(`  ${verb} ${item.kind} ${item.name}`);
  }

  const added = plan.filter((item) => !item.exists).length;
  const skipped = plan.length - added;
  console.log(`\n${added} ${verb}, ${skipped} skipped.`);
  if (!options.dryRun && added > 0) {
    console.log("Next: open Claude Code in your project and say \"Set this repo up for the workflow.\"");
    console.log("For the SessionStart resume hook, install the plugin instead (run: plugin).");
  }
}

function list() {
  console.log("Skills:");
  for (const name of listSkills()) {
    console.log(`  ${name.padEnd(14)} ${describe(join(SKILLS_DIR, name, "SKILL.md"))}`);
  }
  console.log("\nAgents:");
  for (const file of listAgents()) {
    console.log(`  ${file.replace(/\.md$/, "").padEnd(19)} ${describe(join(AGENTS_DIR, file))}`);
  }
}

function pluginTarget() {
  return join(homedir(), ".decide-build-ship", "plugin");
}

function isOwnCopy(dir) {
  try {
    const manifest = JSON.parse(readFileSync(join(dir, ".claude-plugin", "plugin.json"), "utf8"));
    return manifest.name === PLUGIN_NAME;
  } catch {
    return false;
  }
}

function plugin(args) {
  const unknown = args.filter((arg) => arg !== "--dry-run");
  if (unknown.length > 0) throw new UsageError(`unknown option: ${unknown[0]}`);
  const dryRun = args.includes("--dry-run");
  const target = pluginTarget();
  const updating = existsSync(target);
  if (updating && !isOwnCopy(target)) {
    throw new InstallError(`${target} exists and is not a decide-build-ship plugin copy; move it away first`);
  }

  if (dryRun) {
    console.log(`Dry run: would copy the plugin (${PLUGIN_PARTS.join(", ")}) to ${target}`);
    return;
  }
  if (updating) rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  for (const part of PLUGIN_PARTS) {
    const from = join(PACKAGE_ROOT, part);
    if (existsSync(from)) cpSync(from, join(target, part), { recursive: true });
  }

  console.log(`Copied the plugin (version ${readVersion()}) to ${target}\n`);
  if (updating) {
    console.log("Updated an earlier copy. To load the new version, run:");
    console.log(`  claude plugin marketplace update ${PLUGIN_NAME}`);
    console.log(`  claude plugin update ${PLUGIN}`);
    return;
  }
  console.log(`Install it (skills, agents and the SessionStart resume hook) with:
  claude plugin marketplace add "${target}"
  claude plugin install ${PLUGIN}

Or inside Claude Code:
  /plugin marketplace add ${target}
  /plugin install ${PLUGIN}`);
}

function main(argv) {
  const [command, ...rest] = argv;
  if (!command || command === "--help" || command === "-h" || command === "help") return console.log(USAGE);
  if (command === "--version" || command === "-v") return console.log(readVersion());
  if (command === "install") return install(rest);
  if (command === "plugin") return plugin(rest);
  if (rest.length > 0) throw new UsageError(`unexpected arguments: ${rest.join(" ")}`);
  if (command === "list") return list();
  throw new UsageError(`unknown command: ${command}`);
}

try {
  main(process.argv.slice(2));
} catch (error) {
  if (error instanceof UsageError) {
    console.error(`decide-build-ship: ${error.message}\nRun with --help for usage.`);
    process.exit(2);
  }
  console.error(`decide-build-ship: ${error.message}`);
  process.exit(1);
}
