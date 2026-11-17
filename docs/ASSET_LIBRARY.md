# Sandblock Library

## Status

**Current, in part.** The repository exists: `roblox/sandblock-library`
(GitLab project 160), cloned in the workspace as `sandblock-library/`. Its
README is canonical for the layout and the item format, and its `AGENTS.md`
for the library agent's rules. Git LFS is on, a service account can propose
but not merge, and `main` is protected.

- **Content.** `main` holds 30 items, all UI (`ui/*`), merged by a human from
  the library agent's requests: the `ui/cartoon-menu-kit` builder and the 27
  items built on it (menus, HUD widgets, popups, a prize wheel, world
  templates), and two standalone components (`ui/sandblock-components`,
  `ui/styled-title`). No system, VFX, model, sound or animation yet.
- **Reading (current).** A game's agent team reads the library as a git
  checkout: the Reuse scout annotates the plan's tasks with the items to
  start from, and the workers take them
  ([Reading the library](#reading-the-library)). This is in the boilerplate's
  team and has not yet run on a game.
- **Later, maybe.** The gateway's reading tools and the app's Library view
  are not built, and may never be needed.

The accepted decision is
[SB-030](DECISIONS.md#sb-030--one-library-agent-proposes-reusable-content-a-human-merges-it),
amended on 2026-10-10 to make the checkout the way games read.
The list of content types stays canonical in
[`ROBLOX_DEVELOPMENT_WORKFLOW.md`](ROBLOX_DEVELOPMENT_WORKFLOW.md#library-content-types).

## Goal

A game takes what it needs from earlier games instead of building it again,
and takes a whole mechanic: its code, its menu, its effect, its model, and its
sound.

```text
every game's main ──daily routine──▶ library agent ──merge request──▶ human merges ──▶ main
                                                                                          │
reuse scout, workers ◀──── git pull of the library's checkout (current) ◀───────────────────┤
Library view, search_library, use_library_item (later, maybe) ◀───────────────────────────┘
```

## One writer

Only the library agent writes the library. It is not part of a game's
[pipeline](AGENT_GAME_PIPELINE.md): no worker, orchestrator, or reviewer
proposes items. Three reasons:

- Deciding what is reusable means looking past one game, at the library as a
  whole. The agents building a game are judged on that game.
- One writer keeps duplicates out and keeps items consistent with each other.
- A game's agents keep their context for the game.

GitLab enforces the boundary. The agent's service account is a Developer of
the library project only. It can push branches and open merge requests, but
`main` is protected and only Maintainers merge. **A human merging the request
is the promotion** that [SB-013](DECISIONS.md#sb-013--human-approvals-remain-explicit)
requires, and closing it is a rejection the agent does not repeat.

GitLab is also the only record of scans. Each game has a scan log, the issue
`Scans: <game>` in the library project. Every scan comments there with the
commits it read, what it proposed, and what it skipped and why. The last
comment is where the next scan starts, so no state file is kept, and a human
can read why something was left out and ask for it.

## Storage

- **One Git repository, one folder per item**, with an `item.json`, a
  `README.md`, and the item's files. The id is the path, such as
  `vfx/lightning-strike`.
- **Text first.** An effect or a kit is stored as the replayable script that
  builds it, which is how `vfx-creator` and `asset-kit` already work. It can
  then be read in a diff, re-tinted, and reviewed. A `.rbxm` is kept only for
  what no script rebuilds.
- **Binaries in Git LFS.** Every image, audio file, mesh, and `.rbxm` the item
  needs is kept as its original file. Each machine needs `git-lfs`, or a clone
  holds pointer files.
- **Roblox ids are per owner.** The source file is the item, and an id is a
  cached upload of it. An animation plays only in experiences its owner
  publishes, and audio needs its owner's permission elsewhere. `item.json` maps
  each owner (`group:<id>`, `user:<id>`) to its id.
- **`needs` links the pieces of a mechanic.** A search returns them together,
  so a feature does not ship without its effect or its sound.
- **Tags in one form**: lowercase, singular, English (`tree`, `pine`), with
  `style` for the look (`stud`, `low-poly`) and `uses` for the purpose. A set
  of pieces that belong together, such as Stud Trees, is one item, a pack, and
  each piece has its own tags. The library README is canonical for both.
- **Games are derived, never written as tags.** The game an item came from is
  in `origin.repo`, and the games that use it record it in their
  `sandblock-library.json`. Readers show both as `game:<slug>` tags. Written
  into `item.json`, every adoption would need a merge request just to stay
  true.
- **No committed index.** The app reads every `item.json` when it searches. A
  generated index would conflict between any two open requests.

Rejected:

- **Roblox packages or the Toolbox as the source.** They are binary, untagged,
  and bound to an owner, and their diffs cannot be reviewed. Packages remain a
  way to move models between places
  ([`CROSS_PLACE_MODEL_TRANSFER.md`](CROSS_PLACE_MODEL_TRANSFER.md)).
- **Google Drive.** It has no review and no versions. It stays the home of
  thumbnails ([SB-026](DECISIONS.md#sb-026--thumbnail-lineage-lives-in-drive-and-the-board-draws-it)).
- **Wally for library code.** It needs a hosted registry, and games adapt the
  code they take. Wally stays for third-party packages.

## Reading the library

**Current: the checkout.** A game's agents read the library as a git
checkout, with no tool of the app's. The machine's checkout is the
workspace's `sandblock-library/`
(`$HOME/sandblock/sandblock-code-workspace/sandblock-library`), or the path in
`SANDBLOCK_LIBRARY`. Every pass starts with `git pull --ff-only`, and agents
only read: they never commit, branch or check out there. The Conductor runs every
agent without permission prompts (`--permission-mode
bypassPermissions`), so an agent reads the checkout at its
absolute path from the game's checkout or from its worktree, and needs no
`--add-dir`. The pull uses the machine's own SSH access to GitLab.

- The **Reuse scout** of each game's team searches it with `grep` and `jq`
  over every `item.json`, reads the READMEs and looks at the previews, then
  annotates each task of the plan with the item to start from
  ([pipeline §3](AGENT_GAME_PIPELINE.md#3-reuse)).
- The **workers** take the item their task names: its `needs` first, its
  `install.files` copied or its `install.build` run in their own copy, then
  adapted, with owner-bound assets uploaded again under the game's owner.
  They record it in `sandblock-library.json` ([below](#what-a-game-records)).
- Both follow the `library-reuse` skill in `sandblock-skills`.

**Later, maybe: tools on the gateway.** Three tools on the project endpoint
would form one search surface for every content type:

| Tool | Does |
| --- | --- |
| `search_library` | Takes `query`, and optionally `type`, `tags`, and `style`. Returns matching items with their summary, version, preview, and `needs`. |
| `get_library_item` | Takes an `id`. Returns its `item.json`, `README.md`, file list, and previews as images. |
| `use_library_item` | Takes an `id`, and optionally `place`. Takes the item into the game. |

What `use_library_item` does depends on the item:

| Item | Effect |
| --- | --- |
| Systems, UI | Copies `install.files` into the game repository, and reports any Wally package in `packages` that `wally.toml` lacks. |
| VFX, kits with a `build` | Runs the build in the addressed place, which is a worker's own copy. |
| Models with a `.rbxm` | Inserts it under `install.parent`. |
| Sounds, animations, images | Returns the ids for the game's owner. |

Before any of this, each of the item's assets is resolved for the owner of the
addressed place, the same owner `upload_assets` uploads for
([SB-025](DECISIONS.md#sb-025--agents-upload-every-kind-of-asset-through-one-tool)).
An id that owner already has is reused. Otherwise the source is uploaded.

These tools would read `main` of the same checkout, or the app's own clone
on a machine without the workspace
([`MACHINE_SETUP_AND_UPDATES.md`](MACHINE_SETUP_AND_UPDATES.md)), fetched when
a project window opens. Reading needs only the person's own GitLab access.
They are worth building only if reading the checkout proves too slow or too
loose for the agents.

Searching stays conditional either way
([SB-011](DECISIONS.md#sb-011--reuse-search-is-conditional)): the plan's
tasks are all checked once, while fixes and balancing skip the search.

## The Library view (later, maybe)

Sandblock Code shows the library in a **Library** page of every project
window, beside Assets and Thumbnails, and from the launcher, to browse it
without opening a game.

- **Grid.** One card per item, with its preview, name, type, version, and
  tags. A pack shows how many pieces it has.
- **Filters.** Text, type, tags, style, and game (`game:<slug>`, the game it
  came from or a game that uses it). The tag lists come from the library, with
  how many items carry each tag.
- **Item page.**
  - Its previews, and a pack's pieces as a grid.
  - Its README, rendered.
  - Its files, with code highlighted: a system's modules, an effect's build
    script.
  - What it `needs` and what needs it, as linked cards.
  - Its assets with their ids per owner, and a play button for sounds.
  - Where it came from, with a link to the commit, and the games that use it.
  - Its history: the commits that changed its folder.
- **In a project window**, two more things.
  - A **Used here** filter, and badges when the game's copy was changed or a
    newer version exists.
  - **Use in this game**, which does what `use_library_item` does.
- **Proposals.** The library agent's open merge requests appear as pending
  cards with their preview. Merging stays in GitLab, under the person's own
  account.

The view reads the local checkout, so browsing needs no network. Proposals and
the games that use each item come from the GitLab API with the person's own
`read_api` token
([`MACHINE_SETUP_AND_UPDATES.md`](MACHINE_SETUP_AND_UPDATES.md#the-gitlab-token)):
the open requests, and each game's `sandblock-library.json` for the games of
the `game` topic. The app never needs write access to GitLab.

## Renders (target)

Every item that can be seen gets rendered previews, so the Library view shows
it and a reviewer sees it before merging.

**Built from its code, in a scratch place.** The agent never opens a game's
place, not even a copy. It opens a scratch place
([SB-031](DECISIONS.md#sb-031--scratch-places-blank-studios-outside-every-project)),
a Studio that belongs to no project:

1. It opens a blank place, or a `rojo build` of the game's code when a menu
   needs the game's modules and packages.
2. It builds the item there from the item's own files: its build script, its
   modules, its asset ids. Sources that have no id yet are uploaded with
   `upload_assets`, naming the owner.
3. It captures the item, then closes the place, which deletes it.

Building there also checks the item for free. The place holds nothing from the
game's world, so an item whose build fails there still depends on its game.

**With tools the gateway already has:**

| Item | Render | Tools |
| --- | --- | --- |
| Models and kits | A square icon without background for the card, and turntable angles for the item page. A pack also gets an icon per piece, for `pieces[].preview`. | `get_model_icon`, `capture_turntable` |
| UI and menus | Mounted in a ScreenGui with sample data, then rendered | `render_gui_element` |
| VFX | Frozen frames of the effect, taken the way the `vfx-creator` filmstrip takes them | its capture snippets |
| Sounds, animations | Nothing; the view plays a sound | — |

The library agent's session is not connected to the scratch endpoint. It calls
it with the library's `scripts/mcp-call.py --scratch`, which also saves the
images a tool returns. The agent looks at every image and commits the renders
as `previews` in the request.

When a render cannot happen, the item is proposed with the label
`preview-missing`, with the reason: for example Sandblock Code is not running,
or it is too old to have scratch places. Re-rendering from the Library view is
later work.

## What a game records

Every game has `sandblock-library.json` at its root, committed with the game.
The boilerplate ships it empty. The worker that takes an item writes its
entry on its branch, and the Lead dev's merge keeps the entries of both sides.
(Later, `use_library_item` would write it.) It follows the same principle as
the skills manifest, `.claude/sandblock-skills.json`
([SB-021](DECISIONS.md#sb-021--shared-agent-skills-live-in-sandblock-skills)):

```json
{
  "library": "git@ssh.git.shulkr.net:roblox/sandblock-library.git",
  "owner": "group:1234567",
  "items": {
    "systems/daily-rewards": {
      "version": "1.2.0",
      "commit": "0123abc",
      "files": { "src/server/services/DailyRewardsService.luau": "<sha256>" }
    },
    "vfx/lightning-strike": { "version": "1.0.0", "commit": "0123abc" }
  },
  "ids": {
    "vfx/lightning-strike": { "sources/bolt.png": { "group:1234567": 98765432 } }
  }
}
```

- `owner` is the Roblox owner of the game's places (`group:<id>` or
  `user:<id>`), which the ids under `ids` belong to. The Lead dev fills it
  from the real place (`game.CreatorType`, `game.CreatorId`). A worker in a
  copy names it to `upload_assets`, since a copy has no owner of its own.
- `items` holds one entry per item taken, its `needs` included: its
  `version` and the library `commit` it was read at. Only items with copied
  files have `files`.
- `files` holds a fingerprint of each copied file, as it came from the
  library. A copy changed in the game
  is reported and never overwritten without asking. The library agent reads
  the change as a possible new version of the item.
- `ids` holds the uploads made for this game's owner, until the library agent
  adds them to the item.
- Taking an item again updates it. An older version is found again through the
  recorded commit.

## The library agent

**Current, since 2026-11-17: a morning timer on the always-on PC.** The
runner is `~/sandblock/library-daily` (its README is canonical for how it
runs), started by the systemd `--user` timer `library-daily.timer`. It
replaced the Library Curator of Paperclip's Sandblock Labs, whose routine
"Scan quotidien de la bibliothèque" (10:00) never scanned a game and stopped
with Paperclip (SB-042).

- **When.** Once a day at 8:30, or at boot when the PC was off then.
- **Only when few Studios run.** It first asks Windows how many Studios are
  open and how much memory is free. With more than two Studios, or less than
  4 GB free, it does not pass that day, sends nothing, and tries again the
  next morning.
- **What the runner does without AI.** It lists the games of the PC: every
  folder of `~/sandblock` with a `*.project.json`, a Git repository and a
  `main` branch, minus an exclusion list. For each game it takes whichever
  `main` is ahead, GitLab's or the local one, since the Conductor merges
  locally. It reads the game's scan log, keeps the games whose head the last
  comment does not name, and finds the human review comments not answered
  yet. With nothing new, it stops there. Otherwise it clones the games that
  moved into a temporary folder.
- **The agent.** `claude -p` runs with Opus 5.5 in the machine's
  `sandblock-library` checkout, so it follows that repository's `AGENTS.md`
  and its `library-scan` skill. The runner's prompt gives it the games, the
  clones and the reviews, and says whether renders are allowed. It runs in
  `dontAsk` mode under the library's `.claude/settings.json`: anything else
  is refused, and the report says so. A pass is capped at $20 and 3 hours.
- **The report** goes to Romain as a Discord DM: the reviews answered, the
  games, and what waits on a human. Then each request opened gets its own
  card: a French sentence on what the item brings, up to four previews read
  from the branch, and the buttons « Approuver » and « Me rappeler plus
  tard ». The Discord bot relays a click to the runner's `bin/library.py`.
  « Approuver » merges the request with a token kept apart from the agent's: a
  project access token of the library, with the Maintainer role. Clicking it is
  the human promotion SB-013 asks for, made from Discord instead of GitLab.
  « Me rappeler plus tard » sends the card again the next morning, before the
  Studio check.

Each pass follows the library's `library-scan` skill, with the games already
chosen and cloned by the runner:

1. Answer the human review comments first.
2. For each game that moved, scan it from its clone, render its items in
   scratch places ([Renders](#renders-target)), open the requests, and
   comment on the scan log, naming the head scanned. The runner reads that
   comment the next morning.
3. The runner deletes the clones.

**Renders are skipped** when a Studio older than the newest installed version
is open. On 2026-11-10, a newer Studio launched next to older ones signed
every Studio out. Its visual items are then labelled `preview-missing`.

The pass never uses a checkout someone works in, and never opens a game in
Sandblock Code. Only `main` is read, because a branch is not reviewed yet.

Renders need Sandblock Code running and a Studio signed in on that machine,
and its WSL must run in the signed-in Windows session: `sandblock-code`
refuses to start an app in session 0, where it could not be shown. When
renders cannot happen, the scan still proposes, and labels its visual items
`preview-missing`.

A scan on demand is the same pass, run for one game:
`~/sandblock/library-daily/bin/daily.py --force --game <folder>`.

It works in its own worktree of the library, at
`<repo parent>/.worktrees/sandblock-library/<branch slug>`, the location rule
of [SB-029](DECISIONS.md#sb-029--each-agent-codes-in-a-worktree-and-tests-in-a-copy-it-serves).
It opens at most ten requests per pass, so the first scan of a long history
does not flood the review.

It is never started by an orchestrator or a worker, and a game's agents never
get its tokens. "Adding to the library" means opening the request; the item is
added when a human merges it.

Its rules are in the library's `AGENTS.md`: the scan, the bar an item must
pass, the tags, renders, and how to write an item and open its request.

## Credentials

Both tokens are kept in `sandblock-code/.env`, which is ignored by Git and
readable by its owner only. The `library-scan` skill reads them from the
environment first, then from that file.

| Variable | Account | Reaches | Scopes | Expires |
| --- | --- | --- | --- | --- |
| `SANDBLOCK_LIBRARY_TOKEN` | `SandblockCodeAutomation`, a project service account | the library (project 160), as Developer | `api` | 2027-10-07 |
| `SANDBLOCK_ROBLOX_GAMES_GROUP_TOKEN` | `AutomationCodeLibrary`, a group access token | the group `roblox/games`, as Developer | `api`, `write_repository` | 2026-11-06 |

- **The library token is the only one that writes the library.** It cannot
  push `main` or merge.
- **The games token can write to the games, but the agent never does.** It
  uses that token only to list and clone. This is a rule in the agent's
  `AGENTS.md`, not a GitLab limit: a Reporter role with `read_api` and
  `read_repository` would enforce it.
- **The games token expired on 2026-11-06**, and the daily pass no longer
  needs it. The runner lists the games from the PC's folders and clones them
  over the machine's own SSH access to GitLab, or from the local repository.
  It hands the agent only the library token, through the environment. In
  `dontAsk` mode, `curl -H "PRIVATE-TOKEN: $VAR"` is refused, so the agent
  calls the API through the runner's `bin/gitlab.py`, which reads the token
  itself.

## First content

The first scans should propose:

- the `vfx-creator` worked effects (`DemoImpact`, `TorchFire`, the thunder
  set) and their uploaded sprites;
- stop-the-eruption's volcano kit;
- the animations in `build-tests`;
- the systems of anime-aura-farming.

The runtime player, `VfxPlayer`, ships with the `vfx-creator` skill today.
Making it the item `systems/vfx-player` would leave two copies, so where it
lives is to decide first.

The aura place's 207-effect catalog stays a reference inside `vfx-creator`.
It is Toolbox content, not ours.

## To build

| Piece | Owner | State |
| --- | --- | --- |
| Repository, layout, item format and schema, the agent's rules, the `library-scan` skill | `sandblock-library` | Written |
| A check for items: schema, files, `needs`, LFS | `sandblock-library` | To write |
| Reading the checkout from a game's team: the Reuse scout, the workers' procedure, `sandblock-library.json` | `sandblock-game-boilerplate` (`conductor/`), `sandblock-skills` (`library-reuse`) | Written 2026-10-10; in Throw a Weapon, not yet run |
| `search_library`, `get_library_item`, `use_library_item`, reading and fetching the checkout | `sandblock-code` | Later, maybe |
| The Library view: a page in each project window and in the launcher | `sandblock-code` | Later, maybe |
| The daily pass: `library-daily.timer` at 8:30, only when few Studios run | `~/sandblock/library-daily` on the always-on PC | Set up 2026-11-17; first pass pending |
| Proposal cards with « Approuver » and « Me rappeler plus tard » | `~/sandblock/library-daily` (`cards.py`, `library.py`), `sandblock-discord-bot` (`src/library.ts`) | Built 2026-11-17; the merge token is still to create |
| The library's `AGENTS.md` and `library-scan` skill still name Paperclip and the games token; the runner's prompt overrides them | `sandblock-library`, a merge request | To update |
| Scratch places: `/scratch/mcp`, `open_scratch_place`, `close_scratch_place`, a blank place, uploads that name their owner | `sandblock-code`, `sandblock-studio-plugin` | Implemented; opening and connecting validated in Studio, renders not yet ([SB-031](DECISIONS.md#sb-031--scratch-places-blank-studios-outside-every-project)) |
| `download_assets` for the library agent: it changes no place, but the capture endpoint does not list it | `sandblock-code` | To decide |
| Inserting a `.rbxm` from a file | `sandblock-studio-plugin` | To build and validate (`SerializationService:DeserializeInstancesAsync` is the assumed path) |
| `git-lfs` on each machine | machine setup | Missing on the WSL machine this was written on |
| The reuse agent's skill | `sandblock-skills` | `library-reuse`, 2026-10-10 |

## To validate with Roblox

- Whether images and meshes uploaded by one owner render in another owner's
  experiences. This was assumed, and animations and audio are known not to.
  `vfx-creator` records the opposite for particle textures (a user's upload
  drew nothing in a group's game), so a worker checks that every image
  draws in its copy.
- Whether every game is published under one group. If so, most items need one
  id.
- The `.rbxm` insertion path above.
- Whether Studio runs unattended on the always-on machine for the daily
  renders, in an open Windows session and signed in.
- Whether a scratch place, unpublished and with `PlaceId` 0, shows images and
  meshes owned by the games' group.

## Ownership

- `sandblock-library`: the content, the item format, the schema, the library
  agent's rules, and its `library-scan` skill.
- `sandblock-code`: the reading tools, the Library view, and the scratch
  places the renders use.
- `sandblock-studio-plugin`: inserting a `.rbxm`.
- `sandblock-skills`: the skills that make items (`vfx-creator`, `asset-kit`,
  and the others) and the reuse agent's skill, `library-reuse`.
- `sandblock-game-boilerplate`: the Reuse scout and the workers' procedure in
  its `conductor/`, and the empty `sandblock-library.json` every game starts
  with.
- Each game: its `sandblock-library.json`.
