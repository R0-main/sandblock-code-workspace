# Sandblock Library

## Status

**Target, with its storage in place.** The repository exists:
`roblox/sandblock-library` (GitLab project 160), cloned in the workspace as
`sandblock-library/`. Its README is canonical for the layout and the item
format, and its `AGENTS.md` for the library agent's rules. Git LFS is on, a
service account can propose but not merge, and `main` is protected. Nothing
reads or writes the library yet: it holds no item, no tool searches it, the
app has no Library view, and the daily `/loop` does not run. The accepted decision is
[SB-030](DECISIONS.md#sb-030--one-library-agent-proposes-reusable-content-a-human-merges-it).
The list of content types stays canonical in
[`ROBLOX_DEVELOPMENT_WORKFLOW.md`](ROBLOX_DEVELOPMENT_WORKFLOW.md#library-content-types).

## Goal

A game takes what it needs from earlier games instead of building it again,
and takes a whole mechanic: its code, its menu, its effect, its model, and its
sound.

```text
every game's main ──/loop daily──▶ library agent ──merge request──▶ human merges ──▶ main
                                                                                          │
Library view in Sandblock Code ◀──────────────────────────────────────────────────────────┤
reuse agent, workers ◀──── search_library, use_library_item ◀─────────────────────────────┘
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

## Reading the library (target)

Three tools on the project endpoint form one search surface for every content
type:

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

The app reads `main` of a library checkout. That is the workspace's
`sandblock-library/`, or its own clone on a machine without the workspace
([`MACHINE_SETUP_AND_UPDATES.md`](MACHINE_SETUP_AND_UPDATES.md)), fetched when
a project window opens. Reading needs only the person's own GitLab access.

The reuse agent searches while it annotates the plan
([pipeline §3](AGENT_GAME_PIPELINE.md#3-reuse)), and workers take the items
named in their task. Searching stays conditional
([SB-011](DECISIONS.md#sb-011--reuse-search-is-conditional)).

## The Library view (target)

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

Until scratch places exist, items that can be seen are proposed with the label
`preview-missing`. Re-rendering from the Library view is later work.

## What a game records

`use_library_item` writes `sandblock-library.json` at the game's root, and it
is committed with the game. It follows the same principle as the skills
manifest, `.claude/sandblock-skills.json`
([SB-021](DECISIONS.md#sb-021--shared-agent-skills-live-in-sandblock-skills)):

```json
{
  "library": "git@ssh.git.shulkr.net:roblox/sandblock-library.git",
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

- `files` holds a fingerprint of each copied file. A copy changed in the game
  is reported and never overwritten without asking. The library agent reads
  the change as a possible new version of the item.
- `ids` holds the uploads made for this game's owner, until the library agent
  adds them to the item.
- Taking an item again updates it. An older version is found again through the
  recorded commit.

## The library agent

It runs as a **Claude Code `/loop`**, in a session on the always-on machine
whose working directory is a checkout of `sandblock-library`:

```text
/loop 24h /library-scan
```

Each pass follows the library's `library-scan` skill:

1. List the games in the GitLab group `roblox/games`.
2. Compare the head of each game's `main` with the last commit in its scan
   log. A game that has not moved is skipped.
3. For each game that moved:
   1. Clone it into a temporary folder with the games token.
   2. Scan it, render its items in scratch places ([Renders](#renders-target)),
      open the requests, and comment on the scan log.
   3. Delete the clone.

The pass never uses a checkout someone works in, and never opens a game in
Sandblock Code. Only `main` is read, because a branch is not reviewed yet.

Renders need Sandblock Code running and a Studio signed in on that machine,
and its WSL must run in the signed-in Windows session: `sandblock-code`
refuses to start an app in session 0, where it could not be shown. When
renders cannot happen, the scan still proposes, and labels its visual items
`preview-missing`.

A scan on demand is the same skill, asked for one game.

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
- **The games token reaches no game yet**, checked 2026-10-07.
  `roblox/games` is empty, while the games are in `roblox/`, its other
  subgroups, and `JustRomain/`. They must move into `roblox/games`, or the
  token must be created where they are.
- **The games token expires in a month.** It must be renewed before
  2026-11-06, or the daily pass stops listing games.

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
| `search_library`, `get_library_item`, `use_library_item`, reading and fetching the checkout | `sandblock-code` | To build |
| The Library view: a page in each project window and in the launcher | `sandblock-code` | To build |
| The daily pass: a Claude Code session running `/loop 24h /library-scan` on the always-on machine | that machine | To start |
| The games in `roblox/games`, where the games token reaches them | GitLab, a human | To move |
| Scratch places: `/scratch/mcp`, `open_scratch_place`, `close_scratch_place`, a blank baseplate, uploads that name their owner | `sandblock-code`, `sandblock-studio-plugin` | To build ([SB-031](DECISIONS.md#sb-031--scratch-places-blank-studios-outside-every-project)) |
| `download_assets` for the library agent: it changes no place, but the capture endpoint does not list it | `sandblock-code` | To decide |
| Inserting a `.rbxm` from a file | `sandblock-studio-plugin` | To build and validate (`SerializationService:DeserializeInstancesAsync` is the assumed path) |
| `git-lfs` on each machine | machine setup | Missing on the WSL machine this was written on |
| The reuse agent's skill | `sandblock-skills` | To write |

## To validate with Roblox

- Whether images and meshes uploaded by one owner render in another owner's
  experiences. This is assumed; animations and audio are known not to.
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
  and the others) and the reuse agent's skill.
- Each game: its `sandblock-library.json`.
