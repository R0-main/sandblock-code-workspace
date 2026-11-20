# Earlier games and the hand polish: Totally Normal Obby, Throw a Weapon (+ Punch to Escape, Avalanche Smash)

Read-only study, 2026-11-20. Sources: each game's `docs/reviews/*.md`, TNO's `conductor/tasks-*.yaml`
(19 batch files), `git log`, the Conductor DB (`tasks.notes`, `runs`, read-only), Romain's messages
(`human/*.md`, workspace sessions 2026-10-12 → 11-20). Quotes are Romain's, verbatim (typos kept).

## 0. The numbers

| Game | Built by | Build | First "playable" (agent review, gate green) | Board items after | Launch | Polish after the team |
|---|---|---|---|---|---|---|
| Throw a Weapon | Paperclip team, 10-12/13 | 109 DCs in 2 days, 3 agent review rounds (44 → 22 → 15 entries) | 10-13 05:19 (r3: « Blocking now: R1-7 only (the ids) ») | ~370 messages from Romain 10-14 → 10-27 (by hand, one Claude Code agent), ~230 more DCs (DC-110 → DC-412 by 10-28) | beta 10-28 (« Ok le jeu est sortie en beta test »), live update 11-16, BeOne video 11-16 | still going 11-20: DC-473; « 2026-11-17-retours » = 60 mailbox lines + 19 video lines → 19 bugs, 10 feel calls |
| Punch to Escape | Conductor #1, 10-15/16 | 139 tasks, 532 runs, 1.5 days | 10-16 (r1, 1454 specs green; feel review 14 entries) | 2 board remarks (POV framing, Minecraft cracks) + store page | none: no commit after 10-16 but skill syncs; not in Romain's list of live games on 11-03 | none |
| Totally Normal Obby | Conductor #2, 10-19 | 198 tasks, 817 runs; plan + build S → F14 in ≈ 47 h | 10-20 ~16:00, ≈ 29 h after creation (r1: « Blocking: None ») | ~63 board items, 10-21 → 11-09: ~41 in 14 Conductor batches (F15 → F29), 21 in one hand session (11-02), 3 shift-lock asks (11-06/09) | store page published 10-28 (title « Just an Obby... », moved to group Litsu Game); live fixes 11-02 | 11-02: 16 commits in one day, by hand |
| Avalanche Smash | Conductor, 11-07/08 | 74 tasks, 218 runs, ~1 day | 11-08 (r1, 22 entries, blocking none) | 2 taste calls, one of them reshapes the game (« le jeu manque de raisons de revenir » → rebrand to Snowball Zoo) | none: no commit after 11-08 but syncs | none |

So none of the early games came out launch-ready. Throw a Weapon, the oldest and the only one with
players, needed the most polish (2 weeks of Romain playing and dictating fixes before the beta, then
3 more weeks). TNO needed ~63 items over 19 days. Punch to Escape and Avalanche Smash had few board
items because Romain never polished them, not because they were better: both were dropped right after
the build.

## 1. TNO: what the board sent back, by trade

TNO's feedback came in short bursts while Romain played (workspace sessions) and was turned into one
batch file per burst. Batches and what each one fixed:

| Batch | Date | Board's words | Tasks / span |
|---|---|---|---|
| F15 obstacles | 10-21 | « il faudrait que il y ai plus d'etapes differente reprises des obby existant sur roblox, plus de diversiter sur les obstacles » | 18 tasks, 27.5 h (15 obstacle types on ~43 sections) |
| pendulum | 10-21 | « l'agent a fait l'obstacle du balancier qui tue imposible le playtest essaie depuis toute a leur » | the axe swung along the path: crossing window 0 s, the bot died 19 times |
| F16 guide arrow | 10-21 | « y'a plein de fleches comme ca change les par un model blender » | 2 tasks, 2.7 h |
| F17 Axo + fog | 10-21 | « rendre l'axoloat rond comme screen1 couleur + mauve ... avoir un vrai fog dans la zone brouillard » | 6 tasks, 18.7 h |
| F17 music | 10-22 | « les musique faut prendre des musique de obby normale pour la premiere etape » (was a music-box nursery tune) | 1 task |
| F18 path | 10-22 | « les fleches de ces etapes sont pas dans le bon sens + je trouve encore le chemin trop repetitif y'a pas assez de variter de hauteur ni de gauche droite » | 15 tasks, 100 h span (blocked 10-23 → 10-26 by missing Worktree copies) |
| (blood) | 10-23 | « refais juste le sang sur les jump car la on voit trop que c'est des parts elles ne sont pas relier etc.. c'est tres moche » | done on main 10-27 (82d6a30) |
| F19 playtest B1–B12 | 10-26 | the 12-line list (`docs/reviews/2026-10-26-board.md`) | 27 tasks, **4.9 h** (after « pas besoin qu'il teste ») |
| F20 variety | 10-26 15:00 | « je trouve toujours que au debut c'est trop redondant et meme les etapes sont quand meme bcp des caree jump de base... » | 7 tasks, 22 h |
| F20 bare shapes | 10-27 | « pourquoi y'a des formes comme ca ? soit c'est mal fini soit en trop » | 1 task |
| F21 → F29 store | 10-28/29 | 8 rounds of icon/thumbnails (below) | 8 art tasks + 1 description |
| hand session | 11-02 | 21 items, one Claude Code session in the repo, not the Conductor | 16 commits 10:05 → 16:32 |

By trade (≈ 63 items):

- **Map / obstacles / course (~20).** Variety and repetition (10-21, 10-22, 10-26 B10, 10-26 15:00,
  10-27 ×2); the impossible pendulum; conveyor arrows the wrong way (10-22); blood made of loose parts
  (10-23); green platforms unreadable → violet (B2); conveyors too slow (B5); kill parts on the chase,
  the chase border « mal setup » (B8); flower and cloud decor on round pads (« c;estnul », 10-27); gift
  box bow and ribbon (« mal fini soit en trop », 10-27); « bug des decors placer en code sur le chase »
  (10-27); chevrons « par dessus la route a chaque turn » (10-27); conveyor beams reversed, « sur les
  tapis il ne doit pas avoir de model 3d juste les beams » (10-28); 11-02: laser gate on the diagonal
  « pour ne pas pouvoir la skip », wider checkpoint platform, respawn facing the wrong way, glitch wall
  too dark in Darkness, « les beam sont toujours bug avec le truc en 3d ».
- **UI / HUD (~9).** « BUTTON TROP GROS sur le hud PC » (B1); sliders instead of on/off (B11); the
  Scare-all icon's teeth (10-27); run timer not showing, « le cchrono est sur le leaderboard aussi »,
  « le menu d'admin est un peu trop gros », purchase prompters hidden behind transparency (11-02);
  shift lock icon top-left, then on PC too (11-07, 11-09).
- **Feel / VFX / camera / scares (~6).** A real fog (10-21); the teaser flash on the 2nd jump (B3); the
  phantom rush sound (B6); the chase intro cutscene (B9); « remove notification screamer sinon c'est
  pas drole » (11-02); shift lock (11-06).
- **Sound (~4).** Obby music for stage 1 (10-22); the phantom rush (B6); sliders (B11); « sound
  gresillement trop fort » (11-02).
- **Characters / animation (~4).** Axo round and mauve (10-21); Axo's bubbles shown by distance (B4);
  the chase monster running backwards (B7); store art still showing the old Axo (« mtn l'axoloat est
  bcp plus rounded », 10-28).
- **Store art (8 rounds, 9 remarks, in 2 days).** F21 old Axo; F23 « propale d'autre minia et thumbnaisl tres
  roblox obby »; F24 « les thumnails pas dingue va prendre les minia de concurent »; F25 « le stud c'est
  pas la texture stud roblox mais des legos ... et le bacon hair fit trop ia »; F26 « j'aime la DA pas
  le fait qe ca soit un ciel etoileler ou quoi, prends des screen in game et passes dans l'ia »; F27
  « y'a trop d'elemtns dans la miniature »; « le fov et l'angle est pas bon sur certaines capture »;
  F28 « le bacon hair a pas de pose naturel roblox + il est pas dans le bon sens il cours en
  parralele »; F29 « fait des variantes la y'a trop rien mtn ». F27 alone: 23 runs, 6 reviewer
  send-backs on the same platform row.
- **Monetization (~5).** « remplacer le gamepass tous ko par screamer » (B12); 11-02: ADMIN Commands
  gamepass (Fly + a ban-worded Kick), in-map purchase stands, « c'est super moches les 3d products ...
  game.Workspace.Course.GamePassPrompter mais version un peu revisier », « certain son mal placer ou
  dans d'atre models », the admin pass when nobody can be kicked.
- **Bugs (~7).** Monster backwards (B7), chase decor, rollback of skins (11-02), run timer, rejoin must
  restart at spawn 0, respawn direction, the place never saved (10-20: « La place réelle n'a jamais été
  sauvegardée sur Roblox », all work only in a Studio autosave; Romain restored it by hand).
- **Pacing (~3).** 21 min vs the GDD's 30–40 → +60 % checkpoints (10-21); 55 min after F18 → « garde
  comme ca » (10-22); « + dure » on jumps and belts (B5, B10), against DC-21 « flat difficulty ».
- **Ops (~3).** Group rank ≥ 254 gets the commands, the transfer to Litsu Game, the title.

### Complaints that came back (the team did not learn)

1. **Repetitive, plain-square course: 6 times in 7 days, across 4 batches** (F15, F18, F19-B10, F20,
   then F20 again on 10-27). Each batch wrote a DC and met its letter, not its intent. The PM's own
   question on 10-23: « DC-44 est respecté à la lettre, mais 15 segments se lisent comme une rangée
   droite depuis la caméra ». On 10-27 the reshaped course was not even in the real place: « mais
   pourquoi c'est pas mis sur le main ? sur la main place y'a que des part carre ».
2. **Directional cues (arrows, chevrons, beams): 5 times** (10-21 guide arrows, 10-22 conveyor arrows,
   10-27 chevrons over the road, 10-28 beams reversed, 11-02 « toujours bug »). The map-builder role
   already carried TAW's rule « flat chevrons » since 10-19.
3. **Geometry that looks unfinished: 6 times** (blood, flower/cloud decor, gift box, chase decor, 3D
   products, models inside other models).
4. **Testing instead of fixing: 4 remarks** on TNO (10-21 ×2, 10-26, 10-27 ×2), after one on TAW (10-20).
5. **Across games, a week apart:** LEGO studs and AI hair in store art (TAW 10-21 « c'est trop stud en
   mode lego et pas en mode roblox » → TNO 10-28 « des legos ... le bacon hair fit trop ia »); sound
   sliders (TAW 10-22 « change les on off musique / sfx par des sliders » → TNO 10-26 B11).

The agent reviews did not catch any of these. TNO's r1 + feel review (32 entries) checked the GDD and
DCs (lamp lost on respawn, eyes too small, spikes red on red, receipts) and found real issues, but none
of the board's items (variety, Axo's shape, music, arrows, store art): it judges compliance, the board
judges against the real games of the genre.

## 2. Throw a Weapon: what Romain polished by hand

The Paperclip team built it on 10-12/13 (109 DCs, three review rounds, gate green). From 10-14 Romain
played it and dictated fixes to one Claude Code agent working in the main place: ~370 messages before
the beta of 10-28, ~150 after. The day after the hand-over: « j'aimerais refaire tout les menu du jeu il
sont horrible, meme le HUD est pas dingue » (10-15).

What he polished, by trade:

- **Map.** « le lobby est trop large, normalement dans le skill stud map on te dit de ne pas faire de
  part individuel mais de faire des grosse part avec texture stud differents » (10-15); training zones
  longer and longer to show progress; a straight map with long, populated zones and side walls, signs
  as models (10-19); walls too high, lobby recentred, a portal at the end, a lobby « + vivant » (10-21/22).
- **UI.** Every menu redone from the library kit; strokes (outer, inner, bottom border, 10-15, 10 messages
  in one hour); « il faut une police unique pour le jeu » → Montserrat Heavy; no text gradients; lock
  icons; icons redone (bag, sword, potions); notification badges « reprendre un peu le style de
  ../anime-aura-farming » (10-27); stats bottom-left on mobile (10-29); iPad scaling (11-17).
- **Impact and feel (the core).** « enfaite il faut vraiment ce concentrer sur l'impact et bien faire en
  sorte que le joueur vois les sbires mourrire faut que ca soit dramatique !!! » (10-15): time to see the
  hit, damage billboards, cash with a trail, minions breaking apart, VFX on impact, craters, dismemberment
  (10-26), boss rage cutscene (10-22), FOV on level-up, screen shake on a perfect.
- **Throw controls.** Behind the object, cursor steering, no aim assist on PC, a constant slow speed,
  falling gradually at max range (10-14/15, 10-19); mobile: « sur mobile c'est trop compiliquer ... super
  dure a controler et viser » (10-27); the gauge (11-09); the throw animation copied from Throw Food For
  Animals: « c'est bcp plus lent que sur la ref » (11-06).
- **Weapons.** « trouve moi des armes plus wdf avec des mecaniques uniques » (10-15), then « ok la le jeux
  est vraiment sympa il y a juste des trucs pas dingues c'est les armes » (10-19); per-weapon tuning
  for two weeks (anvil, rubber chicken, TNT, ice spear, trident, skewer, katana, goblin barrel, bowling).
- **Sound.** Hit SFX he picked (Among Us kill, « HEAD SHOT! »), wind in flight, music « pas besoin que ca
  soit avec le theme juste que ca soit des musique de jeu roblox » (10-26), level-up like trending games.
- **Monetization and economy.** Passes and products published, VIP ×2 of the best mat, Hacker mat 2.5×,
  auto-rebirth pass, offline earnings, regional pricing; « fait moi un tableau de progression car j'ai
  l'impression que la c'est bcp bcp trop long pour progresser » (10-22); « si le joueur paie alors il a
  tout sinon c'est pas fair » (10-29).
- **Onboarding.** Tutorial to level 20 too long, one beam to the target, no night in the tutorial, kill 5
  minions without the boss (10-22/23); a black-out with a big hand (11-17).
- **Store art.** « les thumbnails actuel sont vraiment trop nul pas claire et ai slop » (10-21): ~12
  rounds in one morning (real in-game screens, « comme kick a luckyblock »), then event tiles (11-05/06,
  many rejected « knife-eye » rounds), variants of the tile with the best CTR (4 %).
- **Tools for himself.** An admin panel « in order to test faster » (10-19, 10-21), test commands for
  boss animations (10-22).
- **After the beta.** Funnels, economy, feedback (10-28, 10-30, 11-02, 11-04, 11-06, 11-11); player bugs
  from Discord (10-29, 11-07).

### « 2026-11-17-retours »

Sources: the lobby mailbox (94 messages over 30 days, 60 kept), BeOne's video of 11-16 (19 moments),
133 YouTube comments, two days of live errors, and the board's one line: « Et également les niveau de
force requis sur les panneaux ne sont pas très fiables ». Triage:

- 19 bugs (F1–F19): broken view on death, ragdoll with the held weapon, the bat lost on K.O., an
  invisible « barrière » in zone 5, Rocket Fist locking other arenas, slow-mo on extra kills, ground
  blasts refused by the server, drifting on the AFK mat, weapons leaving the map, the barrel under the
  floor, throwing before the zone, the frozen boss still throwing, 5 sounds denied after the group move,
  iPad scaling, the wheel on a pad, the « x4 » label, stale zone signs (« Throw with 35M » while the
  config says 3M since DC-263), a script timeout.
- 10 feel calls (D1–D10): goblins too short, the chicken « fait zéro dégâts », the trident's delay,
  « un cimetière » of katanas, hit without touching the boss, 5 s respawn, anchored after the throw,
  flying mobs too hard to hit.
- Content requests (pets ×5, more weapons, rebirths, stats, PvP, aim tutorial, mobile control), and one
  risk: the bosses read as Yo-kai Watch characters.
- « Ok go » on 9 (F1, F2, F4, F5, F6, F7, F14, F15, F19), done the same day (DC-460 → DC-468), each one
  seen in Play on PC; phone checks left. Two were already written in ROADMAP.md and never done (the 4:3
  layout, the stale signs).

What made it launch-ready: not a test pass. Romain played every day, one remark at a time, and saw the
fix in the main place minutes later; the feel was rebuilt around the hit; menus came from the kit; music,
sounds and the throw animation were copied from named Roblox games; then real data (funnels, mailbox, a
YouTuber's video) drove the fixes after the beta.

## 3. Was the early output better?

No, not in polish. The early games came out as fast as the later ones, and just as far from launch:

- **Throw a Weapon** (the oldest): green gate and three review rounds, then « horrible » menus, « ai slop »
  thumbnails, generic weapons and two weeks of hand polish before a beta.
- **Punch to Escape** (Conductor #1): built in 1.5 days. The board said « les main prennent tout le
  vision » and « faire que les craques soit ceux de minecraft », and it was never finished.
- **TNO first days:** a complete, playable build in ≈ 29 h (r1: victory, chase, trolls, passes, boards,
  French, gamepad all verified), but generic. Its first board remark, the next morning, was the
  variety one. Its real place was never saved (10-20). It needed ~63 more items.
- **Avalanche Smash** (11-07): built in a day, but the board's first call reshaped the concept.

What was better early is the speed of a fix once the test passes were dropped: F19 (12 items) took 4.9 h
on 10-26, against 27.5 h for F15 (1 request) and 100 h for F18 (2 requests). The 11-02 hand session
fixed 21 items in one day. What got slower is what was added around a fix: bot walks, balance
re-measures, review tasks, capture sets, and Studio infrastructure: 114 of TNO's 157 error notes are
Studio / MCP / worktree-copy failures.

## 4. What Romain said about the agents' method

- **Testing too much, for nothing.** TAW 10-20: « bon par contre la y'a un agent qui testt et pas
  l'impression que ca sert a grand chose.... » then « stop them all for now i'll play the game ».
  TNO 10-21: « le playtest essaie depuis toute a leur », « il test depuis combine de temps le truc la ».
  10-26: « aussi pas besoin qu'il teste a chaque fois just que la il fix ce qu'on a dit ». 10-27: « aussi
  pas besoin de lancer de playtest ou il test tout les jump... », « stop the bot and juste finish the
  F20 ». Side effect, 10-26: « il fait des tets et y'a un max de sons de partout sur mon pc ».
- **Wasting work.** 10-22: « a chaque fois les agents fond ca : Next I'm opening the game in Sandblock
  Code ... il ne check pas si c'est deja ouvert ? ... afin de pas gaspiller des token ».
- **Not looking at the result.** 10-27: « mais pourquoi c'est pas mis sur le main ? », « soit c'est mal
  fini soit en trop et en plus apres les etapes sont juste normales comme avant »; 11-17: « juste check
  par toi meme si ca a ete fait ou pas ».
- **Not copying the referenced game.** « reprises des obby existant sur roblox » (10-21), and still no
  variety a week later; « va prendre les minia de concurent » (10-28) after a round drawn from a generic
  idea; « c'est bcp plus lent que sur la ref » (TAW 11-06); « normalement dans le skill stud map on te dit
  ... » (TAW 10-15: the skill already said it).
- **Wrong model for 3D vision work.** PTE 10-16: « je pense c'est parsque c'est sonnet 5.5 qui a coder ca
  alors que pour une tache qui demande de la vision 3d avancer ca aura du etre opus 5.5 ».
- **Asking too much, blocking for nothing.** 11-20: « le conductor pose trop de questions qui auraient pu
  être répondues par le PM, et il se bloque souvent pour rien ». In TNO: the badges asked 3 times (10-19
  answer « on skip les badges pour le moment ok », asked again 10-20); the device playtest asked 4 times
  for results (a 1-hour checklist with ~147 R$ of real purchases that he never played); the PM's
  « urgent » for Worktree copies 6 times in 10 minutes (F18-e, 10-23 09:19 → 09:29) and 5 times on F27
  (10-29), each « Approved by the human » without anything changing.
- **Slow.** 11-20: « c'est plus que super lent ». F18 waited 100 h, F27 needed 23 runs.

## 5. The polish patterns, as rules a team can follow up front

1. **Fix what was asked and test only what you touched.** No whole-course playtest, bot walk,
   re-measure or capture set unless the board names it (TNO rules §11). F19 went from days to 5 h.
2. **Land it in the real place and look at it from the player's camera** before saying done: one
   capture of the spot. Nothing is done while it only exists in a copy or a branch.
3. **Start from the referenced game, not an idea of the genre.** Name the 2–3 games, put their
   screenshot or clip beside yours, copy the layout, timing and look, then add the twist.
4. **Judge the board's intent, not the DC's letter.** For "varied", "dramatic", "Roblox-like", the check
   is the camera view and the comparison with the reference, not a rule counter.
5. **No two plain pieces in a row.** Vary shape, height and side from the first segment; keep decor
   bare unless it reads at once (no ribbons, flowers, stacked parts).
6. **Directional cues are one mesh**, point along the real motion, sit on the surface without crossing
   the route, and are checked in Play once.
7. **Impact first**: let the player see the hit, the damage, the death, then the reward; the HUD comes
   back after.
8. **UI from the kit**: one font, the kit's strokes, settings as sliders, sizes per device (PC, phone,
   tablet 4:3), no gradients on text.
9. **Sound and music Roblox players already know**: obby music for an obby, trending SFX, not designed
   kits.
10. **Store art from the real game**: an in-game screenshot with the real avatar (Pal Hair, a real R15
    pose), Roblox studs, one subject on a simple frame, an AI pass that keeps them, then variants. Never
    LEGO studs or a made-up hair.
11. **Paid things are delivered and fair**; purchase stands follow the board's own model (the
    GamePassPrompter), not one 3D model per product.
12. **A decision is final**: "skip" means skip until the board reopens it; the PM fixes or explains
    infrastructure blockers instead of re-asking the board.
13. **Give the board fast test tools** (admin panel, commands) instead of long checklists.
14. **Opus for 3D vision work** (viewmodels, cameras, framing).
15. **After launch, the data drives the fixes** (funnels, mailbox, videos, live errors), not more
    internal test passes.

## Caveats

- Run-hours in the DB are inflated by runs that hung overnight (e.g. 16–18 h single runs on F15/F17/F18);
  spans above are wall-clock from the first run to the last, nights and outages included.
- TAW message counts are approximate (some sessions are duplicated in the transcripts; ~530 unique lines
  over 10-14 → 11-20, ~370 before 10-28).
- TNO's board item count (~63) is a hand tally of distinct requests; F19's 12 are counted one by one.
