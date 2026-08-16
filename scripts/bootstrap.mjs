import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(workspaceRoot, "workspace.json"), "utf8"));
const configureRemotes = process.argv.includes("--configure-remotes");

function run(args, cwd = workspaceRoot, output = "inherit") {
  const result = execFileSync("git", args, { cwd, encoding: "utf8", stdio: output });
  return typeof result === "string" ? result.trim() : "";
}

function safeTarget(relativePath) {
  const target = resolve(workspaceRoot, relativePath);
  if (!target.startsWith(`${workspaceRoot}${sep}`)) {
    throw new Error(`Repository path escapes workspace: ${relativePath}`);
  }
  return target;
}

function ensureRemote(repoPath, name, url) {
  if (!url) return;
  const remotes = run(["remote"], repoPath, "pipe").split("\n").filter(Boolean);
  if (remotes.includes(name)) {
    const current = run(["remote", "get-url", name], repoPath, "pipe");
    if (current !== url) {
      console.warn(`  ! ${name} already points to ${current}; expected ${url}`);
    }
    return;
  }
  run(["remote", "add", name, url], repoPath);
  console.log(`  + added ${name}: ${url}`);
}

for (const repository of manifest.repositories) {
  const target = safeTarget(repository.path);
  const gitDirectory = join(target, ".git");

  console.log(`\n${repository.name}`);
  if (!existsSync(gitDirectory)) {
    if (existsSync(target) && readdirSync(target).length > 0) {
      throw new Error(`${repository.path} exists but is not a Git repository`);
    }
    const branchArgs = repository.defaultBranch
      ? ["--branch", repository.defaultBranch]
      : [];
    run(["clone", ...branchArgs, repository.remote, target]);
    console.log(`  + cloned ${repository.remote}`);
  } else {
    const root = run(["rev-parse", "--show-toplevel"], target, "pipe");
    if (resolve(root) !== target) {
      throw new Error(`${repository.path} resolves to unexpected Git root ${root}`);
    }
    const branch = run(["branch", "--show-current"], target, "pipe") || "detached HEAD";
    console.log(`  ✓ existing repository (${branch})`);
  }

  if (configureRemotes) {
    ensureRemote(target, "origin", repository.remote);
    ensureRemote(target, "upstream", repository.upstream);
  }
}

console.log("\nWorkspace ready.");
