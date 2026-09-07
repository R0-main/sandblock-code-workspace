# Roblox development workflow

This workflow applies to Sandblock-owned and client games produced by the
Roblox pole. Sandblock Code accelerates the development loop; it does not own
the product backlog or replace human approvals.

## Roles and sources of truth

- The approved GDD is the source of truth for game scope and intended player
  experience.
- Any team member can contribute to the GDD; the Head of Roblox Pole has the
  final word on GDD, planning, publication, and post-launch Roblox advertising.
- Tasks live in the chosen tracker and are moved to Done manually. A future
  Sandblock platform MCP may automate tracker operations, but it is not part of
  Sandblock Code v0.
- The Project Skill routes coding agents to the approved GDD, architecture,
  conventions, and stable project knowledge.
- Git and tests are the source of truth for the implemented game state.

## From idea to launch

### 1. Approve the GDD

Define the core loop, progression, economy, content, UX, art direction,
monetization, platform requirements, analytics needs, and release goal. Common
Roblox commercial features become required only when the GDD includes them.

Potential GDD items include mobile performance targets, console/gamepad
support, localization, onboarding, daily rewards, shop UX, calls to action,
and like-game or join-group rewards. Their absence must not be silently
converted into implementation scope by an agent.

### 2. Generate the Project Skill

Use the approved GDD together with the Sandblock Roblox coding skill to create a
project-specific context router. It should:

- state the project vision and non-negotiable constraints;
- link to focused references instead of duplicating every fact;
- identify code ownership and important entry points;
- record how to build, test, and visually verify work;
- distinguish current implementation from planned behavior.

The skill is versioned with the game repository. When development changes a
stable rule, product constraint, or context route, update the task tracker,
refresh the skill and affected reference, validate them, then include that
context change in the related Git work. Do not rewrite the skill for incidental
implementation details that the code already explains well.

### 3. Plan work outside Sandblock Code

Break the approved GDD into independently verifiable tasks using Todoist or the
current internal equivalent. Tasks may be assigned to any appropriate team
member or agent. Sandblock Code may launch the work environment, but it does not
become the task database in v0.

Use a branch per feature or task when isolation is useful. A tiny related fix
can remain on the active feature branch. Do not use worktrees for Roblox/Rojo
development.

### 4. Develop in a bound project runtime

Select the project workspace in Sandblock Code, then start the runtime. The app launches
the agent in the repository and connects it to the correct MCP, Rojo runtime,
Project Skill, and main Studio place.

For each task the agent should:

1. read the Project Skill and task-relevant references;
2. inspect current code and repository status before editing;
3. decide whether existing Sandblock systems, models, VFX, sounds, or UI
   assets are relevant;
4. implement the smallest coherent change in native strict Luau;
5. run focused checks, then the repository check suite;
6. use Studio captures when the result is spatial or visual;
7. report evidence, limitations, and any context that must be updated.

The app-provided binding is authoritative. An agent can report its working
directory for diagnostics, but must not reassign the project by passing a new
filesystem path to Studio.

### 5. Review and playtest

Automated tests and static analysis reduce avoidable pushes but do not replace
human play. Validate the changed mechanic locally, then run broader playtests
at the appropriate milestone.

For client games, especially creator-led projects, the client's Discord
community can provide a practical pool of playtesters. Collect observations and
bugs, convert actionable items into normal tasks, and process them one by one or
in parallel. Bug handling is not automatically prioritized or fixed by the
platform.

### 6. Publish and operate

Publication remains a human decision. After launch, evaluate live metrics,
player feedback, crashes, retention, and economy behavior. Roblox Ads Manager
campaigns happen only after launch and are planned manually by the responsible
human.

## Reference game-code architecture

New Sandblock Roblox games use native strict Luau. The proven baseline from the
reference production repository includes:

- Rojo for filesystem-to-Studio mapping;
- Wally for package management;
- Knit and Component for services, controllers, and tagged world behavior;
- Charm plus CharmSync for reactive state replication where appropriate;
- one central typed networking layer with server-authoritative validation;
- Lapis for persistence;
- Trove for lifecycle cleanup;
- Studio-authored UI hydrated from Luau, with Vide reserved for genuinely
  data-driven dynamic views;
- Aftman or its chosen successor for pinned developer tooling;
- Konsole or the repository's approved command/debug surface.

This is a baseline, not a demand to use every package in every feature. Extend
existing project patterns before adding a competing framework.

## Quality gates

Every game repository should provide one deterministic command such as
`./scripts/check.sh`. The reference sequence covers:

1. StyLua formatting checks;
2. Selene linting;
3. `luau-lsp` type checking;
4. documentation or context checks;
5. Lune unit/spec tests;
6. a Rojo build that proves the project tree is valid.

Run the smallest relevant tests during implementation and the complete check
before handoff. Server-authoritative boundaries, persistence, purchases,
rewards, and economy changes deserve focused tests even if the UI appears to
work.

Performance validation must match the GDD and target devices. When mobile or
console support is in scope, verify input, layout, memory, replication, and
frame behavior on those constraints rather than relying on desktop Studio
alone.

## Reuse and asset workflow

### Library content types

Sandblock's global library is **target** behavior. It is designed to hold every
kind of production content a game needs, not code alone:

- reusable Luau systems and utilities such as shops, daily rewards,
  leaderboards, onboarding, or codes;
- 3D models, props, and map or environment kits;
- UI components, layouts, icons, and generated images;
- VFX such as particle rigs, beams, trails, impact and ability effects;
- sounds and music such as SFX, ambience, UI feedback, and loops;
- animations and future asset types.

Items are expected to be searchable through tags and metadata such as category,
visual or audio style, compatible stack, intended use, source project, version,
and approval state.

A mechanic is rarely code alone. When an agent builds one, it should be able to
find the system, the model, the VFX, and the sound through the same search
surface instead of assuming only code and UI are reusable, and it should state
which of those pieces are missing rather than shipping a silent or effectless
feature as if it were complete.

### When to search

Search the library when the task is substantial enough that reuse could save
time or preserve consistency—for example a shop system, daily rewards, a shared
UI pattern, an environment kit, a complex model, the effect for a new ability,
or the SFX for a new interaction.

Skip the search for trivial local edits where no reusable system or asset is
plausibly needed. This keeps the workflow fast and prevents irrelevant context
from flooding the agent.

### Generated assets

When an agent generates an image, model, effect, sound, or other asset through
Sandblock tools:

1. attach it to the active project with useful tags and provenance;
2. inspect it in the relevant UI, Studio, or playback context;
3. revise or reject it if it does not meet the project need;
4. keep it project-local by default;
5. promote it to the global library only after a human explicitly approves the
   promotion.

Current generation tools cover images and thumbnails. Model, VFX, and audio
generation is **later** work; when those tools arrive they inherit the same
review, provenance, and promotion rules rather than defining their own.

The approval can later be delegated to a reliable review agent, but the current
policy is human approval.

## Visual MCP feedback

Use visual tools when they materially verify the result:

- capture map views after placement or spatial changes;
- render GUI elements at relevant sizes after UI changes;
- capture model or turntable views after model changes;
- inspect generated icons and thumbnails before upload;
- compare captures after an iteration when the agent is correcting a visual
  defect;
- capture the effect in its real context after a VFX change, since a particle
  rig judged in isolation rarely reads the same in the scene.

Audio has no equivalent capture. After a sound change, report what was added,
where it is triggered, and its volume or looping behavior, and leave the
subjective check to a human listening pass.

The goal is evidence, not screenshot volume. A pure refactor with unchanged
rendered behavior usually needs tests, not a decorative capture.

## Handoff checklist

Before a task is marked Done manually, confirm that:

- the implementation matches an approved task and GDD scope;
- relevant focused tests and the repository check command pass;
- server authority, cleanup, and persistence implications were considered;
- relevant visual changes were captured and inspected;
- code, model, VFX, and sound pieces of the change are either present or
  explicitly reported as missing;
- generated assets remain local or have explicit global-library approval;
- stable context changes are reflected in the Project Skill or its references;
- the branch contains no unrelated workspace or child-repository changes.
