# Delivery roadmap

The roadmap is ordered by dependency, not by calendar date. A milestone is
complete only when its exit checks pass in the extracted repositories.

## M0 — Workspace baseline

**State:** Complete

- Root Git meta-repository created.
- Three independent child repositories colocated.
- Bootstrap, optional remote configuration, and aggregate status commands
  created.
- Rojo fork pinned to `v7.7.0-rc.1` with an upstream-preserving policy.
- Canonical workspace context and agent routing added at the root.

## M1 — Focus the desktop product

**State:** Complete

**Goal:** Make `sandblock-code` visibly match the v0 product boundary.

- Remove or quarantine task-board, backlog, planning, and unrelated historical
  platform surfaces from the active app.
- Keep the useful Electron shell, project-tab direction, MCP gateway, runtime
  infrastructure, and generation tools.
- Establish the shared visual tokens and accessible desktop component patterns.

**Exit check:** A new user can understand that the app manages local Roblox
projects and developer runtimes without encountering a second project-management
product.

## M2 — Durable local projects

**State:** In progress

**Goal:** Give every registered project a validated identity.

- Implement the local project registry and configuration schema.
- Store repository root, Rojo project, main place, Project Skill, and optional
  generation settings.
- Add create/import/edit/remove flows with canonical path validation.
- Report missing or invalid project files without corrupting the registry.

**Exit check:** Restarting the app restores registered projects and the current selection, then validates them
without launching a runtime.

**Current progress:** The app now persists local repository roots in Electron
application data, scans Skills/assets/Rojo/place files, creates an optional
versioned `.sandblock-code.json`, restores the active project, and supports
removal without deleting repo files. Rich config editing and complete runtime
launch validation remain.

## M3 — Project-bound runtime orchestration

**Goal:** Reach a deterministic ready-to-code state.

- Create opaque runtime IDs and project-bound MCP endpoints.
- Start/stop the gateway and pinned Rojo server per project.
- Launch the coding agent with the correct working directory and Project Skill.
- Launch Roblox Studio on the configured main place.
- Add health, retry, logs, and partial-failure recovery.

**Exit check:** Two configured projects cannot accidentally share paths,
runtime identity, place validation, or Rojo state.

## M4 — Sandblock Studio plugin

**Goal:** Replace the migration toolbar with the final in-Studio control and
feedback surface.

- Build the Sandblock-branded dock widget in Luau GuiObjects.
- Implement launch-ticket handshake and automatic opening for intentional app
  launches.
- List only approved active runtimes as manual fallback.
- Validate `PlaceId` before mutation.
- Surface MCP health, current project, Rojo health, capabilities, and errors.

**Exit check:** Opening Studio from Sandblock Code binds the correct project
without asking the developer for a path, while a normal Studio launch remains
non-intrusive.

## M5 — Integrated pinned Rojo experience

**Goal:** Make Rojo feel like part of Sandblock Code without losing upstream
maintainability.

- Define the minimal adapter/protocol boundary in the fork.
- Bundle or locate the compatible CLI/server predictably.
- Start and stop sync from the project runtime.
- Present connection and sync errors through the Sandblock plugin.
- Add a compatibility test covering app, server, plugin, and a fixture project.

**Exit check:** The compatible versions work end to end and upgrading Rojo is an
explicit, testable pin change.

**Current progress:** The `7.7.0-rc.1` fork now exports a UI-free adapter and
the Sandblock Studio plugin vendors it with its MPL-2.0 notice. A fixture test
covers the protocol-5 handshake, initial reconciliation, and a live WebSocket
filesystem patch. Runtime-owned server launch, approved descriptor binding, and
the app/plugin compatibility contract are still required before M5 is complete.

## M6 — Visual feedback and generation workflows

**Goal:** Productize the useful visual MCP capabilities.

- Expose map, UI, model, icon, and turntable captures consistently.
- Make generated thumbnails/assets reviewable before Roblox upload.
- Attach generated outputs to the active project and record provenance.
- Preserve human approval before promotion to the global Sandblock library.

**Exit check:** An agent can make a visual change, capture evidence, inspect it,
and revise the result inside one bound runtime.

## M7 — Project Skill tooling and reusable library

**Goal:** Make accumulated Sandblock knowledge reusable without bloating every
task.

- Generate or refresh a Project Skill from the approved GDD plus coding skill.
- Validate links, ownership, and one-fact-one-source context routing.
- Add conditional search of tagged systems, code, models, and UI assets.
- Add human-reviewed promotion from a project into the global library.

**Exit check:** A fresh agent can recover project vision and conventions from
the skill, find relevant reusable work when needed, and avoid loading unrelated
assets for trivial tasks.

## Later candidates

- Multiple Studio places per game.
- Internal task-platform MCP integration.
- Automated asset-quality review after enough reliable signals exist.
- Additional generated 3D asset workflows.

These candidates do not expand v0 until promoted through an explicit decision.
