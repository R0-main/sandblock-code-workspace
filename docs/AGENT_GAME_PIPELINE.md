# Agent game pipeline

## Status

**Target.** This is the pipeline a team of agents follows to build a whole
Roblox game from an idea, much faster than by hand. Parts of it exist:
[worktree copies](WORKTREE_COPIES.md) and the orchestrator's skill
(`roblox-agent-team` in `sandblock-skills`), the thumbnail skills, the
asset and map skills that still live in game repositories, and the team
itself, which every game carries as a Paperclip company
([SB-032](DECISIONS.md#sb-032--a-games-agent-team-is-a-paperclip-company-the-game-carries)). The rest is
described here so it can be built against one plan. It does not replace the
[development workflow](ROBLOX_DEVELOPMENT_WORKFLOW.md): the human approvals,
quality gates and reuse rules there still apply. What comes before the idea
and after the release (trends, ads, analytics, community, live ops, and
Discord as the human surface) is in [`AUTONOMOUS_STUDIO.md`](AUTONOMOUS_STUDIO.md).

## The chain

```text
idea ─▶ GDD ─▶ plan ─▶ reuse check ─▶ orchestrator
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
2. **Plan approved.**
3. **Art direction approved**, on the first assets of the asset waves.
4. **Release approved**, after a human playtest that judges the fun.

## Agents

| Agent | Input | Output | Skills |
| --- | --- | --- | --- |
| Design | The idea | A complete GDD | `grill-design`, `grill-me`, `to-questionnaire` |
| Planner | The GDD | `docs/PLAN.md`: tasks, their agent, dependencies, waves | `to-tasks` |
| Reuse | The plan | Each task annotated with what already exists | `search_library` ([the library](ASSET_LIBRARY.md); tools to build) |
| Orchestrator / lead dev | The plan | Waves run, branches merged, builds transferred | `roblox-agent-team` |
| Art director | The GDD | The art direction and concept art the asset waves follow | `roblox-game-conventions` |
| Asset agents, one per trade | One asset task each | A build in their copy | Modeler: `stud-models`, `asset-kit`. Map builder: `stud-map`, `map-builder`, `map-assembly`, `asset-kit`. UI designer: the game's UI skill, `roblox-game-conventions`, `controller-glyphs`. VFX artist: `vfx-creator`. Animator: `stud-animations`. Sound designer: `sound-effects` |
| Code agents | One feature each | Code and tests on their branch | The game's Project Skill, `tdd`, the packages' skills |
| Reviewer / tester | The merged game | A fix list | `roblox-game-review`, `roblox-game-conventions` |
| Balancing | The fixed game and the GDD's targets | Tuned economy and progression numbers, with proof | `game-balancing` |
| Thumbnail artist | GDD, art direction | Square icon, thumbnails to test in ads | `roblox-thumbnails`, `roblox-thumbnail-variant` |
| Store copy | GDD | Game name and description, localized | `roblox-localization` |

On a Paperclip team the agents are organized in departments (art under the Art
director, the Planner and the Balancer under the Game designer), and the trades
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
- **reuse**: empty until the reuse agent fills it.

Waves follow one order, because code written against a hierarchy that later
moves breaks:

1. **Base**: the files every feature touches (remotes, player data, config, UI
   routing) and the packages the game uses. Features only add to them later.
2. **Assets, all of them**: models, map, UI, VFX, animations, sounds. A task
   that depends on another asset goes in a later asset wave.
3. **Code**: one task per feature, in parallel, written against the real
   assets already in the place.

A wave holds at most four workers: a project runs four live copies at once.

## 3. Reuse

The reuse agent goes through the plan and, for each task, looks for code or an
asset the team already has. When it finds one, it writes the item's id (such as
`vfx/lightning-strike`) into the task, and the worker takes it with
`use_library_item` instead of starting from nothing.

It searches the global [library](ASSET_LIBRARY.md). Its storage exists but
its reading tools do not yet; until they do, this step is skipped, or done by
hand on earlier games' repositories.

Nothing in this pipeline writes the library. What a game adds to it is decided
afterwards by the library agent, started by a human, and merged by a human
([`ASSET_LIBRARY.md`](ASSET_LIBRARY.md#one-writer)).

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
- **Store copy**: the game's name and description, written for the genre's
  search terms, then localized.

Launching the ads and choosing the winners stay with the Head of Roblox Pole.

## What is missing

| Piece | State |
| --- | --- |
| Planner skill, writing `docs/PLAN.md` | `to-tasks` v1 in `sandblock-skills` (2026-10-07); to improve by iteration |
| Reuse agent | Waits for the library's reading tools (`search_library`, `use_library_item`) |
| Asset and map skills in `sandblock-skills` | Gathered 2026-10-07 with their tools; games get them through `scripts/sync-skills.sh`. Still per game: `aura-icons`, `create-boss`, `ui-builder` |
| Reviewer skill: the test session and the fix list format | `roblox-game-review` v1 in `sandblock-skills` (2026-10-07); to improve by iteration |
| Generic balancing skill | `game-balancing` v1 in `sandblock-skills` (2026-10-07), AAF's model as the worked example; to improve by iteration |
| Setting the game's name and description from an agent | No tool yet |
| Running it all from one place (Paperclip roles) | `paperclip/` and `scripts/paperclip-team.sh` in `sandblock-game-boilerplate` ([SB-032](DECISIONS.md#sb-032--a-games-agent-team-is-a-paperclip-company-the-game-carries), 2026-10-07): one Paperclip company per game, without the reuse agent yet. Tested on a disposable game, not yet through a whole wave |
