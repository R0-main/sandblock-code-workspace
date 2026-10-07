# Worktree copies: one branch, one Studio, one agent

## Status

**Current, unvalidated.** The desktop app and the gateway implement everything
below, and their tests pass, including a copy served from a real Git worktree
through its own Rojo session. Nothing has run on Windows, through WSL, or
against Roblox Studio yet. It extends
[place copies](STUDIO_LAUNCH_AND_PLACE_COPIES.md#copies), which are in the same
state. [Implementation](#implementation) records where the code lives. The accepted decision is
[SB-029](DECISIONS.md#sb-029--each-agent-codes-in-a-worktree-and-tests-in-a-copy-it-serves).

## Goal

A team of agents builds one game in parallel. Each worker agent gets its own
Git branch, checked out in its own worktree, and its own Studio: a place copy
whose scripts Rojo syncs from that worktree instead of the main checkout. The
worker codes and tests in isolation. An orchestrating agent creates the
worktrees and copies, merges the branches, brings the builds into the real
place, and cleans up.

```text
orchestrator
  get_place_version("main")                              → 42
  open_worktree_copy("main", 42, "feat/shop")            → "main@v42-a1b2", ~/sandblock/.worktrees/<game>/feat-shop
  starts a worker in that worktree with the copy's key and its ticket
worker
  codes in its worktree, tests in its copy, groups what it builds in Studio
  under one Folder or Model, commits on its branch, reports ready
orchestrator / lead dev
  reviews and merges feat/shop into main
  transfer_model_between_places(copy → "main", setupLuau)
  tests on the real place
  close_place_copy("main@v42-a1b2")
  remove_worktree("feat/shop")
```

## Worktrees

- **Git is the record.** Sandblock Code stores nothing about worktrees. Every
  tool reads `git worktree list --porcelain` in the project's repository, so a
  worktree made or removed by hand is seen like any other, and nothing is lost
  when the app restarts.
- **Location.** A worktree Sandblock Code creates lives at
  `<repo parent>/.worktrees/<repo name>/<branch slug>`, beside the repository
  and on the WSL filesystem where Rojo and Wally run. The slug replaces every
  character outside `[A-Za-z0-9._-]` with `-` (`feat/shop` → `feat-shop`).
- **Which worktrees count.** Any worktree of the project's repository other
  than the main checkout, wherever it lives. The location above only decides
  where new ones go.
- **Created from.** A new branch starts from the project's default branch
  (`main`) unless the call names another `base`. An existing branch that is not
  checked out anywhere is checked out as is.
- **Prepared.** Before a copy serves it, a worktree gets what Git does not
  carry: `wally install` when `wally.toml` exists and its package folders are
  missing, and the main checkout's `.tooling` linked in when the worktree has
  none. Nothing else is copied; secrets stay in the main checkout, and uploads
  already use the keys Sandblock Code holds.
- **Reused.** Opening a copy on a branch that already has a worktree reuses
  it. This is how an orchestrator resumes after the app restarted: the copies
  died with the app, the worktrees and their commits did not.

## Copies served from a worktree

- **Binding.** The copy remembers its worktree in memory, beside its ticket.
  The binding ends with the copy; the worktree stays.
- **Rojo.** The copy's start (`POST /runtimes/{runtimeId}/start` with `copy`)
  serves the copied place's project file from the worktree, as its own Rojo
  session on its own port. `RojoManager` already keys sessions by repository
  root and file, so a worktree session never meets the main checkout's.
- **Route.** That session is reached at
  `/runtimes/<id>/copies/<copyKey>/rojo` (runtime API 5), and the start answers
  that URL as `rojo.url`. The plugin already syncs through the URL the start answers, so it
  needs no change. A copy without a worktree keeps the place's route and the
  main checkout's session, as today.
- **Stopping.** The worktree session stops when its copy ends, by any of the
  copy's endings: `close_place_copy`, its Studio exiting, its project window
  closing, or the app quitting.
- **Sync check.** The check that Studio synced its place's own tree reads the
  project file from the worktree.
- **Limits.** A worktree copy counts against the project's live copies, like
  any copy. One worktree serves at most one live copy.

## Agent tools

Listed on `/projects/<projectId>/mcp` beside the place copy tools, only while
both the project's **Studio launch** and **Worktree copies** settings are on
(see [Settings](#settings)).

| Tool | Effect |
| --- | --- |
| `open_worktree_copy({ place, version?, branch, base?, timeoutSeconds? })` | Find or create the branch's worktree, prepare it, open a copy of a declared place served from it, and wait until it connects. |
| `list_worktrees({})` | Every worktree of the project's repository, from Git, with its live copy. |
| `remove_worktree({ branch, force? })` | Remove a branch's worktree, and delete the branch when it is merged. |
| `close_place_copy({ place })` | Unchanged; for a worktree copy it also stops the worktree's Rojo session. |

`list_studio_places` is unchanged: it lists copies from what their plugin
claims, and the plugin never learns a branch. `list_worktrees` joins each
worktree to the key of the copy serving it instead.

`open_worktree_copy` answers like `open_place_copy`, plus where the worker
works:

```json
{ "success": true, "place": "main@v42-a1b2", "copyOf": "main", "version": 42,
  "branch": "feat/shop", "worktree": "/home/romain/sandblock/.worktrees/my-game/feat-shop",
  "created": true, "ms": 52310 }
```

`list_worktrees` reads Git each time:

```json
{ "success": true, "base": "main", "worktrees": [
  { "branch": "feat/shop", "path": "/home/romain/sandblock/.worktrees/my-game/feat-shop",
    "head": "3f2c1ab", "dirty": false, "ahead": 4, "merged": false, "copy": "main@v42-a1b2" } ] }
```

`merged` means the branch's head is reachable from `base`. `copy` is null when
no live copy serves the worktree.

`remove_worktree` refuses a worktree that a live copy serves (close the copy
first), one with uncommitted changes, and one whose branch is not merged into
the default branch, unless `force` is set. It then runs `git worktree remove`
and deletes the branch with `git branch -d` when it is merged. The main checkout
is never removed.

New failure codes, beside the place copy codes:

| Code | Meaning |
| --- | --- |
| `worktree_copies_disabled` | The project's Worktree copies setting is off. |
| `branch_checked_out` | The branch is checked out in the main checkout. |
| `worktree_busy` | A live copy already serves this worktree. |
| `worktree_not_found` | No worktree has that branch checked out. |
| `worktree_dirty` | The worktree has uncommitted changes; `force` removes it anyway. |
| `branch_not_merged` | The branch is not merged into the default branch; `force` removes it anyway. |
| `worktree_setup_failed` | `git worktree add` or `wally install` failed; the message carries its output. |
| `no_project_file` | The branch has no Rojo project file for the copied place. |

## Settings

**Worktree copies, per project.** Project settings → Agent tools, one switch
under Studio launch, **off by default**: a small game worked by one agent does
not need branches per agent, and the tools would only crowd its tool list.
Like Studio launch, it belongs to the machine, not the repository.

- When it is off, the gateway neither lists nor routes `open_worktree_copy`,
  `list_worktrees`, or `remove_worktree`, and the runtime service refuses their
  routes with `worktree_copies_disabled`.
- It needs Studio launch: while Studio launch is off, the switch shows off and
  cannot be turned on.
- Turning it off ends nothing. Live worktree copies keep running and
  `close_place_copy` still closes them, as it does any copy. Worktrees stay on
  disk, and Git removes them by hand.

## Runtime service routes

Beside the [place copy routes](STUDIO_LAUNCH_AND_PLACE_COPIES.md#runtime-service),
with the same header, refusal shape and gating:

| Route | Caller | Effect |
| --- | --- | --- |
| `POST /runtimes/{runtimeId}/places/{placeKey}/worktree-copies` | gateway | `{ branch, version?, base? }`; answers `{ copy, worktree: { branch, path, created } }`. |
| `GET /runtimes/{runtimeId}/worktrees` | gateway | `{ base, worktrees: [...] }`, as `list_worktrees` answers. |
| `POST /runtimes/{runtimeId}/worktrees/remove` | gateway | `{ branch, force? }`; answers `{ removed, branch, path, branchDeleted }`. |
| `/runtimes/{runtimeId}/copies/{copyKey}/rojo/...` | plugin | A worktree copy's Rojo session; 404 for any other copy. |

## Roles

Sandblock Code can turn the Studio launch tools off per project, not per
agent. The split between agents is set where each agent is configured
(Paperclip, or Claude Code permissions):

- **Orchestrator.** Every tool above, `get_place_version`, and
  `transfer_model_between_places`. It owns the worktree and copy lifecycle.
- **Worker.** The Studio tools of its own copy, addressed by its key, plus
  shell and Git on its own branch. It is denied `open_place`,
  `open_place_copy`, `open_worktree_copy`, `close_place_copy`,
  `remove_worktree`, and `transfer_model_between_places`. Deny lists on MCP tool
  names hold; shell patterns do not, which is why the lifecycle is not a CLI
  command.
- **Worker in a Paperclip team** ([SB-032](DECISIONS.md#sb-032--a-games-agent-team-is-a-paperclip-company-the-game-carries)).
  Paperclip creates the worker's branch and worktree for its task, beside the
  ones Sandblock Code makes, so the worker also calls `open_worktree_copy` on
  that branch, with the place and version the orchestrator gave it. The tool
  reuses the worktree. The rest of its deny list stands; the game's
  `paperclip/README.md` is canonical for that setup.

## Bringing work back

The order matters, because closing a copy deletes whatever was not transferred:

1. The worker commits on its branch and reports ready. It does not merge,
   transfer, or close its copy.
2. The orchestrator reviews and merges the branch into `main`.
3. The orchestrator transfers the worker's grouped Folder or Model from the
   copy into the real place, with a `setupLuau` that puts each piece in place.
   This differs from the [plain copy guidance](STUDIO_LAUNCH_AND_PLACE_COPIES.md#skill-guidance),
   where the subagent transfers: here code and world reach `main` together,
   after review.
4. The lead dev tests the merged result on the real place.
5. The orchestrator closes the copy, then removes the worktree.

## Skill guidance

Carried by the tools' own descriptions, which every agent reads; no skill file
holds it. In short:

> To run a team on one game, open one worktree copy per worker with
> `open_worktree_copy(place, version, branch)`, every one at the same version
> from `get_place_version`. Start each worker in its `worktree` with its copy's
> key, and have it address every Studio call to that key.
>
> A worker codes and commits on its branch, tests in its copy, and groups what
> it builds in Studio under one Folder or Model. It never merges, transfers, or
> closes its copy.
>
> When a worker is ready: merge its branch, transfer its group into the real
> place, test there, then `close_place_copy` and `remove_worktree`. After an app
> restart, `list_worktrees` shows the work still in flight; open a copy on each
> branch again to resume.

## Ownership

- `sandblock-code` (main process) owns the worktree operations (Git and Wally
  in WSL), the copy-to-worktree binding, the worktree Rojo sessions, and the
  copy Rojo route.
- `sandblock-code` (gateway) owns the three new tools and their gating.
- `sandblock-studio-plugin` needs no change: it syncs through the `rojo.url`
  its start answers.

## Implementation

- Desktop main process, in `sandblock-code/desktop/electron/`:
  - `worktrees.ts`: Git and Wally, path forms, where worktrees go.
  - `placeCopies.ts`: a copy's worktree, one copy per worktree, and `onEnded`,
    which `main.ts` uses to stop the worktree's Rojo session.
  - `studioPreferences.ts`: the `worktreeCopies` setting.
  - `studioService.ts`: the three routes' logic and refusals.
  - `runtimeApi.ts`: the routes, the copy Rojo route, and serving a file from a
    worktree.
- Renderer: the **Worktree copies** switch in project settings → Agent tools.
- Gateway, in `sandblock-code/src/`:
  - `tools/studioLaunch.ts`: the three tools.
  - `runtimeService.ts`: their client calls.
  - `studioLaunch.ts` and `mcpServer.ts`: gating on both settings.

Still to validate on a real machine: Git and Wally through `wsl.exe` from the
Windows app, the `\\wsl.localhost` form of a worktree path for Rojo, and a
copy's Studio syncing through the copy route.
