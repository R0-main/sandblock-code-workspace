import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(workspaceRoot, "workspace.json"), "utf8"));
const args = new Set(process.argv.slice(2));
const pull = !args.has("--no-pull");
const clean = args.has("--clean");
const launch = args.has("--launch");
const isWindows = process.platform === "win32";

const paths = {
  app: join(workspaceRoot, "sandblock-code"),
  ui: join(workspaceRoot, "sandblock-ui"),
  rojo: join(workspaceRoot, "sandblock-rojo"),
  plugin: join(workspaceRoot, "sandblock-studio-plugin"),
};
const warnings = [];

function step(title) {
  console.log(`\n\x1b[1m== ${title}\x1b[0m`);
}

function warn(message) {
  warnings.push(message);
  console.warn(`  ! ${message}`);
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: "pipe" }).trim();
}

function tryGit(args, cwd) {
  try {
    return git(args, cwd);
  } catch {
    return null;
  }
}

/** Runs a visible command and stops the update when it fails. */
function run(command, commandArgs, cwd) {
  console.log(`  $ ${command} ${commandArgs.join(" ")}`);
  const result = spawnSync(command, commandArgs, { cwd, stdio: "inherit", shell: isWindows });
  if (result.error) throw new Error(`${command} could not start: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`${command} ${commandArgs.join(" ")} failed in ${cwd}`);
}

function hasCommand(command) {
  const probe = isWindows ? ["where", [command]] : ["which", [command]];
  return spawnSync(probe[0], probe[1], { stdio: "ignore" }).status === 0;
}

function safeTarget(relativePath) {
  const target = resolve(workspaceRoot, relativePath);
  if (!target.startsWith(`${workspaceRoot}${sep}`)) {
    throw new Error(`Repository path escapes workspace: ${relativePath}`);
  }
  return target;
}

/**
 * Fast-forwards one repository on the branch it already has checked out.
 *
 * Anything that would need a decision — local changes, no upstream, a
 * detached HEAD, diverged history — is reported and left untouched.
 */
function syncRepository(repository) {
  const target = safeTarget(repository.path);
  console.log(`\n${repository.name}`);

  if (!existsSync(join(target, ".git"))) {
    if (existsSync(target) && readdirSync(target).length > 0) {
      warn(`${repository.path} exists but is not a Git repository`);
      return;
    }
    const branchArgs = repository.defaultBranch ? ["--branch", repository.defaultBranch] : [];
    const cloned = spawnSync("git", ["clone", ...branchArgs, repository.remote, target], { stdio: "inherit" });
    if (cloned.status === 0) console.log(`  + cloned ${repository.remote}`);
    else warn(`${repository.name}: clone of ${repository.remote} failed`);
    return;
  }

  const branch = tryGit(["branch", "--show-current"], target);
  if (!branch) return warn(`${repository.name}: detached HEAD, not pulled`);
  if (git(["status", "--porcelain"], target)) {
    return warn(`${repository.name}: local changes on ${branch}, not pulled`);
  }
  const upstream = tryGit(["rev-parse", "--abbrev-ref", "@{u}"], target);
  if (!upstream) return warn(`${repository.name}: ${branch} has no upstream, not pulled`);

  const before = git(["rev-parse", "HEAD"], target);
  const pulled = spawnSync("git", ["pull", "--ff-only", "--quiet"], { cwd: target, stdio: "inherit" });
  if (pulled.status !== 0) return warn(`${repository.name}: ${branch} cannot fast-forward to ${upstream}`);
  const after = git(["rev-parse", "HEAD"], target);
  console.log(before === after
    ? `  ✓ ${branch} already up to date`
    : `  ✓ ${branch} ${before.slice(0, 7)} → ${after.slice(0, 7)}`);
}

/**
 * `npm ci` from the lockfile, skipped when the lockfile and Node version are
 * unchanged since the last install so a no-op update stays quick.
 */
function installDependencies(label, cwd) {
  const lockfile = join(cwd, "package-lock.json");
  const stamp = join(cwd, "node_modules", ".sandblock-install-stamp");
  const fingerprint = createHash("sha256")
    .update(readFileSync(lockfile))
    .update(process.version)
    .digest("hex");
  if (!clean && existsSync(stamp) && readFileSync(stamp, "utf8") === fingerprint) {
    console.log(`  ✓ ${label} dependencies unchanged`);
    return;
  }
  run("npm", ["ci"], cwd);
  writeFileSync(stamp, fingerprint);
}

function studioPluginsDirectory() {
  if (process.env.SANDBLOCK_STUDIO_PLUGINS_DIR) return process.env.SANDBLOCK_STUDIO_PLUGINS_DIR;
  if (isWindows) return join(process.env.LOCALAPPDATA ?? join(homedir(), "AppData", "Local"), "Roblox", "Plugins");
  // Under WSL, Studio is the Windows one: a Linux home has no Studio to read
  // ~/Documents/Roblox/Plugins, so an update run there installed nothing.
  const windowsLocalAppData = process.env.WSL_DISTRO_NAME ? wslWindowsLocalAppData() : null;
  if (windowsLocalAppData) return join(windowsLocalAppData, "Roblox", "Plugins");
  return join(homedir(), "Documents", "Roblox", "Plugins");
}

/** `%LOCALAPPDATA%` of the Windows user, as a WSL path, or null when interop is unavailable. */
function wslWindowsLocalAppData() {
  try {
    const windowsPath = execFileSync("cmd.exe", ["/c", "echo %LOCALAPPDATA%"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (!windowsPath || windowsPath.includes("%")) return null;
    return execFileSync("wslpath", ["-u", windowsPath], { encoding: "utf8" }).trim() || null;
  } catch {
    return null;
  }
}

try {
  step(pull ? "Sync repositories" : "Sync repositories (skipped: --no-pull)");
  if (pull) manifest.repositories.forEach(syncRepository);

  step("Dependencies");
  installDependencies("Sandblock UI", paths.ui);
  installDependencies("Sandblock Code", paths.app);

  step("Sandblock Code app");
  // Builds @sandblock/ui first through the desktop:renderer pre-hooks.
  run("npm", ["run", "desktop:build"], paths.app);

  step("Sandblock Rojo fork");
  if (hasCommand("cargo")) {
    run("cargo", ["build", "--release", "--locked"], paths.rojo);
  } else {
    warn("cargo not found: the app falls back to the Aftman-pinned Rojo instead of the fork build");
  }

  step("Studio plugin");
  if (!hasCommand("aftman")) throw new Error("aftman not found: install it to build the Studio plugin");
  // Only fetch when the pinned Rojo is missing: `aftman install` also rewrites
  // every shim in ~/.aftman/bin, which fails when those are read-only.
  const pinnedRojo = spawnSync("rojo", ["--version"], { cwd: paths.plugin, stdio: "ignore", shell: isWindows });
  if (pinnedRojo.status !== 0) run("aftman", ["install"], paths.plugin);
  const built = join(paths.plugin, "build", "SandblockStudioPlugin.rbxm");
  mkdirSync(dirname(built), { recursive: true });
  // The plugin's own aftman.toml selects the Rojo that builds it.
  run("rojo", ["build", "default.project.json", "-o", built], paths.plugin);
  const pluginsDirectory = studioPluginsDirectory();
  mkdirSync(pluginsDirectory, { recursive: true });
  const installed = join(pluginsDirectory, "SandblockStudioPlugin.rbxm");
  copyFileSync(built, installed);
  console.log(`  ✓ installed ${installed}`);
} catch (error) {
  console.error(`\n\x1b[31m✗ ${error.message}\x1b[0m`);
  process.exit(1);
}

console.log(`\n\x1b[32m✓ Workspace updated.\x1b[0m Restart Roblox Studio (or reload plugins) to pick up the plugin.`);
if (warnings.length > 0) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const message of warnings) console.log(`  ! ${message}`);
}

if (launch) {
  step("Launch Sandblock Code");
  run("npm", ["run", "desktop:start"], paths.app);
}
