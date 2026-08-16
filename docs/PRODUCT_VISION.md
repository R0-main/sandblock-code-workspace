# Product vision

## North star

Sandblock Code is the local developer cockpit for the Sandblock Roblox pole. A
developer selects one local project workspace and gets a correctly bound coding agent, MCP
gateway, Rojo runtime, Roblox Studio session, Project Skill, and visual asset
tools without manually reconnecting each component.

The product exists to increase the speed and reliability of Roblox game
production while keeping humans in control of product direction, approvals,
and releases.

## Audience and scope

The initial users are Sandblock developers working on:

- Sandblock-owned Roblox games;
- client Roblox games, frequently for creators with an existing community.

This vision is specific to the Roblox pole. It does not define a company-wide
workflow for unrelated production disciplines.

## The intended experience

For each local game project, Sandblock Code provides a focused editor-like
workspace. It knows the repository root, main Roblox place, Rojo project,
Project Skill, and runtime configuration. From there the developer can:

1. start or inspect the project runtime;
2. open Roblox Studio on the main place;
3. start the pinned Rojo-compatible sync path;
4. launch a coding agent already scoped to the project;
5. use Studio-aware MCP tools and obtain visual feedback;
6. adjust a small set of project settings;
7. generate and review thumbnails or other supported assets.

The agent receives context through the project binding and Project Skill. It
must not ask the developer to repeatedly paste repository paths, place IDs, or
architecture summaries.

## v0 product boundary

### Included

- Local project registration and one selected project workspace.
- Project settings and runtime health.
- Project Skill discovery, validation, and regeneration utilities.
- Start/stop orchestration for the MCP gateway and pinned Rojo runtime.
- Launching a coding agent in the project repository.
- Launching Roblox Studio on the project's main place.
- A Sandblock-branded Studio plugin for connection state, runtime selection,
  Rojo integration, and visual feedback tools.
- Thumbnail and supported asset-generation workflows with human review.

### Excluded from v0

- Task boards, planning, backlog, or team management.
- A replacement for the team's task tracker.
- Automatic product decisions, release approval, or advertising decisions.
- Automatic publication of generated assets to the global library.
- Full multi-place orchestration; v0 opens the main place.
- Git worktree orchestration for Roblox projects.

Historical platform and task-management code may still exist in the extracted
desktop repository during migration. Its presence does not put those features
back into v0.

## Product principles

### Project-bound by default

The app owns project configuration and launches every process with an explicit
runtime identity. Agents operate inside the selected repository and receive a
project-scoped MCP endpoint. Paths are configuration, not conversational
instructions.

### One agent-facing tool surface

Official StudioMCP capabilities and Sandblock-specific tools are exposed
through one MCP gateway. The developer and agent should not need to reason
about two competing Studio connections.

### Visual feedback is part of implementation

Roblox work is spatial and visual. When a change affects maps, UI, models,
icons, or rendered output, the agent should capture the smallest useful image
and inspect it before declaring the work complete.

### Automation with explicit human authority

Agents can implement, test, search reusable systems, generate assets, and
prepare changes. Humans retain the final word on the GDD, planning, global
asset promotion, playtest interpretation, publication, and post-launch ads.

### Modular growth

New runtime tools, asset types, and Studio capabilities must plug into stable
contracts. Sandblock Code should evolve by adding capabilities rather than
turning one component into an unbounded monolith.

## Success criteria for v0

v0 is successful when a developer can select a registered project and reach a
ready-to-code state with one understandable launch flow, while the app can
prove that:

- the agent is rooted in the selected repository;
- the MCP runtime belongs to that project;
- Studio is on the configured main place;
- the compatible Rojo client and server are connected;
- the Studio plugin exposes useful connection and error feedback;
- visual Studio operations can be captured and inspected;
- failures are recoverable without restarting every component.
