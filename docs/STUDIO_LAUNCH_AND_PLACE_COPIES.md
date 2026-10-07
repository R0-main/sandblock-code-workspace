# Studio launch, auto-connect, and place copies

## Status

**Current, unvalidated.** The desktop app, the gateway, and the Studio plugin
implement everything below, and their unit tests pass, but nothing has run
against Roblox Studio or Roblox's servers yet. Until the
[required Roblox validation](#required-roblox-validation) passes, treat every
Roblox fact below as an assumption the code makes.
[Implementation](#implementation) records where the code narrows or extends
this design. The accepted decision is
[SB-027](DECISIONS.md#sb-027--agents-open-studio-and-work-in-disposable-place-copies).
[Scratch places](#scratch-places) are accepted in SB-031 and implemented;
opening and connecting one is validated in Studio, the rest is not yet.

## Goal

An agent can open Roblox Studio on any place its project declares, and a
Studio connects to Sandblock Code without anyone clicking. An orchestrating
agent can give each subagent its own disposable copy of a place at an exact
version, so several agents build in parallel. Each subagent then brings its
work back into the real place in one transfer, and a setup script puts every
piece where it belongs.

```text
orchestrator
  get_place_version("main")                → 42
  open_place_copy("main", 42)  ×N          → "main@v42-a1b2", "main@v42-c3d4", …
subagent (one per copy)
  builds inside its copy, groups everything under one Folder or Model
  transfer_model_between_places(copy → "main", setupLuau = "put each piece in place")
  close_place_copy(its copy)
```

## Auto-connect

The plugin no longer waits for a click. When Studio loads, and every ten
seconds while it is not connected, the plugin asks the runtime service whether
this Studio should connect (`POST /studios/hello`). Sandblock Code decides; the
plugin only follows the answer. The rules, in order:

1. **A copy.** `game.Name` carries the ticket of a live copy (see
   [Copies](#copies)): connect as that copy.
2. **A Sandblock launch.** `open_place` launched Studio on this `PlaceId` less
   than five minutes ago: connect to that project, and consume the launch.
3. **A Studio opened by hand.** The `PlaceId` is declared by exactly one
   registered project whose window is open, and automatic connection is on for
   that place on this machine: connect.
4. Otherwise do nothing. In particular, a place nobody declared, a project with
   no window open, and a place declared by two open projects never connect on
   their own.

Connecting is the existing connect: the bridge claim and the Rojo sync of that
place, with every `PlaceId` check unchanged. Turning automatic connection off
for a place means a Studio on that place never connects by itself, and
`open_place` refuses that place rather than launch a Studio that would sit
unconnected. Copies of that place still connect: a copy is a separate local
file, never the place itself.

Disconnecting by hand stops automatic connection for the rest of that Studio
session. Connecting by hand still works everywhere it worked before.

## Agent tools

Four tools, listed only on `/projects/<projectId>/mcp` and only while the
project's **Studio launch** setting is on (the default). They are never on the
capture endpoint or the unscoped `/mcp`. Each takes its own `place` argument
and is not subject to the caller's selected place.

| Tool | Effect |
| --- | --- |
| `open_place({ place, timeoutSeconds? })` | Launch Studio on a declared place and wait until it connects. |
| `get_place_version({ place })` | The latest version Roblox has saved for a declared place, and the few before it. |
| `open_place_copy({ place, version?, timeoutSeconds? })` | Open a disposable local copy of a declared place at an exact version and wait until it connects. |
| `close_place_copy({ place })` | Close a copy's Studio and delete its file. |

`open_place` answers immediately with `alreadyOpen: true` when a Studio already
holds the place. Otherwise it waits for the place's claim on the bridge,
180 seconds by default and 600 at most. On timeout it answers `connect_timeout`
and leaves the launched Studio open. It does not change the caller's selected
place.

```json
{ "success": true, "place": "lobby", "placeId": 2345678901, "alreadyOpen": false, "ms": 41250 }
```

`get_place_version` answers the newest saved version first:

```json
{ "success": true, "place": "main", "placeId": 1234567890, "version": 42,
  "savedAt": "2026-10-05T09:12:44Z",
  "recent": [{ "version": 42, "savedAt": "…" }, { "version": 41, "savedAt": "…" }] }
```

`open_place_copy` uses the latest saved version when `version` is omitted, and
always reports the version it opened:

```json
{ "success": true, "place": "main@v42-a1b2", "copyOf": "main", "version": 42, "ms": 38110 }
```

Failures are structured, like the transfer tools:
`{ "success": false, "code": "…", "message": "…", "retryable": false }`.

| Code | Meaning |
| --- | --- |
| `studio_launch_disabled` | The project's Studio launch setting is off. |
| `place_not_declared` | The place is not one of the project's declared places, or (for `close_place_copy`) not a live copy. |
| `place_unpublished` | The declared place has no `PlaceId` yet. |
| `auto_connect_off` | Automatic connection is off for that place on this machine. |
| `studio_not_found` | Roblox Studio is not installed where Sandblock Code looks for it. |
| `launch_failed` | Studio could not be started. |
| `connect_timeout` | Studio started but did not connect in time; it is left open. |
| `roblox_account_missing` | No usable Roblox account is connected in Sandblock Code. |
| `roblox_refused` | Roblox refused the version listing or download (permission, missing place). |
| `version_not_found` | The requested version does not exist. |
| `copy_limit` | The project already has its maximum number of live copies (four). |

## Copies

A copy is a place version downloaded from Roblox and opened in Studio as a
local file. Studio cannot open a historical version of a cloud place, so a file
is the only way to start from an exact snapshot.

- **What it contains.** The version Roblox saved, not unsaved edits in a Studio
  still open on the real place. Its scripts are then synced by Rojo from the
  repository (below), so code is current while the world is the snapshot.
- **Identity.** A local file has `PlaceId` 0, so `PlaceId` cannot tell copies
  apart. The file is named `<placeKey>-v<version>-sb<ticket>.rbxl`, where the
  ticket is random and single-use. Studio uses the file name as `game.Name`, so
  the plugin presents it in `POST /studios/hello` and Sandblock Code recognises
  the copy. Rojo's first sync renames the DataModel after its project, so the
  plugin keeps the file name in the DataModel attribute `SandblockCopyFile` and
  presents that on any later hello. The agent-facing key is
  `<placeKey>@v<version>-<4 characters>`, and `list_studio_places` shows it with
  `copyOf` and `version`.
- **Studio routing.** A copy's fingerprint reads that attribute in place of
  the name (`JobId|0|<file name>`). After Rojo's rename every copy of a place
  would otherwise read the same, and the rename lands after the plugin has
  claimed, so a fingerprint carrying the name would no longer match the one
  the plugin claimed with. The gateway's probe reads the same three parts, so
  it binds each copy to its own StudioMCP `studio_id`, and official tools such
  as `execute_luau` reach the right copy. The plugin also sends its current
  fingerprint on every poll: when it changes, the bridge moves the place's
  binding to it, or probes again if the place had none.
- **Refused official calls.** When no Studio StudioMCP lists answers with the
  place's fingerprint, its official calls are refused, and the refusal says
  which of two cases applies. If StudioMCP does not list that Studio (by
  PlaceId, or by file name for a copy), the fix is the MCP server setting in
  that Studio's Assistant. If StudioMCP lists it, that setting is already on,
  and the agent is told to have the plugin reconnected instead.
- **Rojo.** A copy syncs the Rojo project of the place it copies, through the
  same runtime-service route.
- **Lifecycle.** A copy ends with `close_place_copy`, when its Studio exits,
  when its project window closes, or when the app quits. Its Studio process is
  stopped and its file deleted. Anything not transferred out is lost by design.
- **Limits.** Four live copies per project. Each Studio uses one to three
  gigabytes of memory.
- **Files.** Copies live under the app's user data directory, in
  `place-copies/<projectId>/`, never in a game repository.

Downloads use the Roblox account Sandblock Code already holds for Creator Hub
analytics (the first usable account), from the main process. The cookie never
reaches the gateway, the plugin, or an agent. That account needs edit access to
the place; when it lacks it, the tools answer `roblox_refused`.

## Scratch places

**Current, partly validated**, accepted in
[SB-031](DECISIONS.md#sb-031--scratch-places-blank-studios-outside-every-project).
Implemented in `sandblock-code` (gateway, runtime service, copy manager) and
`sandblock-studio-plugin`, with tests on both sides. On 2026-10-07, on
Windows, `open_scratch_place` opened the blank place in Studio and the plugin
connected it by itself.

A scratch place is a Studio opened on a place that belongs to no project:
blank, or a place file the caller built. It is for work that must not touch a
game: building something from its code alone, uploading what it needs, and
photographing it. The library agent renders items this way
([`ASSET_LIBRARY.md`](ASSET_LIBRARY.md#renders-target)), and never opens a
game's place.

```text
open_scratch_place()                          → "scratch-a1b2"   (blank place)
open_scratch_place({ placeFile })             → "scratch-c3d4"   (e.g. `rojo build -o game.rbxl` of a game's code)
execute_luau / upload_assets / render_gui_element / get_model_icon … with place = "scratch-a1b2"
close_scratch_place({ place: "scratch-a1b2" }) → Studio stopped, file deleted
```

- **Its own endpoint.** `/scratch/mcp` serves scratch places and nothing else.
  Bridge sessions are scoped by runtime id, and scratch places live under the
  reserved one, `sandblock:scratch`. Only the scratch endpoint is tied to it.
  `/projects/sandblock:scratch/mcp` is refused, and the unscoped `/mcp`
  ignores scratch places entirely: they are not counted as a project, and they
  are not reachable from it. No project endpoint reaches a scratch place, so
  SB-018's allowlist still holds for every game.
- **Served by the app, not a window.** The endpoint is up whenever Sandblock
  Code runs. Plain `sandblock-code` (without `open`) is enough to start it, and
  no game is opened. No setting gates it.
- **What it contains.** Without `placeFile`, a blank place: the default
  services, empty, written as XML by the app. Studio adds the camera and the
  terrain itself.

  With `placeFile`, a copy of that `.rbxl` or `.rbxlx`, which must hold a
  Roblox place and be at most 512 MB. The caller's file is only read. A WSL
  path works: the app converts it to the Windows path it can open
  (`wslpath -w`, or `C:\…` for `/mnt/c/…`). Building a game's code with `rojo
  build` gives its scripts and packages without its world.

  There is no Rojo session: a scratch place is a snapshot, not a sync.
- **Identity.** It is a copy without a source. The file is named
  `scratch-sb<ticket>.rbxl` (or `.rbxlx`), it has `PlaceId` 0, and the plugin
  presents the name in `POST /studios/hello`, as a copy does. Hello answers
  `{ connect: true, runtimeId: "sandblock:scratch", reason: "scratch", copy:
  null, scratch: { key, name } }`.

  The plugin then connects the bridge only, with no project, no place check,
  and no Rojo. It claims the place as `{ key, name, main: false, scratch: true
  }` under that runtime id, and its panel shows "Scratch place · no project".
  The bridge files any claim naming either the scratch runtime id or a scratch
  place in the scratch scope, without a PlaceId, so the two never disagree.

  The agent-facing key is `scratch-<4 characters>`. It is never a default
  target: every call names it with `place`.
- **Tools.** `open_scratch_place`, `close_scratch_place`, and every other tool
  except the package and transfer tools (`transfer_model_between_places`,
  `create_package`, `publish_package_version`, `insert_package`,
  `update_package_copy_to_latest`). Those would carry what a scratch place
  holds into a game's place, or publish it.

  The project-only tools (Studio launch, copies, worktrees, Creator Hub) are
  never listed there, because the scratch scope is no project. Upstream
  StudioMCP tools such as `execute_luau` reach the scratch place through the
  usual fingerprint binding: without Rojo, `game.Name` stays the unique file
  name.
- **Uploads.** `upload_assets` uploads for the owner of the place a call
  targets, and a scratch place has none. Its `owner` argument (`group:<id>` or
  `user:<id>`) names one, which must be an owner the held Open Cloud keys act
  for. With a single key, it defaults to that key's owner.

  On a published place, `owner` is refused unless it is that place's owner
  (`owner_mismatch`): SB-025's rule that agents cannot choose an owner still
  holds there. Images still upload through Studio, as the signed-in account.
- **Lifecycle.** The same as a copy, through the same copy manager. A scratch
  place ends with `close_scratch_place`, when its Studio exits after its hello,
  or when the app quits; that stops the Studio and deletes the file. Closing a
  project's window leaves scratch places alone.

  At most four are live at once, counted apart from every project's copies.
  Files live under the app's user data directory, in
  `place-copies/sandblock-scratch/`, and leftovers from a crash are swept like
  copies.
- **Runtime service.** API version 6 adds `POST /scratch-places` (`{
  placeFile? }` → `{ scratch: { key, name } }`) and `DELETE
  /scratch-places/{key}`. Their refusals are `not_a_place_file`,
  `place_file_not_found`, `place_file_too_large`, `studio_not_found`,
  `copy_limit`, and `scratch_not_found` (404). The project routes never reach a
  scratch place.

Validated in Studio on 2026-10-07: the blank XML place opens, and the plugin
connects it without a click. Still to validate: renders and `execute_luau`
in it, a `placeFile` built with `rojo build`, uploads that name their owner,
and whether images and meshes owned by the games' group show in it.

## Bringing work back: transfers and setup

A subagent groups everything it built under **one** Folder or Model in its copy
and transfers that single instance with `transfer_model_between_places`, which
publishes it through the project's transfer package
([CROSS_PLACE_MODEL_TRANSFER.md](CROSS_PLACE_MODEL_TRANSFER.md)). One transfer
per subagent keeps package publications, which are throttled per owner, to a
minimum.

The transfer gains an optional `setupLuau` string. After insertion, the gateway
runs it in the destination Studio through StudioMCP's `execute_luau`, with
`model` bound to the instance that was just inserted. The script moves each
piece to where it belongs, and may return a JSON-encodable value that the
result reports as `setupResult`.

```ts
transfer_model_between_places({
  fromPlace: "main@v42-a1b2",
  modelPath: "Workspace.ArenaBuild",
  toPlace: "main",
  destinationPath: "Workspace",
  packageMode: "transfer",
  setupLuau: `
    for _, child in model.Arena:GetChildren() do child.Parent = workspace.Map.Arena end
    model.Lighting.Parent = game:GetService("ServerStorage")
    model:Destroy()
    return { moved = true }
  `,
})
```

- **Finding the instance.** The plugin marks the inserted root with the
  transfer's `SandblockTransferId` attribute. The setup preamble finds it by that
  attribute under the destination, never by its path, so two subagents
  inserting a `House` under the same parent do not collide. The attribute is
  removed once setup succeeds.
- **All or nothing.** The setup runs inside a ChangeHistoryService recording.
  If it raises, the recording is cancelled, the inserted instance is removed,
  and the tool answers `setup_failed` with the Luau error. The destination is
  left as it was before the transfer.
- **One at a time per destination.** Transfers into the same place run one at a
  time from insertion through setup, so two subagents' setups never interleave.
- **Availability.** A transfer with `setupLuau` checks that StudioMCP is bound
  to the destination before publishing anything, and refuses with
  `setup_unavailable` otherwise.
- **Rojo.** Setup can move instances anywhere. Moving them under a tree Rojo
  syncs without `ignoreUnknownInstances` gets them deleted on the next sync;
  that check covers the insertion destination only.

A copy has no Roblox owner (`CreatorId` 0). When the source is a copy, the
transfer publishes under the owner of the destination place; when the
destination is a copy, it uses the source's. Two copies never transfer to each
other. Because the place is a copy of one the project declares, the owner
check still holds between real places.

## Settings

Both settings belong to the machine, not the repository, like the Creator Hub
toggle:

- **Automatic connection, per place.** Project settings → Places, one switch per
  place, on by default. Stored as the `PlaceId`s turned off.
- **Studio launch, per project.** Project settings → Agent tools, one switch
  covering the four tools above, on by default. When it is off the gateway
  neither lists nor routes them, and the runtime service refuses their routes
  too, except closing a copy: a copy opened before the setting was turned off
  can still be closed.

## Contracts

### Runtime service

New and changed routes on the loopback runtime service. All require the
`X-Sandblock-Runtime` header.

| Route | Caller | Purpose |
| --- | --- | --- |
| `POST /studios/hello` | plugin | Body `{ placeId, placeName }`. Answers `{ connect: true, runtimeId, reason: "copy" \| "launch" \| "declared", copy }` or `{ connect: false, reason }`. |
| `POST /runtimes/{runtimeId}/places/{key}/open` | gateway | Launch Studio on the declared place and record a pending launch. Answers `{ place, placeId }`. |
| `GET /runtimes/{runtimeId}/places/{key}/versions` | gateway | `{ place, placeId, versions: [{ version, savedAt }] }`, newest first, at most ten. |
| `POST /runtimes/{runtimeId}/places/{key}/copies` | gateway | Body `{ version? }`. Download, write, and open a copy. Answers `{ copy }`. |
| `DELETE /runtimes/{runtimeId}/copies/{copyKey}` | gateway | Close a copy. Answers `{ closed: true }`. |
| `POST /runtimes/{runtimeId}/start` | plugin | Also accepts `{ placeId: 0, copy: "<copyKey>" }`, which serves the copied place's Rojo session. |
| `POST /runtimes/{runtimeId}/events` | plugin | Also accepts `copy: "<copyKey>"`. |

`{key}` may be the declared key, or the agent's own words when the gateway has
not learned the declared list yet; the service resolves it by key, name, or
`PlaceId`, ignoring case and accents. A copy descriptor is
`{ key, name, copyOf, version }`; copy keys and tickets are lowercase and
matched without regard to case. Refusals use the codes in
[Agent tools](#agent-tools), as `{ error: code, message }` with status 409 (404
for an unknown runtime or copy, 502 `roblox_refused` for a transient Roblox
failure, which the gateway reports as retryable). The runtime API version
becomes 4.

### Gateway

- The app passes `SANDBLOCK_RUNTIME_URL` (loopback, the runtime port) in the
  gateway's environment.
- The app posts `{ type: "sandblock-studio-launch", projects: [projectId, …] }`
  with the projects whose Studio launch setting is on, when the gateway starts
  and whenever the setting changes. A gateway the app did not start lists the
  tools for no project.
- Bridge claims may carry a copy: `place = { key, name, main: false, copyOf,
  version, projectFile }` with no `placeId`. The bridge keeps `placeId` null
  rather than reading 0 from the fingerprint. A copy is exclusive by key within
  its project, and is never declared or the default target.
- Package commands addressed to a copy carry `expectedPlaceId: 0`, and
  `creator: { creatorType, creatorId }` taken from the other side of the
  transfer.

### Plugin

- Runs the auto-connect loop above and remembers a manual disconnect for the
  session.
- For a copy: claims with the copy descriptor, starts with `copy`, reports
  events with `copy`, and shows "Copy of <place> v<version>" instead of a
  `PlaceId` mismatch.
- `package_publish` and `package_inspect_source` accept `creator` for an
  unpublished copy instead of refusing with `place_not_published`.
- `package_insert` and `package_clone_local` set `SandblockTransferId` on the
  inserted root when given `markId`. The gateway sends one only when a setup
  will run, and the setup removes it; `transferId` still only verifies the
  shuttle.

## Launching Studio

The main process launches the newest
`%LOCALAPPDATA%\Roblox\Versions\version-*\RobloxStudioBeta.exe` on Windows, or
`/Applications/RobloxStudio.app/Contents/MacOS/RobloxStudio` on macOS.
`SANDBLOCK_STUDIO_EXE` overrides both.

- A declared place: `-task EditPlace -placeId <placeId> -universeId <universeId>`.
- A copy: `-task EditFile -localPlaceFile <file>`. The process is kept, so the
  copy can be closed.

No credential is ever passed on the command line: Studio uses its own sign-in.

## Required Roblox validation

1. `RobloxStudioBeta.exe -task EditPlace -placeId … -universeId …` and
   `-task EditFile -localPlaceFile …` open the place on the current Studio.
2. The version endpoints answer with the stored account's cookie, and their
   exact shapes: `GET https://develop.roblox.com/v1/assets/{placeId}/saved-versions`
   and `GET https://assetdelivery.roblox.com/v1/asset/?id={placeId}&version={n}`.
   Pin them from the Creator Hub's own traffic on a place's version-history page
   (`scripts/capture-creator-hub.mjs --page=…`), as SB-017 requires, rather than
   trusting these paths.
3. `game.Name` of a Studio opened on a local file is that file's name.
4. A copy Studio can publish the transfer package under the destination's owner
   (`AssetService:CreateAssetAsync` with an explicit creator).
5. `ChangeHistoryService:FinishRecording(…, Cancel)` reverts a setup that raised
   when it runs through `execute_luau`.
6. StudioMCP lists copy Studios and binds each one by fingerprint, and a plugin
   can set an attribute on the DataModel (`game:SetAttribute`).

Observed on 2026-10-06 with one live copy: StudioMCP lists the copy's Studio
under its file name with no PlaceId, its `game.Name` reads the Rojo project
name after sync, and the plugin's `SandblockCopyFile` attribute holds the file
name. That covers the listing and attribute halves of item 6. Binding through
the fingerprint is untested until the updated plugin runs against a copy.

## Ownership

- `sandblock-code` (main process) owns the Studio launcher, the version client,
  copies and their lifecycle, the hello decision, the new runtime-service
  routes, and both settings.
- `sandblock-code` (gateway) owns the four tools, their gating, copies on the
  bridge, and `setupLuau` with its destination lock.
- `sandblock-studio-plugin` owns the auto-connect loop, copy claims, and the
  package-handler changes.
- `sandblock-skills` owns the guidance below once it becomes a skill.

## Skill guidance

> To build several parts of a place in parallel, read the place's version with
> `get_place_version`, then open one copy per subagent with
> `open_place_copy(place, version)` so every subagent starts from the same
> snapshot. Give each subagent its copy's key and have it address every Studio
> call to that key.
>
> A subagent builds only inside its copy and groups everything it made under
> one Folder or Model. It brings that back with one
> `transfer_model_between_places` call into the real place, with a `setupLuau`
> that moves each piece to where it belongs, then closes its copy with
> `close_place_copy`.
>
> A copy holds what Roblox last saved, not unsaved edits. Keep code in the
> repository: Rojo syncs it into every copy, so do not transfer scripts that
> Rojo owns.

## Implementation

**Current, unvalidated.** Where the code lives:

- Desktop main process, in `sandblock-code/desktop/electron/`:
  - `studioLaunch.ts`: finds Studio and launches it.
  - `placeVersions.ts`: the only module that holds the two Roblox endpoints.
  - `placeCopies.ts`: copies and their lifecycle.
  - `studioPreferences.ts`: `studio-preferences.json` in the app's user data.
  - `studioService.ts`: pending launches, the hello decision, and the route
    logic.
  - `runtimeApi.ts`: the routes.
- Renderer: `desktop/renderer/src/studioLaunch.ts`, plus the switches in project
  settings.
- Gateway, in `sandblock-code/src/`:
  - `tools/studioLaunch.ts`: the four tools.
  - `runtimeService.ts`: the client of the runtime service.
  - `studioLaunch.ts`: gating.
  - `transferSetup.ts`: the setup Luau.
  - `packages.ts`: copies in transfers, and the destination lock.
- Plugin, in `sandblock-studio-plugin/src/`:
  - `Main.lua` and `Runtime.lua`: the auto-connect loop and copies.
  - `Handlers/Packages.lua`: `creator` and `markId`.

Choices the design left open, or that the code narrows:

- **Marking for setup.** `package_insert` and `package_clone_local` tag the
  inserted root only when given `markId`, which the gateway sends only with a
  setup. `transferId` keeps its one job of verifying the shuttle.
- **Locks.** The owner's publication lock covers the publication only.
  Insertion and setup take the destination's lock, so a long setup never holds
  up another publication.
- **Checking a setup before publishing.** One probe runs the generated script
  with an early return. That proves StudioMCP reaches the destination and that
  the agent's code compiles there. A compile error answers `setup_failed`, and
  nothing is published. If the setup's answer is lost after insertion, a cleanup
  script removes whatever still carries the mark.
- **Setup output.** The agent's `print` and `warn` are captured and returned
  with the result. The agent's line numbers are kept in Luau errors.
- **No undo recording.** If Studio cannot begin a recording, the setup does not
  run and the inserted instance is removed.
- **What a plugin auto-connects.** A playtest DataModel never auto-connects.
  Automatic connection also stops for the rest of the session in two cases:
  - the bridge answers that another Studio holds the place;
  - Sandblock Code refuses a connection it had just offered.
- **Copy tickets.** A copy's ticket keeps matching while the copy lives, so a
  plugin reload reconnects it. If Studio hands its process off before the first
  hello, the copy lives until its ticket expires, ten minutes after opening. A
  copy whose Studio still runs is never ended by the clock.
- **XML place files.** A place Roblox serves as XML is written as `.rbxlx`.
- **Project scans.** The hello decision reuses one scan of the projects for
  twenty seconds. Any change made in the app clears it, so a hand-edited
  `.sandblock-code.json` is picked up within twenty seconds.
- **The Studio page's Open Studio button** opens the main place. It ignores the
  agent-tools setting and follows the place's automatic connection.
- **Gateway-only failure codes.** `project_required`, `runtime_unavailable`,
  `runtime_timeout`, `runtime_protocol`, and `studio_launch_error`.
