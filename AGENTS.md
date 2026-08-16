# Sandblock Code workspace instructions

This root is a Git meta-repository containing orchestration files for three
independent child repositories.

## Repository routing

- `sandblock-code/`: Electron/React app, MCP gateway, project runtimes,
  generation utilities, agent and Studio launchers.
- `sandblock-studio-plugin/`: final Luau plugin artifact, MCP bridge,
  Sandblock-branded Studio UI, runtime/project selector, Studio handlers.
- `sandblock-rojo/`: upstream-preserving Rojo fork and the minimal adapter
  required by the Sandblock plugin.

The parent repository ignores all three child directories. Parent commits may
change only workspace orchestration such as this file, `workspace.json`, or the
bootstrap/status scripts. Never stage a child repository into the parent or
replace it with an accidental Git submodule.

Before editing, run `npm run status` or inspect `git status --short` in every
repository involved. A request affecting one repository does not authorize
unrelated changes in the others. Cross-repository work requires separate,
intentional commits in each affected child.

## Cross-repository rules

- Sandblock Code owns project paths and creates opaque runtime IDs.
- The Studio plugin selects approved running runtimes; it does not discover
  arbitrary filesystem paths.
- The Rojo fork stays close to upstream and contains no desktop orchestration.
- Cross-repository versions are pinned; never follow a moving branch at runtime.
- Keep loopback services local and validate project and `PlaceId` matches before
  syncing or dispatching Studio mutations.
- Do not use Git worktrees for the Roblox/Rojo development workflow.
- Preserve upstream Rojo license files and notices.

## Bootstrap behavior

`npm run bootstrap` validates existing repositories and clones missing ones
from `workspace.json`. It does not mutate remotes of existing repositories.
`npm run bootstrap:remotes` explicitly adds missing planned `origin` and
`upstream` remotes; use it only after confirming those remotes exist.

The historical source repository is
`/Users/romain/sandblock/roblox-studio-ai-automation`. Keep it until the three
extracted repositories build and integrate independently.
