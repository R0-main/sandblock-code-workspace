---
name: sandblock-workspace-context
description: Load the canonical product vision, architecture, decisions, roadmap, ownership boundaries, and Roblox production workflow for the Sandblock Code multi-repository workspace. Use when starting or resuming work from the workspace root; planning or implementing changes that touch Sandblock Code, its MCP gateway, Roblox Studio plugin, Rojo fork, project runtime, Project Skills, visual tools, or cross-repository contracts; or deciding which child repository owns a change.
---

# Sandblock Workspace Context

Use this skill as a router to the workspace's canonical sources. Do not replace
current repository inspection with remembered context.

## Start every workspace task

1. Run `npm run status` from the workspace root.
2. Read [`docs/README.md`](../../../docs/README.md) to identify the canonical
   source for the question.
3. Read only the routed documents needed for the task, completely.
4. Inspect the owning child repository and its instructions before proposing or
   editing code.
5. State whether important behavior is **current**, **target**, **later**, or
   **historical**.

Never treat the historical monorepository as a fourth active component. It is a
migration source until the extracted system is validated end to end.

## Route by concern

### Product scope or prioritization

Read:

- [`PRODUCT_VISION.md`](../../../docs/PRODUCT_VISION.md)
- [`DECISIONS.md`](../../../docs/DECISIONS.md)
- [`ROADMAP.md`](../../../docs/ROADMAP.md) when delivery order matters

Protect the v0 boundary. Historical task/platform code does not authorize task
management features in the focused product.

### Runtime, MCP, project binding, or cross-repository design

Read:

- [`ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md)
- [`DECISIONS.md`](../../../docs/DECISIONS.md)
- [`sandblock-code/docs/repository-layout.md`](../../../sandblock-code/docs/repository-layout.md)

Then load the child repository's own context skill or instructions. Sandblock
Code owns paths and runtime identity; the Studio plugin consumes approved
runtimes; the Rojo fork stays narrow and pinned.

### Desktop app or gateway implementation

Read [`sandblock-code/.agents/skills/sandblock-project-context/SKILL.md`](../../../sandblock-code/.agents/skills/sandblock-project-context/SKILL.md)
and follow its routing. Treat any platform/task-management sections inherited
from the historical repository as migration code unless root vision explicitly
promotes them.

### Roblox Studio plugin implementation

Read:

- [`ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md)
- [`DESIGN_SYSTEM.md`](../../../docs/DESIGN_SYSTEM.md)
- [`sandblock-studio-plugin/README.md`](../../../sandblock-studio-plugin/README.md)
- the plugin repository's `AGENTS.md` if present

The current manual toolbar bridge is not the final target. Preserve outbound
loopback communication and validate runtime plus `PlaceId` before mutations.

### Rojo fork work

Read [`sandblock-rojo/SANDBLOCK.md`](../../../sandblock-rojo/SANDBLOCK.md), then
the upstream contribution and build instructions relevant to the change.
Preserve license notices, keep the patch narrow, and test against the pinned
app/plugin compatibility contract.

### Roblox game workflow or Project Skills

Read [`ROBLOX_DEVELOPMENT_WORKFLOW.md`](../../../docs/ROBLOX_DEVELOPMENT_WORKFLOW.md).
For a specific game, also load that game's Project Skill and GDD. GDD scope
controls which commercial/platform features become tasks.

### UI work

Read [`DESIGN_SYSTEM.md`](../../../docs/DESIGN_SYSTEM.md) and inspect the actual
rendered surface. Share semantic tokens across desktop and Studio, not web UI
components. Use visual verification when the result is visible or spatial.

## Make cross-repository changes safely

1. Identify every affected contract and owning repository.
2. Check each repository's status independently.
3. Keep separate intentional commits per child repository.
4. Use matching feature branches when coordination helps; do not use worktrees
   for Roblox/Rojo development.
5. Pin concrete compatible versions or commits rather than moving branches.
6. Update root documentation when a cross-repository fact or accepted decision
   changes.
7. Run `npm run context:check` at the root plus the checks in each changed child.

The root meta-repository must never accidentally stage a child as a submodule.

## Preserve documentation authority

Keep one fact in one canonical source. Link instead of copying. If current code
and documentation conflict, verify the implementation, label the difference,
and update the correct source in the same change. Do not convert target design
into a claim of shipped behavior.
