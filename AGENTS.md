# Sandblock Code workspace instructions

This root is a Git meta-repository containing canonical cross-repository
context and orchestration for nine independent child repositories.

## Required startup

For every task started at this root:

1. Run `npm run status`.
2. Read `.agents/skills/sandblock-workspace-context/SKILL.md` completely.
3. Follow its document routing for the task.
4. Read the instructions in every child repository that will be changed.

Keep **current**, **target**, **later**, and **historical** behavior distinct.
The root `docs/` directory is canonical for facts and decisions that affect
more than one repository.

## Repository routing

- `sandblock-code/`: Electron/React app, MCP gateway, project runtimes,
  generation utilities, agent and Studio launchers.
- `sandblock-studio-plugin/`: final Luau plugin artifact, MCP bridge,
  Sandblock-branded Studio UI, runtime/project selector, Studio handlers.
- `sandblock-rojo/`: upstream-preserving Rojo fork and the minimal adapter
  required by the Sandblock plugin.
- `sandblock-ui/`: reusable semantic tokens, CSS, React primitives, and the
  component catalog consumed by Sandblock web and Electron projects.
- `sandblock-skills/`: agent skills and workflows shared across games.
- `sandblock-game-boilerplate/`: the starting repository for a new Sandblock
  Roblox game — stack, check gate, example modules, and the agent
  configuration every new game inherits.
- `sandblock-library/`: the content games reuse — systems, UI, VFX, models,
  sounds, animations — written only by the library agent through merge
  requests a human merges.
- `sandblock-paperclip/`: the configuration of the machine's Paperclip
  instance, which runs the games' agent teams (SB-032) — pinned version,
  config, systemd service, the studio's company. Its state stays in
  `~/.paperclip`.
- `sandblock-discord-bot/`: the Discord bot, the only human surface of the
  agent teams: one channel per Paperclip company, approvals as buttons, the
  project manager reached by mention or reply (`docs/AUTONOMOUS_STUDIO.md`).

The parent repository ignores all nine child directories. Parent commits may
change only workspace-level material such as `docs/`, `.agents/`, this file,
`workspace.json`, or root scripts. Never stage a child repository into the
parent or replace it with an accidental Git submodule.

Before editing, inspect Git status in every repository involved. A request
affecting one repository does not authorize unrelated changes in the others.
Cross-repository work requires separate, intentional commits in each affected
child.

## Cross-repository rules

- Sandblock Code owns project paths and creates opaque runtime IDs.
- The Studio plugin selects approved running runtimes; it does not discover
  arbitrary filesystem paths.
- The Rojo fork stays close to upstream and contains no desktop orchestration.
- Cross-repository versions are pinned; never follow a moving branch at runtime.
- Keep loopback services local and validate project and `PlaceId` matches before
  syncing or dispatching Studio mutations.
- Use Git worktrees for Roblox/Rojo work only as SB-029 describes: one per
  worker, served by its own place copy (`docs/WORKTREE_COPIES.md`).
- Preserve upstream Rojo license files and notices.
- Update root documentation in the same change when a cross-repository contract
  or accepted decision changes.

## Verification

Run `npm run context:check` for root context changes. Also run the owning child
repository's tests and build commands for implementation changes. Visual or
spatial Studio work requires proportionate rendered verification.

## Bootstrap behavior

`npm run bootstrap` validates existing repositories and clones missing ones
from `workspace.json`. It does not mutate remotes of existing repositories.
`npm run bootstrap:remotes` explicitly adds missing planned `origin` and
`upstream` remotes; use it only after confirming those remotes exist.

The historical source repository is
`/Users/romain/sandblock/roblox-studio-ai-automation`. Keep it until the
extracted repositories build and integrate independently.
