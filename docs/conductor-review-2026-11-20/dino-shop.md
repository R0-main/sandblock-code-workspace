# Run a Dino Shop! — why the Conductor's build needed so much hand polish

Scope: `~/sandblock/dino-shop`, started 2026-11-12 17:43, 274 Conductor tasks (all `done`), 1 412 runs
(251 agent-hours), then six rounds of board feedback 2026-11-13 → 11-20. Read-only.
Sources: `docs/reviews/*.md` (board 11-14/15, 11-16, 11-17, 11-18; Romain 11-19, 11-20; reviewer r1/r2),
`docs/TASTE_CALLS.md`, `docs/PLAN.md`, `docs/GAME_DESIGN.md` (DC-1..173), `conductor/{rules.md,team.yaml,roles/*}`,
`.claude/skills/roblox-game-conventions`, conductor.db (`tasks.notes`, `runs`), git log (main + unmerged
branches), Romain's messages (`scratchpad/human/dino-shop.md`, `sandblock-code-workspace.md`, `root.md`,
`build-tests.md`). Working files: `scratchpad/dino/` (`items.py` = the classified item list, `tasks_dump.md`,
`runs_dump.jsonl`, `t.py`).

## 0. Headline numbers

- **156 board items** sent back after the Conductor's build (5 early 11-13 remarks, 7 store art, 3 map audit
  11-14, 13+1 on 11-15, 42 on 11-16, 37 on 11-17, 22 on 11-18, 11 on 11-19, 15 on 11-20).
  - **77 defects** (the pipeline should have caught them), **29 reworks** of a choice the pipeline itself
    made (design batch rubber-stamped, agent design call, brief misread), **5 process failures**, **45 new
    asks / taste changes** (only visible by playing).
- Where the 111 non-new items should have been caught (primary point):
  **31 regression or side effect of an earlier board-fix task**, **28 reviewer approved it**, **14 brief /
  plan / design batch**, **14 the 11-13 mass approval**, **11 an existing rule not followed**, **7 Conductor
  process**, **4 agent design call never put to the board**, 2 worker did not look.
- Review gate, by reviewer: the **Art director (Sonnet)** approved **118 of 131** visual reviews (UI 34/36,
  modeler 32/34, map 12/13, VFX 12/15, animator 8/12, sound 18/18); 63 of its 118 approvals say it relied on
  the worker's report or did not re-run something; only 2 mention the player's camera. The **Code reviewer
  (Opus)** sent the Coder back 59 times in 151 reviews. Visual work was built on Opus and judged on Sonnet.
- Work runs: 312 `done`, 169 `no-copy`, 129 `blocked`, 47 failed, 20 `question` (365 of 677 work runs ended
  without the work). PM triage: 84 `escalate`, 54 `retry`, **4 `answer`** of 162. Human: **57 « Retried by the
  human »**, 33 mass approvals, 3 other approvals.
- Plan-time approvals (UTC): the design challenger's **23 questions + 25 assumptions answered in 34 s** (P3, 11-12
  18:22:02 → 18:22:36, « Toutes tes recommandations (recommandé) », after the PM wrote « Je recommande tout en
  A »); the **142-task plan approved in 34 s** (P5, 18:40:53 → 18:41:27). 32 later design calls say « Decided by:
  the agent of <task>, to be confirmed with the board (not put to it) ».

## 1. Every class of problem, by trade

| Trade | Items | D | R | N | P | Main catch points (D+R+P) |
| --- | --- | --- | --- | --- | --- | --- |
| Map / world | 27 | 15 | 5 | 5 | 2 | REVIEW 6, FIXBATCH 6, BRIEF 5, RULE 2, PROCESS 2, AGENTDC 1 |
| UI / HUD (screens) | 36 | 24 | 2 | 10 | 0 | MASS 9, RULE 6, FIXBATCH 6, REVIEW 3, PROCESS 2 |
| UI: world billboards / labels | 11 | 5 | 3 | 3 | 0 | FIXBATCH 4, REVIEW 2, RULE 1, WORKER 1 |
| Game feel / VFX / camera / onboarding guide | 14 | 4 | 5 | 5 | 0 | BRIEF 4, REVIEW 3, FIXBATCH 2 |
| Animation / characters (NPCs, pets, carry) | 12 | 6 | 3 | 3 | 0 | MASS 2, AGENTDC 2, REVIEW 2, FIXBATCH 2, RULE 1 |
| Code / mechanics / bugs | 26 | 14 | 4 | 8 | 0 | FIXBATCH 8, REVIEW 7, MASS 2, BRIEF 1 |
| Economy / pacing / passes | 19 | 3 | 7 | 6 | 3 | BRIEF 4, PROCESS 3, FIXBATCH 3, REVIEW 2, AGENTDC 1 |
| Art direction / look (lighting, icons, models) | 4 | 3 | 0 | 1 | 0 | REVIEW 2, MASS 1 |
| Store art | 7 | 3 | 0 | 4 | 0 | WORKER 1, RULE 1, REVIEW 1 |
| **Total** | **156** | 77 | 29 | 45 | 5 | FIXBATCH 31, REVIEW 28, MASS 14, BRIEF 14, RULE 11, PROCESS 7, AGENTDC 4, WORKER 2 |

UI (screens + labels) is the largest family: **47 items**. Map/world 27, code 26, economy 19.
Classification is mine (one primary trade and catch point per item); the full list is at the end (§8).

### Recurring chains (the same thing sent back round after round)

- **Carrying**: 11-15 « ils flottent dans le vide derrière lui » (B4) → basket → 11-16 « il s'empile quand
  meme dans la meme ligne » (B43) → 11-17 « mettre les objet dans les main » (B30) → 11-18 « raprocher plus les
  mains » (B3), « les NCP doivent prendre les objets dans les mains » (B2) → 11-19 « desfois y'a des ressources
  invisible » (B2).
- **Billboards**: 11-15 « trop compliqués à comprendre » → 11-16 « l'icon du fruit ne doit pas etre en
  billboard … il ne doit pas y avoir marque le nombre » (undoes B15-shelf-signs and B15-billboards-readability)
  → 11-17 « fix les billboard », « passer dans le mur » → 11-20 « le style des billboard … a revoir », « pas de
  billboard x/4 », « des pixels qui passent ». 11 items over 5 rounds.
- **Hatch notice / babies**: 11-15 « spamme en permanence » → 11-16 « le popup » → 11-17 « enelver la popup a
  chaque fois » → 11-20 « la gestion des petit dino … dificile ».
- **Berries / stack flow**: 11-15 « Ramassage des baies cassé » → 11-16 « 1 par 1 », « 1 baie sur l'arbre a
  baie correspond a 1 baie » → 11-17 « reaparait a son endroit apres 2 s », « sur le buisson en lui meme » →
  11-18 « plus vite », « surtout pour le premier item ».
- **Employees**: DC-95 (agent call: an employee never walks) → 11-17 « revois les metier » → 11-18 « le
  magasinier … ne se deplace pas » → 11-19 prompt that stays behind, stocker that ignores machine output → 11-20
  « 3 remplisseur », « bcp moins vite ».
- **Customers**: 11-16 B4, B17 → 11-17 B2, B11, B18, B20, B21, B22, B28, B38 → 11-18 B6, B19 → 11-19 B1.
- B16 and B17 triage tables list **14 and 13 items** whose « Changes » column undoes earlier work.

## 2. Where the pipeline should have caught it (with DB cases)

### a) The plan and design batch were rubber-stamped, then reversed by play (BRIEF 14, AGENTDC 4)

- P3: 23 questions + 25 assumptions in one batch, the PM's triage note « Réponds « Toutes tes recommandations »
  ou « ok sauf 3 et 7 ». Je recommande tout en A. », answered in 34 s. Option A of Q3 became DC-17 (the opening
  shot on one's own black T-Rex); Q4 became DC-18 (dark silhouettes in locked areas); H16 became DC-53 (big
  stacks fly in groups). Reversed on 11-16: « le dino noire au debut la on ne comprends rien » (B13), « la
  partie pas unlocked ne doit pas avoir de part dutout meme des parts noires » (B34), « des que je vais sur un
  plan de baie ca doit les recuperer 1 par 1 » (B1, B2).
- DC-12 (fences whose spans swing open) is « the agent's answer to Romain's ask … Romain's verdict on the look
  is pending »; reversed 11-16 « elles souvre toutes donc c'est nul » (B10).
- DC-95 « Decided by: the agent of F13-staff-code, to be confirmed with the board (not put to it) »: « an
  employee stands on the spot where his buy pad stood … never walking », random-outfit avatars. Came back as
  11-15 « une vraie tenue d'employé », 11-17 « revois les metier », 11-18 « le magasinier est bug, deja il ne se
  deplace pas ». 32 DCs carry « not put to it ».
- Planner gaps: no task swapped the map's Part placeholders for the baked models (`PLAN.md`: F1-map-dressing
  « added 2026-11-13 on the board's request: no task did the swap »); two berry stands at the start (11-17 B26
  « il ne faut que 1 stand max par ressources »); bag upgrades on floor pads (B24); F24-guide-vfx's brief asks
  for « a new one when something new becomes buyable » → 11-16 « on ne doit pas avoir de beam / tuto pour chaque
  chose a acheter » (B37).
- Briefs written by the sessions that filed board fixes misread him: B15-pet-bounce read « l'animation de bulk
  (rebond) » as a Pet Simulator hop; the reviewer approved « as the brief asked ('on its scale') »; 11-16: « ne
  joue pas leurs animation de walk des que je marche masi fond des bonds » (B21). B15-carry-mixed's brief: « one
  stacked column per product »; 11-16: « si c'est pas du meme type il s'empile quand meme dans la meme ligne la
  je vois que l'agent qui s'occupe de ca ne fait pas ca » (B43).

### b) The visual review gate approves almost everything (REVIEW 28)

- Art director: Sonnet, 118/131 approvals. It checks kit conformity and counts, not the player's view.
  - F22-shop-ui-a: « The side-by-side shows the same header, studs, X and tabs as the kit's Shop. I did not
    replay the playtests; I relied on the worker's PASS lines ». Then 11-16: « les pack stylee ne sont pas asser
    mis en avant, il manque des animation + … le stroek n'est pas rouge » (B26, B27).
  - F16-museum-hall-a (approved): six plates and the billboard checked, « audit_map on the build: CLEAN (43
    parts) ». Romain, 11-14: the Museum is « toujours en stud » but « moche, un simple bloc ».
  - F14-skilltree-ui-a approved with the note « every station door shares the box icon »; 11-15: « à la place
    des icônes génériques, afficher le portrait … On ne sait pas qui est la première caisse » (B7).
  - F26-thumbnails-a approved 11-13 23:32 (« Minor, not blocking: the shop is small and distant »); four minutes
    later Romain opened a redo session: « des petits points verts », dinos « tous retournés », the avatar
    « nul ». The reviewer rule « an avatar on store art faces the way it leads » exists in `reviewer.md`.
  - F1-map review: « The overview capture reads right: studded city … black T-Rex silhouettes behind the
    fences » and a tag count. 11-15: « Map pas finie et pas polie »; 11-16: « plein de choses construites en
    studs sont ds placeholder ».
  - B16-shelf-types: the code reviewer counted props in `execute_luau` (« 102 shelves, 36 MarketTable … Every
    prop has ItemSpots equal to its Places »); 11-20: « certain meubles et etagere sont rotate a 180 deg ».
    `reviewer.md` says « Judge what the player's camera sees, not the number that stands for it ».
- Whole-game review r1 (F99-review, 11-14) listed under « Verified and fine »: « Tutorial on a phone: …
  berries to the shelf, the till pays » and « Every HUD menu on the phone opens … ». The board's first play the
  next day: « Ramassage des baies cassé » (B2), « sur certaines UI, le fond noir ne couvre pas tout l'écran sur
  téléphone » (B13). r1's 17 issues were code-reading server bugs and suite failures; none was about the look.

### c) Board-fix batches regress what they do not test (FIXBATCH 31, the largest point)

`rules.md` rule 11: « Fix what was asked, test only what you touched … Reviewers and the Lead dev … never
[send back] for a missing test ». Each batch was judged on its spot only, and broke or half-did its neighbours:
- B16-shelf-types swapped 102 shelves; 16 ended up facing the wall (11-20 B1); the hand fix of B1 then turned 24
  row-C tables the wrong way (11-20 B1b, « Les game.Workspace.Map.Plot1.Store.BerryShelf sont comme rotate a 180
  deg »).
- B17-onboarding removed the bag pads but left `Pad_Boots`: 11-18 « y'a toujours les plques de tyccoon » (B21).
- B18-ui-shell moved Settings to TopbarPlus, not Visit: 11-19 « les teleportaion en haut a droite n'est pas dans
  topbar » (B3). B18-staff-walk made staff walk, the upgrade prompt stayed: 11-19 B9.
- B16-map-pass gave furniture collision; customers' paths were not re-checked: 11-17 « les clients passes a
  travers les etageres » (B21). B19 B2's invisible/drifting items came from three client bugs piled up by the
  B16–B18 stack tasks (pool handed back twice, squash read as rest pose).
- B15-fullscreen-insets made the backdrop edge to edge but shifted the window: 11-18 « par contre le menu en lui
  meme non ! (donc pas besoin de dacler le shop sur la droite » (B17).

### d) The 11-13 mass approval (MASS 14) — see §3

### e) Rules that existed and were not followed (RULE 11)

- Blur: `roblox-game-conventions` « Window bodies are see-through over the blurred world » (2026-10-13) → 11-16
  « des qu'un menu est ouvert mettre un blur d'arriere plan » (B25).
- « A price and its button recolour with the balance » → 11-16 B27 (bones button stroke not red).
- « Labels are fully readable at rest — never cut … Check it with the longest text » → 11-17 « le text "retour a
  ma boutique" depasse du button » (B33).
- « Touch has no hover: first tap shows the frame » → 11-20 « les hover … doivent etre que au clique » (B5).
- Reviewer rule « a sound and a pop on every gain » → 11-19 « rajouter un son pour les notifications du HUD ».
- UI kit look (strokes) → 11-16 « certain ui stroke ont pas la bonen couleurs » (B35).
- The board's own 11-13 decision, written into F6-customers-code's fixes: « tous les PNJ humains … sont des
  personnages Roblox blocky »; the worker built « R15 Roblox avatars built from a HumanoidDescription »; code
  review approved → 11-16 « certain client sont en R15 mais pas blocky » (B36).
- stud-map §4 (one Part per floor) → 11-14 audit: floors « faits de plein de petites Parts ».
- `roblox-luau-knit` ScreenInsets rule → 11-15 B13 (black background not full screen on phones).

### f) Process (PROCESS 7)

- Questions written into a review file and never put to him: B17-map-layout and B17-remove-pass sat paused
  11-17 → 11-18/19. 11-18 B9: « tu n'as pas changer le fait que l'on aie la deuxieme ressources rapidement … (je
  crois que toutes les taches ne ce sont pas faites »; triage: « B17-map-layout was paused on questions written
  in the review file, which were never put to him ». B8 « jsp pourquoi j'ai toujours le Super Paleontologue qui
  spawn ? » (same cause).
- Off-Conductor work left unmerged: the baked Museum (`worktree-map-stud-audit`, 2795dbe, 11-14) → 11-18 « le
  model du musse est pas dans la main place » (B15).
- Library kit fix not synced: 11-13 build-tests « il manque l'icon / la frame correct de la notif » then « tu
  peut l'envoyer a run a dino shop conductor »; 11-16 « les notification sur le HUD n'ont pas le bon style
  normalement y'avais une session qui avait fix » (B32).
- Passes owned by the creator: three rounds lost on « le raptoir aprivoiser est donner direct je comprends pas »
  (11-16 B19), « y'a un super paleontologue qui fly » (11-17), « okdonc ignore les bug qui vienne du fait que
  j'avais les gamepasse » (11-17). No « play as a player without passes » mode was built (question 4, 11-16,
  unanswered).

## 3. The 33 mass-approved tasks (11-13 07:23 UTC, 08:23 Paris, « Approved: Accepté sans test Studio (slots pleins) »)

Pattern in the notes (F2-stack-code, F7-hatch-ui, F15-pets-ui): the worker codes without a copy, polls
`copy_limit` 30–40 min, answers blocked with « Nothing was seen, played or captured »; the PM escalates; the
human approves; the Lead dev merges and builds it into the real place (« Not tested, because the board accepted
the task without a Studio pass »). A catch-up wave (`-a` tasks, 11-13 afternoon) was then reviewed against the
brief, and most defects below survived it.

Came back as board fixes (13 clearly, 3 partly):
| Task | Came back as |
| --- | --- |
| F2-stack-code | 11-15 B2 « Ramassage des baies cassé », B4 floating items; 11-16 B1–B3; 11-17 B1, B2; 11-19 B2 |
| F3-pad-code | 11-16 B38 « pas que 1 pads par 1 pads »; 11-17 B24 bag pads; 11-18 B21 tycoon pads |
| F7-hatch-ui | 11-15 B8 spam, B9 no 3D baby; 11-16 B40 « le popup »; 11-17 B13 remove it |
| F14-skilltree-ui | 11-15 B7 portraits; 11-16 B24 full screen; 11-17 B7/B8 split; 11-19 B5 two black backgrounds |
| F15-pets-ui | 11-16 B39 « les dino dans les viewpoert ne sont pas centered »; 11-17 B9 equip best |
| F16-museum-hall | 11-14 audit « moche, un simple bloc »; 11-18 B15 |
| F17-visit-ui | 11-17 B33 « retour a ma boutique » overflows; 11-19 B3 topbar |
| F20-boosts-ui | 11-16 B28 « l'icon du x2 cahs est ignoble », B33 friends « + »; 11-20 B5 tap tooltips |
| F21-playtime-ui | 11-16 B22 « les cartes des gift sont rotated », B23 rarity backgrounds |
| F22-shop-ui | 11-16 B26, B27; 11-17 B31 accessories in the viewport |
| F24-guide-vfx | 11-16 B37 « pas avoir de beam / tuto pour chaque chose a acheter » |
| F24-intro-camera | 11-16 B13 « le dino noire au debut la on ne comprends rien » |
| F26-thumbnails | store art redone 11-13/14 (green dots, dinos backwards, avatar) |
| partly: F5-feel-vfx | 11-19 B2 (MachineFx squash read as rest pose, furniture drift) |
| partly: F12-map-era2 | 11-16 B12 placeholders (both eras); 11-20 question 7 (era 2 tables) |
| partly: F19-meteor-vfx | 11-19 B7 « les oeufs qui tombent des meteorites … il deviens petit et pas le meme oeuf » |

Not seen back: F6-customers-anim, F6-feel-vfx, F7-feel-vfx, F8-commons-era1-anim, F8-epics-era1-anim,
F8-mythics, F8-mutation-looks, F10-feel-vfx, F11-rebirth-ui (only reviewer r1 items), F12-item-icons-era2,
F12-thieves-feel-vfx, F13-staff-anim (clips never used: staff became avatars), F15-feel-vfx, F17-leaderboards-ui,
F18-feel-vfx, F21-codes-code, F1-plot-code-a. Note: the UI screens are 9 of the 13; every mass-approved UI screen
except leaderboards and rebirth came back.

## 4. What Romain did by hand outside the Conductor, and why

| When | What | Why (his words / evidence) |
| --- | --- | --- |
| 11-12 | GDD, map layout V4, references, before the Conductor | design phase (« la layout du shop et des farm je trouve ca vraiment pas ouf ») |
| 11-13 14:16 | F1-map-dressing run by a session (36c0bdc), later approved « Built outside the Conductor » | no task did the placeholder swap; prompt: « Exécute toi-même cette tâche … sauf si les règles exigent qu'elle passe par le conductor » |
| 11-13 15:47 | catch-up task list for the work « accepted without Studio » (50bf6b4) | the mass approval left screens unbuilt (DinosGui, GiftsGui, LeaderboardGui…) |
| 11-13 23:36 → 11-16 | store art redone twice in sessions (`worktree-store-art-redo` unmerged; thumbnails v3 merged b0aa9452) | « c'est vraiment nul »; « trop dans le même style », « pas assez retouchées » |
| 11-14 20:10 | map stud audit with sub-agents (museum, trees, floors; `worktree-map-stud-audit`, 3 commits never merged) | before publishing; at 23:10 he asked « Enfin, pourquoi tu l'as fait toi-même alors que tu t'aurais pu mettre les tâches dans le conducteur et ça aurait été good? » |
| 11-14 23:35 | billboards readability session (beside the B15 task) | « la c'est trop compliqué à comprendre » |
| 11-15 → 11-18 | every review pasted into a session that files Conductor tasks | « use le conductor pour manage ca » (11-16) |
| 11-15, 11-16 | Conductor fixes: copy slots owned by the Conductor (82915246), spawn E2BIG (136 « Waiting » results in B15-carry-mixed's history) | « Romain reçoit des escalades sans arrêt et ne veut plus gérer ça » (prompt of 11-15); « 4 oui fix le conductor » |
| 11-19 13:15 | B19: 11 items fixed in one session (branch b19-romain-playtest, a34ede2b, 54 files, +1 025) | « ok sans passer par le conductor » |
| 11-20 09:14 | B20: 13 items + babies redesign by sub-agents (b20-romain-playtest: eac9061a 128 files +5 520; 337a8e6e 56 files +4 190; strokes, row C) | « n'utilise pas le conductor », « lance des subagents pour chaque taches » |

Both B19 and B20 branches are not merged into main (main HEAD 3362c90, 11-19 13:43).
Why he left it: speed and blocking, not only quality. Compare (all times UTC; transcripts are UTC, git is
+0100): in-session B19 took **~52 min** (message 13:15, commit a34ede2b 14:07, B7–B11 added on the way); B20's
12 items **~1 h** (09:14 → 10:14), the babies redesign merged by 11:28, the billboard strokes in 12 min (14:24 →
14:36). Conductor batches (first run → last run): B15 40.6 h (185 work runs, median 0.4 min: empty copy_limit
loops), B16 9.7 h, **B17 47.9 h** (two tasks paused on unasked questions), **B18 27.6 h** (B18-map-fixes ran 10
empty times on a WSL failure, 11-18 13:57 → 11-19 08:49, ~19 h, then asked him; he answered « wsl fonctionne »,
it asked again).

## 5. What he said about speed, blocking, the Conductor (dino-shop period)

- 11-12 17:45 « c'est combien d'agent en parralele max ? »; 17:47 « met en 4 avec leurs propres studio et met
  max 8 »; 11-12 (workspace) « maximiser ça, pour que ça se finisse le plus rapidement possible, mais avec le
  même résultat ».
- 11-13 14:11 « tu peux check si tout les playtest de test de dino sont bien ou alors ils sont just overkill et
  trop chronophage en terme de temps d'exec »; 15:02 « j'espere qu'elles ne retest pas tout les playtest a chaque
  changement sinon ca prendrait trop de temps les playtest c'est vraiment pour tester le jeu quoi ».
- 11-14 23:10 « pourquoi tu l'as fait toi-même alors que tu t'aurais pu mettre les tâches dans le conducteur et
  ça aurait été good? »
- 11-16 09:25 « use le conductor pour manage ca »; 11:05 « check si tout avance bien »; 12:04 « ca avance ? »;
  12:36 « je vois que l'agent qui s'occupe de ca ne fait pas ca ».
- 11-16 13:02 (workspace) « analyse moi comment le dernier jeu a ete fait par le conductor, et dit moi si la code
  base et la maniere de faire, des notes etc est bien ou pas ».
- 11-17 14:20 « debloque la situation du conductor y'a une tache bloqued » (B17-customers: three retries re-ran
  the review, never the worker; PM: « Je ne peux pas forcer le worker depuis ici »).
- 11-18 08:46 « lance sandblock code + le studio stp »; 10:08 « check si tou ce passe bien »; B9 « je crois que
  toutes les taches ne ce sont pas faites ».
- 11-19 08:52 « check si y'a des taches bloquer dans le condiuctor et debloque les »; 09:30 « regle toi meme »;
  08:53 (workspace) « dans le sandblock conductor y'a trop de taches bloquer, et j'ai l'impression que le PM ne
  les regles pas et que c'est que a moi des les relancer ».
- 11-19 13:15 « ok sans passer par le conductor »; 11-20 09:14 « n'utilise pas le conductor ».
- 11-20 15:26 « les résultats des jeux créés (en terme de quality) par le conductor sont clairement moins bien
  que au début, de plus c'est plus que super lent »; « le conductor pose trop de questions qui auraient pu être
  répondues par le PM, et il se bloque souvent pour rien ».

## 6. Findings ranked by impact on quality

1. **The visual gate does not judge what the player sees.** Art director on Sonnet approves 90 % (118/131),
   checks kit conformity, tag counts, the worker's PASS lines; only 2 approvals mention the player's camera. 28
   board items were approved by a reviewer; UI is the largest family (47). Visual work is built on Opus and
   judged on a weaker model; `team.yaml` itself says « Opus … for those who check ».
2. **Board-fix batches regress (31 items, the largest catch point).** Rule 11 makes each fix judge one spot
   once and forbids sending back for a missing test; with 15–17 fix tasks per batch touching the same stack,
   customers, shelves and HUD, each batch broke or half-did the next one's ground (shelves 180°, Boots pad left,
   topbar half done, customers through shelves, invisible items).
3. **Design was decided by agents and rubber-stamped.** 48 calls approved in 34 s at plan time (PM recommending
   « tout en A »), 32 later DCs « not put to it », « Romain valide tous les assets par défaut » (his 11-13 task prompts). At least six
   agent-chosen or rubber-stamped calls came back reversed (DC-12, DC-17, DC-18, DC-53, DC-95, the guide on
   every pad).
4. **Mass approval of 33 unseen tasks** (11-13 07:23): 13 came back clearly, 3 partly; 9 of them UI screens.
   The catch-up `-a` tasks re-checked « built and seen », not the defects.
5. **Planner gaps**: no placeholder-to-model swap, two berry stands, bag pads, a guide on every pad, no carrier
   prop; map shipped « placeholders by design » and the 11-14 r1 review called the map « clean ».
6. **Process stalls drove him off the Conductor**: paused tasks whose questions never reached him (B17-map-layout,
   B17-remove-pass), a 19 h WSL stall, 57 manual retries, PM escalating 84 times and answering 4; then B19 and
   B20 done by hand in about an hour each, both still unmerged.
7. **Testing on the creator's account** hid the player's game for three rounds (passes owned automatically).

## 7. Notes on method

- « D/R/N/P » and the catch point are my reading per item; borderline ones (e.g. lighting, x2 icon, equip best,
  TopbarPlus) could move between D and N. Counts per review: 11-13 5, 11-14 9, 11-15 14, 11-16 43 (incl. one
  store-art remark), 11-17 37, 11-18 22, 11-19 11, 11-20 15. B41 (11-16, « fait une passe » on the Conductor) and
  B16 (11-17, « ignore les bug ») are not counted; B13 (11-20) was dropped by him.
- `fixes`/attempts in the DB: most visual tasks have attempts = 0 (approved first time).

## 8. Every item

| Date | Item | Trade | Nature | Where it should have been caught | Task / origin | His words |
| --- | --- | --- | --- | --- | --- | --- |
| 11-13 | E1 | UI | N | NEW | F0-ui-shell fix | « cash en bas à gauche » |
| 11-13 | E2 | UI | N | NEW | F0-ui-shell fix | « icônes de boost sous l'argent » |
| 11-13 | E3 | MAP | N | NEW | F1-map-dressing | « pads gris uniquement sous les choses où l'on met dedans » |
| 11-13 | E4 | UI | D | PROCESS | kit 1.1.1 (build-tests) | « il manque l'icon / la frame correct de la notif » |
| 11-13 | E5 | ANIM | N | NEW | F6-customers-code fixes | « tous les PNJ humains blocky » |
| 11-14 | S1 | STORE | D | WORKER | F26-thumbnails(-a) | « des petits points verts » |
| 11-14 | S2 | STORE | D | RULE | F26-thumbnails(-a) | « dinos tous retournés » |
| 11-14 | S3 | STORE | D | REVIEW | F26-thumbnails(-a) | « le perso Roblox est nul » |
| 11-14 | S4 | STORE | N | NEW | thumbnails v3 | « trop dans le même style » |
| 11-14 | S5 | STORE | N | NEW | thumbnails v3 | « pas assez retouchées, trop capture brute » |
| 11-14 | S6 | STORE | N | NEW | thumbnails v3 | « s'inspirer vraiment des concurrents » |
| 11-16 | S7 | STORE | N | NEW | thumbnails v3 | « les texte sont moche » |
| 11-14 | M1 | MAP | D | REVIEW | F16-museum-hall(-a) | « le musée ... moche, un simple bloc » |
| 11-14 | M2 | ART | D | REVIEW | F1-map / map | « les arbres sont très moches » |
| 11-14 | M3 | MAP | D | RULE | F1-map (stud-map §4) | « sols faits de plein de petites Parts » |
| 11-15 | B1 | ECON | N | NEW | B15-shelves-fixed | « Rayons : 8 places dès l'achat, ne s'améliorent plus » |
| 11-15 | B2 | CODE | D | MASS | F2-stack-code | « Ramassage des baies cassé » |
| 11-15 | B3 | CODE | N | NEW | B15-carry-mixed | « porter plusieurs types » |
| 11-15 | B4 | ANIM | D | MASS | F2-stack-code (no carrier in plan) | « ils flottent dans le vide derrière lui » |
| 11-15 | B5 | CODE | N | NEW | B15-showcase-carry | « le joueur porte lui-même le dinosaure » |
| 11-15 | B6 | ANIM | D | AGENTDC | DC-95(6) random avatar outfits | « une vraie tenue d'employé » |
| 11-15 | B7 | UI | D | REVIEW | F14-skilltree-ui | « on ne sait pas qui est la première caisse » |
| 11-15 | B8 | UI | D | MASS | F7-hatch-ui (r1 R1-10 'fixed') | « la notification ... spamme en permanence » |
| 11-15 | B9 | UI | D | MASS | F7-hatch-ui | « Il manque le viewport 3D du bébé » |
| 11-15 | B10 | ANIM | D | MASS | pets (F15) | « Il manque l'animation de bulk (rebond) » |
| 11-15 | B11 | LABEL | D | REVIEW | F0-world-labels | « on ne sait pas quel item va dans quel rayon » |
| 11-15 | B12 | MAP | D | BRIEF | F1-map placeholders | « Map pas finie et pas polie » |
| 11-15 | B13 | UI | D | RULE | kit screenGui (phone insets) | « le fond noir ne couvre pas tout l'écran » |
| 11-15 | B14 | LABEL | D | REVIEW | F0-world-labels/F1-pad-labels | « trop compliqués à comprendre » |
| 11-16 | B1 | FEEL | R | BRIEF | DC-53 (H16) | « doit les recuperer 1 par 1 » |
| 11-16 | B2 | FEEL | R | BRIEF | DC-53 (H16) | « pareille des que je les poses » |
| 11-16 | B3 | CODE | D | MASS | F2-stack-code | « c'est bug si y'a des client » |
| 11-16 | B4 | CODE | D | REVIEW | F6-customers-code | « les clients se mettent pas bien devant la caisse » |
| 11-16 | B5 | LABEL | R | FIXBATCH | B15-shelf-signs | « l'icon du fruit ne doit pas etre en billboard » |
| 11-16 | B6 | LABEL | R | FIXBATCH | B15-billboards-readability | « il ne doit pas y avoir marque le nombre » |
| 11-16 | B7 | UI | N | NEW | B16-loading-screen | « un laoding screen » |
| 11-16 | B8 | MAP | D | REVIEW | F1-map / F6-shop-props | « les etageres / meubles doivent avoir des colision » |
| 11-16 | B9 | MAP | D | RULE | F1-map (scale a character believes) | « les barriere des enclos sont torp hautes » |
| 11-16 | B10 | MAP | R | AGENTDC | DC-12 swinging spans | « elles souvre toutes donc c'est nul » |
| 11-16 | B11 | CODE | R | FIXBATCH | B15-berry-pickup | « 1 baie sur l'arbre a baie correspond a 1 baie » |
| 11-16 | B12 | MAP | D | BRIEF | F1-map-dressing 'placeholders by design' | « plein de choses construites en studs sont ds placeholder » |
| 11-16 | B13 | FEEL | R | BRIEF | DC-17 (Q3 batch) / F24-intro-camera | « le dino noire au debut la on ne comprends rien » |
| 11-16 | B14 | CODE | D | REVIEW | station labels | « ca met que le brouteur est max alors que non » |
| 11-16 | B15 | MAP | D | REVIEW | F18-delivery / F1-map | « la premiere station de livraision donner n'est pas la bonne » |
| 11-16 | B16 | MAP | N | NEW | B16-map-pass | « si il n'y a pas de station remplacer par un mur » |
| 11-16 | B17 | CODE | N | NEW | DC-127 (replaces DC-54) | « les clients doivent poser leurs articles sur un coter » |
| 11-16 | B18 | ART | N | NEW | B16-lighting | « Revoir la lighting » |
| 11-16 | B19 | ECON | P | PROCESS | pass owned by creator | « le raptoir aprivoiser est donner direct » |
| 11-16 | B20 | ANIM | D | REVIEW | tame raptor harness | « elle ne suit pas le dino » |
| 11-16 | B21 | ANIM | R | FIXBATCH | B15-pet-bounce | « ne joue pas leurs animation de walk ... fond des bonds » |
| 11-16 | B22 | UI | D | MASS | F21-playtime-ui | « les cartes des gift sont rotated » |
| 11-16 | B23 | UI | D | MASS | F21-playtime-ui (rarity ladder rule) | « les carte qui on du loot meilleurs ... background different » |
| 11-16 | B24 | UI | N | NEW | F14-skilltree-ui | « le skill tree doit prendre tout l'ecran » |
| 11-16 | B25 | UI | D | RULE | conventions: blurred world | « mettre un blur d'arriere plan » |
| 11-16 | B26 | UI | D | MASS | F22-shop-ui | « les pack stylee ne sont pas asser mis en avant » |
| 11-16 | B27 | UI | D | MASS | F22-shop-ui (rule: price recolours) | « le stroek n'est pas rouge » |
| 11-16 | B28 | ART | D | MASS | F20-boosts-ui | « l'icon du x2 cahs est ignoble » |
| 11-16 | B29 | FEEL | N | NEW | B16-berry-bush-model | « les baie doivent pousser 1 par 1 » |
| 11-16 | B30 | CODE | N | NEW | B16-drop-button | « un button drop item » |
| 11-16 | B31 | CODE | D | REVIEW | reset data (admin) | « le reset data ne reset pas tout » |
| 11-16 | B32 | UI | D | PROCESS | kit 1.1.1 not synced | « les notification sur le HUD n'ont pas le bon style » |
| 11-16 | B33 | UI | D | MASS | F20-boosts-ui / f20-boosts-code-a-a | « le button + des friends est pas en haut » |
| 11-16 | B34 | MAP | R | BRIEF | DC-18 (Q4 batch), B15-map-polish | « la partie pas unlocked ne doit pas avoir de part » |
| 11-16 | B35 | UI | D | RULE | UI kit look: strokes | « certain ui stroke ont pas la bonen couleurs » |
| 11-16 | B36 | ANIM | D | RULE | F6-customers-code (board call 11-13) | « certain client sont en R15 mais pas blocky » |
| 11-16 | B37 | FEEL | R | BRIEF | F24-guide-vfx brief, F24-ftue-code | « pas avoir de beam / tuto pour chaque chose » |
| 11-16 | B38 | ECON | R | BRIEF | PadRules one pad at a time | « pas que 1 pads par 1 pads » |
| 11-16 | B39 | UI | D | MASS | F15-pets-ui | « les dino dans les viewpoert ne sont pas centered » |
| 11-16 | B40 | UI | D | MASS | F7-hatch-ui | « le popup Nouveau Dino en bas de l'ecran » |
| 11-16 | B42 | MAP | N | NEW | B16-shelf-types | « les etagere soit different » |
| 11-16 | B43 | CODE | R | BRIEF | B15-carry-mixed brief (one column per product) | « il s'empile quand meme dans la meme ligne » |
| 11-17 | B1 | FEEL | D | REVIEW | stack flights into stations | « elle ne tween pas jusqu'au bon endroits » |
| 11-17 | B2 | CODE | D | FIXBATCH | B16-stack-flow | « tous les client l'on dans la main » |
| 11-17 | B3 | ECON | P | PROCESS | pass owned by creator | « je ne comprends pas le raptor aprivoiser » |
| 11-17 | B4 | ECON | R | FIXBATCH | B16-stack-flow (one berry every 3 s) | « elle reaparait a son endroit apres 2 s » |
| 11-17 | B5 | CODE | R | FIXBATCH | B15-berry-pickup zone beside bushes | « lorsque l'on est sur le buisson en lui meme » |
| 11-17 | B6 | FEEL | R | FIXBATCH | B16-drop-button grid | « ils doivent se mettre en hauteur pas en grille » |
| 11-17 | B7 | UI | N | NEW | B17-skill-tree-split | « l'arbre de competence ... sur la machine » |
| 11-17 | B8 | UI | N | NEW | B17-skill-tree-split | « un arbre generale ... au milieu en bas » |
| 11-17 | B9 | UI | N | NEW | B17-ui-fixes | « un button equip best » |
| 11-17 | B10 | LABEL | D | FIXBATCH | B15/B16 billboards | « fix les billboard » |
| 11-17 | B11 | CODE | D | REVIEW | customers / showcase | « les npc qui achete des dino dans les vitrines » |
| 11-17 | B12 | CODE | N | NEW | B17-nursery | « un petit enclos a coter » |
| 11-17 | B13 | UI | R | FIXBATCH | B15-hatch-notice | « enelver la popup a chaque fois » |
| 11-17 | B14 | ANIM | D | REVIEW | staff spots | « un super paleontologue qui fly » |
| 11-17 | B15 | ECON | N | NEW | B17-remove-pass | « enleve ce gamepass c'est trop cheat » |
| 11-17 | B17 | FEEL | D | FIXBATCH | StackFx squash on slabs | « le sol gris ne doit pas scale » |
| 11-17 | B18 | MAP | R | FIXBATCH | B16-customers pile | « la pile d'argent doit etre plus large » |
| 11-17 | B19 | LABEL | N | NEW | B17-billboards | « pas besoin de billboard sur les plants de baie » |
| 11-17 | B20 | CODE | D | REVIEW | customers | « les clients se rentre dedans » |
| 11-17 | B21 | CODE | D | FIXBATCH | B16-map-pass collisions vs customer paths | « les clients passes a travers les etageres » |
| 11-17 | B22 | ECON | D | REVIEW | customers density | « y'a trop de clients pas asser espacer » |
| 11-17 | B23 | CODE | D | FIXBATCH | B16-onboarding | « le onboarding est bug ... bush de bais a acheter » |
| 11-17 | B24 | ECON | R | BRIEF | Big Bag pads (plan) | « les amelioration de sac ... pas avec des pads au sol » |
| 11-17 | B25 | ECON | R | FIXBATCH | DC-130 end of guide | « on doit recruter un employer ... mais il est lent » |
| 11-17 | B26 | MAP | R | BRIEF | plot layout (two berry stands) | « il ne faut que 1 stand max par ressources » |
| 11-17 | B27 | MAP | R | BRIEF | plot layout | « mettre le brouteur a la place du TRex » |
| 11-17 | B28 | CODE | N | NEW | B17-customers | « l'argent peut etre reucper des deux coter » |
| 11-17 | B29 | MAP | N | NEW | B17-bin-model | « les poubelles doivetnt etre fermer » |
| 11-17 | B30 | ANIM | N | NEW | B17-hands-carry (reverses his own B15 B4) | « mettre les objet dans les main » |
| 11-17 | B31 | UI | D | REVIEW | shop cosmetics preview | « les accersoires a acheter sont mal poser » |
| 11-17 | B32 | UI | N | NEW | B17-ui-fixes | « pas depasser 2 icon en horizontal » |
| 11-17 | B33 | UI | D | RULE | labels never cut, longest text (F17-visit-ui) | « le text retour a ma boutique depasse » |
| 11-17 | B34 | LABEL | D | RULE | world labels on walls | « les billboard pret des mur ... passer dans le mur » |
| 11-17 | B35 | ECON | R | AGENTDC | DC-95 jobs (agent of F13-staff-code) | « revois les metier » |
| 11-17 | B36 | ECON | R | BRIEF | §5 recipes, DC-115 trays (model has 2 trays) | « 1 de chaque ressoucre d'input pour faire 1 » |
| 11-17 | B37 | FEEL | N | NEW | B17-machines | « les output des machiens doivent se stack en 2x2 » |
| 11-17 | B38 | CODE | N | NEW | B17-customers | « acheter plusieurs choses » |
| 11-18 | B1 | ECON | R | REVIEW | F99-balance | « le debut est trop long recolter 150$ » |
| 11-18 | B2 | ANIM | N | NEW | B18-staff-walk / customers-hands | « les NCP doivent prendre les objets dans les mains » |
| 11-18 | B3 | ANIM | R | FIXBATCH | B17-hands-carry pose | « raprocher plus les mains » |
| 11-18 | B4 | FEEL | N | NEW | B18-stack-speed | « recupere les ressoucres plus vite » |
| 11-18 | B5 | FEEL | D | REVIEW | zone = root centre over slab | « surtout pour le premier item » |
| 11-18 | B6 | CODE | D | REVIEW | customer/staff paths | « forcement passer par les entree » |
| 11-18 | B7 | ANIM | R | AGENTDC | DC-95 (1) never walks | « le magasinier ... ne se deplace pas » |
| 11-18 | B8 | ECON | P | PROCESS | B17-remove-pass paused, question never seen | « j'ai toujours le Super Paleontologue » |
| 11-18 | B9 | MAP | P | PROCESS | B17-map-layout paused, questions never asked | « je crois que toutes les taches ne ce sont pas faites » |
| 11-18 | B10 | MAP | D | FIXBATCH | till money tray vs CashSpot | « la plaque grises de la caisses est pas bonne » |
| 11-18 | B11 | MAP | D | REVIEW | showcase wall openings | « les endroits des vitrines ... pas fermee » |
| 11-18 | B12 | MAP | D | FIXBATCH | B17-piles bins (decor bins left) | « y'a des poubelle encore pas fonctionelle » |
| 11-18 | B13 | CODE | D | REVIEW | shelf drop handler | « on peut quand meme mettre des baie dessus » |
| 11-18 | B14 | ECON | D | BRIEF | events gating | « pas de meteorite ... tant que l'on a pas de ecloseur » |
| 11-18 | B15 | MAP | P | PROCESS | museum on unmerged off-Conductor branch | « le model du musse est pas dans la main place » |
| 11-18 | B16 | UI | N | NEW | B18-ui-shell | « settings soit topbar plus » |
| 11-18 | B17 | UI | R | FIXBATCH | B15-fullscreen-insets | « respecter les insets du telephones » |
| 11-18 | B18 | UI | N | NEW | B18-events | « une icon en bas a droite avec le timer » |
| 11-18 | B19 | FEEL | N | NEW | B18-customers-hands | « la meme animation que lorsque c'est le joueur » |
| 11-18 | B20 | MAP | D | REVIEW | incubator DropZone beside machine | « certaines hitbox ... pas bonne » |
| 11-18 | B21 | ECON | D | FIXBATCH | B17-onboarding left Pad_Boots | « y'a toujours les plques de tyccoon » |
| 11-18 | B22 | UI | D | REVIEW | StationUpgradesController | « ca ouvre le menu + le ferme » |
| 11-19 | B1 | MAP | D | REVIEW | staff spots | « raproche les caissier de la caisse » |
| 11-19 | B2 | CODE | D | FIXBATCH | stack/machine squash, pool (B16-B18) | « bugs de positionnement ... ressources invisible » |
| 11-19 | B3 | UI | D | FIXBATCH | B18-ui-shell (settings only) | « les teleportaion ... pas dans topbar » |
| 11-19 | B4 | UI | D | RULE | a sound on every gain/toast | « rajouter un son pour les notifications » |
| 11-19 | B5 | UI | D | FIXBATCH | B16-ui-menus dim + confirm shade | « 2 background noire » |
| 11-19 | B6 | FEEL | N | NEW | DC-163 | « un petit delai » |
| 11-19 | B7 | FEEL | D | REVIEW | meteor egg (F19/F9) | « il deviens petit et pas le meme oeuf » |
| 11-19 | B8 | CODE | N | NEW | DC-164 | « il doivent remarcher jusqu'a l'enclos » |
| 11-19 | B9 | UI | D | FIXBATCH | B18-staff-walk | « le proximity prompt reste a l'endroit » |
| 11-19 | B10 | MAP | D | FIXBATCH | B17-machines-model counter | « les machines sont en can collide false » |
| 11-19 | B11 | CODE | D | FIXBATCH | B17-staff-jobs / B18-staff-walk | « le magasinier ... pas que attendre les ressources de base » |
| 11-20 | B1 | MAP | D | FIXBATCH | B16-shelf-types prop swap | « rotate a 180 deg » |
| 11-20 | B1b | MAP | D | FIXBATCH | B20's own B1 fix (row C) | « BerryShelf sont comme rotate a 180 deg » |
| 11-20 | B2 | ECON | N | NEW | DC-167 | « 3 remplisseur d'etagere » |
| 11-20 | B3 | ECON | N | NEW | DC-168 | « les employee doivent aller bcp moins vite » |
| 11-20 | B4 | ECON | N | NEW | DC-169 | « s'incrementer 1 par 1 » |
| 11-20 | B5 | UI | D | RULE | touch has no hover (conventions) | « les hover ... doivent etre que au clique » |
| 11-20 | B6 | LABEL | N | NEW | B20 world labels | « le style des billboard ... a revoir » |
| 11-20 | B7 | LABEL | R | FIXBATCH | counts on outputs | « pas de billboard x/4 » |
| 11-20 | B8 | MAP | N | NEW | DC-171 | « la poubelle doit etre placer a coter » |
| 11-20 | B9 | LABEL | N | NEW | DC-172 (contradicts standing AlwaysOnTop=false) | « always on » |
| 11-20 | B10 | ART | D | REVIEW | shared feeder mesh modelled with a berry | « montre une baie alors que c'est des poisson » |
| 11-20 | B11 | UI | D | FIXBATCH | cash moved 11-13, pop not | « + x$ est mal placer » |
| 11-20 | B12 | ECON | N | NEW | DC-170 | « augmenter leurs speed » |
| 11-20 | B14 | CODE | R | FIXBATCH | DC-117 -> DC-138 chain | « la gestion des petit dino ... dificile » |
| 11-20 | S | LABEL | D | WORKER | world-labels strokes | « des pixels qui passent » |