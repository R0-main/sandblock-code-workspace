import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(workspaceRoot, "workspace.json"), "utf8"));

function status(label, path) {
  console.log(`\n${label}`);
  if (!existsSync(join(path, ".git"))) {
    console.log("  missing");
    return;
  }
  const output = execFileSync("git", ["status", "--short", "--branch"], {
    cwd: path,
    encoding: "utf8",
  }).trimEnd();
  console.log(output || "  clean");
}

status("Workspace", workspaceRoot);
for (const repository of manifest.repositories) {
  status(repository.name, resolve(workspaceRoot, repository.path));
}
