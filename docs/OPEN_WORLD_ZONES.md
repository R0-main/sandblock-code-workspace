# Open-world zones

## Status

**Proposal** (2026-10-29), from a brainstorm with Romain for an anime
open-world game (GDD draft: `artifacts/anime-open-world/GAME_DESIGN.md`,
local). Not accepted, nothing built: none of this is Target yet. It extends
the asset waves of the [agent game pipeline](AGENT_GAME_PIPELINE.md) for a map
too big for one map builder and a game with hundreds of models and quests.
What it relies on is labelled **Current** where it exists.

## The chain

```text
graybox ─▶ shared kit ─▶ art direction approved ─▶ zones, in parallel ─▶ quests placed
(played)                                          orchestrator
                                                   ├─▶ model workers (many)
                                                   └─▶ zone assembler
```

## 1. Graybox

The whole map is blocked out first, played, and approved before any art. It is
designed by a human or a map agent on Opus: the city's layout (districts,
landmarks, routes) is the part agents do worst. It carries:

- **Standard dimensions**: street width, door height, character scale. Every
  model is built to them.
- **Named anchors** where quest NPCs, objectives and collectibles go. Quests
  reference them by name (§5).
- **Traversal routes** for the powers (rooftops, climbable walls), tested in
  the graybox.
- **One folder per zone** in the place, so two assemblers never touch the
  same instance.

## 2. Shared kit

Before any zone: the palette, materials, scale references and the props every
zone uses (street furniture, doors, lamps). Built once and approved at the art
direction checkpoint. Zones only model what is their own, so four zones never
build four benches, and never drift into four art directions.

## 3. Zones, in parallel

- **Zone orchestrator**: one task per zone. Its role has `canAddTasks`
  (**Current** in the Conductor: a run's `newTasks` are added after checks on
  ids, roles, deps and cycles,
  [`sandblock-conductor/docs/DESIGN.md`](../sandblock-conductor/docs/DESIGN.md)).
  It reads the zone's graybox and the GDD, checks the shared kit and the
  [library](ASSET_LIBRARY.md), then adds one task per small batch of models
  and one assembly task that depends on them. Tasks rather than subagents, so
  each model keeps its review, retries, triage and usage in the Conductor UI.
- **Model workers**: a few models each. To run many at once they must build
  outside Studio, as `no-studio` tasks: for example Blender run headless (the
  `blender-image-to-3d` skill exports GLB/FBX with a manifest). A model built
  in Studio holds a live copy, and the copy cap below applies to it.
- **Zone assembler**: holds a Studio copy, imports the zone's models and
  places them on the graybox, in its zone's folder only. The lead dev then
  integrates the zone into the real place as for any asset build
  (`integrate`, **Current**).
- **Review in batches**: the art director reviews a contact sheet of a whole
  batch or zone, not each model in its own run.

## 4. Limits

- **Studio**: four live copies per project
  ([`STUDIO_LAUNCH_AND_PLACE_COPIES.md`](STUDIO_LAUNCH_AND_PLACE_COPIES.md)),
  each using one to three gigabytes. At most four zones assemble at once.
- **Runs**: the game's `maxRuns` in `team.yaml` caps runs at once, `no-studio`
  ones included.
- **Quota**: every run shares the Claude subscription's limits (per five-hour
  window and per week). Measure the first zone before scaling the others.
  Opus where the players feel it (map, hero models, VFX, combat), Sonnet or
  Haiku for quest writing.

## 5. Quests as data

The quest mechanics (chase, stealth, escort, timer, puzzle, defense, …) are
coded once. Each quest is a data file written by an agent, in parallel, as a
`no-studio` task: its giver, steps, anchors, items, reward and consequence. A
headless check proves every quest completable: each anchor, NPC and item it
names exists, its reward sits in its tier, nothing locks the player out. Anime
Aura Farming's headless Lune suite (`anime-aura-farming/scripts/test.sh`) is
the model. Quests are produced in bulk and released by episode.

## What is missing

| Piece | State |
| --- | --- |
| Zone orchestrator role and its skill | Not started |
| Zone assembler skill (import, place on anchors, zone folder) | Not started |
| Model workers outside Studio in the Conductor (`no-studio` Blender path, upload) | Not started |
| Batch review by the art director (contact sheet) | Not started |
| Quest data format, mechanics, and the headless completability check | Not started |
| The game itself (repository, GDD approved) | GDD draft v0.1 only |
