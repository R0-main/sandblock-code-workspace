# Architecture

## System overview

Sandblock Code is a coordinated workspace of four independently versioned
repositories. The desktop app is the control plane, the Studio plugin is the
in-Studio execution and feedback surface, the Rojo fork supplies a pinned,
compatible sync engine, and Sandblock UI owns reusable web interface primitives.

```mermaid
flowchart LR
    Human["Developer"] --> App["Sandblock Code desktop app"]
    UI["Sandblock UI\ntokens + React primitives"] --> App
    App --> Config["Project configuration"]
    App --> Runtime["Project runtime"]
    App --> RuntimeSvc["Project runtime service\nloopback 3071"]
    App --> Agent["Coding agent\nCWD = project repo"]
    App --> Studio["Roblox Studio\nmain place"]
    Runtime --> Gateway["Project-bound MCP gateway"]
    Agent --> Gateway
    Gateway --> Official["Official StudioMCP tools"]
    Gateway --> Local["Sandblock local tools"]
    Gateway --> Bridge["Outbound Studio bridge"]
    Bridge --> Plugin["Sandblock Studio plugin"]
    Plugin --> RuntimeSvc
    RuntimeSvc --> RojoServer
    Plugin <--> Studio
    Runtime --> RojoServer["Pinned Rojo server"]
    RojoServer <--> RojoAdapter["Plugin Rojo adapter"]
    RojoAdapter --> Studio
```

## Repository ownership

### `sandblock-code`

Owns the Electron/React desktop application, local project registry, runtime
orchestrator, MCP gateway, agent launcher, Studio launcher, generation
utilities, and health surfaces.

It is the source of truth for repository paths and runtime identities. The
renderer remains unprivileged; process launch, filesystem access, secrets, and
network listeners belong in the Electron main process or a dedicated local
service.

### `sandblock-studio-plugin`

Owns the final Roblox Studio plugin artifact: Sandblock-branded dock UI,
outbound MCP bridge, approved runtime selection, `PlaceId` validation, Studio
handlers, visual capture tools, and the user-facing Rojo adapter.

The plugin does not discover arbitrary filesystem paths and does not decide
which local repository should control Studio. It consumes approved runtime
descriptors from Sandblock Code.

### `sandblock-rojo`

Owns the pinned Rojo fork and only the minimal compatibility or adapter changes
required by Sandblock. It preserves upstream license files and keeps core
behavior close to upstream.

The Sandblock-branded product UI belongs in `sandblock-studio-plugin`, not in a
large permanent rewrite of Rojo core.

### `sandblock-ui`

Owns the `@sandblock/ui` package, semantic web tokens, framework-agnostic CSS,
product-agnostic React primitives, and the component catalog. It has an
independent release lifecycle and contains no Electron, MCP, filesystem,
project-state, or Roblox Studio behavior.

## Current implementation and target split

| Area | Current | Target |
| --- | --- | --- |
| Desktop | Focused Electron/React cockpit selects one local repo and shows its Skills, assets, config, MCP health, and Studio binding; historical platform/task code is inactive | Add project-bound launch orchestration without expanding back into task management |
| MCP gateway | TypeScript gateway federates official StudioMCP and custom tools, resolves the plugin-connected Studio's opaque id, and injects it into applicable official calls | Preserve explicit project binding as runtime profiles add optional upstreams |
| Studio bridge | Luau plugin immediately claims its declared place on the outbound bridge, then long-polls for that place's commands after a manual connect action | Dock UI auto-binds from a valid launch ticket, with manual fallback |
| Runtime discovery | The plugin lists approved projects from Sandblock Code's loopback runtime service and asks it to serve one | Same service also issues launch tickets and reports agent/gateway binding per runtime |
| Studio ownership | One Studio per declared place, several projects on one bridge; each place has its own command queue, each agent is tied to its project's endpoint and keeps its own selected place | Preserve deterministic per-place ownership and expose it clearly per runtime |
| Rojo | Fork pinned to `v7.7.0-rc.1`; Sandblock Code starts `rojo serve` per project from the pinned build on an internal port, and serves it to Studio at `/runtimes/<id>/rojo` on the runtime service (HTTP and WebSocket); no Rojo it did not start is used | Ship the pinned build with the app, plus automatic binding from a launch ticket |
| Project launch | Rojo and the Studio services start from one action, in the desktop window or in the plugin | One flow also launches the main place and the agent |
| Visual tools | Selection, UI/model/icon rendering and image generation already exist | Productized feedback loop exposed from the selected project and plugin |

## Project configuration

Each registered project has a local registry entry owned by Sandblock Code and
may keep stable, shareable metadata in `.sandblock-code.json` at its repository
root. The current versioned format is:

```json
{
  "version": 1,
  "projectId": "stable-project-id",
  "displayName": "Game name",
  "rojoProject": "default.project.json",
  "mainPlaceId": 1234567890,
  "places": [
    { "key": "main", "name": "Game name", "placeId": 1234567890, "main": true },
    { "key": "lobby", "name": "Lobby", "placeId": 2345678901, "main": false }
  ],
  "projectSkill": ".agents/skills/project-context/SKILL.md",
  "assetRoots": ["assets", "generated"]
}
```

`places` is the allowlist of Roblox places the project owns, and the only set an
agent can act on. Exactly one place is `main`: every agent session starts there.
Sandblock Code is the only writer — the desktop declares places by picking from
the Studios open on the machine, at game creation and in project settings, so a
project is never bound to a place nobody has opened. Neither the plugin nor an
agent can add one. `mainPlaceId` stays in sync with the main place, and a project
written before `places` existed reads back as a single main place.

The absolute repository path never enters the versioned project file. Electron
stores it in its local application-data registry, canonicalizes it in the main
process, and exposes only narrow folder, scan, config, binding, and open-path
operations to the sandboxed renderer.

The app scans the registered repo for `SKILL.md` files, Rojo project files,
place files, and project-local assets of every supported kind: images, 3D
models, VFX definitions, and audio. If the connected
Studio reports a `PlaceId`, the app labels it as connected to the selected repo
only when that value matches one of the declared `places`; otherwise it shows an
unbound or mismatched state and offers an explicit bind action.

At launch, the app creates an ephemeral runtime descriptor. It adds values such
as `runtimeId`, process state, local ports, compatible component versions, and a
short-lived Studio launch ticket. The runtime descriptor is never a substitute
for the durable project configuration.

Repository paths must be canonicalized and validated by the app. An LLM may
report its working directory for diagnostics, but that value cannot silently
rebind a runtime or authorize a different project.

## Target launch lifecycle

1. The developer selects a local project and chooses Start or Open Studio.
2. Sandblock Code validates the repository, Rojo project, main place, Project
   Skill, and compatible component versions.
3. The app creates or reuses the project's MCP gateway and opaque runtime ID.
4. The app starts the pinned Rojo server for that project.
5. The app launches Roblox Studio on the configured main place with a
   short-lived launch ticket discoverable only on loopback.
6. The plugin opens its dock UI for that valid launch, registers itself, checks
   `PlaceId`, and selects the approved runtime. If automatic binding fails, it
   shows a manual selector containing only approved active runtimes.
7. The app launches the coding agent with `cwd` set to `repoRoot`, the Project
   Skill available, and a project-bound MCP endpoint.
8. The app reports Ready only after gateway, Rojo, plugin, Studio place, and
   agent binding checks pass.

Partial failures must remain visible and independently retryable. A failed
plugin handshake should not erase the project config or force a full app
restart.

## Project runtime service

Sandblock Code exposes a small loopback HTTP service, by default on port `3071`
(`SANDBLOCK_RUNTIME_PORT`), so the Studio plugin can discover approved projects
without learning any filesystem path. It lives in the Electron main process,
which already owns the project registry, path canonicalization, and the right to
start processes.

| Route | Purpose |
| --- | --- |
| `GET /health` | Service signature and the pinned Rojo version/protocol |
| `GET /runtimes` | Runtime descriptors for every registered project |
| `POST /runtimes/{runtimeId}/start` | Serve that project with the pinned Rojo build |
| `POST /runtimes/{runtimeId}/stop` | Stop that project's Rojo server |
| `POST /runtimes/{runtimeId}/events` | Studio reports a connect, a sync, or a disconnect |
| `GET /activity` | Sync history, newest first, optionally for one runtime |

A runtime descriptor carries `runtimeId`, `displayName`, the repository-relative
`projectFile`, `mainPlaceId`, whether the project is configured, a blocking
`issue` when there is one, and the current `rojo` state including the loopback
`url`, `projectName`, `serverVersion`, `protocolVersion`, and whether that
server matches the pinned protocol. It never carries `repoRoot`.

Studio is the only side that sees a patch land, so the plugin reports its own
events and the app keeps them next to what it knows by itself — a server it
started, adopted, stopped, or failed to start. That history is in memory: it
explains a running session, not a permanent record.

Every route except `/health` requires the `X-Sandblock-Runtime` header. The
service is unauthenticated on loopback like the bridge, but a browser cannot add
a custom header cross-origin without a preflight the service refuses, so a page
the developer happens to visit cannot enumerate projects or spawn servers.

Rojo is started as `rojo serve <projectFile> --port <free port>` with the
working directory set to the project repository, using `SANDBLOCK_ROJO_BIN`, the
pinned fork build beside the app, or `rojo` on `PATH`, in that order. A game
repository's own toolchain is deliberately not used: it may pin a different Rojo
or none at all, while the vendored Studio adapter only speaks the pinned
protocol. The server is considered running only once it answers `/api/rojo`;
until then the app reports `starting`, and a failure keeps the last lines Rojo
printed.

A server the app did not start — `rojo serve` run by hand, or one left by an
earlier session — is reported as `external` and reused instead of being
duplicated on a second port. A candidate only counts when the `projectName` it
reports matches the `name` in that repository's own Rojo project file, so the
plugin's development server, or another game's, is never mistaken for this
project. The app never stops an external server: it does not own that process.

## MCP gateway

The agent uses one Sandblock MCP endpoint. The gateway dynamically merges:

- official StudioMCP tools;
- Sandblock Studio bridge tools;
- local utilities such as generation, project metadata, and future library
  search tools. Library search is **target** and must cover every content type
  listed in
  [`ROBLOX_DEVELOPMENT_WORKFLOW.md`](ROBLOX_DEVELOPMENT_WORKFLOW.md)—systems,
  models, UI, VFX, and sounds—through one query surface rather than one tool
  per asset family.

Current transports include MCP HTTP, legacy SSE compatibility, and the
plugin's outbound claim/poll/response bridge. The claim names the place the
Studio holds and repeats the project's declared list, which is how the bridge
learns the allowlist; it confirms ownership of that place before the first
long-poll is parked. New transports must preserve a single tool registry and
common request correlation rather than creating a second agent-facing gateway.

## Multi-place Studio routing

Several Studios connect to the bridge at once, one per declared place, each with
its own command queue — and from several projects at once. Two Studios on the
*same* PlaceId are refused whichever projects they belong to; a key like `main`
only names a place inside one project.

Projects are kept apart at the agent, not at the bridge. Each project has its
own endpoint, `/projects/<projectId>/mcp`; a session opened there resolves places
inside that project only, and its session id cannot be replayed on another
project's path. The unscoped `/mcp` keeps working while one project is connected
and refuses Studio calls once a second connects, naming the project endpoints.

The agent Sandblock Code launches receives its project endpoint through
`--mcp-config` under `--strict-mcp-config`. Agents opened by hand — Claude Code
in a terminal, the desktop Code tab or an IDE, and Cursor — read `.mcp.json` and
`.cursor/mcp.json`, which the app writes into the game repository from project
settings. The desktop's Studio status and tool runner name the active project on
every request, so switching the window's project never shows or drives another
game. See [SB-019](DECISIONS.md#sb-019--agents-are-tied-to-one-project-so-several-games-run-at-once).

Every agent-facing tool call is addressed to one place. An MCP client starts on
the project's main place and changes that with `select_studio_place`, or
overrides it for a single call with the `place` argument the gateway adds to
every Studio-facing schema. The selection lives per MCP client, so two agents can
hold two places at the same time without moving each other's target.
`list_studio_places` reports the declared places, which have a Studio connected,
and which one the caller's calls are going to.

The gateway owns official Studio routing, now per place. It matches each
connected plugin's Studio fingerprint against `list_roblox_studios`, stores the
resulting opaque StudioMCP id for that place, removes `studio_id` from
agent-facing tool schemas, and injects the id of the place a call is addressed
to. If several Studios are open and no unique match exists, it refuses to guess.
Legacy StudioMCP builds that expose a global `set_active_studio` flow remain
supported: calls are serialized and the active Studio is switched around each
one, so a shared global cannot be pulled out from under a call in flight.

Not every upstream belongs in every session. A runtime profile decides which
upstreams the gateway federates, so a development session is not charged the
context cost of tools it will not call. Creator Hub analytics is the first such
profiled upstream (**target**, see
[`DECISIONS.md`](DECISIONS.md#sb-017--creator-hub-analytics-is-a-separate-process-behind-the-same-gateway)):
its own process, its own credential, merged into the same tool registry rather
than served from a second endpoint.

Useful current visual capabilities include reading the Studio selection,
inserting instances, rendering GUI elements, capturing workspace or turntable
views, obtaining model or styled icons, generating icons, and uploading local
images. The gateway also exposes device simulator state/control and a
multi-device playtest matrix that selects each phone or tablet preset, starts
Play, waits, captures the viewport, reads console output, stops Play, and
restores the prior simulator state. Tool availability is runtime-discovered;
documentation must not claim that an unavailable tool succeeded.

Every call an agent or the playground makes is routed through one registry, and
recorded there: name, source, caller, duration, a one-line argument preview, and
the error when it failed. `GET /playground/history` serves that timeline to the
desktop, which shows it beside the project's sync history.

The gateway is the source of truth for tool names, validation, timeouts,
correlation IDs, and errors. Studio commands remain serialized per place: one
plugin owns a place, and its queue is that place's execution order.

## Studio plugin behavior

The plugin initiates outbound requests to a loopback endpoint because Roblox
Studio plugins cannot act as arbitrary inbound local servers. It should:

- show selected project, place validation, MCP health, Rojo health, and last
  actionable error;
- accept only runtime descriptors issued by Sandblock Code;
- refuse to connect when the Studio `PlaceId` is not one of the selected
  runtime's declared `places`, before any server is started, and name the places
  that are declared;
- claim exactly one declared place, so Studios on different places of the same
  project connect side by side;
- auto-open only for an intentional Sandblock launch or when the user opens it;
- provide a manual recovery path without asking for raw filesystem paths;
- expose visual captures so agents can verify spatial or rendered changes.

The current toolbar toggle is a migration step, not the final interaction
model.

## Rojo compatibility strategy

The baseline is upstream Rojo `v7.7.0-rc.1`, matching the proven game stack.
Sandblock Code pins compatible app, CLI/server, and plugin adapter versions.
Runtime code never follows a moving upstream branch.

The current Studio integration vendors a generated model from
`sandblock-rojo/sandblock-adapter.project.json`. That model exposes the
fork-owned HTTP/WebSocket protocol, initial hydration, reconciliation, and sync
session lifecycle without upstream Rojo product UI. The Sandblock plugin owns
the visible controls and status feedback. The adapter connects to the port the
runtime service reports for the selected project; the saved manual URL is only a
recovery path used when no project is selected and the app is unreachable.

Rojo updates are deliberate, not automatic. Update when there is a relevant
bug fix, security issue, Roblox Studio compatibility requirement, or valuable
feature. Each update requires a compatibility branch, integration checks, and
an explicit new pin. The fork should remain replaceable with a newer upstream
baseline.

## Security and trust boundaries

- Local HTTP services bind to loopback by default.
- Runtime and launch tickets are opaque and short-lived.
- Project paths are canonicalized; runtime operations remain inside approved
  roots.
- Studio mutations require a matching runtime and `PlaceId`.
- The Electron renderer has `contextIsolation` enabled, Node integration
  disabled, sandboxing enabled, and only narrow IPC methods exposed.
- Generated assets of any kind—image, model, VFX, or audio—require review
  before global library promotion.
- Logs avoid secrets and provide enough correlation to debug one launch.
- Roblox account credentials are captured through the genuine Roblox login page,
  verified before storage, and held in the OS keychain. They never reach the
  renderer, an agent, a tool result, or a child process argument list.

## Cross-repository contracts

Contracts are versioned explicitly. At minimum the app and plugin agree on:

- runtime descriptor schema;
- bridge request/response envelope;
- health and capability discovery;
- error codes;
- compatible Rojo version or protocol;
- launch-ticket handshake.

During development, a cross-repository feature can use matching feature
branches. Releases pin concrete versions or commits; they do not depend on
whatever happens to be checked out locally.
