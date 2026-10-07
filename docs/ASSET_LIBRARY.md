# Sandblock Library

## Status

**Target, with its storage in place.** The repository exists:
`roblox/sandblock-library` (GitLab project 160), cloned in the workspace as
`sandblock-library/`. Its README is canonical for the layout and the item
format, and its `AGENTS.md` for the library agent's rules. Git LFS is on, a
service account can propose but not merge, and `main` is protected. Nothing
reads or writes the library yet: it holds no item, no tool searches it, and the
app does not launch the library agent. The accepted decision is
[SB-030](DECISIONS.md#sb-030--one-library-agent-proposes-reusable-content-a-human-merges-it).
The list of content types stays canonical in
[`ROBLOX_DEVELOPMENT_WORKFLOW.md`](ROBLOX_DEVELOPMENT_WORKFLOW.md#library-content-types).

## Goal

A game takes what it needs from earlier games instead of building it again,
and takes a whole mechanic: its code, its menu, its effect, its model, and its
sound.

```text
game repositories ──read──▶ library agent ──merge request──▶ human merges ──▶ main
                                                                                │
reuse agent, workers ◀──── search_library, use_library_item ◀───────────────────┘
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

GitLab is also the only record of scans. Every request names the game commit
it scanned, so no state file is kept.

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

- **Started by a human** from Sandblock Code, on one game. It is never started
  by an orchestrator or a worker. Running it after a release, without being
  asked, is later work.
- **Given** the game read-only, meaning its repository and its capture endpoint
  ([SB-024](DECISIONS.md#sb-024--a-thumbnail-variant-sees-the-game-read-only-and-can-be-continued)).
  It also gets its own worktree of the library at
  `<repo parent>/.worktrees/sandblock-library/<branch slug>`, the location rule
  of [SB-029](DECISIONS.md#sb-029--each-agent-codes-in-a-worktree-and-tests-in-a-copy-it-serves),
  and the library token for that worktree only.
- **Never given to a game's agents**, and the token is never given to them
  either.
- **Its rules** are in the library's `AGENTS.md`: how to scan, the bar an item
  must pass, how to write an item and open its request.

Until the app launches it, it runs by hand. Start a session in a worktree of
`sandblock-library/`, with `SANDBLOCK_LIBRARY_TOKEN` in its environment, and
point it at a game.

## Credentials

**Current.**

- The service account is `SandblockCodeAutomation`, a GitLab project service
  account and Developer of project 160.
- Its token has the `api` scope and expires on 2027-10-07. It is kept as
  `SANDBLOCK_LIBRARY_TOKEN` in `sandblock-code/.env`, which is ignored by Git
  and readable by its owner only.
- GitLab confines a project service account to its own project, so the token
  cannot read the games. The agent reads them from the machine's own clones.

**Target.** The main process reads the token and hands it only to library
agent runs. It is kept like the Roblox keys
([SB-025](DECISIONS.md#sb-025--agents-upload-every-kind-of-asset-through-one-tool)).

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
| Repository, layout, item format and schema, the agent's rules | `sandblock-library` | Written, not pushed |
| A check for items: schema, files, `needs`, LFS | `sandblock-library` | To write |
| `search_library`, `get_library_item`, `use_library_item`, reading and fetching the checkout | `sandblock-code` | To build |
| Launching the library agent on a game, with the token | `sandblock-code` | To build; by hand until then |
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

## Ownership

- `sandblock-library`: the content, the item format, the schema, and the
  library agent's rules.
- `sandblock-code`: the reading tools, launching the library agent, and the
  token.
- `sandblock-studio-plugin`: inserting a `.rbxm`.
- `sandblock-skills`: the skills that make items (`vfx-creator`, `asset-kit`,
  and the others) and the reuse agent's skill.
- Each game: its `sandblock-library.json`.
