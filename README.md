# Sandblock Code workspace

This Git meta-repository initializes and coordinates the three repositories
required by the Sandblock Roblox developer environment.

```text
sandblock-code-workspace/
  sandblock-code/             Electron app, MCP gateway, local runtime
  sandblock-studio-plugin/    Sandblock Roblox Studio plugin
  sandblock-rojo/             pinned Rojo fork
```

The root repository tracks only workspace orchestration. The child directories
are ignored by the parent and each keeps its own `.git`, commits, branches, and
release lifecycle.

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

Launch coding agents from this root when a change needs context from more than
one component. For a contained change, launch the agent from the relevant child
repository.

The historical migration source remains at
`/Users/romain/sandblock/roblox-studio-ai-automation`. Do not delete it until
the project-bound MCP/Studio runtime is validated end to end.

The expected `R0-main` remotes in `workspace.json` are intentionally not added
to the existing local repositories by the default bootstrap. They become
authoritative only after those GitHub repositories have been created.
