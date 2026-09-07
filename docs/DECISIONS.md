# Architecture decisions

This log records accepted cross-repository decisions. Change a decision only
with an explicit replacement entry; do not quietly contradict it in a child
repository.

## SB-001 — One meta-repository, four independent product repositories

**Status:** Accepted

The workspace root tracks documentation, agent context, bootstrap configuration,
and coordination scripts. `sandblock-code`, `sandblock-studio-plugin`,
`sandblock-rojo`, and `sandblock-ui` retain independent Git histories and
release lifecycles. The parent ignores child directories and does not turn them
into accidental submodules. `sandblock-ui` owns reusable web tokens and React
primitives; platform-specific product behavior remains in its owning product
repository.

## SB-002 — Sandblock Code v0 is a developer cockpit

**Status:** Accepted

v0 centers on one selected local project workspace, project settings, Project Skill utilities,
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

The library is scoped to every content type a game needs—reusable Luau systems,
models and map kits, UI and icons, VFX, sounds and music, and animations—so a
conditional search covers a whole mechanic instead of its code only.
[`ROBLOX_DEVELOPMENT_WORKFLOW.md`](ROBLOX_DEVELOPMENT_WORKFLOW.md) is canonical
for that list and for the search and promotion procedure.

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

## SB-016 — Sandblock Code serves projects to the plugin over a loopback runtime service

**Status:** Accepted

The Studio plugin discovers projects, and starts one project's Rojo server,
through a loopback HTTP service owned by the Electron main process (default
port `3071`). The plugin sends an opaque `runtimeId` and receives a runtime
descriptor with a loopback Rojo URL; repository paths never cross that boundary,
and every route except `/health` requires the `X-Sandblock-Runtime` header.

Rojo is started from the pinned fork build with the project repository as
working directory, not from the game repository's own toolchain, because a game
repository may pin a different Rojo or none at all while the vendored adapter
only speaks the pinned protocol. The plugin refuses to connect when the open
Studio place conflicts with the project's `mainPlaceId`, before any server
starts. The saved manual Rojo URL remains only as a recovery path for a server
started by hand while the app is unreachable.

A Rojo server the app did not start is reported and reused rather than
duplicated, matched to the project by the `name` in its Rojo project file. The
app does not stop a process it does not own.

Sync history flows the other way: the plugin reports connects, patches, and
disconnects to the same service, because Studio is the only side that sees a
patch land. Both that history and the gateway's tool history stay in memory and
describe the current session only.

## SB-017 — Creator Hub analytics is a separate process behind the same gateway

**Status:** Accepted

Roblox exposes no Open Cloud API for Creator Hub analytics. Reading retention,
engagement, monetization, acquisition, player feedback, or creator alerts
requires an authenticated `.ROBLOSECURITY` session against endpoints Roblox does
not document. Those endpoints are treated as best effort: a tool reports that a
capability is unavailable rather than inventing a number, and the analytics
surface degrades one connector at a time.

Sandblock Code owns the credential. It is captured through the genuine Roblox
login page in an isolated, non-persistent Electron session, or pasted as a
fallback, verified against Roblox before storage, and kept in the OS keychain.
The renderer and every agent receive account metadata only. A dedicated analyst
account with the narrowest workable group role is preferred over an account that
owns Robux or administers a group.

The analytics server runs as its own process so its tools are not loaded while an
agent is writing game code. It is federated into the existing gateway as an
additional upstream, enabled by runtime profile. It does not become a second
agent-facing endpoint, which preserves [SB-005](#sb-005--agents-see-one-federated-mcp-gateway).

Its tools are read-only. Publication, moderation, Robux movement, ad campaigns,
and account mutation stay outside the tool surface, and interpretation of the
data remains a human decision under
[SB-013](#sb-013--human-approvals-remain-explicit).

Projects gain a resolved Roblox `universeId` alongside `mainPlaceId` in
`.sandblock-code.json`, because analytics are addressed by universe rather than
by place.
