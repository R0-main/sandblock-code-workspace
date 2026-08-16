# Architecture decisions

This log records accepted cross-repository decisions. Change a decision only
with an explicit replacement entry; do not quietly contradict it in a child
repository.

## SB-001 — One meta-repository, three independent product repositories

**Status:** Accepted

The workspace root tracks documentation, agent context, bootstrap configuration,
and coordination scripts. `sandblock-code`, `sandblock-studio-plugin`, and
`sandblock-rojo` retain independent Git histories and release lifecycles. The
parent ignores child directories and does not turn them into accidental
submodules.

## SB-002 — Sandblock Code v0 is a developer cockpit

**Status:** Accepted

v0 centers on project tabs, project settings, Project Skill utilities,
generation tools, runtime status, and one-click launch of the agent, MCP, Rojo,
and main Studio place. Task boards, backlog, planning, and team management are
outside v0 even if historical code for them still exists.

## SB-003 — The app owns project binding

**Status:** Accepted

Sandblock Code stores the repository path and project metadata, creates the
runtime identity, launches the agent in the repository, and gives it a
project-bound MCP endpoint. The LLM does not select a project by sending an
untrusted path during MCP connection. MCP Roots are not the architectural
foundation of project binding.

## SB-004 — v0 launches the main Roblox place only

**Status:** Accepted

Multi-place games may still exist, but v0 configures and opens one main place.
Additional place orchestration is added only when a real workflow requires it.

## SB-005 — Agents see one federated MCP gateway

**Status:** Accepted

Official StudioMCP tools and Sandblock-specific local/Studio tools are merged
behind one agent-facing endpoint. The gateway owns discovery, validation,
timeouts, errors, and correlation.

## SB-006 — Studio initiates an outbound bridge

**Status:** Accepted

The Luau plugin polls or streams outbound to the local gateway and returns
results. Sandblock Code issues approved runtime descriptors; the plugin never
scans arbitrary repositories. Automatic binding uses a short-lived launch
ticket and `PlaceId` validation, with an approved-runtime selector as fallback.

## SB-007 — The final Studio surface is one Sandblock plugin

**Status:** Accepted

The existing MCP bridge and Rojo user experience converge in the
Sandblock-branded dock plugin. The plugin owns connection feedback and project
selection. It may consume fork modules or protocols, but Sandblock product UI
does not require a broad permanent rewrite of Rojo core.

## SB-008 — Rojo is pinned and the fork remains narrow

**Status:** Accepted

The baseline is `v7.7.0-rc.1`. App, CLI/server, and plugin adapter compatibility
is pinned. Upstream updates are reviewed only when they offer concrete value or
compatibility/security fixes. License files and notices are preserved.

## SB-009 — Roblox game code uses native strict Luau

**Status:** Accepted

Sandblock game repositories do not add roblox-ts. The proven reference stack is
native strict Luau with Rojo, Wally, Knit/Component, Charm/CharmSync, a central
typed network layer, server authority, Lapis persistence, Trove cleanup, and a
repeatable local check script. A specific game can omit a package it does not
need, but should not introduce a second competing architecture casually.

## SB-010 — Project Skills are generated context routers

**Status:** Accepted

A Project Skill is generated from the approved GDD and the coding conventions
skill. It routes agents to focused, one-fact-one-source references instead of
copying the entire project into one prompt. Stable scope or architecture changes
update both the task plan and the Project Skill before the related Git push.

## SB-011 — Reuse search is conditional

**Status:** Accepted

Agents search the Sandblock systems/assets library when a task is non-trivial,
reuse-sensitive, or explicitly calls for an asset/system. Trivial local changes
do not pay a mandatory library-search tax. Generated assets stay project-local
until a human approves global promotion.

## SB-012 — Visual verification is proportional and required when relevant

**Status:** Accepted

Map placement, UI, model, icon, thumbnail, and rendered changes use Studio
captures as part of verification. Purely textual or trivial code changes do not
require unnecessary screenshots.

## SB-013 — Human approvals remain explicit

**Status:** Accepted

Humans own final GDD decisions, planning, task completion state, global asset
promotion, publication, and post-launch Roblox Ads Manager decisions. Agents
can prepare and execute authorized development work but do not silently assume
these approvals.

## SB-014 — No Git worktrees in the Roblox/Rojo workflow

**Status:** Accepted

Feature or task branches are used as appropriate, but the workflow does not
depend on Git worktrees because they complicate Rojo and Roblox Studio binding.

## SB-015 — Game standards are GDD-gated

**Status:** Accepted

Mobile performance, console/gamepad support, localization, onboarding, daily
rewards, shop UX, shop calls to action, and like/join-group rewards are common
commercial Roblox considerations. They become implementation tasks only when
the approved GDD includes them.
