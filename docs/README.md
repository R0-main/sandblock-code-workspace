# Sandblock Code documentation

This directory is the canonical source for decisions that affect more than one
repository in the Sandblock Code workspace.

## Authority map

| Subject | Canonical source |
| --- | --- |
| Product direction and v0 boundaries | [`PRODUCT_VISION.md`](PRODUCT_VISION.md) |
| System boundaries, runtime binding, transports, and ownership | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| Accepted cross-repository decisions | [`DECISIONS.md`](DECISIONS.md) |
| Delivery order and completion gates | [`ROADMAP.md`](ROADMAP.md) |
| Roblox game production workflow, reuse rules, and reusable library content types (systems, models, UI, VFX, sounds) | [`ROBLOX_DEVELOPMENT_WORKFLOW.md`](ROBLOX_DEVELOPMENT_WORKFLOW.md) |
| The reusable library: its repository, storage, one writer (the library agent), the reading tools, and what a game records (target, storage in place) | [`ASSET_LIBRARY.md`](ASSET_LIBRARY.md) |
| Cross-place Studio model transfer and package tools (implemented, pending Roblox validation) | [`CROSS_PLACE_MODEL_TRANSFER.md`](CROSS_PLACE_MODEL_TRANSFER.md) |
| Launching Studio, automatic plugin connection, disposable place copies for parallel agents (implemented, pending Roblox validation), and scratch places outside every project (implemented, opening validated in Studio) | [`STUDIO_LAUNCH_AND_PLACE_COPIES.md`](STUDIO_LAUNCH_AND_PLACE_COPIES.md) |
| The agent pipeline from idea to released game: agents, waves, review session, store work (target) | [`AGENT_GAME_PIPELINE.md`](AGENT_GAME_PIPELINE.md) |
| Worktree copies: one branch, one Studio, one agent, with the orchestrator owning the lifecycle (implemented, pending Windows and Roblox validation) | [`WORKTREE_COPIES.md`](WORKTREE_COPIES.md) |
| Game list (GitLab topic `game`), one-click clone and setup, and in-app updates (target) | [`MACHINE_SETUP_AND_UPDATES.md`](MACHINE_SETUP_AND_UPDATES.md) |
| Shared visual direction | [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) |
| Repository locations, branches, and bootstrap configuration | [`../workspace.json`](../workspace.json) |

Implementation details that belong to only one component stay in that child
repository. The root documentation links to those details instead of copying
them. If an implementation change alters a cross-repository contract, update
the relevant root document in the same change.

## Status vocabulary

- **Current** describes behavior that exists in the checked-out repositories.
- **Target** describes an accepted design that still needs implementation.
- **Later** is intentionally outside the current delivery milestone.
- **Historical** is migration context and must not be treated as the desired
  product behavior.

Do not silently write target behavior as if it were already implemented.

## Reading routes

- Product or scope question: read `PRODUCT_VISION.md`, then `DECISIONS.md`.
- Desktop, MCP, runtime, plugin, or Rojo change: read `ARCHITECTURE.md` and
  `DECISIONS.md`, then inspect the owning child repository.
- Sequencing or prioritization: read `ROADMAP.md` after the vision and
  architecture.
- Roblox game delivery or Project Skill work: read
  `ROBLOX_DEVELOPMENT_WORKFLOW.md`.
- Cross-place model transfer or Roblox package tooling: read
  `CROSS_PLACE_MODEL_TRANSFER.md`.
- Opening Studio, plugin auto-connect, place copies, or parallel subagents in
  Studio: read `STUDIO_LAUNCH_AND_PLACE_COPIES.md`.
- New-machine setup, cloning a game, or updating the app: read
  `MACHINE_SETUP_AND_UPDATES.md`.
- UI work: read `DESIGN_SYSTEM.md` and the owning repository's current UI.

The historical repository at `~/sandblock/roblox-studio-ai-automation` is a
migration source, not a product component or a canonical source of future
scope.
