# Machine setup, game cloning, and app updates

## Status

**Target:** agreed direction, not current behavior. Nothing in this document is
implemented yet. Once validated, the two decisions at the end move into
[`DECISIONS.md`](DECISIONS.md) as SB-027 and SB-028.

## Goal

A developer on a new computer should reach a working game in three clicks:
install Sandblock Code once, pick a game from a list, start working. Every later
improvement to Sandblock Code should reach every machine without a terminal.

Three features cover that:

1. **A game list**: every game repository on the self-hosted GitLab carries
   the topic `game`, and the app lists them through the GitLab API.
2. **One-click clone and setup**: the app clones a game from that list,
   registers it, and installs its toolchain and packages.
3. **In-app updates**: the app notices that the workspace `main` has moved,
   says "Update available", and updates and relaunches itself on one click.

## What already travels, and what does not

**Current.** A game's Roblox identity is already shared through Git:
`.sandblock-code.json` carries `projectId`, `universeId`, `mainPlaceId`, and
the declared places ([SB-018](DECISIONS.md#sb-018--a-project-declares-the-places-its-agents-may-reach)).
Cloning a game's repository is enough for the gateway to know its places.
Nothing else may copy those ids: one fact, one source.

What a new machine lacks today is local to the app's `userData`:

| State | File | Covered here |
| --- | --- | --- |
| Which games exist and where they are on disk | `projects.json` | Yes: the GitLab `game` topic replaces "find the remote, clone by hand, add the folder" |
| Game toolchain and packages | inside each game repository | Yes: one-click setup |
| The app itself, the Studio plugin, the Rojo fork | the workspace | Yes: in-app updates |
| Roblox accounts | `roblox-accounts.json` + keychain vault | No: sign in once per machine |
| GitLab token | keychain vault | No: paste it once per machine |
| Open Cloud keys, Drive service account | vault + `~/.config/sandblock-code` | **Later:** a cloud store that keeps secrets server-side |

## 1. Finding the games: GitLab topic `game`

### The topic is the list

**Target.** Every game repository on the self-hosted GitLab (`git.shulkr.net`)
carries the project topic **`game`**, set in the project's Settings → General →
Topics. There is no index file to maintain: tagging a repository is what
publishes it to every machine, and removing the topic withdraws it.

The app lists the games with one call to the GitLab API:

```text
GET https://git.shulkr.net/api/v4/projects?topic=game&membership=true&simple=true&per_page=100
```

- `membership=true` keeps the list to projects the token's user belongs to,
  directly or through a group. `game` is a generic topic, and without this
  filter public or internal projects from other people on the instance could
  appear.
- GitLab permissions decide who sees which game. There is no second access
  list.
- Each result gives the name, `path_with_namespace`, `default_branch`,
  `ssh_url_to_repo`, and `last_activity_at`. Results are paged through the
  `x-next-page` header.
- No Roblox ids come from GitLab. They stay in each game's
  `.sandblock-code.json`.

### The GitLab token

**Current:** unauthenticated, the API answers `401` for `/api/v4/version` and an
empty list for projects, because the game repositories are private. A token is
therefore required.

**Target:**

- Settings gains **GitLab**: the instance URL (default `https://git.shulkr.net`,
  overridable with `SANDBLOCK_GITLAB_URL`) and a personal access token with the
  `read_api` scope only. The app never needs write access to GitLab.
- Before storing the token, the app checks it with `GET /api/v4/user`. It then
  stores the token in the keychain-backed vault, like Roblox accounts and Open
  Cloud keys. The renderer sees only the username and the token's expiry.
- The token is entered once per machine. An expired or revoked token shows
  "Reconnect GitLab" in the clone dialog, not an empty list.

### What is not covered

- **Repositories outside the instance.** `be-the-first-youtuber` is on GitHub,
  so it does not appear until it moves to `git.shulkr.net`. GitHub topics could
  be added later as a second source, with their own token.
- **Setting the topic.** Covered for new games: see "Creating a game's
  repository" below. A game created before that, or by hand, gets the topic by
  hand.

### Creating a game's repository

**Implemented** (`gitlabGames.ts`, `projectCreate.ts`). Creating a game in the
app also creates its GitLab project in the `roblox/games` group (id 296):

1. Before cloning the template, the app checks that `roblox/games/<slug>` is
   free. A taken name is refused while nothing exists yet on either side.
2. After the first local commit, it creates the project through the API:
   private, empty, topic `game`, so the game list finds it.
3. It adds that project as `origin` and pushes `main` over SSH, with the
   developer's own key. The bot only creates the project; the first commit stays
   the developer's.

If step 2 or 3 fails, the local project is still created and registered, and the
error says what is left to do. Failing the whole creation would leave a folder
that blocks a retry under the same name.

The credential is a **group access token** on `roblox/games`, not the personal
`read_api` token above: GitLab Free has no service accounts, and a group token
is the equivalent, a bot user that can only reach that group. It needs the `api`
scope and a role at least the group's "Minimum role required to create
projects". It is read from `SANDBLOCK_ROBLOX_GAMES_GROUP_TOKEN`, in the
environment or in the app's `.env`; `SANDBLOCK_GAMES_GROUP` overrides the group
path. Without it, creation stays local as before. Moving it into the vault
belongs with the GitLab settings above.

### Creating the game on Roblox

**Implemented** (`robloxGames.ts`), not yet run against Roblox. The new-game
form asks whether the Roblox game already exists. If it does, its places are
picked from the open Studios as before. If not, the developer picks an owner:
a connected Roblox account, or a group that account belongs to. After the
repository is created, the app creates a private game from the Baseplate
template with that account's session (`POST
apis.roblox.com/universes/v1/universes/create`, `?groupId=` for a group, the
endpoint Studio and Mantle use), names its start place after the game, and
declares it as the main place with its `universeId`.

The repository goes first: Roblox has no way to delete a game, so a name refused
locally or on GitLab must not leave one behind. If Roblox refuses, for instance
a group role that may not create experiences, the project is still created and
Settings › Roblox places offers the same creation again, for as long as no
published place is declared.

## 2. One-click clone and setup

### Clone

**Target.** The project launcher gains **Clone a game**:

1. Lists the `game` projects, most recently active first. A game whose
   remote matches the `origin` of a project already registered on this
   machine shows "Open" instead of "Clone".
2. Clones into a parent folder: an app setting that defaults to the parent of
   the last registered project, for example `~/sandblock`. The folder name is
   the GitLab project path. An existing non-empty folder is refused rather than
   reused.
3. Clones `ssh_url_to_repo` through `runGit`, so it uses the machine's existing
   SSH setup, and Windows goes through WSL exactly as project creation does
   today. The token is only used for the API and never ends up in a remote URL
   or in `.git/config`.
4. If the clone has no `.sandblock-code.json`, the project still registers, and
   the app offers the existing **Create config** action instead of failing.
5. Registers the folder with `ProjectRegistry.add`, runs setup, and opens the
   project window.

### Setup

Setup turns a fresh clone into a game Rojo can serve and an agent can build.
**Target:** by default the app detects the steps from the repository:

| Present in the repository | Step |
| --- | --- |
| `aftman.toml` | `aftman install` |
| `rokit.toml` | `rokit install` |
| `package-lock.json`, `bun.lock`, `pnpm-lock.yaml` | `npm ci`, `bun install --frozen-lockfile`, `pnpm install --frozen-lockfile` |
| `package.json` without a lockfile | `npm install` |
| `wally.toml` | `wally install` (after the toolchain step, which provides `wally`) |

A game that needs something else declares it in `.sandblock-code.json`, and the
declaration replaces detection entirely:

```json
"setup": [["aftman", "install"], ["npm", "ci"], ["npm", "run", "packages"]]
```

Rules:

- **Shown before it runs.** The setup panel lists the exact commands first.
  One click runs them all. Each step streams its output and shows its own
  status, and a failed step stops the rest.
- **Trusting tools is a human approval** ([SB-013](DECISIONS.md#sb-013--human-approvals-remain-explicit)).
  Today the app runs `aftman install --skip-untrusted`, which silently skips a
  tool this machine never trusted. Setup instead lists the untrusted tools by
  name. **Trust and install** runs `aftman trust <tool>` or `rokit trust <tool>`
  for each one, and only then installs.
- **Re-runnable.** Project settings keep **Reinstall dependencies**. A stamp
  per step, made from the lockfile hash plus the tool version (the same idea
  as `scripts/update.mjs`), skips steps that are already up to date. After a
  pull changes a lockfile, the project shows "Dependencies out of date".
- **Never blocks opening.** A project whose setup failed still opens. Rojo and
  the gateway report their own errors, as they do for a project set up by hand.
- Runs with the login-shell `PATH` the app already adopts, so tools installed
  through a shell profile are found.

The Studio plugin and the pinned Rojo are not per-game; the app update below
installs them. The shared agent skills are not a setup step either: a game
commits its copies (`scripts/sync-skills.sh`, [SB-021](DECISIONS.md#sb-021--shared-agent-skills-live-in-sandblock-skills)),
so a fresh clone already has them, and refreshing them is a reviewed change to
the game like any other.

## 3. In-app updates

### The update channel is the workspace `main`

Sandblock Code is not one repository: the app builds `../sandblock-ui`, and the
update also builds the Rojo fork and installs the Studio plugin. The rule
"releases pin concrete versions or commits" ([ARCHITECTURE.md](ARCHITECTURE.md#cross-repository-contracts))
means an update must not take each child's latest commit independently.

**Target.** The workspace repository pins one compatible commit per child in
`workspace.lock.json`:

```json
{
  "version": 1,
  "repositories": {
    "sandblock-code": "382db13…",
    "sandblock-ui": "77aee45…",
    "sandblock-studio-plugin": "…",
    "sandblock-rojo": "…",
    "sandblock-skills": "…"
  }
}
```

A release is a commit on the workspace `main` that changes this lock. A root
script, `npm run release:pin`, writes the lock from the commits currently
checked out. It refuses when a child has local changes or a commit that is not
on its remote. "Update available" therefore means: **the workspace `main` on
the remote pins something other than what this machine runs.**

### Detection

- At launch, then every 30 minutes, the app runs `git ls-remote origin
  refs/heads/main` on the workspace. The check is cheap and changes nothing. It
  compares the result with the local workspace `HEAD`.
- When the remote is ahead, the launcher shows **Update available** with the
  list of new workspace commits (`git log HEAD..origin/main`), fetched only
  when the panel opens.
- Offline or unreachable: nothing is shown, and the next check retries.

### Developer machines

A machine where someone develops the children must never be updated under
them. The update is **disabled with an explanation** when any child:

- has local changes, or commits that are not on its remote;
- is on a branch other than its `defaultBranch` from `workspace.json` (today
  `sandblock-rojo` is on `codex/project-first-studio`, so this machine would
  show "Update managed by hand").

`npm run update` stays the terminal path for those machines.

### Applying an update

1. **Confirm.** The dialog names what stops: the gateway, every Rojo server,
   and every running agent session, by project. A running agent turn is lost,
   so the update never starts without this confirmation.
2. **Record the rollback point**: the current commit of the workspace and of
   every child, in `userData/update-previous.json`.
3. **Run the update** as a child process: `node scripts/update.mjs --pinned`.
   It fast-forwards the workspace, checks out each child at its pinned commit
   (detached), and keeps today's steps: `npm ci` with stamps, `desktop:build`,
   the Rojo fork build, and the plugin build and install. Output streams into
   the dialog.
4. **Relaunch.** On success: stop the runtimes, then `app.relaunch()` and
   `app.exit()`. Project windows that were open reopen after the relaunch.
5. **On failure** the running app is still the old one, in memory, but the
   disk is half updated. The dialog shows the log and offers **Restore the
   previous version**, which checks out the recorded commits and rebuilds. The
   app also refuses to relaunch onto a failed build.

Updates are never applied automatically, only proposed. A Studio restart is
still needed to load a new plugin build, and the dialog says so after the
relaunch.

## Implementation split

| Repository | Change |
| --- | --- |
| workspace (root) | `workspace.lock.json`, `npm run release:pin`, `--pinned` mode in `scripts/update.mjs`, this document, then SB-027 and SB-028 |
| `sandblock-code` | GitLab settings and token in the vault, clone dialog, setup runner (replaces `ensureAftmanInstalled`'s silent skip), `setup` field in `.sandblock-code.json`, update check, update dialog, rollback |
| Game repositories on `git.shulkr.net` | Topic `game`, added by hand. No code change |
| `sandblock-studio-plugin`, `sandblock-rojo`, `sandblock-ui` | None. They are only pinned |

Suggested order: GitLab list and clone, then setup, then updates. Each one is useful
on its own.

## Decisions to record once validated

- **SB-027 — Games are listed from the GitLab topic `game` and set up in one
  click.** The list comes from the GitLab API with a per-machine `read_api`
  token, filtered to the user's projects. It carries nothing that
  `.sandblock-code.json` already owns. Setup is detected or declared, shown
  before it runs, and asks before trusting a tool.
- **SB-028 — The app updates itself to the workspace `main`'s pinned
  commits.** The update is detected automatically, applied only on
  confirmation, disabled on developer machines, and rolled back on failure.

## Open questions

- Should a game without the topic (a local experiment) still be addable from a
  folder? Proposed: yes, unchanged from today.
- Should the token be a personal access token, or should the app sign in
  through GitLab OAuth (a device or browser flow) to avoid pasting one?
  Proposed: a personal access token first; OAuth only if pasting proves to be
  friction.
- Later: a cloud store for Open Cloud keys and the Drive service account, kept
  server-side, so a new machine needs only a Roblox sign-in. It is designed
  separately.
