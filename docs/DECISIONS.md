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

**Status:** Replaced by [SB-027](#sb-027--agents-open-studio-and-work-in-disposable-place-copies)

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

**Status:** Replaced by [SB-029](#sb-029--each-agent-codes-in-a-worktree-and-tests-in-a-copy-it-serves)

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
additional upstream, enabled per project in that project's settings. It does not become a second
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
meta-repository, and cloned by `npm run bootstrap`. It carries seventeen
skills, listed in its README: the thumbnail workflow, the orchestrator's guide,
the team's review conventions, and the creation skills gathered on 2026-10-07
from `build-tests` and the games (VFX, stud-style models, maps and asset kits,
animations, sounds, localization, controller glyphs), each with the tools it
runs. Games receive them as committed copies: the boilerplate's
`scripts/sync-skills.sh` copies `skills/` into the game's `.claude/skills/` and
records the commit and a fingerprint per skill in `.claude/sandblock-skills.json`,
so a skill changed inside a game is reported instead of overwritten. A skill is
improved in this repository, then synced; never edited in a game.

**Target:** Sandblock Code resolves shared skills from this repository when it
launches a coding agent, or runs the sync for the games it creates.

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

## SB-024 — A thumbnail variant sees the game read-only, and can be continued

**Status:** Accepted

A variant run edited a thumbnail knowing only the base image and the
repository, so the art showed generic characters and effects rather than the
game's own. And it ended with its image: asking for one more change meant a new
run from scratch, without what the last one had learned.

A variant run is therefore given the project's **capture** endpoint,
`/projects/<projectId>/capture/mcp`. It serves the same project as
`/projects/<projectId>/mcp`, but only tools that cannot change the place: finding
and inspecting instances, photographing models and UI, and
`render_2d_asset_id`, which shows image assets such as particle textures by id.
The filter is at the gateway, so an unlisted tool is not callable by name
either, and a session opened on one profile cannot be replayed on the other.
There is no unscoped capture endpoint. Access is chosen per run with a switch
in the variant dialog: on by default when a Studio has one of the project's
places open, off otherwise, and off means the run has no MCP server at all.

Codex runs with `--ignore-user-config`, because the person's own `config.toml`
may declare the full gateway and a `-c` override can add a server but never
remove one. The capture server is the run's only MCP server, and its tools are
approved without asking — safe only because the gateway serves it read-only.

A run keeps its Codex session and its scratch directory after a turn ends. A
follow-up resumes the session, edits the latest image, and files the result in
Drive as a new variant beside the previous one. The directory is removed when
the run is finished by hand or the app quits.

**Current:** implemented in `sandblock-code` (gateway, runner, Thumbnails tab)
and documented in `sandblock-skills`' `roblox-thumbnail-variant`. No Studio
plugin change: every capture it uses already restores what it touched.

## SB-025 — Agents upload every kind of asset through one tool

**Status:** Accepted

Agents could upload only images. Sounds, meshes, animations, and videos had to
be uploaded by hand in Studio or Creator Hub before an agent could use their ids.

`upload_assets` uploads local files of any type Roblox accepts and returns one
result per file. It is one tool, not one per type, for three reasons. Every type
takes the same path, an Open Cloud create-asset call followed by polling the
operation. A mixed batch is one call. And every extra tool adds context to
every session. The type comes from the extension; `assetType` is only needed
for a `.rbxm` that is an animation. `upload_local_images` is removed.

Images still upload through the upstream StudioMCP's `upload_image`. It uses
Studio's own sign-in, needs no key, and returns an id an `ImageLabel` can show.
Every other type uses the Open Cloud Assets API with an API key:

- Sandblock Code keeps one key per Roblox owner, user or group. When a key is
  added, Roblox's introspection endpoint confirms that it can write assets and
  names the owners it acts for. The key goes into the same keychain-backed vault
  as the Roblox accounts, and the renderer only ever sees a summary with the
  last four characters.
- The app sends the gateway the full set of keys as a process message. It does
  so when the gateway starts and whenever a key is added or forgotten. The
  gateway keeps them in memory only. A gateway the app did not start receives
  no keys.
- An asset belongs to the owner of the place the call targets, which the
  gateway looks up from Roblox's public place, universe, and game endpoints.
  Agents cannot choose an owner. If no place is connected, uploads work only
  when a single key is held.

Uploads run one at a time. Throttling and server errors are retried after 2, 4,
8, and 16 seconds, honoring `Retry-After`. A refused key is not retried. An
upload Roblox is still processing is reported as pending, with its operation
id, so that it is not uploaded twice. Audio and video count against Roblox's
upload quotas.

**Current:** implemented in `sandblock-code` (gateway tool, desktop key store,
Settings section). It has not yet been run against Roblox with a real key. No
Studio plugin change.


## SB-026 — Thumbnail lineage lives in Drive, and the board draws it

**Status:** Accepted

A variant was filed in Drive with no record of what it came from. Only the run
knew its base, and only until it was closed or the app quit, so nobody could
see which image a variant was made from or what had been tried along the way.

Each variant now records its parent in Drive:

- A variant's `parent` property is the Drive id of what it was made from. That
  is the base for a run's first image, and the image the previous turn filed for
  every later one, because a follow-up edits the run's latest image.
- What was asked for is stored in the file's Drive `description`, since a
  request is free text and a property is capped at 124 bytes. When the request
  is empty, the first line of the agent's reply is stored instead, because it
  names the axis the agent chose.
- A base the Roblox CDN serves is saved to Drive as `live` art before the run
  starts. A lineage then starts at a file, and that file does not expire the way
  a CDN link does.
- Images downloaded into Drive carry `src`, a hash of their bytes. The same
  image is stored once, so a tile saved by hand and then used as a base, or used
  as a base twice, is a single root.
- A variant keeps its base's shape. An icon's variants are icons.

The Thumbnails tab adds a **Board** view built with React Flow. Every image in
the library is a card. A card with a parent has an arrow from it, labelled with
the request, and lineages are laid out as trees. Images with no parent and no
child sit in a grid under the trees. A card is drawn square when its image is
square, whatever its stored shape says, because icon variants filed before this
change were stored as 16:9. A run in progress appears as a pending card under its
parent. Selecting a card shows it large with its request and parent. From there
you can start a new variant from the card or delete it. If a run is still open
and the card is its latest image, you can also ask that run for the next change.

Images pasted or dropped into a variant request, or into a follow-up, are
reference images for the change. The app checks their type and size, writes
them into the run's `references` directory, names them in the prompt, and
attaches them to the Codex message with `--image`. They are never filed as the
result.

Image bytes are cached on disk by Drive file id, along with a preview shrunk to
card width. The cache is correct only because the app never rewrites a file's
bytes in place: an edit is always a new file. The Drive client stays alive while
the connection is unchanged, so its access token and folder ids are not fetched
again on every call. The window shows the last listing at once while a new one
loads.
Card positions are kept per project in the window's local storage. They are a
display preference, and "Tidy up" lays the tree out again.

**Current:** implemented in `sandblock-code` (Drive client, variant handler,
Thumbnails board). Variants filed before this change have no parent and appear
in the board's grid. No skill or Studio plugin change: the app files every variant
itself, so the agent never sees this metadata.

## SB-027 — Agents open Studio and work in disposable place copies

**Status:** Accepted — replaces [SB-004](#sb-004--v0-launches-the-main-roblox-place-only)
and the rule that a Studio opened by hand stays unconnected until someone clicks

SB-004 limited launching to the main place, and the plugin waited for a click
before connecting, so that a normal Studio launch stayed non-intrusive. Both
now block the work. An agent cannot open the place it needs. Several agents
cannot build in parallel either, because a place holds one Studio and every
agent's edits land in the same world.

Sandblock Code therefore launches Studio on any declared place, and the plugin
connects without a click. Sandblock Code decides when a Studio connects, and
the plugin asks it on load. A Studio connects when Sandblock Code launched it,
or when someone opened by hand a place that exactly one open project declares.
Automatic connection can be turned off per place on each machine. The four
agent tools that open Studio — `open_place`, `get_place_version`,
`open_place_copy`, `close_place_copy` — can be turned off per project.

An orchestrating agent can give each subagent a disposable copy of a declared
place at an exact version: the version is downloaded from Roblox and opened as a
local file, so copies of one snapshot run side by side. A copy is reached only
through its project's endpoint, syncs its place's Rojo tree, and is deleted when
it closes. A subagent brings its work back in one transfer of one grouped
instance. An optional setup script then puts each piece in place in the
destination, and the destination is left unchanged if that script fails.

The Roblox account already held for Creator Hub analytics downloads the
versions, from the main process only. The app still never passes a credential
to Studio.

[`STUDIO_LAUNCH_AND_PLACE_COPIES.md`](STUDIO_LAUNCH_AND_PLACE_COPIES.md) is
canonical for the behavior, the contracts, and the Roblox facts still to
validate.

## SB-028 — Agents download assets by id through one tool

**Status:** Accepted

Agents could see an image asset by id with `render_2d_asset_id`, but could not
get the file of any asset: a sound to trim, a mesh to inspect, a model to take
apart, an image to edit. Roblox has also refused unauthenticated requests to
`assetdelivery.roblox.com` since April 2025, so a plain download no longer
works.

`download_assets` is the reverse of `upload_assets`
([SB-025](#sb-025--agents-upload-every-kind-of-asset-through-one-tool)): one
tool for every type, a batch in one call, and one result per asset. It saves
each asset into a folder the agent names, or a temporary folder. The extension
comes from the file's own bytes, and the Roblox asset type is reported beside
the path, because a Model and an Animation are both `.rbxm`. A different file
already saved under the same name is kept unless the call asks to overwrite it.

It reads Open Cloud's Asset Delivery API (`apis.roblox.com/asset-delivery-api`)
with the keys Sandblock Code already holds for uploads:

- A key is still added only when it can write assets. Downloads also need the
  Legacy Asset API (`legacy-asset:manage`) on it; Settings says so, and a
  download Roblox refuses names the missing permission.
- The key of the targeted place's owner is tried first. Downloading changes
  nothing, so when Roblox refuses or does not find the asset, the other keys
  held are tried after it, for an asset private to another owner.
- The key goes to `apis.roblox.com` only, never to the CDN the delivery answer
  points at.

The Roblox account held for Creator Hub analytics is not used. Its cookie stays
in the main process, and a routine agent download has no reason to reach it.

**Current:** implemented in `sandblock-code` (gateway tool, Settings copy). It
has not yet been run against Roblox with a real key: the delivery answer's
shape (`location`, `assetTypeId`) and which assets a key may read are assumed.
No Studio plugin change.

## SB-029 — Each agent codes in a worktree and tests in a copy it serves

**Status:** Accepted — replaces [SB-014](#sb-014--no-git-worktrees-in-the-robloxrojo-workflow)

SB-014 kept worktrees out because Rojo and Studio are bound to one checkout.
SB-027 gave each agent its own Studio, but every copy still syncs the main
checkout's code, so agents cannot change code in parallel: they would share
one working tree, and none could test its code in Studio before it is merged.

Each worker agent now gets its own branch in its own worktree, and a place copy
whose Rojo session serves that worktree. The orchestrating agent owns the
lifecycle through MCP tools, `open_worktree_copy`, `list_worktrees`, and
`remove_worktree`, not a CLI command, for two reasons. One lifecycle stays on
one surface, so the app can refuse a second copy on a worktree and stop a
worktree's Rojo session with its copy. And a worker is kept off that lifecycle
by denying tool names, which a shell pattern cannot do.

Git is the only record of worktrees: every tool reads
`git worktree list --porcelain`, so nothing is saved and a restart loses only
the copies. Worktrees are never registered as projects, so the main checkout
remains the only project that declares the place, and auto-connect is unchanged.

The worker codes, tests, and commits. The orchestrator merges, then transfers
the worker's build into the real place, so code and world reach `main`
together after review. It closes the copy last, because closing deletes
whatever was not transferred.

Most projects do not need this, so the tools are listed only when a
per-project **Worktree copies** setting is on. It is off by default, and needs
Studio launch on.

[`WORKTREE_COPIES.md`](WORKTREE_COPIES.md) is canonical for the behavior and
the contracts.

**Current:** implemented in `sandblock-code` (desktop and gateway), tested
against a real Git worktree, not yet run on Windows or against Studio. The
plugin needs no change: it already syncs through the Rojo URL its start
answers.

## SB-030 — One library agent proposes reusable content, a human merges it

**Status:** Accepted — amends SB-001 and implements SB-011's library

The library that SB-011 searches had no home. The reusable pieces of earlier
games were scattered across their repositories, places, and skills: effects,
kits, systems, menus, sounds. A new game rebuilt them, or an agent dug through
old repositories by hand.

The library is a seventh repository, `sandblock-library`
(`git@ssh.git.shulkr.net:roblox/sandblock-library.git`). Each item is a folder
with an `item.json`. Text comes first: an effect or a kit is the script that
builds it. Binaries go to Git LFS as their original files, and Roblox ids are
recorded per owner, because an animation or a sound uploaded by one owner does
not play in another's game.

One agent writes it: the library agent. It runs once a day as a Claude Code
`/loop` on every game whose `main` moved, and on demand. It never writes to a
game. It is outside the game pipeline: workers,
orchestrators, and reviewers only read the library. The agent proposes each
item as a merge request, and a human merging it is the promotion SB-013
requires.

GitLab enforces this. The agent's writing account is a Developer of the library
project only, and `main` is protected, so only Maintainers merge. Each game's
scans are logged in an issue of the library project, which is where the next
scan starts.

Games read the library through one search surface on the gateway, take an item
with one tool, and record what they took in `sandblock-library.json`, as they
record shared skills (SB-021). People browse it in a Library view in Sandblock
Code. Items carry tags in one form, and a pack groups pieces that belong
together. Games are not written as tags: the game an item came from and the
games that use it are derived. Every item that can be seen is rendered from its
own code in a scratch place (SB-031), never in its game's place, with the
gateway's existing capture tools.

[`ASSET_LIBRARY.md`](ASSET_LIBRARY.md) is canonical for the design. The
library's own README is canonical for the item format, and its `AGENTS.md` for
the agent's rules.

**Current:** the GitLab project exists with LFS on. The service account and its
token, in `sandblock-code/.env`, are set up, and `main` is protected. The
repository's layout, schema, and agent rules are written. No item, tool, view,
or daily pass exists yet, and the games token reaches no game until the games
move into `roblox/games`.

## SB-031 — Scratch places: blank Studios outside every project

**Status:** Accepted — extends [SB-027](#sb-027--agents-open-studio-and-work-in-disposable-place-copies)

Every Studio an agent could open belonged to a project: a declared place, or a
copy of one. Some work must not touch any game. The library agent renders an
item to propose it, and opening a game's place, even as a copy, would expose
the game's world to an agent that only needs the item. A copy also needs the
game's place declared with its PlaceId, and a Roblox account that can download
it.

Sandblock Code therefore serves `/scratch/mcp`, an endpoint bound to no
project. It opens Studios on a blank place, or on a place file the caller
built, such as a `rojo build` of a game's code. These are scratch places,
identified like copies by a ticket in their file name. The endpoint offers the
Studio tools that act in one place, including captures and uploads (which name
their owner), and reaches nothing else. No project endpoint reaches a scratch
place. That isolation keeps SB-018 intact for every game.

[`STUDIO_LAUNCH_AND_PLACE_COPIES.md`](STUDIO_LAUNCH_AND_PLACE_COPIES.md#scratch-places)
is canonical for the behavior.

**Current:** implemented in `sandblock-code` (the gateway's scratch scope,
endpoint, tools and upload `owner`; the runtime service's routes, API version
6; the copy manager) and in `sandblock-studio-plugin` (connecting a scratch
place without a project or Rojo). It is tested on both sides. In Studio, on
Windows, a blank scratch place opens and connects by itself; renders,
uploads and caller-built place files are not validated yet.

