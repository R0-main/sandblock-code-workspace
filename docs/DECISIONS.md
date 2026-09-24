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
foundation of project binding. The same boundary applies inside Studio: the
gateway resolves the official StudioMCP session from the connected plugin and
injects its opaque `studio_id`; an agent-facing tool cannot select an arbitrary
open Studio by supplying that id.

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
descriptor whose Rojo URL is the service's own route for that project; repository
paths never cross that boundary, and every route except `/health` and that Rojo
route requires the `X-Sandblock-Runtime` header (see
[SB-020](#sb-020--rojo-is-part-of-sandblock-code)).

Rojo is started from the pinned fork build with the project repository as
working directory, not from the game repository's own toolchain, because a game
repository may pin a different Rojo or none at all while the vendored adapter
only speaks the pinned protocol. The plugin refuses to connect when the open
Studio place is not one of the project's declared `places` (see
[SB-018](#sb-018--a-project-declares-the-places-its-agents-may-reach)), before
any server starts.

Sync history flows the other way: the plugin reports connects, patches, and
disconnects to the same service, because Studio is the only side that sees a
patch land. Both that history and the gateway's tool history stay in memory and
describe the current session only.

## SB-017 — Creator Hub analytics is a separate process behind the same gateway

**Status:** Accepted

Roblox's Open Cloud Analytics Query API (announced 2026-08-24, API key scope
`universe.analytics:read`) is not offered to every account: the Sandblock
account's API key screen does not list the `universe-analytics` system, and
player feedback, benchmarks, insights, and alerts have no Open Cloud API at all.
So analytics are read the way the Creator Hub dashboard reads them: an
authenticated `.ROBLOSECURITY` session against endpoints Roblox does not
document. The metrics among them run on the same query engine the Open Cloud API
documents, so its metric reference describes them.

Those endpoints are pinned from the dashboard's own traffic, recorded by
`sandblock-code/scripts/capture-creator-hub.mjs` while someone browses the
Creator Hub, never guessed. They are treated as best effort: a tool reports that
a capability is unavailable rather than inventing a number, and the analytics
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

## SB-018 — A project declares the places its agents may reach

**Status:** Accepted

A game is several Roblox places, and an agent legitimately needs more than one:
a lobby and an arena are one project. But an agent that could reach any open
Studio would eventually edit a place belonging to another game, or a colleague's
scratch place that happens to be open.

So a project declares its places in `.sandblock-code.json`, and that list is an
allowlist. Sandblock Code is the only writer: the desktop declares places by
picking from the Studios open on the machine — at game creation, and in project
settings — so a place cannot be declared by typing a number nobody has opened.
Neither the plugin nor an agent can add one.

The Studio plugin refuses to connect from an undeclared place, and names the
declared ones instead of failing vaguely. It claims exactly one place on the
bridge, so Studios on different places of the same project connect side by side,
each with its own command queue. Two Studios on the same place are refused.
Studios from several projects share the bridge; [SB-019](#sb-019--agents-are-tied-to-one-project-so-several-games-run-at-once)
keeps each agent inside its own project.

Every agent call is addressed to one place. A session starts on the main place,
switches with `select_studio_place`, or overrides one call with a `place`
argument. The selection is per MCP client, so two agents can hold two places at
once instead of moving each other's target — which is the conflict this decision
exists to prevent, expressed one level up from the old single-Studio lock.

`mainPlaceId` stays in the config, in sync with the main place, and a project
written before this decision reads back as a single main place.

## SB-019 — Agents are tied to one project, so several games run at once

**Status:** Accepted — revises the "one project per bridge" rule SB-018 first
shipped with

The goal is to work on several games at the same time: a Studio, a Rojo server
and an agent per game, side by side. Locking the bridge to one project made that
impossible, and it protected the wrong thing — the danger was never two games
being connected, it was an agent reaching a game that is not its own.

So the lock moves from the bridge to the agent. Each project has its own MCP
endpoint, `/projects/<projectId>/mcp`, and a session opened there resolves places
inside that project only: another game's places cannot be listed, selected, or
reached by PlaceId, and a session id cannot be replayed on another project's
path. This implements the project-bound endpoint [SB-003](#sb-003--the-app-owns-project-binding)
already required.

What stays exclusive across projects is a place: one Studio holds a PlaceId,
whichever project claims it. A key such as `main` only names a place inside one
project, so two projects may both have one.

The unscoped `/mcp` endpoint keeps working while a single project is connected.
Once a second connects it refuses every Studio call and names the project
endpoints, because it has no way to tell which game its caller means.

Agents are bound without the LLM choosing anything. The agent Sandblock Code
launches gets its project endpoint through `--mcp-config`, under
`--strict-mcp-config`, so the developer's own user-scope servers stay out. An
agent opened by hand — Claude Code in a terminal or in the desktop Code tab, an
IDE extension, Cursor — reads `.mcp.json` or `.cursor/mcp.json`, which the app
writes into the game repository on an explicit action. Those files are keyed by
`projectId`, so linking first ensures `.sandblock-code.json` exists: an id
derived from this machine's path would break for anyone else who clones the
game.

Every Studio read and tool call names the project it belongs to, and working on
one game leaves the other projects' Studios, Rojo servers and agents running.
The in-window project switcher this decision first shipped with is replaced by a
window per project in [SB-022](#sb-022--a-project-window-is-the-projects-runtime).

## SB-020 — Rojo is part of Sandblock Code

**Status:** Accepted — supersedes SB-016's manual Rojo URL and its reuse of a
Rojo server the app did not start

Studio used to connect to Rojo on whatever port the project had been given, and
could also be pointed at a Rojo someone started by hand — through a manual URL
in the plugin, or because the app adopted a server already on the default port.
Both let a Rojo off the pinned protocol reach Studio: a game repository can pin
another Rojo, and a hand-run `rojo serve` uses it. With several games open at
once, a port per game also meant a port per game to keep free and reachable.

Rojo is now something Sandblock Code provides, not something it finds. The app
starts every server a project syncs through, from the pinned build, on an
internal port kept clear of Rojo's own default. Studio never sees that port: the
runtime service serves each project's Rojo at `/runtimes/<runtimeId>/rojo`,
forwarding Rojo's HTTP API and tunnelling its WebSocket, and the runtime
descriptor hands the plugin that route. The vendored adapter builds every Rojo
URL by appending `/api/...` to its base, so the fork needed no change.

A server the app did not start is never adopted, and the plugin has no Rojo URL
setting: without Sandblock Code there is nothing to sync with.

Rojo's own client cannot add the `X-Sandblock-Runtime` header, so the Rojo route
is exempt from it and refuses browsers instead — any request carrying `Origin`
or `Sec-Fetch-Site`, which Roblox Studio's HTTP and WebSocket clients never send.
That is stricter than Rojo itself, which accepts a WebSocket from any origin.

## SB-021 — Shared agent skills live in `sandblock-skills`

**Status:** Accepted

Amends SB-001: the workspace now coordinates five independent product
repositories. `sandblock-skills` (`git@ssh.git.shulkr.net:roblox/skills.git`)
owns the agent skills that are shared across games and are therefore owned by
neither one game repository nor the desktop application.

A skill belongs there when it encodes a reusable Sandblock workflow and its
inputs are configuration. A skill belongs in a game's own Project Skill when it
describes that game specifically. The Roblox thumbnail workflow is the first
case: the discovery, ranking, and generation engine is shared, while the
per-game subjects, palettes, and place bindings stay with the game.

Nothing in the extracted system may depend on the historical monorepository at
runtime. Migrating a skill out of it is what retires that dependency; pointing
the desktop application at a skill still living there is not an acceptable
substitute.

**Current:** the repository is registered in `workspace.json`, ignored by the
meta-repository, and cloned by `npm run bootstrap`. It carries no skill yet.

**Target:** the thumbnail workflow moves out of
`roblox-studio-ai-automation`, and Sandblock Code resolves shared skills from
this repository when it launches a coding agent.

## SB-022 — A project window is the project's runtime

**Status:** Accepted — revises the single switching window described in
[SB-019](#sb-019--agents-are-tied-to-one-project-so-several-games-run-at-once)

SB-019 made it possible to work on several games at once, but the desktop still
showed them through one window with a project switcher. That leaves the developer
reading one game while the process runs three, and every surface in the window —
Studio status, Rojo state, tool history — has to be re-read on each switch to
avoid describing the wrong game.

Sandblock Code therefore runs one main process and opens one window per project.
The app starts on a launcher: the list of registered games. Opening one opens its
window, fixed on that project for as long as it exists. There is no in-window
switcher, so a window can never display one game while the call it sends goes to
another, and two games sit side by side on screen instead of taking turns.

What is shared stays in the main process behind those windows: the MCP gateway
and its per-project endpoints, the loopback runtime service, the project
registry, the Roblox account, and the agent sessions. A window is a view and a
set of controls, never a second copy of a service.

What belongs to one project belongs to its window. A project's Rojo server starts
when its window opens and stops when that window closes: nothing keeps syncing a
game nobody has open. The plugin can still ask the runtime service to serve a
project — that request opens the project's window first, so *Rojo is running* and
*its window is open* stay the same statement from either side. The runtime
service lists the projects with a window open first, most recently focused first,
replacing the single "selected repository" the old window declared.

Closing the last window quits the app. The main process is where the gateway, the
runtime service and every Rojo server live; left running with nothing on screen
it would keep serving games nobody has open.

## SB-023 — A place syncs its own Rojo project

**Status:** Accepted — refines
[SB-020](#sb-020--rojo-is-part-of-sandblock-code)

An experience can be several places that share code but not their tree: a lobby
and a game that both mount `code/core`, each beside its own `code/lobby` or
`code/game`. The project config named one Rojo file and Sandblock Code ran one
server per repository, so whichever file that was reached every Studio of the
project. The game place of `stop-the-eruption` was synced with the lobby's
project, without an error or a warning, and ran the other place's code.

A declared place may therefore name its own Rojo project with
`places[].rojoProject`; a place without one syncs the project's `rojoProject`,
so single-place projects do not change. Sandblock Code runs one `rojo serve` per
distinct project file, each on its own internal port, and places naming the same
file share its session.

The Studio's `PlaceId` is the routing key. The plugin sends it when it asks for
a runtime; the runtime service resolves it to the declared place, the place to
its project file, and the file to its session, and hands back that place's route
`/runtimes/<runtimeId>/places/<key>/rojo`. A `PlaceId` the project does not
declare gets no session, and an unpublished place is served only when every
place syncs the same file. Nothing falls back to the main place's tree: a silent
fallback is exactly how the wrong code reached a place.

Routing is also checked after the fact. The plugin reports the DataModel name it
synced; when it is not the `name` of the Rojo project the place declares, the
place shows the error with the expected and received files in the project's
window, and the plugin stops the sync. The runtime API moves to version 3. An
older plugin names no place: it keeps working while every place syncs one file,
and is refused, with a message to update, once they differ.
