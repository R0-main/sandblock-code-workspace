# Agent game pipeline

## Status

**Target.** This is the pipeline a team of agents follows to build a whole
Roblox game from an idea, much faster than by hand. Parts of it exist:
[worktree copies](WORKTREE_COPIES.md) and the orchestrator's skill
(`roblox-agent-team` in `sandblock-skills`), the thumbnail skills, the
asset and map skills that still live in game repositories, the reuse step
(a Reuse scout reading the [library](ASSET_LIBRARY.md) as a git checkout),
the design calls (a Design challenger asking the board once,
[SB-037](DECISIONS.md#sb-037--a-design-challenger-asks-the-board-once-and-every-agent-reads-the-roblox-dna)),
and the team itself, which every game carries as a Paperclip company
([SB-032](DECISIONS.md#sb-032--a-games-agent-team-is-a-paperclip-company-the-game-carries)). The rest is
described here so it can be built against one plan. It does not replace the
[development workflow](ROBLOX_DEVELOPMENT_WORKFLOW.md): the human approvals,
quality gates and reuse rules there still apply. What comes before the idea
and after the release (trends, ads, analytics, community, live ops, and
Discord as the human surface) is in [`AUTONOMOUS_STUDIO.md`](AUTONOMOUS_STUDIO.md).

## The chain

```text
idea ─▶ GDD ─▶ plan ─▶ reuse check ─▶ design calls ─▶ orchestrator
                                         │
         ┌───────────────────────────────┴───────────────────────────────┐
         ▼                                                               ▼
   build chapters (waves)                                   store, in parallel
   base ─▶ assets ─▶ code ─▶ review ─▶ fixes ─▶ balancing   icon, thumbnails, name,
                                                            description
         └───────────────────────────────┬───────────────────────────────┘
                                         ▼
                                  release (human)
```

Four human checkpoints, and nothing else waits on a person:

1. **GDD approved.**
2. **Plan approved**, once the reuse check has annotated it and the board has
   answered the design challenger's batch (the batch is part of this
   checkpoint, answered once).
3. **Art direction approved**, on the first assets of the asset waves.
4. **Release approved**, after a human playtest that judges the fun.

## Agents

| Agent | Input | Output | Skills |
| --- | --- | --- | --- |
| Design | The idea | A complete GDD | `grill-design`, `grill-me`, `to-questionnaire` |
| Planner | The GDD | `docs/PLAN.md`: tasks, their agent, dependencies, waves | `to-tasks` |
| Reuse scout | The plan's tasks, then tasks added later | Each task annotated with the library item it starts from, or "nothing" | `library-reuse` ([the library](ASSET_LIBRARY.md), read as a git checkout) |
| Design challenger | The GDD and the draft plan, after the reuse check | One batch of questions for the board, each with a recommendation and a copy-paste answer block; the answers become the GDD's design calls | `design-challenge` |
| Orchestrator / lead dev | The plan | Waves run, branches merged, builds transferred | `roblox-agent-team` |
| Art director | The GDD, then the Thumbnail artist's images | The art direction and concept art the asset waves follow; then the store page (`roblox-store.yml`: title, description, the chosen icon and thumbnails), which it publishes once the board confirms it | `roblox-game-conventions` |
| Asset agents, one per trade | One asset task each | A build in their copy | Modeler: `stud-models`, `asset-kit`. Map builder: `stud-map`, `map-builder`, `map-assembly`, `asset-kit`. UI designer: the game's UI skill, `roblox-game-conventions`, `controller-glyphs`. VFX artist: `vfx-creator`. Animator: `stud-animations`. Sound designer: `sound-effects` |
| Code agents | One feature each | Code and tests on their branch | The game's Project Skill, `tdd`, the packages' skills |
| Reviewer / tester | The merged game | A fix list | `roblox-game-review`, `roblox-game-conventions` |
| Balancing | The fixed game and the GDD's targets | Tuned economy and progression numbers, with proof | `game-balancing` |
| Thumbnail artist | GDD, art direction | Square icon, thumbnails to test in ads | `roblox-thumbnails`, `roblox-thumbnail-variant` |

Every agent reads `roblox-game-dna` (`sandblock-skills`) at the start of every
run: what makes a Roblox game a Roblox game, with a short block per role in its
instructions.

On a Paperclip team the agents are organized in departments (art under the Art
director, the Planner, the Reuse scout, the Design challenger and the Balancer
under the Game designer), and the trades
meet in a task tree with one issue per feature and one task per trade under it
([SB-032](DECISIONS.md#sb-032--a-games-agent-team-is-a-paperclip-company-the-game-carries)).

## 1. Idea to GDD

The design agent questions the idea until every system, screen, and number the
build needs is decided, and records it as the GDD. A value the GDD leaves "to
be defined later" blocks the tasks that need it, so the planner sends it back
here rather than guessing.

## 2. Plan

The planner reads the whole GDD and writes `docs/PLAN.md` in the game
repository: the agents' working plan, mirrored to the team's tracker when one
is used. For each task:

- **what** it delivers, and how to check it is done;
- **which agent** does it, and with which skill;
- **what it depends on**: a model before its icon, an icon before the menu
  that shows it;
- **its wave**, from the order below;
- **reuse**: empty until the Reuse scout fills it (§3);
- **acceptance criteria**: written once the design calls are in (§3, "The
  design calls"), each citing a GDD section or a design call (`DC-<n>`).

Waves follow one order, because code written against a hierarchy that later
moves breaks:

1. **Base**: the files every feature touches (remotes, player data, config, UI
   routing) and the packages the game uses. Features only add to them later.
2. **Assets, all of them**: models, map, UI, VFX, animations, sounds. A task
   that depends on another asset goes in a later asset wave.
3. **Code**: one task per feature, in parallel, written against the real
   assets already in the place.

A wave holds at most four workers with a Studio copy: a project runs four live
copies at once. A code task whose whole check is headless (pure logic, the
save, config, remotes) is marked `no-studio`: its worker codes and tests in its
worktree only, outside the four, and starts as soon as its blockers have
landed instead of waiting for its wave, so pure logic is built while the asset
waves run. At most four run at once.

## 3. Reuse

**Current** in the boilerplate's team (2026-10-10), not yet run on a game.
Once the Planner has created the plan's tasks, and before the plan goes to the
board, the Reuse scout goes through every task and looks for an item of the
[library](ASSET_LIBRARY.md) to start from. The board then confirms a plan that
already says what is reused.

- **How it reads the library.** As a git checkout: the machine's
  `sandblock-library` (by default
  `$HOME/sandblock/sandblock-code-workspace/sandblock-library`, or
  `SANDBLOCK_LIBRARY`), which it updates with `git pull --ff-only` and
  searches with `grep` and `jq` over the `item.json` files, the READMEs and
  the previews (the `library-reuse` skill). Paperclip runs agents without
  permission prompts, so an agent working in the game's checkout or in a
  worktree reads it at its absolute path. No gateway tool is involved.
- **What it writes.** On each task, one comment: the item and its version,
  the library commit, what it `needs`, how to install it (`build` and what it
  `produces`, or the files to copy), what to adapt, and its asset ids that the
  game's owner does not own. A match also gets the label `library`. With no
  match it writes "nothing in the library, build from scratch". The Planner
  copies the verdicts into the `Reuse:` line of each task in `docs/PLAN.md`.
- **What it never does.** It never writes the library, and never changes a
  task's scope. A task the library would change significantly becomes a
  question issue to the Game designer.
- **Again later.** Tasks added after the plan (a board request, a feature the
  plan missed) wait on a `Reuse · …` issue before anyone is assigned. Fixes
  and balancing skip it ([SB-011](DECISIONS.md#sb-011--reuse-search-is-conditional)).
- **The worker** starts from the item its task names. It brings the item's
  `needs` first, runs its `build.luau` in its own copy or copies its files,
  adapts it, and uploads again under the game's owner the animations and
  sounds that owner does not own. It records the item, its version and the
  library commit in the game's `sandblock-library.json`.

**Later, maybe:** the gateway tools `search_library`, `get_library_item` and
`use_library_item` would do the same through the project endpoint
([`ASSET_LIBRARY.md`](ASSET_LIBRARY.md#reading-the-library)).

Nothing in this pipeline writes the library. What a game adds to it is decided
afterwards by the library agent, started by a human, and merged by a human
([`ASSET_LIBRARY.md`](ASSET_LIBRARY.md#one-writer)).

### The design calls

**Current** in the boilerplate's and Throw a Weapon's team (2026-10-10), not
yet run on a plan
([SB-037](DECISIONS.md#sb-037--a-design-challenger-asks-the-board-once-and-every-agent-reads-the-roblox-dna)).
Once the reuse annotations are in, the Design challenger reads the GDD with the
draft plan, applying `roblox-game-dna` and its challenger questions, and asks
the board everything that changes what is built, once:

- **Triage.** Values the GDD leaves to tune are the Balancer's, never asked.
  Only what changes a task, a system, a screen or a product goes to the board;
  minor points are listed as assumptions, decided by the recommendation.
- **The batch**, in French: grouped by feature, deduplicated, numbered by
  impact, each question with the tasks it changes, options when useful and a
  recommendation; then a copy-paste block pre-filled with the
  recommendations. The Project manager posts it unchanged and brings the
  reply back verbatim. Partial answers ("ok sauf 3 et 7") are fine: the
  challenger asks once more only for what is left, then takes its
  recommendation « par défaut ».
- **One home.** The Game designer records the answers as `DC-<n>` entries in
  the GDD's "Design calls" section; the Planner adjusts the tasks and gives
  each acceptance criteria citing them. Then the board confirms the plan.
- **Again later** only for added tasks that raise a new question.

## 4. Build chapters

The orchestrator runs the waves as `roblox-agent-team` describes: one branch,
one worktree, and one Studio copy per worker, every copy of a wave opened at
the same saved version. The real place is a Team Create place and autosaves;
the next wave opens only from a version saved after the last transfer.

- **Asset workers** build in their copy, group the build under one Folder or
  Model, and the orchestrator transfers it into the real place.
- **Code workers** code against the real assets in their copy. The map is
  built in parallel by its own workers; until a zone is in, code uses
  placeholders there: transparent coloured parts with a billboard naming what
  they stand for.
- **Each code worker tests its own feature**: the boilerplate's code tests,
  then a test in its own Studio through Konsole commands and `execute_luau`.
  A `no-studio` task stops at the code tests; the orchestrator's test of the
  merged real place is its Studio check.
- The orchestrator reviews and merges each branch, transfers each build, tests
  the merged result, and cleans up.

After the assets, a VFX pass and an animation pass add effects and animated
props, as asset waves of their own.

## 5. Review session

When every feature is merged, the reviewer runs one long test session on the
whole game, in a copy of the real place:

- every loop and screen of the GDD, end to end, as a new player and as a
  late-game one;
- the team conventions (`roblox-game-conventions`): shop buttons, HUD and
  menus, prompts, streaming, gamepad, mobile;
- the code review of what was merged.

It writes a **fix list**: each issue with how to reproduce it, what the GDD
expects, and how serious it is. The orchestrator turns it into fix tasks and
runs them as waves, then the reviewer checks again. The loop ends when the
list holds nothing blocking.

## 6. Balancing

Once the game works, the balancing agent tunes its numbers before anyone
playtests it: prices, income curves, rebirth and zone gates, rewards, offline
earnings, drop rates. It measures the pacing the GDD asks for (how long to
reach each milestone, for a free player and a paying one), changes the
numbers, and proves each change with the same measurement. A change to what a
saved number means comes with a migration for existing saves.

Its changes go through a branch and the orchestrator like any other. Then a
human playtests the game, which is the release checkpoint.

## 7. Store, in parallel

Started once the GDD and the art direction are approved, beside the build:

- **Thumbnail artist**: the square game icon, and several thumbnails to test
  against each other in Roblox ads. The thumbnail skills start from what
  performs in the genre and change one thing per variant; the app's Thumbnails
  tab keeps the lineage.
- **Art director**: the store page. It writes the game's name and description
  for the genre's search terms, chooses the icon and the thumbnails among the
  Thumbnail artist's, and declares them in `roblox-store.yml`. Once the Lead
  dev has merged it and the board has confirmed it, the Art director alone
  publishes it with `publish_store_page`
  ([SB-033](DECISIONS.md#sb-033--the-store-page-is-a-file-in-the-game-published-with-the-connected-account)).

Launching the ads and choosing the winners stay with the Head of Roblox Pole.

## What is missing

| Piece | State |
| --- | --- |
| Planner skill, writing `docs/PLAN.md` | `to-tasks` v1 in `sandblock-skills` (2026-10-07); to improve by iteration |
| Reuse agent | The Reuse scout and `library-reuse` (2026-10-10), reading the library's checkout directly; in the boilerplate and Throw a Weapon's `paperclip/`, first run on Throw a Weapon's plan (THR-131) |
| Design challenge and the Roblox DNA | The Design challenger, `design-challenge` and `roblox-game-dna` (2026-10-10, SB-037); in the boilerplate and Throw a Weapon, not yet run. The DNA's game-feel and genre references are stubs, still being researched |
| Asset and map skills in `sandblock-skills` | Gathered 2026-10-07 with their tools; games get them through `scripts/sync-skills.sh`. Still per game: `aura-icons`, `create-boss`, `ui-builder` |
| Reviewer skill: the test session and the fix list format | `roblox-game-review` v1 in `sandblock-skills` (2026-10-07); to improve by iteration |
| Generic balancing skill | `game-balancing` v1 in `sandblock-skills` (2026-10-07), AAF's model as the worked example; to improve by iteration |
| Setting the game's name, description, icon and thumbnails from an agent | `roblox-store.yml` and `publish_store_page` in `sandblock-code` ([SB-033](DECISIONS.md#sb-033--the-store-page-is-a-file-in-the-game-published-with-the-connected-account)), not yet run against a real game. In the boilerplate, the Art director writes and publishes it |
| Running it all from one place (Paperclip roles) | `paperclip/` and `scripts/paperclip-team.sh` in `sandblock-game-boilerplate` ([SB-032](DECISIONS.md#sb-032--a-games-agent-team-is-a-paperclip-company-the-game-carries), 2026-10-07): one Paperclip company per game, with the Reuse scout and the Design challenger since 2026-10-10. Tested on a disposable game, not yet through a whole wave |
