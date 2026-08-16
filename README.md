# Sandblock Code workspace

This Git meta-repository is the single entry point for the three repositories
that form the Sandblock Roblox developer environment.

```text
sandblock-code-workspace/
  docs/                       canonical cross-repository context
  .agents/skills/             workspace context skill for coding agents
  sandblock-code/             Electron app, MCP gateway, local runtime
  sandblock-studio-plugin/    Sandblock Roblox Studio plugin
  sandblock-rojo/             pinned Rojo fork
```

The root tracks architecture, vision, agent context, and workspace
orchestration. Each child directory keeps its own `.git`, commits, branches,
and release lifecycle; child repositories are ignored by the parent.

## Start here

The canonical documentation index is [`docs/README.md`](docs/README.md). It
routes to:

- product vision and v0 boundaries;
- cross-repository architecture and accepted decisions;
- delivery roadmap;
- Roblox development workflow;
- shared desktop/Studio design direction.

Agents working from this root should load
[`$sandblock-workspace-context`](.agents/skills/sandblock-workspace-context/SKILL.md)
before planning or changing any component.

## Initialize the workspace

Node.js 20+ and Git are the only requirements for the bootstrap itself.

```bash
npm run bootstrap
```

The command leaves existing child repositories untouched and clones any
missing repository from `workspace.json`. Once the planned GitHub repositories
exist, configure missing `origin` remotes with:

```bash
npm run bootstrap:remotes
```

Inspect the parent and all children together with:

```bash
npm run status
```

Check that the canonical context and skill structure are complete with:

```bash
npm run context:check
```

Launch coding agents from this root when a change needs context from more than
one component. For a contained change, launch the agent from the relevant child
repository.

## Migration source

The historical repository remains at
`/Users/romain/sandblock/roblox-studio-ai-automation`. It is a migration source,
not an active fourth component. Do not delete it until the project-bound
MCP/Studio runtime is validated end to end.

The expected `R0-main` remotes in `workspace.json` are intentionally not added
to existing local repositories by the default bootstrap. They become
authoritative only after those GitHub repositories have been created.
