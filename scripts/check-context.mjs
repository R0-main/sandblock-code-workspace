import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "docs/README.md",
  "docs/PRODUCT_VISION.md",
  "docs/ARCHITECTURE.md",
  "docs/DECISIONS.md",
  "docs/ROADMAP.md",
  "docs/ROBLOX_DEVELOPMENT_WORKFLOW.md",
  "docs/DESIGN_SYSTEM.md",
  ".agents/skills/sandblock-workspace-context/SKILL.md",
  ".agents/skills/sandblock-workspace-context/agents/openai.yaml",
];

const failures = [];

for (const relativePath of requiredFiles) {
  try {
    await access(path.join(root, relativePath), constants.R_OK);
  } catch {
    failures.push(`Missing or unreadable: ${relativePath}`);
  }
}

if (failures.length === 0) {
  const skill = await readFile(
    path.join(root, ".agents/skills/sandblock-workspace-context/SKILL.md"),
    "utf8",
  );
  const metadata = await readFile(
    path.join(
      root,
      ".agents/skills/sandblock-workspace-context/agents/openai.yaml",
    ),
    "utf8",
  );

  if (!skill.includes("name: sandblock-workspace-context")) {
    failures.push("Skill frontmatter has the wrong name");
  }

  if (!metadata.includes("$sandblock-workspace-context")) {
    failures.push("Skill default prompt must reference $sandblock-workspace-context");
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`ERROR ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Workspace context is complete (${requiredFiles.length} files checked).`);
}
