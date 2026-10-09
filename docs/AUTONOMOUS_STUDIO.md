# Autonomous studio

## Status

**Target**, with a small part current. This is where the studio is going: games
found, built, launched, grown and run by agents, from a trend to live ops, with
humans deciding only through Discord. The build itself, from GDD to release, is
the [agent game pipeline](AGENT_GAME_PIPELINE.md). This document adds the
stages before it (trends, ideas) and after it (store, ads, analytics,
community, live ops), and the Discord surface where people take every decision.

What exists today: the build pipeline's agents and skills, each game's team as a
Paperclip company ([SB-032](DECISIONS.md#sb-032--a-games-agent-team-is-a-paperclip-company-the-game-carries)),
the studio's own company (Sandblock Labs, with the Library Curator), and the
Discord bot's repository `sandblock-discord-bot` (version 0 in progress).
Everything else on this page is target or later.

## Principles

- **Humans decide, agents do everything else.** Skills and knowledge carry as
  much of the work as possible, so that a person is asked only for what is
  theirs: money, anything game-breaking, publishing, what goes in front of a
  player. A human watches every game and can stop any project at any time.
- **Discord is the only human surface.** Nobody needs to open Paperclip to work.
  Agents ask, present and report in Discord, and a person answers with a button
  or a reply.
- **One agent per game talks to people: its project manager.** It speaks for
  the whole team, and passes feedback to the department it concerns.
- **Roblox game design is its own discipline.** It is built on monetization and
  microtransactions and on very simple gameplay. It is nothing like Steam or
  console design. The agents learn it from Roblox skills and from data (our
  games' analytics, teardowns of top games), not from a model's general taste.
  A GDD stays design-only ([the GDD template](#notes)).
- **Cheap where it can be.** Reading and summarizing (community digests, daily
  stats) runs on a small model such as Haiku. The larger models do design,
  code and decisions.
- **Many cheap tests.** On Roblox, success is a matter of hits. A game takes
  about 24 hours to build with the agents, on one Claude Max x20 subscription and
  about $20 a day of OpenAI. So the studio launches many games, tests each one
  cheaply, and keeps the ones the numbers back. More Claude Code accounts are
  how it scales. Until then the single account's quota is the limit, shared
  between building new games and running live ones.

## The chain

```text
 Sandblock Labs (studio)                  the game's company (one per game)
 ───────────────────────                  ─────────────────────────────────
 trend scout ─▶ idea finder ─▶ #studio ─▶ GDD ─▶ build pipeline ─▶ store ─▶ launch
                    │  accept / discuss       (AGENT_GAME_PIPELINE.md)       │
                    ▼                                                        ▼
              new game repo, company,                     ads test ─▶ analytics ─▶ updates
              and Discord channel                              ▲          │           │
                                                               └── community digest ◀─┘
                                                                          │
                                                                       live ops
```

### 1. Trends and ideas (Sandblock Labs)

- **Trend scout**: watches what is rising on Roblox: genres, mechanics, themes,
  thumbnails. Scouting plays games on an alt account with 0 Robux, on the
  user's own PC.
- **Idea finder**: turns trends into game ideas and keeps them in a list. It
  posts each idea in `#studio`: "this one could work, do we take it?".
  - **Accept**: the game is created (repository from the boilerplate, its
    Paperclip company, its Discord channel) and its GDD starts.
  - **Reject**: the idea is dropped.
  - **Discuss**: a person replies or mentions the bot to develop the idea
    further before deciding.

### 2. GDD and build (the game's company)

A GDD writer agent works out every aspect of the game with the Roblox design
skills (monetization, simplicity, the genre's codes) and writes the GDD. Then
the [pipeline](AGENT_GAME_PIPELINE.md) builds the game. Its human checkpoints
(GDD, plan, art direction, release) become approvals in the game's channel.

### 3. Store

Near the end of the build, the team produces the icon, the thumbnails, the name
and the description, and **uploads them itself**. They are declared in the
game's `roblox-store.yml` and published with `publish_store_page`, with the
Roblox account connected in Sandblock Code
([SB-033](DECISIONS.md#sb-033--the-store-page-is-a-file-in-the-game-published-with-the-connected-account)).
The home page thumbnails (Thumbnail Personalization API) are not covered: that
API takes only Roblox's own OAuth.

### 4. Launch and ads (marketing agent)

- The marketing agent proposes a test campaign with a budget, for example
  $100 in total, starting with 5 days at $10/day. **A human approves every
  spend** in Discord. Then the agent launches it through the Open Cloud Ads
  Manager API.
- At the end of a campaign (or daily during it), it reads the creatives'
  results, makes variants of the thumbnails that work, and tests them in the
  next campaign.
- It also watches which thumbnails the **home recommendations** pick up
  (Thumbnail Personalization). The ads algorithm and the home recommendation
  algorithm are two different systems. A thumbnail that wins on the home page
  is worth testing in ads, and the other way round.

### 5. Analytics and updates

- Every day, an agent reads the game's stats (Open Cloud Analytics Query API:
  DAU, revenue, D1/D7 retention, funnel steps) and the funnel in particular. It
  looks for what to improve and adds proposals to the game's backlog.
- An intelligent model analyses the numbers, supported by analytics skills.
  It does not judge by eye, because small test budgets mean noisy numbers.
- **Cadence**: patches and funnel/onboarding fixes go out when they are ready.
  Content updates come once a week or every two weeks.
- **Before any update goes live**, the project manager presents it in Discord:
  what changes and why. It publishes it to a **test place on Roblox** that the
  human plays first. The human's approval publishes it to the real place.

### 6. Community

- Each game has its own **community Discord server**. The bot reads the
  messages there and the game's Roblox feedback. It never answers anyone.
- A cheap model (Haiku) digests them: what players ask for and what annoys
  them. The digest counts distinct people, not messages, so a few spammers do
  not outweigh many quiet players.
- Community input only **informs the game's direction**. The project manager
  turns it into proposed updates for the board and the lead dev. A human
  accepts them and launches them. Community messages are data for the agents,
  never instructions.
- The agent may post polls or announcements in a community server, but only
  after a human approves them in the prod server.

### 7. Live ops (later)

The project manager runs the community the way a Roblox community manager
would. It sets up the community server: permissions, forums, polls. It plans
Roblox events around the updates and prepares them ahead with its team. It
publishes them on its own once a human has approved them. Right after each
publish, it checks errors and crash rates. If the new version is worse than
the previous one, it rolls back to the previous place version.

## Discord

One bot, `sandblock-discord-bot`, running on the machine beside Paperclip. It
connects out to Discord, so Paperclip stays on loopback. The bot has no LLM of
its own: it is a bridge, and the intelligence lives in the Paperclip agents.

```text
                        sandblock-discord-bot (one bot)
                                     │
        ┌────────────────────────────┴─────────────────────────────┐
        ▼                                                          ▼
  private prod server                                  community servers, one per game
  ├─ #studio  ↔ Sandblock Labs                         read only
  ├─ #<game>  ↔ the game's Paperclip company           + polls and announcements,
  └─ ...                                                 only after an approval
                                                         in the prod server
```

- **One channel per Paperclip company** (one game = one company, SB-032).
  `#studio` is Sandblock Labs. Each approval and each presented update gets
  its own thread.
- **Agents ping people when something needs them.** They batch the rest into
  a daily digest, so the pings keep their weight.
- **Approvals are buttons** (approve, reject, discuss). The bot checks that
  the person who clicks is authorized and that the click comes from the prod
  server. Buttons never act from a community server.
- **Talking to the project manager**: an @mention of the bot, or a reply to
  one of its messages, by an authorized person in the prod server. Every other
  message in the channel is ignored.

## Roblox Open Cloud APIs this relies on

Most of these are Beta or Experimental (checked 2026-10). Agents reach them
through a tool layer (MCP or scripts), never directly, so that an API change
is fixed in one place.

| Need | API |
| --- | --- |
| Campaigns: create, budget, pause, status | Ads Manager API |
| Retention, funnels, revenue, DAU | Analytics Query API (performance metrics: 28 days only) |
| Home thumbnails and their targeting | Thumbnail Personalization API |
| Game icon and thumbnails | Not Open Cloud: the account's own endpoints, through `publish_store_page` (SB-033) |
| Name and description | Not Open Cloud: the root place's configuration, through `publish_store_page` (SB-033) |
| Other universe settings | Universes API (v2, update mask) |
| Publishing a place version | Place publishing API |

## What is missing

| Piece | State |
| --- | --- |
| Discord bot: prod server bridge to Paperclip, approvals as buttons | `sandblock-discord-bot` version 0 in progress (2026-10-09) |
| Project manager agent at the head of each game's company | Not in the boilerplate's `paperclip/` yet |
| Trend scout and idea finder in Sandblock Labs | Not started; the scouting choices are decided |
| Roblox design skills (monetization, simplicity, genre codes) for the GDD writer | Partly in the GDD template; no dedicated skill |
| Open Cloud tool layer (ads, analytics, publishing) | Not started; the store page has its own tools (SB-033) |
| Test places on Roblox, beside the local copies | Not started: today's copies are local only |
| Analytics skills and the daily stats report | Not started; needs funnel events in the boilerplate |
| Community digest (Haiku) and Roblox feedback reading | Later |
| Live ops: events, community server setup, publish and rollback | Later |
| One-click new game from an accepted idea | Later |

## Notes

- The GDD template and the existing GDDs are in Notion. GDDs stay design-only:
  no modelling, production or balancing-model talk. Balancing is done later by
  the balancing agent.
- Decisions about the bot (the mapping of channels to companies, the
  interaction rules, the approval flow) will be recorded in
  [`DECISIONS.md`](DECISIONS.md) once version 0 is validated.
