# Ton Taste dans les skills : les lignes proposées

Rien n'est encore écrit dans les skills : c'est la liste à valider.

**Comment elle a été faite (2026-11-20).** Les quatre analyses de ce dossier
ont donné 386 remarques. Chacune a été comparée au texte actuel de
tous les skills : 119 y sont déjà (pas reprises), 23 ont été
écartées (un détail d'un seul jeu, une consigne ponctuelle, une citation
introuvable), 9 lignes ont été retirées à la vérification. Restent
**138 lignes**, chacune avec tes mots retrouvés tels quels dans tes
messages, avec leur date et leur jeu. Les lignes sont en anglais, comme les
skills ; tes citations restent en français.

| Skill | Lignes |
| --- | --- |
| `roblox-game-conventions` | 55 |
| `roblox-game-dna` | 29 |
| `game-balancing` | 8 |
| `stud-animations` | 7 |
| `roblox-thumbnails` | 7 |
| `map-builder` | 6 |
| `vfx-creator` | 5 |
| `roblox-agent-team` | 5 |
| `sound-designer` | 3 |
| `asset-kit` | 2 |
| `roblox-game-review` | 2 |
| `roblox-localization` | 1 |
| `roblox-experience-events` | 1 |
| `stud-map` | 1 |
| `map-assembly` | 1 |
| `fps-weapon-blender` | 1 |
| `blender-image-to-3d` | 1 |
| `roblox-thumbnail-variant` | 1 |
| `to-tasks` | 1 |
| `sandblock-game-boilerplate/CLAUDE.md` | 1 |

## Ce que je recommande en plus

`roblox-game-conventions` fait déjà 59 Ko et en prendrait 55 lignes de plus
(environ 90 Ko). C'est une des causes de la baisse de qualité : les agents
lisent tout et en suivent moins. Je propose de ranger ses lignes par métier
(UI, monde et caméra, combat, PNJ) dans des fichiers `references/` du skill,
le SKILL.md gardant l'index, pour que chaque rôle ne lise que sa partie.

## Les contradictions avec les skills actuels

Tranchées par ta remarque la plus récente (sauf avis contraire de ta part) :

| Sujet | Ce que dit le skill | Ce qui devient la règle |
| --- | --- | --- |
| Contour d'un texte en couleur | noir partout | un texte en couleur a un contour de sa couleur, plus foncé ; le noir reste pour le texte blanc (Run a Dino Shop!, 2026-11-16) |
| Aide à la visée | tactile seulement | tactile et manette dans les shooters, jamais clavier/souris (MP5 Arena, 2026-11-05) ; Throw a Weapon ne change pas |
| Touche Ctrl | libère la souris | libère la souris, sauf si le jeu s'en sert pour une action (la glissade de MP5 Arena) : la souris se libère alors en ouvrant un menu |
| Réglages des effets de caméra | un curseur pour chacun | la règle reste ; MP5 Arena les cache « pour le moment » |
| Billboards des pads d'achat | jamais AlwaysOnTop | AlwaysOnTop pour le label d'un pad d'achat, pour voir le prochain achat à travers les murs (Run a Dino Shop!, 2026-11-20) |
| Beam du tutoriel | un beam à chaque nouvel achat | le beam ne guide que la première boucle (Run a Dino Shop!, 2026-11-16) |
| Prix du starter pack | 49 à 99 R$ | un premier achat très bas, 9 à 29 R$, en prix finissant par 9 (tes prix sur Anime Aura Farming et Stop The Eruption) |
| Dégradé de plusieurs couleurs dans un titre | une seule teinte | une seule teinte partout (tes remarques du 15/10 et du 02/11 sont plus récentes que le titre d'Anime Aura Farming) |
| Planning des events en jeu | dans le code, republier à chaque event | dans la config du Creator Hub, sans republier (MP5 Arena tourne comme ça depuis le 03/11) |
| Description du jeu sur Roblox | toujours avec sa traduction | en anglais par défaut, vérifiée sur la vraie page ; la traduction française quand tu la demandes |
| Image jointe sans explication | c'est la spec | l'agent écrit en une ligne comment il la prend (« je la prends comme la ref à suivre ») et continue : tu corriges si c'est un exemple à éviter (build-tests, 2026-11-13) |
| Musiques d'anime | jamais de copie uploadée | la règle reste : pas d'upload par un compte jetable pour échapper aux plaintes de droits d'auteur. Les copies avaient de toute façon été refusées par la modération le 02/10 |

Deux points touchent aux règles de Roblox, et ceux-là sont à toi :

1. **La récompense contre un like** (MP5 Arena, 2026-11-03) : Roblox interdit
   de récompenser chaque joueur pour un like, et un jeu peut être retiré pour
   ça. Je recommande de garder la règle (pas de récompense par joueur, un code
   commun quand le jeu atteint X likes) et de retirer celle de MP5 Arena.
2. **Le boost offert à un joueur qui veut partir** (Anime Aura Farming,
   2026-10-05 : « meme si cest un peu fake en term de drop ») : je recommande
   de garder l'idée (roue bonus et boosts quand un nouveau joueur ouvre le menu
   Échap), mais avec le plafond écrit à côté du x16, pour que ce qui est
   affiché soit ce qui est appliqué.

## Les lignes, skill par skill

### `roblox-game-conventions` (55)

**Breathing room in every window (2026-10-05)**, ajout (`G1-10`)

- **A layout follows its content**: a card is as tall as what it holds, rewards or buttons that leave their row or grid half empty are centred instead of sitting in fixed slots, and a tool panel (admin, debug) is as compact as any menu (Anime Aura Farming, 2026-10-06: « les cardes peuvent etre moin haute y'a moin de chose a mettre »; MP5 Arena, 2026-11-02: « ceneter les reward si y'a moins que 3 lignes », « le button doit etre centered si y'a de la place et pas d'autrecaisses a ouvrir »; Totally Normal Obby, 2026-11-02: « le menu d'admin est un peu trop gros »).

**Cutscenes and skips (2026-10-15 → 10-31)**, ajout (`G2-2`)

- **The first shot says what the game is about**: an intro opens on its subject, plainly lit against
  a contrasting background, so the player understands it at once (never a black silhouette or a dark
  locked object as the first thing seen), and keeps one sky from its first shot into play, so no cut
  jumps (Stop The Eruption, the client's notes relayed by Romain, 2026-10-16: « Le premier plan
  faudrais que ça sois le volcan de derrière pour bien voir et comprendre que c'est un volcan », « le
  ciel le mettre en bleu de base pour avoir un contraste avec le rouge du volcan », « Faut juste
  changer le ciel en bleu pour pas avoir de faux raccord »; Run a Dino Shop!, 2026-11-16: « le dino
  noire au debut la on ne comprends rien »).

**Cutscenes and skips (2026-10-15 → 10-31)**, ajout (`G2-3`)

- **A cutscene about the player shows the player's own avatar**, live in the shot, never a picture
  of a head, and one copied from a reference video is as rich as that video's transitions (Anime
  Aura Farming's aura cutscene, 2026-09-21: « la tete ca devra etre la tete du joueur et pas une
  image », « y'a pas moyen de rajouter plus de flames sur l'ui comme vraiment la transition de la
  video que je t'ai envoyee »).

**First-person camera (2026-10-29, MP5 Arena)**, ajout (`G2-6`)

- **A sight is worth equipping** (shooters): aiming through an optic narrows the FOV further than
  the iron sights and damps the bodycam effect further, so each optic visibly beats the irons (MP5
  Arena, 2026-11-05: « + zoom avec les viseurs -> augmenter le fov etc + peut etre reduire le bodycam
  effect pour rendre les viseur + utile »).

**First-person mouse and keys (2026-09-24)**, renforce une ligne existante (`G2-17`)

Remplace : _- **In a first-person game the PC cursor is hidden** (`UserInputService.MouseIconEnabled = false`   while the lock holds); the crosshair is the aim. It comes back under a menu, a dialogue, the end   screen, and outside first person._

- **In a first-person game the PC cursor is hidden** (`UserInputService.MouseIconEnabled = false`
  while the lock holds); the crosshair is the aim. It comes back under a menu, a dialogue, the end
  screen, and outside first person. **In every game an open menu frees a locked mouse**, a
  third-person game zoomed all the way in included, and a menu still open when the character dies
  keeps it free (Stop The Eruption, 2026-09-23: « si on est dans un menu alors ca nous debloque la
  souris car la la souris est stuck sinon sur pc ! »; Anime Aura Farming, 2026-10-01: « si on est en
  full zoomer et qu'on est dans un menu on dit avoir la souris libre car la sinon on peut rester
  coincer dans un menu »; MP5 Arena, 2026-11-02: « des que l'on meurt en etant dans un menu on ne vois
  plus notre souris »).

**First-person viewmodel (2026-10-16, Punch to Escape)**, ajout (`G2-7`)

- **The viewmodel's scale stays local** (shooters): another player's laser dot is drawn from their
  third-person gun at world scale, never sized like our own first-person one; the same holds for
  anything else drawn at the viewmodel's scale (MP5 Arena, 2026-11-02: « le parte spheriques au bout
  des lazer des autres joueurs ne doit pas se scale comme notre propre lazer »).

**HUD (2026-09-24)**, ajout (`G1-13`)

- **A gauge that ends in death shows it**: the game's death mark (a skull) sits at the end where the player dies, so the danger reads without a tutorial (Stop The Eruption, 2026-10-27, the lava gauge: « rajouter un tete de mort en haut du HUD game a droite pour bien montrer que si ca arrive en haut on meurt »).

**HUD (2026-09-24)**, ajout (`G1-21`)

- **A death countdown can be skipped** (games with a respawn timer): a Respawn button, its key (Space, the pad's A) and a click or a tap on the screen respawn at once, and a bar shows when the automatic respawn comes (MP5 Arena, 2026-11-02, after another game's death card: « pour reaparaitre rajouter un button pour resapwn direct genre escape ou clique sur ecran avec je t'ai donner un example, ici a barre jaune me dit quand je vais respawn auto »). Escape is Roblox's own menu and cannot be read: give the skip another key.

**HUD (2026-09-24)**, ajout (`G1-22`)

- **Nothing on the HUD overlaps, on any screen**: whenever a piece is added or moved (a pill, a widget, a streak, a quest panel), render the HUD with every piece and popup showing at once, on PC and on a phone (`audit_ui`, `roblox-game-review`, then a capture), and check that none covers, touches or leaves another's frame (MP5 Arena, 2026-11-02: « sur les hud quest le button de money est un peu decaler et sort de la frame », « met le juste un peu plus haut stp pour ne pas qu'il soit sur la brre d'xp », « sur telephone le event in X hour est sur le button quest », « aussi sur telephone les quest passe sur le button tiere dnas le hud du jeu »; 2026-11-05: « met les event plus haut sur l'ecran car sinon ca cache les kills streak »).

**HUD (2026-09-24)**, ajout (`G1-34`)

- **The left HUD button grid is at most two icons wide**; more buttons add rows (Run a Dino Shop!, 2026-11-17: « les icons du HUD de gauche ne doivent pas depasser 2 icon en horizontal »).

**HUD (2026-09-24)**, ajout (`G1-35`)

- **System buttons are TopbarPlus icons, all of them**: Settings and the teleports (Visit, Village, Lobby) sit in the topbar, never as custom HUD buttons, and they move there together; which side is the game's call (top right in Run a Dino Shop!, top left for Settings in Stop The Eruption) (Run a Dino Shop!, 2026-11-18: « faire que les settings soit topbar plus (en haut a droite) plutot que des button custom »; 2026-11-19: « les teleportaion en haut a droite n'est pas dans topbar (il doit etre comme les settings) »; Stop The Eruption, 2026-10-27: « deplacer les settings en haut a gauche gauche + lobby + mettre le button village en haut a droit bien en haut a droite »).

**HUD (2026-09-24)**, ajout (`G1-37`)

- **What belongs to a counter moves with it**: its boost icons sit right under it and open their bubbles toward the screen, its gain pops (+x$) and flying icons land on it, and moving the counter moves all of them in the same change (Run a Dino Shop!, 2026-11-13: « les icônes de boost (Premium, streak, friends, etc.) restent collées à l argent : place-les juste en dessous du compteur d argent, donc en bas à gauche aussi »; 2026-11-20: « l'animation de gain d'argent + x$ est mal placer comme on a changer l'meplecement de la money sur le hud »).

**Impact first: camera, HUD and rewards around a hit (2026-10-15, Throw a Weapon)**, ajout (`G2-4`)

- **In a tap-to-attack fight every successful press lands visibly** (Anime Aura Farming's bosses):
  the target pops a red `Highlight` like a damage flash, an icon flies from the press into the
  combat bar (a crit's own icon on a crit), the avatar dashes into the target instead of standing in
  front of it, and an on-screen cue says what to do (spam, tap on time) and stays on after the first
  press instead of vanishing at the first click (2026-10-08: « on ne captre pas que le doit spammer
  il faudrait un indicateur visuel »; 2026-10-09: « des que l'on clique ca doit fair partir une icon
  d'ou ou clique into la bar de combat pour bien voir que ca affacte », « le hint qui indique de
  cliquer doit rester un peu plus parsque la a partir du moment ou on clique il depsawn », « faire
  que des que l'on clique le boss ai un highlight rouge qui pop comme un damage quoi », « des que
  l'on spam clique notre perso doit faire des dahs dans le boss plutot que rester devant lui »;
  2026-10-15: « des que l'on met des critiques y'a plus de logo critequ qui vont sur la bar », « rend
  ca master class et satifaisant a cahque attaque reusiss »).

**Impact first: camera, HUD and rewards around a hit (2026-10-15, Throw a Weapon)**, ajout (`G2-5`)

- **A fight's camera keeps the player's strike in frame** (Anime Aura Farming's boss fights,
  2026-10-09): no move hides the avatar hitting; each attack has its own angle so no shot repeats,
  FOV and blur doing part of the work; a dodge left or right moves the camera with the avatar, and the
  dodge is wide enough to read (« y'a certain movmeent de camera ou on ne voit pas le joueur taper »,
  « si y'a moyen de rajouter encore des angles de vu car c'est vite redondant et il n'y a pas d'angles
  pour toutes les attaques », « jouer avec le fov + blur etc... », « lorsque le joueur dodge une
  attaque avec gauche ou droite ca doit deplacer la camera pour bien voir le joueur se deplacer »,
  « fit que le dash gauche et droite soit plus large pour que ca soit plus visuel »).

**Interaction prompts (2026-09-23, Stop The Eruption; 2026-10-22, Throw a Weapon)**, ajout (`G2-14`)

- **A pickup or drop zone covers the object the player sees**: standing on or in it works (a bush
  gives its berries to a player standing in it), and a machine takes its input on its own model,
  never on the pen or base beside it (Run a Dino Shop!, 2026-11-17: « les baie doivent se recupere
  lorsque l'on est sur le buisson en lui meme et ce ne recupere pas »; 2026-11-18: « mettre la hitbox
  sur le model d'ecloseur et pas sur l'enclos de l'ecloseur »).

**Interaction prompts (2026-09-23, Stop The Eruption; 2026-10-22, Throw a Weapon)**, ajout (`G2-15`)

- **A prompt about someone moves with him**: on a walking NPC it is parented to his character and
  rides over him, never left at the spot where he idles (Run a Dino Shop!, 2026-11-19: « la le
  proximity prompt reste a l'endroit on l'employee idlemais il doit lesuivre enfaite »).

**Interaction prompts (2026-09-23, Stop The Eruption; 2026-10-22, Throw a Weapon)**, ajout (`G2-16`)

- **One press, one action**: with a prompt and a click on its model both bound (above), a mouse
  click on the prompt fires both, so the action must run once per press (a menu that opens and closes
  on one click is this bug); test a mouse click on the prompt itself on PC (Run a Dino Shop!,
  2026-11-18: « sur PC si on clique a la souris sur le proxmity prompt, ca ouvre le menu + le ferme car
  enfaite y'a deux trigger le proximity prompt + le fait de cliquer sur un truc »).

**Interfaces start in a Claude Design artifact**, ajout (`G1-1`)

- **A new screen in a game that already has screens is built from them**: its frame, stroke, header, buttons, inner frames and states come from that game's existing menus (or its approved design and kit), never a new style, and it is shown side by side with one of them before Romain sees it. Told to make it like menu X, it copies X's exact treatment down to its inner frames (Anime Aura Farming, 2026-09-24: « sur les frame dans le menu y'a juste la stroke et pas de demarcation de background transparency comme dans le menu aura par example »; 2026-11-06: « Bruh une partie des UI fait tellement IA ... »; 2026-11-09: « certaine partie des menu du menu des attributes sont encore trop IA like et ne respect pas la DA des menu qui existe deja dans le jeu »; MP5 Arena, 2026-11-03, in the Claude Design artifact: « le today est pas dans la DA du jeu de base »).

**Interfaces start in a Claude Design artifact (2026-10-29)**, ajout (`G2-1`)

- **Screens are built in Studio, never by code at runtime**: every ScreenGui sits in `StarterGui`,
  built by hand or by a replayable Studio script and saved in the place; client code finds it, fills
  it with live data and animates it, never creates it (the short-lived pieces it spawns, such as
  flying reward icons and UI particles, excepted) (Anime Aura Farming, 2026-09-28: « il faut que tu
  modify l'ui dans roblox directement », « pareille pour le button skip il ne doit pas etre en code ! »;
  2026-11-06: « vraiment faire full ui dans studio pour le hydrate »). A cutscene's skip button too:
  a button of the game's kit like all its others, on screen from the cutscene's first frame
  (2026-09-28: « le style du button ne match pas le styles des autres buttons du projets ! », « le
  button skip doit apparaitre direct »). The world's twin: The world lives in the place.

**Menus (2026-09-24)**, ajout (`G1-6`)

- **Nothing on a screen that serves nothing there**: a picker that only chooses what another action applies to (the aura whose attributes are rolled) shows no ✓, no EQUIPPED mark and no stat its choice does not change, and a side panel shows only when it has something in it (Anime Aura Farming, 2026-11-09, the attributes menu: « le symble Ok et le mote EQUIPPED en vert ne serve a rien, le POWER : +50% ce ne sert a rien nn plus car la c'est juste pour select l'aura », « les attributs doivent etre sur le coter la uniquement si il y en a »).

**Menus (2026-09-24)**, ajout (`G1-8`)

- **An auto mode runs until the player's own target** (roll and RNG games): in a few taps the player picks the result that stops it, an exact combo or any X of the picked results (X attributes on the aura), the screen shows that target's odds, and the stop button is red (Anime Aura Farming, 2026-11-09, the attributes' AUTO ROLL: « parfait juste si y'a moyen de revoir la UX du AUTO mode car c'est dur a faire », « pour le auto il faudrait mettre un preset en mode ca ne s'arrete pas tant que je n'ai pas ca, et ca peut meme montrer la chance d'avoir ce combo », « ok mais il doit soit pouvoir choisir un nombre exaxt ou alors des que X des attributs en sur l'aura », « le stop auto roll button doit etre rouge »).

**Menus (2026-09-24)**, ajout (`G1-31`)

- **A pet or companion inventory has an Equip Best button** (Run a Dino Shop!, 2026-11-17: « un button equip best dans le menu des dino »).

**Menus (2026-09-24)**, ajout (`G1-33`)

- **Every open menu blurs the world behind it, under one backdrop**: the blur and the dim come once whatever is open (a confirmation over a menu adds no second dark layer); the one exception is a showroom menu whose camera frames its own item (Buckets, Classes), while the end screen's orbit still blurs (End-of-game camera) (Run a Dino Shop!, 2026-11-16: « des qu'un menu est ouvert mettre un blur d'arriere plan »; 2026-11-19: « dans le menu des amelioration y'a genre 2 background noire »; Stop The Eruption, 2026-09-22: « oui garde le flou sauf pour certain menu comme le meanu seaux ou classes qui eux deplace la camera a un endroit comme les screen le montre »).

**Notifications and banners (2026-09-24)**, ajout (`G1-32`)

- **An automatic notice fires once per new thing, and a routine one is no popup at all**: never repeated on a timer or a loop while the state lasts, always closable; an event that comes back all game long (each hatch) shows in the world instead (a small pen by the incubator holding the babies), and popups stay for rare moments. A notice the player triggers again is the case above (Run a Dino Shop!, 2026-11-15: « La notification nouvel œuf éclos / nouveau bébé spamme en permanence, et parfois on ne peut pas la fermer. »; 2026-11-17: « je pense aussi que au lieu de mettre une popup + le reste les incubateur doivent avoir un petit enclos a coter qui stock un nombre de bebe dino », « donc enelver la popup a chaque fois la »).

**Phones and touch: scale, not pixels**, ajout (`G1p-1`)

- **Shift lock's switch is one TopbarPlus padlock at the top left, on every device** (Totally Normal Obby, 2026-11-07 → 11-09): no label, blue while the lock is on and in step with Shift both ways, the bumper on its side on a pad (Gamepad), and no second button above jump. Romain, by DM, on the first version's touch button above jump (2026-11-07): « plus rajouter une petite icône dans top bar plus en haut à gauche pour permettre d'activer le shift lock sur mobile »; shown the padlock: « parfait, c'est nickel »; on the touch-only icon (2026-11-09): « rajoute le logo cadena pour le shift lock meme pour les joueurs pc ». On PC the lock pins the mouse at the centre, so the icon turns it on and shows its state, and Shift turns it off. Roblox binds Shift only for a player who turned on Shift Lock Switch in his own Roblox settings, which no game script can change (measured 2026-11-06), and gives phones no shift lock, so a game that offers one runs its own (`UserGameSettings.RotationType = CameraRelative`, a shoulder `Humanoid.CameraOffset`, `MouseBehavior = LockCenter` rewritten every frame) and lets go under every menu, cutscene and death. Worked example: `totally-normal-obby`, `docs/systems/shift-lock.md`.

**Phones and touch: scale, not pixels (2026-10-16, Punch to Escape)**, ajout (`G1-15`)

- **On touch, tapping the thing a prompt acts on does the prompt's action**, as well as tapping the prompt: a tap on the lava pours the bucket (Stop The Eruption, 2026-11-20: « fait que sur mobile on puisse juste cliquer sur la part de lave pour pouvoir Verser son seau »).

**Phones and touch: scale, not pixels (2026-10-16, Punch to Escape)**, ajout (`G1-23`)

- **Only what must reach the screen's edge ignores the insets**: a menu's dark backdrop covers the whole phone screen, notch and rounded corners included (its own ScreenGui, `IgnoreGuiInset` on, `ScreenInsets = None`), and so does a plate made to hang flush from an edge (MP5 Arena's "next map in"); the menu window and every button keep the safe area and are never shifted by hand to clear it. Check it on a phone viewport (Run a Dino Shop!, 2026-11-15: « Mobile : sur certaines UI, le fond noir ne couvre pas tout l'écran sur téléphone. »; 2026-11-18: « les menus sur telephones doivent respecter les insets du telephones (leurs blacked background lui doit etre en Ignore Insets = true par contre le menu en lui meme non ! (donc pas besoin de dacler le shop sur la droite comme on le fait actuelement par example) »; MP5 Arena, 2026-11-05: « dans le hud le next map in est pacoller au bord », « je pense qu'il faut qu'il sotdans sont gui separer et au bord de l'ecran sans les ignoreSets etc... »).

**Phones and touch: scale, not pixels (2026-10-16, Punch to Escape)**, ajout (`G1-27`)

- **In a shooter the touch HUD is the player's to arrange** (MP5 Arena): every in-match touch button can be moved and resized, up to 250 %, from a HUD layout screen, saved per player; auto jump is off on phones and tablets (2026-11-05: « aussi lance un sub agent pour pouvoir deplacer les buttons utilitaire du hud ingame sur mobile », « tu peux aussi dans le HUD layout faire un moyen de redimensionner les touches stp », « met le max a 250% je pense »; 2026-11-02: « desactive l'auto jump sur mobile /tablette stp »).

**Phones and touch: scale, not pixels (2026-10-16, Punch to Escape)**, ajout (`G1-36`)

- **On touch a hover opens on a tap and stays**: the info bubble of a HUD item (the premium currency, a boost) opens on a tap and stays after the finger lifts, until a second tap, a tap elsewhere or a few seconds pass; never only while the finger is held down (Run a Dino Shop!, 2026-11-20: « sur mobile les hover de la money premium etc.. doivent etre que au clique et pas qu clique plus le doigt encore sur l'ecran »).

**Player-facing text (2026-10-19, Stop the Eruption)**, renforce une ligne existante (`G1-16`)

Remplace : _- **No em dashes (—) in anything a player or a client reads**: signs, banners, prompts, toasts,   dialogue, menus, translations and client documents. Players read them as AI-written text   ("enlève les — IA sur les textes"). Use a comma, a colon or a full stop instead. A lone "—"   standing for an empty value in a table cell is fine. Comments, logs and console output are not   player-facing._

- **No dash used as punctuation in anything a player, a client or the community reads**: no em
  dash (—), en dash (–), double hyphen (--) or spaced hyphen ( - ) in signs, banners, prompts, toasts,
  dialogue, menus, translations, client documents and community posts (Discord announcements,
  update notes). Players read them as AI-written text (Anime Aura Farming, 2026-09-16, a Discord
  message: « evite les - ia aussi »; Stop the Eruption, 2026-10-19: « eneleve les -- ia sur les
  texts »). Use a comma, a colon or a full stop instead. A lone "—" standing for an empty value in a
  table cell is fine, and so is a hyphen inside a word. Comments, logs and console output are not
  player-facing.

**Scroll lists — every list menu (2026-09-24)**, ajout (`G1-11`)

- **The scroll frame itself is invisible**: the `ScrollingFrame` has no background (the window shows through), and its scrollbar shows only when the list is taller than the window (compare `AbsoluteCanvasSize` with `AbsoluteWindowSize` whenever rows change; a list that fits does not scroll) (Anime Aura Farming, 2026-10-26, the patch notes: « il y a un background de la scrolling frame et c'est moche »; MP5 Arena, 2026-11-03: « sur les daily quest, ca montre la scrollbar alors que je ne peux pas scroller »).

**Scroll lists — every list menu (2026-09-24)**, ajout (`G1-12`)

- **A list is sorted for the player**: quests finished (claimable) first; unlockables from the quickest to unlock to the longest, each showing its requirement with its icon (the XP icon and the level) (MP5 Arena, 2026-11-03: « les attachments doivent etre dans l'ordre du plus rapide a unlock avec les levels au plus long + il faut utiliser l'icon d'xp pour montrer que il faut x level »; 2026-11-05: « order quest by finished -> order les quest par celle fini en premier »).

**Settings (2026-10-22 → 10-29)**, ajout (`G1-9`)

- **A UI-scale setting scales the menus, never the HUD**: its `UIScale` sits in the menus' content `CanvasGroup`, and the HUD keeps its own scale (Anime Aura Farming, 2026-09-24: « also the gui scale must also affect the Menus Content canva group in order to have a uiscale in it (for do not ui scale the HUD just the in games menus) »).

**Settings (2026-10-22 → 10-29)**, ajout (`G1-25`)

- **The look sensitivity slider is felt from end to end**: its lowest and highest settings turn the view obviously slower and faster in play; widen the mapping until they do and try both ends in a playtest (MP5 Arena, 2026-11-02: « aussi la sensibility ne change pas grands chose je crois »).

**Shop and purchases (2026-09-24)**, ajout (`G1-4`)

- **Featured offers and top rewards move, small and slow**: a starter pack, a featured pack, a paid skip or a row's best reward stands apart from the plain rows (bigger, first) and carries a light idle motion: a small slow rotational shake, a colour motion along its inner stroke or its halo, a gentle scale pulse. Keep it small: a big scale bounce is too much (Anime Aura Farming, 2026-09-11, the daily rewards: « essaie de rajouter du movement ex : sur le "OP !" rajouter un rotational shake, sur le 199 en robux sur le prix du skipp all, rajouter le rgb motion sur la inner stroke et sur le halo », « rajoute un tout petit rotational shake (lent) sur le drop rate de the world (aussi le scale up and down sur le day2 est trop gros »; MP5 Arena, 2026-11-03: « faire que le starter pack bouge sur le hud etc la il ets pas trop voyant »; Run a Dino Shop!, 2026-11-16: « les pack stylee ne sont pas asser mis en avant, il manque des animation »). The starter pack's countdown and expiry: `roblox-game-dna` (Starter pack).

**Shop and purchases (2026-09-24)**, ajout (`G1-17`)

- **Robux buttons are yellow, and the Robux glyph is drawn like every other icon**: the same stroke as the text (the Robux glyph above, or an icon with the kit's outline), never a bare logo; a pass is shown by a simple mark aligned with its text (a crown for VIP), not its store logo (MP5 Arena, 2026-11-02: « dans les menu le logo de robux il manque une stroke la, soit use le unicode soit change l'icon »; 2026-11-03: « met pas forcement le logo du gamepass mais plutot juste de la couronne, aussi align bien es truc etc... », « et les buttons robux en jaune »).

**Shop and purchases (2026-09-24)**, ajout (`G1-18`)

- **A collection screen (camos, skins, accessories) tells at a glance what is owned, what can be bought and with what, and what comes from elsewhere** (crates, events, exclusives): each group reads apart, by section or by state, and every locked card says where it comes from (MP5 Arena, 2026-11-03: « dans le menu des camo tu peux refaire le design car la c'est pas claire entre les camo que l'on a et pas et ce que l'on peut acheter ou pas, meme dans le shot les button achetable en robux devrais etre violet ou jaune »; 2026-11-02: « les camos on ne sait pas pourquoi ils sont locked »).

**Shop and purchases (2026-09-24)**, ajout (`G1-38`)

- **Every purchase celebrates**: a burst of UI confetti images and a firework sound the moment it is granted (for Robux, when the receipt grants), with Anime Aura Farming's as the reference (`src/shared/utils/ui-particles.luau`) (MP5 Arena, 2026-11-03: « des que l'on fait un achat il doit avoir les ui particles de confetti + bruit de firework comme dans ../anime-aura-farming »).

**Skill trees (2026-09-24)**, renforce une ligne existante (`G1-14`)

Remplace : _- **Hover shows, click buys** — no selection, no separate BUY button, and no mark on the hovered   cell itself (no ring: the frame alone says what is hovered). The hover frame is the game's menu   window (its coloured header with the cell's icon and name), then the price, then the effect;   OWNED once owned. A buyable cell also shows its price under its name, on the cell. - **A price label reads w…_

- **Hover shows, click buys**: no selection, no separate BUY button with a mouse or a pad (touch: below), and no mark on the hovered
  cell itself (no ring: the frame alone says what is hovered). The hover frame is the game's menu
  window (its coloured header with the cell's icon and name), then the price, then the effect;
  OWNED once owned. A buyable cell also shows its price under its name, on the cell.
- **A price label reads white when the player can pay it, red when not**, live on the balance, on
  the cell and in its frame alike. Under the gamepad's virtual cursor, find the hovered hitbox per frame (the
  button under the pointer, e.g. `GetGuiObjectsAtPosition`), never by `MouseEnter` alone.
- **On touch, a tap shows and a big BUY button buys**: the first tap on a cell shows its frame and a big BUY button at the right of the screen; that button or a second tap on the same cell buys; a tap on a sub-tree cell opens it at once, and its Back returns at once (2026-11-20, Stop The Eruption: « dans le skill tree mettre un button acheter en gros a droite sur mobile en + de laisser le double clikc = acheter + faire que des que l'on clique sur un subtree ca l'ouvre direct pareille pour le retour d'un subtree »).

**Skill trees (2026-09-24)**, ajout (`G1-29`)

- **A skill tree takes the whole screen**, never a window inside a menu; its close follows Menus (Run a Dino Shop!, 2026-11-16, which asked for a bottom CLOSE: « le skill tree doit prendre tout l'ecran et pas juste dans un menu, mettre le close buttun en bas »).

**The UI kit look**, ajout (`G1-2`)

- **No rainbow or colour-cycling text**: it cannot be read. Text that would be rainbow or RGB is plain white, a title takes its one-hue gradient (above), and a screen or a list keeps one casing, all caps or not, never mixed at random (Anime Aura Farming, 2026-09-24: « met pas en rainbow les text on les vois pas … et aussi uniform les upper cases ou lower case la c'est random »; 2026-10-06: « aussi pas besoin de text rgb juste text blanc »).

**The UI kit look**, renforce une ligne existante (`G1-5`)

Remplace : _- **No black backgrounds behind reward cards** (daily, gifts): the card takes the reward's colour._

- **A reward card wears its reward's colour, in every state** (daily, playtime, gifts): no black background and never one colour for the whole row; each card takes its reward's colour (its type, or its tier, so better loot reads better at a glance), and a claimed card keeps its colours, its CLAIMED mark saying it is claimed, never greyed out. Reward cards stand upright and shake in rotation the moment the player gets the gift (Anime Aura Farming, 2026-09-11: « tu peux faire que les daily deja claim reste en couleur normal et pas griser »; MP5 Arena, 2026-11-03: « dans le daily reward c'est que des caree rouge »; Run a Dino Shop!, 2026-11-16: « les cartes des gift sont rotated alors quelle devrait etre droite et rotatonionale shake des que l'on a le cadeau + les carte qui on du loot meilleurs doivent avoir un background different »).

**The UI kit look**, renforce une ligne existante (`G1-7`)

Remplace : _- **Every button has a hover (scale or brightness) and hover and click sounds**, through the shared   button component (2026-10-30, MP5 Arena: "rajoute des hover effect sur les button du hud + sfx")._

- **Everything the player can click, or read on hover, has a hover (scale or brightness), a click effect and hover and click sounds**, through the shared button component: buttons, HUD buttons, and the cards and rows of a menu (reward cards, selection cards, odds rows) (2026-10-30, MP5 Arena: "rajoute des hover effect sur les button du hud + sfx"; 2026-11-05: « sur les playtime y'a pas de hover effect ni de click effect »; Anime Aura Farming, 2026-11-09: « il doit y avoir un hover effect sur les cartes »; 2026-11-11: « rajoute un hover effect dans les ODDS du menu des attributs »). **A ready reward card is itself a claim button**: a click or tap anywhere on it claims, its Claim button stays (MP5 Arena, 2026-11-02: « fait en sorte que l'on puisse cliquer sur les cases du daily pour recuperer »; 2026-11-05: « Pouvoir clique sur les frame des playtime reward pour claim en + du button claim cliquer dessus c'est plus intuitif »).

**The UI kit look**, renforce une ligne existante (`G1-19`)

Remplace : _- **A "something to buy or claim" badge is a round red dot that pulses smoothly** (tweened, never   stepped, no `UIStroke` on the growing red background), on the HUD icon, on a sub-tree's icon and   above the world station alike, and **it stays as long as the condition holds** (2026-10-24/27,   Stop The Eruption: "ne pas mettre de ui stroke sur le background rouge … là il est saccadé",   "garder t…_

- **A "something to buy or claim" badge is a round red dot that pulses smoothly and wiggles with a
  small rotational shake** (tweened, never stepped, no `UIStroke` on the growing red background), on
  the HUD icon, on a sub-tree's icon and above the world station alike, and **it stays as long as the
  condition holds** (Stop The Eruption, 2026-10-27: « ne pas mettre de ui stroke sur le background
  rouge qui grandit + faire le background rouge plus smooth en animation la il est sacader »,
  « notification skill tree -> garder tout le temps tant que tu peux acheter un truc »; MP5 Arena,
  2026-11-03: « les symbole de notifications doivent bouger rotationale shake ou quoi la »).
  **A "new" dot is another kind of badge**: it shows on a newly unlocked item and on every button that
  leads to it (Customize, the tab, the camo button), only while something new is unseen, and it
  clears when the item is hovered or clicked (MP5 Arena, 2026-11-03: « rajoute les notification sur le
  cutsomize et sur les nouvelles choses unlocked dans les menu », « la notification doit disparaitre
  lorsque l'on a cliquer ou hover l'attachment dans la liste », « cette notif doit etre que des que
  l'on a un truc de nouveau + rajoute pour le button des camouflage + notification sur les
  comouflages »).

**The UI kit look**, ajout (`G1-20`)

- **Time reads with the clock icon**: every timer or duration (a boost, an offer, a shop rotation) has the clock icon beside it as one icon + text pair, and a timed event on the HUD is its own icon or image with its countdown, explained by a hover or a tap, never a text list; an Experience Event's widget opens Roblox's prompt for that event on a click (MP5 Arena, 2026-11-03: « le shop c'est pas bea par example le au lieu du temps en heure tu rajoute aussi l'icon de temps », « non c'est trop chargee je pensais a une widget avec l'icon du prochainevent qui slide de temps en temps et des que l'on clique ca nous met join event prompt et donc tout est avec une image »; Run a Dino Shop!, 2026-11-18: « si y'a des heure de points des event de metore ou quoi mettre une icon en bas a droite avec le timer et un hover qui explique l'event »).

**The UI kit look**, ajout (`G1-28`)

- **A model in a `ViewportFrame` is framed from its own bounding box**: centred, whole and inside its cell, the camera fitted to each model (an accessory for sale included), never one fixed camera for all; and a notice that announces a new creature or item shows its live model, not only its name (Run a Dino Shop!, 2026-11-16: « les dino dans les viewpoert ne sont pas centered et depassent »; 2026-11-17: « dans le shop les accersoires a acheter sont mal poser dans e viewport »; 2026-11-15: « Il manque le viewport 3D du bébé dans cette notification. »).

**The world lives in the place, at player scale (2026-09-22 → 10-29)**, renforce une ligne existante (`G2-8`)

Remplace : _- **Gameplay works for every avatar size**: pads, plates, prompts, jump gaps and ladders are tested   with the smallest and largest R15 scales and with R6; triggers are size-independent (a zone query   on the root part, a prompt), never a touch by a default-size body (2026-10-29, Stop The Eruption:   "mon personnage est trop petit, je ne peux pas aller sur les plaques")._

- **Gameplay works for every avatar size**: pads, plates, prompts, jump gaps and ladders are tested
  with the smallest and largest R15 scales and with R6; triggers are size-independent (a zone query
  on the root part, a prompt), never a touch by a default-size body (2026-10-29, Stop The Eruption:
  "mon personnage est trop petit, je ne peux pas aller sur les plaques"). **Hits and hazards use one
  hitbox for everyone**, a Bacon Hair R15's, never each avatar's own body (2026-11-20, Stop The
  Eruption: « les gens rage parcque leur avatar n'a pas tous la meme hitbox, essaei de fix ca et de
  mettre la hitbox d'un bacon hair r15 quoi »).

**UI engine traps**, ajout (`G1-3`)

- Roblox draws a glyph at 100 px at most and stretches it past that: bigger text blurs and loses its outline. RichText lifts `TextScaled`'s own 100 px cap (a boss countdown drew 338 px tall), and a `UIScale` or a `CanvasGroup` that enlarges text blurs it the same way. Give every big label a `UITextSizeConstraint` (`MaxTextSize = 100`), keep it on clones, or draw a word that must be bigger as an image (2026-10-15, Anime Aura Farming, the boss fight: « les text en gros sont flou »; measured in Play, `docs/systems/boss-fight.md`, Learned the hard way).

**UI engine traps (measured in playtests)**, ajout (`G2-13`)

- On a world label (`BillboardGui`), a filled shape wearing a `Border` `UIStroke` shows a hairline
  of whatever is behind it between the fill and the stroke (both are antialiased along the edge they
  share): draw that outline as a solid frame of its colour behind the fill, a stroke's thickness
  bigger on each side; text keeps its stroke. Measured on billboards only: the kit's screen strokes
  (The UI kit look) stay as they are (2026-11-20, Run a Dino Shop!'s world labels: « y'a des
  problemes sur les billboards strokes un peu la y'a des pixels qui passent »).

**World billboards and SurfaceGuis (2026-09-28)**, renforce une ligne existante (`G2-9`)

Remplace : _- **A product or station in the world is small and clean**: built from the game's real item models   (the bucket for a bucket product), at a size that reads from walking distance, name and price on a   `SurfaceGui`, no Part-built look-alike (2026-10-19, Stop The Eruption: "use des models déjà du jeu   … c'est immense, trop gros")._

- **A product or station in the world is small and clean**: built from the game's real item models
  (the bucket for a bucket product), at a size that reads from walking distance, name and price on a
  `SurfaceGui`, no Part-built look-alike (2026-10-19, Stop The Eruption: "use des models déjà du jeu
  … c'est immense, trop gros"). **A pass with no item of its own is sold from the game's one
  prompter stand**, the same model for every pass (Totally Normal Obby: its `GamePassPrompter`,
  lightly revised), never a 3D model made for each pass (2026-11-02, Totally Normal Obby: « c'est
  super moches les 3d products … game.Workspace.Course.GamePassPrompter mais version un peu
  revisier, je ne parle pas de faire des models 3d pour chaque gamepasses »).

**World billboards and SurfaceGuis (2026-09-28)**, ajout (`G2-10`)

- **What a shelf takes is shown by its icon, on its own sign** (Run a Dino Shop!): every shelf and
  display shows a big icon of the item it takes, readable from the aisle on a phone, painted on a
  sign panel of the furniture (a `SurfaceGui`), never on a floating billboard (2026-11-14: « Rayons
  et échoppes : on ne sait pas quel item va dans quel rayon, il faut un panneau ou une icône
  lisible »; 2026-11-16: « sur les etageree l'icon du fruit ne doit pas etre en billboard mais sur ce
  petit panneau »).

**World billboards and SurfaceGuis (2026-09-28)**, ajout (`G2-11`)

- **The world shows its own state, so labels are few** (Run a Dino Shop!, 2026-11-14: the world
  labels were « trop compliqués à comprendre »): no count, x/y or MAX floats over furniture, a
  machine's output or a resource pile, whose own pile is the count, and a resource source (a bush, a
  generator) gets no label at all (2026-11-16: « il ne doit pas y avoir marque le nombre pas de
  billboard sur ces models »; 2026-11-17: « pas besoin de billboard sur les plants de baie ou les
  generateur de resouces »; 2026-11-20: « pas de billboard x/4 ou x/x pour le resultat des machines ou
  des ressources »).

**World billboards and SurfaceGuis (2026-09-28)**, ajout (`G2-12`)

- **No label crosses a wall from any camera angle**: a billboard turns to face the camera and,
  depth-tested, sinks into a wall beside it; a label against a wall is a `SurfaceGui` on its own
  panel, and every billboard near a wall is checked by orbiting the camera round it (Run a Dino Shop!,
  2026-11-17: « les billboard pret des mur comme "argent gratuit puevent passer dans le mur c'est moche
  change" »).

**new: NPCs and staff (2026-11-14 → 11-18, Run a Dino Shop!)**, nouvelle section (`G2-18`)

## NPCs and staff (2026-11-14 → 11-18, Run a Dino Shop!)

- **NPCs move like people**: a worker visibly walks his whole trip, from where he takes a load to
  where he puts it and back, on the ground; NPCs enter and leave a building through its doors and go
  round the furniture, never through a wall, a shelf or a counter, never teleporting or flying;
  re-check their paths whenever furniture or collisions change (2026-11-17: « les clients passes a
  travers les etageres, caisses etc... », « y'a un super paleontologue qui fly dans la base je ne sais
  pas ce qu'il fait »; 2026-11-18: « les NPC doivent forcement passer par les entree du magasin pour
  entree ou sortir », « le magasinier est bug, deja il ne se deplace pas des ressources jusqu'au
  etagere »).

**new: NPCs and staff (2026-11-14 → 11-18, Run a Dino Shop!)**, ajout (`G2-19`)

- **Human NPCs share the game's body style, and staff wear a uniform**: the body the game picked
  (Run a Dino Shop!: the classic blocky one) is forced on every spawn path, an avatar copied from a
  friend's `HumanoidDescription` included, and checked on a crowd capture; staff wear one uniform so
  they never read as customers (2026-11-14: « Employés : une vraie tenue d'employé (là, ils n'en ont
  pas du tout). »; 2026-11-16: « tout les NPC doivent etre blocky certain client sont en R15 mais pas
  blocky »).

### `roblox-game-dna` (29)

**Discovery: the algorithm is the publisher**, ajout (`G3-7`)

- **The data says why players leave.** Beside the funnel events, the game logs what a player was doing just before he left; an A/B test (MP5 Arena's bots shown as friends) logs its events from the day it ships, with a short note in the repository on how to read them later (Anime Aura Farming, 2026-09-29: « j'aimerais rajouter des events pour savoir ce que le joueur faisait / était avant qu'il quitte afin qu'on optimisa ça et qu'on analyse vraiment tout »; MP5 Arena, 2026-11-02: « Oui code-le maintenant et ecris comment exploiter les stas pour plus tard », « on enregistre toutes les data necessaire pour faire une bonnes analyse des comportement etc en generale ? »).

**Game feel**, ajout (`G3-8`)

- **A movement ability ships whole.** VFX pointing the way it moves, an SFX, a PC key and a phone button, a speed cue on the HUD whose effects are paced to the move; fast enough at its best tier (Anime Aura Farming's fly with the rarest auras); abilities chain (a dash in flight), and none starts by accident (a double jump on the ground never starts the fly) (Anime Aura Farming, 2026-11-10: « il manque un VFX un SFX et le button sur pc comme sur telephone », « le VFX du dash est pas dans le bon sens + il manque un truc de speed sur le HUD », « pour le fly je trouve que c'est pas asser rapide avec les aura les + rare + les effets visuel HUD sont trop rapide aussi pour le fly », « si on double saut en etant au sol ca lance le fly »; 2026-11-11: « fait en sorte que l'on puisse dash meme en fly »).

**The first 60 seconds**, ajout (`G3-1`)

- **Each tutorial step focuses the one thing to press, and no skip or close leads out of a step.** One button in focus at a time, the rest of the screen faded out; a hand on it plays the gesture (a click; for a tap, a left-right sway with a small turn and the word TAP); every screen the tutorial opens gets its own close step; no Skip in the match once the kill step is done, until the player is back in the lobby, and skipping a crate's reveal leads to equipping its camo, never to closing the menu first (MP5 Arena, 2026-11-02: « un onboarding qui fait focus 1 button qui fade out tout le reste de l'ecran », « que l'on ne puisse pas skip tant que l'on est pas dans le lobby comme ca ca evite que l'on skip le tuto alors que l'on joue », « si je skip l'oppening de box ca me propose de quiter le menu alors que je n'ai pas equip le camo »; Anime Aura Farming, 2026-10-08: « un main qui fait gaicde droite + petite toration avec "TAP" pour montrer qu'il faut tapper »; 2026-09-14: « rajouter etape de close le roll screen. pareille pour le close du daily reward »).

**The first 60 seconds**, ajout (`G3-2`)

- **The tutorial ends inside the loop.** It has the player buy one first upgrade in the upgrade system (one, not a step for every buy), and its last step sends him into the next round of the loop or opens the next thing to claim with the hand on its button, never leaving him with nothing to do (Stop The Eruption, 2026-10-23: « dans le tuto on doit introduire la skill tree donc bien faire acheter une premiere amelioration », « ET EN DERNIERE etape du tuto lui dire de re tp au village pour remplir sont seau »; Anime Aura Farming, 2026-09-11: « ca ouvre le menu daily reward et ca met la main qui clique sur le button claim »; Run a Dino Shop!, 2026-11-17: « a la fin du tuto on doit recruter un employer qui fait en sorte d'aller chercher les ressoucres pour les mettre dans les etagere »; 2026-11-16: « l'onboarding est trop long on ne doit pas avoir de beam / tuto pour chaque chose a acheter »).

**The first 60 seconds**, ajout (`G3-3`)

- **In a game of random drops, the first session's luck is scripted.** The tutorial's rare drop, played with the rare-drop animation, is a real rare (1/160 or rarer), set up by a big luck boost just before it; nothing the tutorial hands out can expire while it runs; a scripted bonus lands again a few minutes later (Anime Aura Farming, 2026-09-14: « l'aura donner avec l'animation de rare drop doit etre au moin 1 / 160 », « pendant le tutoriel le bonus ne peux pas exiper et despawn »; 2026-09-25: « un x16 clover apres le tutoriel juste avant de drop l'aura avant cinematique »; 2026-09-29: « des que le joueur arrive sur le jeu pour la premier fois vers 6min 30 il faut lui faire spawn un tripple bonus »).

**The loop and the retention kit**, ajout (`G3-5`)

- **A timed event waits until the player can use what it drops.** No egg shower on a plot with no incubator: the event starts for a player once he owns what uses its reward (Run a Dino Shop!, 2026-11-18: « on ne doit pas avoir de meteorite qui tombent tant que l'on a pas de ecloseur »).

**The loop and the retention kit (SKILL.md), right after the « Live ops » bullet**, ajout (`G3p-2`)

- **Every update ships its patch notes in the game.** A game with updates has a patch-notes menu, newest update first, each update dated, its new items as cards with their icon, name and drop rate, then one short line per change, and the next update's notes are one config entry; the agent who ships an update writes its notes in the same change, unasked. Rows and update headers stay small, a thin line under each header, no background behind the scrolling list. A lobby's what's-new corner is no text panel: a widget slides the next event's picture, and an update's slide opens its notes (Anime Aura Farming, 2026-10-26: « cree un menu patches notes stp et fait un resume des misae a jour(ex: new aura avec leur nom leurs icon et leur drop etc...) », « ok juste tout est un peut trop gros les lignes et les header des updates », « le header il manque de bottom border ou de choses », « la bottom border est trop grosse + il y a un background de la scrolling frame et c'est moche », then « cree une note de patch pour le 28 octobre »; 2026-11-02: « cree un patchnote pour le 4 novembre »; 2026-11-11: « Ok ecrit le patchnote pour AJD »; MP5 Arena, 2026-11-03, turning down a text panel of patch notes and coming events: « non c'est trop chargee je pensais a une widget avec l'icon du prochainevent qui slide de temps en temps … et potentielement si c'est un MAj ca nous ouvre un menu de la maj »).

**The loop and the retention kit (SKILL.md), the « Live ops » bullet**, renforce une ligne existante (`G3p-5`)

Remplace : _After launch, read the funnels, the economy and the errors over the window since the last update   only ("prends que depuis les 2 derniers jours car on a update le jeu", Throw a Weapon, 2026-10-30)._

After launch, read the funnels, the economy, the errors and the players' feedback over the window since the last update only (« prends que depuis les 2 derniers jour car on a updtae le jeu », Throw a Weapon, 2026-10-30; « va checker les funnels, l'economie et les feedbacks stp », Throw a Weapon and Stop The Eruption, 2026-10-28; « Ok va checker la boite des commentaires », Throw a Weapon, 2026-11-17; « regarde les stats et les feedback et les A/B test et fait un resume », MP5 Arena, 2026-11-09; « va check les feedbacks analytics etc.. et dit moi », Stop The Eruption, 2026-11-20). **Every game gives its players a way to send that feedback**: a lobby mailbox whose ProximityPrompt, or a lobby FEEDBACK button in the topbar, opens Roblox's own feedback form (`SocialService:PromptFeedbackSubmissionAsync`, read in the Creator Hub under Audience > Feedback); Roblox decides who may send (not the owner, about once a day), and the form does nothing in Studio, so check it live from an account that does not own the game (Throw a Weapon, 2026-10-21: « rajoute une feature c'est une boite au lettre et ca permet de avec un proximity prompt d'ouvir le feedback panel de roblox en lui meme pour envoye un comment »; MP5 Arena, 2026-11-03: « rajoute un button feedback qui ouvre les commentaire du jeu »).

**The server and the data**, ajout (`G3-6`)

- **The admin panel's admin-abuse tab runs the live event.** Premade one-line actions, each sent to this server or to all; each announced to the players by a broadcast of what the admin just did; each stoppable on its own; a give-all asks for confirmation and premium currency is given sparingly; the ~30-minute event is planned from start to finish with rushes, and a pity gives every player the headline bonus at least once (Anime Aura Farming, 2026-09-24: « il faudrait des choses premade », « au lieu d'exec la command ca envoie ne plus un broadcast qui dit ce que l'admin viens de faire pour avoir du feedback », « plus faire du one ligne avec un button exec all server et exec this server »; 2026-09-15: « on doit etre capable de stop event par event et pas que stop all »; 2026-10-19: « il faut que l'on puisse choisir entre global et server »; 2026-09-28: « planif l'admin abuse du debut a la fin avec des "rush 'devent etc. afin que ca dure ~30min »; 2026-09-29: « un pity counter pour le bonus x3 pour que au moins chaqujoueur l'ai 1 fois pendant l'admin abuse »; Stop The Eruption, 2026-11-17: « rajoute bien un onglet admin abuse plutot », « ne pas donner trop de diamant », « il doit y avoir les broadcast comme sur anime-aura-farming », « sur les giveall rajouter un model de confirmation »).

**The server and the data (SKILL.md), right after the bullet « A record is checked against what is physically possible »**, ajout (`G3p-1`)

- **An anti-cheat never costs a legit player.** Before it ships, list every way the game legitimately moves a body or shortens a run (cutscenes, rides and ziplines, server teleports, pushes, a paid item such as Stop The Eruption's Drainer) and let each one through; refuse only what no legit player can do (a pour into the lava in the second after a teleport, never a fill). Log every move or request it refuses, with the player, the cause and the numbers. The day after it ships, read those logs and the boards for legit players caught, and work the record floor out again whenever a balance change or a product changes the fastest legit run. Where the design itself can slow a too-fast player (Anime Aura Farming's screen bonuses spawning slower as the combo climbs), do that instead of an anti-cheat (Stop The Eruption, 2026-11-16: « pour l'anticheat faut bien prendre en compte les cutscene, la zipline etc etc... », « y'a bien plein de logs ? pour chaque rollback ? »; 2026-11-17: « j'aimerais que tu regardes les logs voir si y'a pas trop de faux positifs ou des rollback de gens legites »; 2026-11-18: « au pire pas grave si on ne peux pas vider le seau dans la lave apres tp c'est quasi impossible a faire sans cheat par contre le fait de remplire doit pas etre comme ca »; 2026-11-19, after a player wrote that his 2-minute runs never showed on the board: « meme avec les nerf d'hier on peut faire ce temps ? », « si les gens achetent un drainer il ne sont plus dans la leaderboard ? »; Anime Aura Farming, 2026-09-30: « fait qu'il n'y ai plus de anticheat pousser sur les bonnus d'ecran, peut etre augmente juste le deilai de spawn plus le combo est elever »).

**The server and the data (SKILL.md), right after the bullet « Every game ships a rank-gated admin panel »**, ajout (`G3p-3`)

- **The admin panel is picked, never typed.** Its commands sit in categories (events, auras…); every key (an event, an item, a pass, a product, an aura) is chosen from a dropdown that shows its icon before its name, never typed in a text field; a give to one player goes through a player list showing their heads, whose search box also finds any profile, on this server, on another or offline, and carries no THIS SERVER / ALL SERVERS buttons (Anime Aura Farming, 2026-09-14: « il faudrait ranger ces commands dans des categories (ex : events, auras etc... ) un dropdown serais preferable au button en dessous du text label, le dropdown doit contenir une image suivi du nom ou juste d'un nom si pas image »; 2026-09-24: « les micros events doivent avoir leurs icons dans le drop down », « pour les event c'est des key donc on ne doit pouvoir utiliser que e dropdown »; 2026-11-03: « rajoute les icons dans le dropdown »; MP5 Arena, 2026-11-02: « faire que l'on puisse give a des gens aussi dans l'admin panel avec un selector de personne avec leurs tete, et si on donne un truc si on peut avoir des images du truc dans le dropdown aussi »; Stop The Eruption, 2026-11-17: « pour le give all des bucket on doit choisir le bucket en dropdown »; 2026-11-18: « dans le panel je comprends pas le give to one player et apres les button this server et all server ca n'a pas de sens », « avant tu pouvais give a n'import quel player peut import si il est dans le server ? », « fait en sorte qu'il y ai la liste de personne + que des que tu ecrit ca cherche n'import quelle profile et que tu puisse lui give »).

**references/dna.md, §2 « Live ops and the trend machine »**, ajout (`G3p-7`)

- **The studio's giveaway** (Anime Aura Farming, an admin-abuse moment): the admin panel draws a prize (a pass, a product or an aura) for one player, or five at once, picked at random among everyone online on every server, and every screen plays the draw: names scrolling down one line like a slot machine under « Tirage pour … », stopping big on the winner, then a line of its own, « X Wins ! ». Check it holds with about 1,500 players online before it runs. Another game's admin-abuse panel gets the same draw and animation (Anime Aura Farming, 2026-11-03: « donner un gamepass / devproduct a un joueur random connecter dans 1 des serveur du jeu », « un message admin cusstom ou tu vois plein de pseudo defiller de haut en bas sur une ligne et ca s'arrete sur 1 pseudo, genre ca dit Tirage pour XXXXX et le XXXX c'est genre une slot machine un peu », « c'est parfait juste le psuedo est un peu petit je trouve », « encore + gros + un autre message apres l'animation qui dit X Wins ! »; 2026-11-04: « le giveaway de passes, c'est optmisier si y'a genre 1500 joueurs ? »; 2026-11-09: « un nouveau giveaway mais d'aura cette fois et faire que l'on puisee tirer 5 personnes a la fois aussi »; Stop The Eruption, 2026-11-17: « j'aimerais pouvoir give un gamepass ou devproduct comme dans animeaurafarming avec la meme animation »; Throw a Weapon, 2026-11-20: « ajouter les feature d'amin abuse de anime aura farming pour ce jeu (ex: event double xp, giveaway gamepasses etc »).

**references/dna.md, §6 « What successful games sell (conventions) », as a new item of the list « The studio's rules on what it sells »**, ajout (`G3p-4`)

- a **limited** item sells a fixed number of copies, one per player, counted over the whole game: its card shows its stock (X / max) on a bar drawn like the game's progress bars, reads OWNED for a player who has it, and leaves the shop once sold out; a time-limited one also counts down to its end, and the times Romain gives are Paris time (16:00 Paris in November is 15:00 UTC) (Anime Aura Farming, 2026-10-06: « acheter la ZORO BLADE et la MEGUMI en limited », « ca doit etre une farmde de style starter pack avec le nombre X / nombre max d'achat », « evidament tu peut l'acheter qu'une fois », « moyen que le stock soit pas aussi arondie et soit comme la progress bar ? », « aussi si le joueur l'as deja mettre sur owned directemeent », « mais apres la y'a pas de progress bar ? »; 2026-10-13: « eneleve la zoroblade tout a ete vendu »; 2026-11-02: « met limited en temps aussi genre 7j depuis le 4 novembre 16h heure de paris »);

**references/dna.md: 6. What successful games sell (conventions), the studio's rules on what it sells**, ajout (`G3-9`)

- **A rewarded ad is offered only when it can play, and on a budget.** No ad card while no ad is available; a cooldown between two ads and a daily cap (Anime Aura Farming: 15 minutes, 16 a day); its reward sized by simulating several values (Anime Aura Farming, 2026-09-25: « si s ane trouve pas d'ads alors ca ne show pas la carte FREE REBIRTH ? », « met 15min de delais entre 2 pubs et fait des essaie de balancing en mettant +1h 45min 30min etc.. pour voir », « met une limite a 16 / jour »).

**references/dna.md: 6. What successful games sell (conventions), the studio's rules on what it sells**, ajout (`G3-10`)

- **A HUD offer card rotates; a running boost shows like an event.** The featured-offer card alternates between offers, so a player who bought one still sees a new one and one who bought nothing sees both, and a tap opens the shop at that offer's section; a bought timed boost (a potion) shows on the HUD with its timer, like a live event, while it runs (Anime Aura Farming, 2026-09-25: « remplacer aussi le sharigan par une autre aura (faire que ca tourne entre aura sharigan et une autre) comme ca ce qui l'on acheter peuvent acheter la nouvelle et ceux qui n'ont rien voie les deux »; 2026-10-06: « un peut comme le starter pack mais pour les potion (elle switch comme le sharigan etc..) et ca ememene directement sur la bonne section du shop si cliqued », « afficher la potion comme un event »).

**references/game-feel.md, « World feedback », the entry « Squash and stretch on hit objects » (after its Mistakes line)**, ajout (`G3p-6`)

- **The studio's version** (Stop The Eruption, Run a Dino Shop!): a squash or a scale pop on a world object (a station refilled, a shelf or a machine fed) scales only the thing that took the item, never the floor slab or pad under it. A part whose Roblox material shows wears it as a `SurfaceAppearance`, which follows the mesh: a material keeps its grain in studs and slides over the squashing part. The squash starts from and ends on a rest size and position captured once while nothing animates the object, never ones read while a squash may still be running, which move or grow the furniture a little at every squash (« le material de rock fait un truc bizzare lorsque y'a le squish du refill la material scale bizzarement », Stop The Eruption, 2026-10-27; « des que l'on remplis une station ou une etagere le sol gris ne doit pas scale », Run a Dino Shop!, 2026-11-17; « ouaisenfaite a force les positions des ressources et des meubles bougent et bug peut etre a cause des animations », Run a Dino Shop!, 2026-11-19).

**references/game-feel.md: Rarity, reveals and ceremonies ("PERFECT!" / "CRITICAL!" / "HEADSHOT!" words)**, ajout (`G3-14`)

- **A timing target forgives.** A target with a closing ring expires once the ring is smaller than it, and a press close to the moment the ring matches the target's size is a PERFECT, inside a margin, not on one exact frame; every press shows its grade word (CRIT, GOOD, PERFECT, MISS), which pops and fades (Anime Aura Farming, 2026-10-09: « le timer expire lorsque le cercle autout est plus petit que le bonus, mais il y a une marge ou si tu clique a peut pres au moment ou le cercle qui se referme fait la taille du cercle normale alors tu fait un PERFECT ! », « lorsque tu clique sur un crit ca met CRIT ! qui pot et disparait au bout d'un moment et faire ca avec les autre action comme GOOD ! Perfect ! Miss »).

**references/game-feel.md: Rarity, reveals and ceremonies (Egg / chest / crate / roll reveal)**, ajout (`G3-13`)

- **The reveal happens inside the roll.** A rare result's cutscene starts while the roll is still turning, even if the roll runs a little longer: in a roll the rarity tell plays without freezing on the result (this replaces the "longer hold" of the egg sequence above); a second or third result (a bonus attribute) gets its own roll on screen and is the opening's epic moment, with its own sound; a miss gets a short lose sound that fits (Anime Aura Farming, 2026-09-25: « il ne faudrait pas que ca hold il faudrait que ca lance la cutscene pendant que ca roll (meme si le roll est un peu plus long pas grave) »; 2026-11-09: « le moment ou on a un deuxiemme attribut c'est vraiment super rare et ca doit etre epique + revoir le SFX des que le cristal expolse / s'ouvre », « il faudrait un genre de roll pour savoir si on en drop un deuxieme ou troisieme plutot que ca appraisse comme ca d'un qu'ou », « rajoute un SFX de lose »; 2026-11-10: « le son de fail des que l'on a pas d'atributs apres est trop long », « change le son car c'est pas le son adapte »).

**references/game-feel.md: Rarity, reveals and ceremonies (Spin wheel / roulette)**, ajout (`G3-12`)

- **The studio's wheel.** A sound that builds pressure plays while it spins and its own sting when it stops; the landed slice scales as one piece, outer border included, never the icon and text apart from it; its confetti start well away from the camera and stay small (Anime Aura Farming, 2026-09-28: « garder un son qui fait montert la pression lorsque le roue spin », « jouer ce son a la fin lorsque la roue s'arrete sur le segement », « il faut qu'il y aie meme la border extrerieur sur le segement sinon c'est bizzare des qu'il scale », « il faut que le scale soit que sur le segement et pas que ca soit sperarer entre segement et l'icon aura + text », « les conffeti parte de trop proche du screen et sont un peu grosses »).

**references/game-feel.md: World feedback**, ajout (`G3-15`)

- **A ragdoll is a controlled failure.** The knock lands the player where he was heading when there is room, else pushes him back; the camera goes third person during it; the loss shows at once (a notification, and a red share of the bar that shrinks slowly); a few seconds of invulnerability follow; the body never flails (Stop The Eruption, 2026-09-24: « ca essaie de non repouser ou on allais si il y a la place sinon ca nous repousse en arriere + faire en sorte qu'on soit en 3eme personne lors du ragdoll + bien montrer que l'on perds de l'eau avec un notification + une genre de bar rouge sur la progress bar le l'eau la bar rouge qui prende du temps a se retrcire », « trouver un meilleur radgoll la il est janky et bouge dans tous les sens »; 2026-10-14: « des qu'il est ragdoll apres il est invulnerable pendant queleques secondes »).

**references/game-feel.md: World feedback**, ajout (`G3-16`)

- **Nothing leaves in one frame, and a pickup rain has no holes.** An effect or pickup that goes scales down or fades; a field of falling pickups spawns by density across the area, always from the top (Anime Aura Farming's clover rain, 2026-09-24: « lorsque ca disparait sa doit scale down au lieu de tout despawn d'un coup », « essaei de les fair spawn avec un density les clover pour eviter qu'il y ai des trous sur l'axe X », « il doivent toujours tomber du haut »).

**references/game-feel.md: World feedback**, ajout (`G3-17`)

- **Every object reads as itself, from the source to the shelf.** One item drawn on a source is one item collected, with no hidden conversion; a source grows its items back one by one, each on the spot it was taken from, after a short fixed delay; a machine waits a short beat after an input lands, so the deposit is seen before it is processed; an object keeps its model, size and colours from the ground to the hands to storage (Run a Dino Shop!, 2026-11-16: « 1 baie sur l'arbre a baie correspond a 1 baie recupere la ca enleves les 4 pour1 baie dans l'inventaire », « les baie doivent pousser 1 par 1 »; 2026-11-17: « pour chaque baie recuperer elle reaparait a son endroit apres 2 s »; 2026-11-19: « Les mahcines doivent avoir une petit delai entre le moment ou il y a une ressources et que ca process », « c'est dommage que les oeufs qui tombent des meteorites de que l'on en prends dans les main il deviens petit et pas le meme oeuf »).

**references/genres.md: 4. Tycoon (droppers, shops, restaurants)**, ajout (`G3-19`)

- **What is not bought yet draws nothing.** A tycoon plot's locked part shows no dark parts and no silhouette, only its pad or its unlock sign; this is for pieces of the plot, while the next zone of a map stays visible and locked (SKILL.md "The first 60 seconds") (Run a Dino Shop!, 2026-11-16: « la partie pas unlocked ne doit pas avoir de part dutout meme des parts noires car c'est lairement moche ici juste ne rien mettre »).

**references/genres.md: 4. Tycoon (droppers, shops, restaurants)**, ajout (`G3-20`)

- **Every buy is a choice that adds something new.** At least two pads on offer at once, never one pad that leads to the next; each early buy brings a resource the player does not have yet, never a second stand of one he has (Run a Dino Shop!, 2026-11-16: « on doit pouvoir avoir le choix entre 2 ou + achats pas que 1 pads par 1 pads »; 2026-11-17: « il ne faut que 1 stand max par ressources , il faut de la diversiter »).

**references/genres.md: 4. Tycoon (droppers, shops, restaurants)**, ajout (`G3-21`)

- **Upgrades to the player are skill-tree cells, never floor pads.** Pads build the plot; bag, carry and speed are bought in the skill tree. When this applies, every self-upgrade pad goes, on every plot, not only the one named (Run a Dino Shop!, 2026-11-17: « les amelioration de sac du skilltree ne doivent pas s'acheter avec des pads au sol »; 2026-11-18: « aussi y'a toujours les plques de tyccoon pour s'ameliorer soi meme ca ca doit etre enlecer »).

**references/genres.md: 4. Tycoon (droppers, shops, restaurants)**, ajout (`G3-22`)

- **Automation is earned.** A hired worker starts clearly slower than the player and his speed is bought in the skill tree; every machine has a speed line beside its capacity line (Run a Dino Shop!, 2026-11-20: « les employee doivent aller bcp moins vite et on doit ameliorer leurs vitess dans le skill tree », « en plus d'ameliorer la capacity des machines on doit pouvoir augmenter leurs speed »).

**references/genres.md: 4. Tycoon (droppers, shops, restaurants)**, ajout (`G3-23`)

- **No pass plays the loop for the player.** In a tycoon, a pass that fills every station by itself is not sold; this rules out the "auto-farm" of dna.md §6's standard pass set for a tycoon (Run a Dino Shop!, 2026-11-17: « tout se remplis direct etc y'a un gamepass qui fait auto enleve ce gamepass c'est trop cheat »).

**references/genres.md: 4. Tycoon (droppers, shops, restaurants)**, ajout (`G3-24`)

- **In a carry tycoon, carrying reads item by item.** Stepping on a source picks its items up one at a time in a visible stream, and putting them down goes the same way; the stream is quick and the first item moves the moment the player touches the zone; each item flies to the exact slot where it will sit; items put on the ground pile upward, never in a flat grid, and a machine's output stacks in a rising 2 × 2 block (Run a Dino Shop!, 2026-11-16: « des que je vais sur un plan de baie ca doit les recuperer 1 par 1, ensuite pareille des que je les poses »; 2026-11-17: « lorsque je met des baie dedans elle ne tween pas jusqu'au bon endroits », « si on poses les objet ils doivent se mettre en hauteur pas en grille », « les output des machiens doivent se stack en 2x2 au lieu de faire une pile direct »; 2026-11-18: « faire que l'on recupere les ressoucres plus vite dans les mains », « des que l'on touche les plaques grises ca mette les items plus vite la c'est trop lent surtout pour le premier item »).

**references/genres.md: 8. Anime fighting, aura farming, RNG**, ajout (`G3-18`)

- **Bosses, the studio's way (aura farming).** One boss per zone, themed on it, standing in its zone of the map where its fight starts, beatable only a few farming zones in; each boss's drop rarer than the last (1/100, then 1/250, then 1/500); the first fight cannot be lost, helped by a little auto-fight; a crit target stands out as clearly as the normal one (a red ring beside the blue) (Anime Aura Farming, 2026-09-28: « un boss par zones (ex: zone naruto = naruto) »; 2026-09-29: « il faudrat etre au moin a la 3eme zone pour le battre sinon impossible »; 2026-10-14: « met les bosses dans les zones de la map pour pouvoir lancer le combat », « 1 / 100 naruto sinon puis pour les autre bosses baisser le trop de drop genre 1 / 250 pui 1 / 500 »; 2026-10-19: « faire un round rouge comme le rond bleu »; 2026-11-04: « rends le premier fight contre le boss plus simple genre pas perdable + avec un peu de autofigth »).

### `game-balancing` (8)

**2. Measure the fastest line, never the typical one**, ajout (`G3-28`)

- **The board's own lines are measured too, beside the fastest one, never instead of it.** When the board names a line, print it next to the fastest one: in Anime Aura Farming, AFK with nothing, and active play that catches about 70% of the timed boosts (Anime Aura Farming, 2026-09-16: « ok mais avec 70% de reussite »; 2026-09-18: « ok mais la si il clique sur les x16 70% du temps d'afk ca prendrait combien de temps ? »; 2026-09-23: « compare avec les free to play etc.. avec 70% des bonus etc... », « il faut du temps en utilisant 70% des x16 et en afk sans rien ca prends bcp bcp de temps »).

**3. The workflow for any pacing change**, renforce une ligne existante (`G3-31`)

Remplace : _3. **Sweep it**: print the resulting ladder for each candidate value, free and paid (AAF:    `--sweep cap=10,25,50`). Fit gates by bisection, in order. Round to readable values._

3. **Sweep it**: print the resulting ladder for each candidate value, free and paid (AAF: `--sweep cap=10,25,50`), next to the live curve (Anime Aura Farming's pacing dashboard, 2026-09-14: « modifi le dashboard pour voir la difference entre les balancing »). Fit gates by bisection, in order. Round to readable values. **A request for a simulation changes no config**: answer with the table and the plan (2026-09-15: « ne la change pas maintenent mais juste fait une simulation ! »; 2026-09-16: « tout en ne touchant pas au code »).

**5. When a number changes meaning, existing players are owed a migration**, ajout (`G3-30`)

- **What players are attached to is spent, never reset; what they paid for is never touched.** When a change must take something back (a board call, see above), give a counter players love a sink instead of a reset; leave paid upgrades out of the migration; take a snapshot of the data first and ship the change in its own commit so it reverts cleanly; tell the players who lose something on their next join, in one window with the item's icon and a Claim button, and give them an item no one can get otherwise (Anime Aura Farming, 2026-09-14: « on ne va pas reset leurs rebirth il y sont trop attacher il faudrait qu'il les depense »; 2026-09-18: « les upgrades payer ne doivent pas etre toucher comme la spinluck ou le dice speed ! », « oui on va faire une snapshot alors », « on va faire ca dans un commit separer ppour ouvoir revert facielement », « avec l'icon de l'aura et en bas un button claim »; 2026-09-16: « une aura unique pour l'ocasion (non optensible autrement) »).

**6. Techniques worth knowing**, ajout (`G3-25`)

- **No full power at the first buy.** An early upgrade starts well below the top of its line (Stop The Eruption's first reservoir at 50%, filling 25% slower), each tier costs more than the last, and when one tier is too strong the whole line is checked (Stop The Eruption, 2026-10-24: « reservoir trop OP -> debut mettre a 50% et remplissage 25% moins rapide », « plus le reservoir est bas + il coute cher (400, 600 puis 900 etc..) »; 2026-11-18, after the first bucket at 400 diamonds was reported too strong: « oui le duexieme doit aussi etre un peu nerf alors », « nerf les tous le LIGTH est deja trop OP »).

**6. Techniques worth knowing**, ajout (`G3-26`)

- **A free wheel is a faucet: keep its payouts small and read it early.** When premium currency looks abused, the wheel is one of the first sources to check; a duplicate result pays a small consolation, not the item's worth again; the wheel's top items stay rare (Stop The Eruption, 2026-11-16: « voir si les diamant sont pas trop abuser par example avec la roue etc... », « nerf les diamant donner dans la roue », « nerf a 10 au lieu de 15 », « et 35 au lieu de 50 et 100 au lieu de 150 »; 2026-11-18: « si on a 2fois un truc dans la roux comme le seau on ne gagne pas de diamant en + ou genre 25 pas plus », « fait que les eeau dans la roue (seau de pompier) soit encore + rare »).

**6. Techniques worth knowing**, ajout (`G3-27`)

- **Every luck lever has a cap and a floor, and bought luck tiers double.** Cap the top rarity so that even admin events cannot make it easy; a special wheel's floor (the new players' wheel at Mythic) never lowers what the player already gets; bought luck tiers double (×64, then ×128) (Anime Aura Farming, 2026-09-30: « cap le drop des Secret pour eviter que ca soit trop simple a avoir meme avec les events admin », « pour la roue des nouveau joueur plance a mythic »; 2026-09-29: « plancher veux pas dire nerf le joueurs »; 2026-10-12: « met 128 plutot ca doit doubler a chaque fois »).

**6. Techniques worth knowing**, ajout (`G3-29`)

- **A run's floors: an opening that works, no trivial middle, a short and playable end.** In a run-based game, report the pace floor by floor: a middle floor cleared with one or two actions is too easy, the last floor is never the longest, and what the player must act on there stays reachable (Stop The Eruption, 2026-10-27: « la progression du debut est nickel », « a la fin c'était trop long et on ne pouvvais plus toucher la lave au dernier etage »; 2026-10-28: « les etages F4 et F5 sont encore trop facile genre 1 ou 2 seau par etage ca va trop vite ? et a la fin le F6 est super long... »).

**6. Techniques worth knowing**, ajout (`G3-32`)

- **A production tycoon counts in ones.** A machine takes one of each of its inputs to make one output, and its model has one input tray per input it takes; a carry capacity, the player's or a worker's, grows by +1 a level (Run a Dino Shop!, 2026-11-17: « le mieux c'est que ca demande 1 de chaque ressoucre d'input pour faire 1 resource d'output », « le model est plus bon car y'a deux palteau d'input alorsque ca demande que des baies »; 2026-11-20: « dans le skill tree notre sac et le sac des employees doit s'incrementer 1 par 1 »).

### `stud-animations` (7)

**4. Write the animation (`blender/anims/<Name>.py`)**, ajout (`G2-28`)

- **A reference is matched, timing and camera included**: when the board names a reference (a
  game's video), time its phases, match them and its camera move, and compare both side by side at the
  same speed before hand-over (Throw a Weapon, 2026-11-06, a throw copied from another game's video:
  « oui mais la ca fait pas l'animation de camera etc... », « c'est bcp plus lent que sur la ref »).

**5b. Big bosses (built: OgreMech, ~39 studs, 18 bones, mace welded in the right fist)**, ajout (`G2-25`)

**A boss in a fight never rests** (Anime Aura Farming's bosses, 2026-10-09 → 10-14): it chains
attacks and never falls back to its idle; every bone moves in its fight clips, the head turning with
the torso, never countered so far that it hangs still in the world; its death ends lying on the floor
(assert it with fk at `Dead`); it stands on the arena floor, never below it, so its ground telegraph
shows (« naruto doit toujours etre entrain de taper lors du combat pas animation idle », « La tete du
boss reste bloquer pendant le combat .. », « la tetes des bosses est comme anchored en combat... »,
« l'animation de death le boss ne tombe pas vraiment par terre », « le boss dans l'aere est juste un
peu bas car le VFX de cercle sur le sol ne se vois pas sinon »).

**5c. Characters (R15 Humanoid) holding an animated weapon (built: TNT slingshot on `Workspace.Rig`)**, ajout (`G2-27`)

7. **Check every held prop in each pose on a close capture** (Anime Aura Farming's auras,
   2026-09-17 → 11-09): the hand closes on its grip and a prop held in the mouth is held by its handle
   (Zoro's sword by its hilt, never the blade), the prop points the way the character holds it, its
   size reads against the body, what it rests on touches it (a ball at the foot, a rock under the
   raised foot), and it still sits right at the smallest character size the game uses (« les katanas
   ne sont pas bien placer dasn les mains + il sont trop petit », « le sabre est dans la bouche alors
   que ca doit etre le manche du sabre », « le katana de Rengoku est mal orienter en main », « le scale
   de death note est bug », « le livre est dans le torse du perso des que la taille est trop
   petite... », « le balon doit etre au pied », « rajouter le rocher sous la jambe gauche de GUTS (la
   jambe qui se leve) »).

**7. Playing it in game**, ajout (`G2-29`)

- **A following pet walks with its own Walk clip** whenever its owner moves, its bounce coming from
  the walk itself; never a rigid glide, never hops in place of the walk (Run a Dino Shop!, 2026-11-14:
  « Il manque l'animation de bulk (rebond) sur les pets qui suivent le joueur. »; 2026-11-16: « Les
  dino pets equipped, ne joue pas leurs animation de walk des que je marche masi fond des bonds »).

**new: 5e. Character poses and attack chains (anime auras, R15)**, nouvelle section (`G2-26`)

### 5e. Character poses and attack chains (anime auras, R15)

- **A showcase character never stands still and never repeats one move** (Anime Aura Farming's
  auras, 2026-09-17 → 10-12): attacks follow one another at random with no gap and no idle between
  them; a pose is long and complex, several beats over several limbs (not always the right arm
  forward), never a basic loop; shaking is for the one character it suits (Eren, the exception to
  §4's no jitter keys), never a beat every pose gets; no joint bends past what a body can do. Anime
  Aura Farming's ThorfinnSit is the bar (2026-09-17: « il faut qu'il y ai tout le temps une
  animation », « pas besoin de Idle on va juste jouer desattaques random a la suite »; 2026-09-25:
  « essaie de les rendre plus vivante et animaer (sauf pour la ThorfinnSit qui est masterclass) »,
  « plus longue et pas juste une loop basique mais plutot complexe avec differents movements »;
  2026-10-05: « tu joue trop sur les vibration / tremblement du corps, c'est bien pour Eren par
  example mais sinon c'est un peu abuser tout le temps , aussi c'est tout le temps le bras droit qui
  est mis en avant chnage un peu »; 2026-10-12: « sur toutes les animation des nouvelles aura y'a
  tout le tmeps un moment ou il vibre / tramble eneleve ca et remplace par un truc vraiment unique »,
  « desfois sur Kaiser fait des movement illegaux des bras »).

**new: 5f. Carrying a stack (carry-and-stack games, Run a Dino Shop!)**, nouvelle section (`G2-30`)

### 5f. Carrying a stack (carry-and-stack games, Run a Dino Shop!)

- **What the player carries is one column held in both hands in front of him**, in a holding pose
  with the hands close together under it: nothing floats detached behind him, no back bag or basket,
  and every type he picks goes on that one column in pick order (2026-11-14: « Aujourd'hui ils
  flottent dans le vide derrière lui (dans le jeu de référence, ils sont devant, dans les mains, donc
  ça passe, ici non) »; 2026-11-16: « aussi les objets si c'est pas du meme type il s'empile quand meme
  dans la meme ligne la je vois que l'agent qui s'occupe de ca ne fait pas ca »; 2026-11-17: « au lieu
  d'un sac qui est deriere nous, mettre les objet dans les main comme dans le screen »; 2026-11-18:
  « changer l'animation de holding raprocher plus les mains entre elles »).

**new: 5f. Carrying a stack (carry-and-stack games, Run a Dino Shop!)**, ajout (`G2-31`)

- **NPCs carry and put down like the player**: the same column in both hands, the same holding
  pose, the same flight and landing when they put items down (2026-11-18: « les NCP doivent prendre
  les objets dans les mains comme le joueur (empilage) », « lorsque les clients posent leurs
  marchandise surla caisse il doit y avoir la meme animation que lorsque c'est le joueur qui pose dans
  les etagere »).

### `roblox-thumbnails` (7)

**1. Two starts, and where the game's own facts live**, renforce une ligne existante (`G5-1`)

Remplace : _**A new game** has no store art and no numbers. Skip §3: discover the genre and the giants (§4), pick two or three simple bases whose story maps onto the game's loop, map them element by element (§5), draw (§6), and hand over a contact sheet with the icon (§10, §12). The first published set is what the next rework measures._

**A new game** has no store art and no numbers. Skip §3: discover the genre and
the giants (§4), pick two or three simple bases whose story maps onto the game's
loop, map them element by element (§5), draw (§6), and hand over a contact sheet
with the icon (§10, §12). The first published set is what the next rework measures.

**Every set starts from the competitors, whatever the method.** Before drawing,
pull the genre's top tiles and icons (`discover.py`, §4) onto one sheet and give
each tile of the set its own base among them, a different one per tile, so the
tiles do not share one style. A staged capture (§7) restages one of those tiles
with the game's assets; it is not a composition of its own (§7's one camera came
from a set built on one base, Totally Normal Obby's a17; with several bases, each
tile takes its base's angle). Run a Dino Shop!'s set of staged captures came back
for it (2026-11-14: « là c'est un peu trop dans le même style », « prends exemple
sur vraiment les concurrents »); the set redrawn from competitor tiles got
« celles-là sont très très cool ». The asked-for form, on MP5 Arena: « prends les
minias de [Deagle Arena] mais fait les dans notre DA » (2026-11-02). Put the
competitors' sheet beside the first candidates.

**10. The icon (1:1)**, ajout (`G5-5`)

Judge the icon beside the main competitor's icon, as a player sees them side by
side in a Home row, at 150 and 50 px: the subject stands off its background in
value and colour (MP5 Arena, 2026-11-02: « l'icon carre du jeu je trouve que y'a
pas asse de contrast avec le background comparer a deagle arena »; a gold gun and
pale arms on a village of the same brightness, beside Deagle Arena's dark,
saturated gun on one calm blue). Fix it with one-axis variants, the subject's
colour or the background; the one he published kept the village and gave the gun
the red camo (« upload celle avec le camo rouge stp »).

**12. Before handing over**, ajout (`G5-4`)

- Every creature and every character other than the player faces the camera
  or the scene's subject, never shows its back (Run a Dino Shop!, 2026-11-14,
  on the dinos of the COLLECT THEM ALL tile: « ils sont tous retournés genre et
  ça aucun sens »). The player's avatar keeps its own rules: three-quarter
  behind with the head turned (§7), over the shoulder on a dispenser tile (§8),
  from behind on the icon recipe (§10).

**5. A new concept: a top game's base, the game's assets**, ajout (`G5-6`)

**A base lends its composition, never its loop.** A base can come from any
genre (§4), but the tile sells this game's loop: it keeps only devices the game
itself has, and a tile that reads as the other game's loop is sent back (Anime
Aura Farming, 2026-10-14, on edits of a card-collection game's tiles: « c'est
pas un jeu de carte notre jeu »). The game's own event promo art is not a base
either when its backdrop is not in the game: « le background n'est pas utiliser
dans le jeu c'etait juste pour le promo d'un event donc les minia genre zoro
c'est pas a prendre » (2026-10-06).

**7. Prompt recipes that were actually needed**, renforce une ligne existante (`G5-2`)

Remplace : _- **The AI pass keeps the capture**: Image 1 is the raw capture; the prompt   adds light, rim, a cleaner sky, and forbids adding or moving anything (the   hair's shape, the studs and the models stay). Compare each result with its   raw side by side (`compare-*.png`): the AI tends to turn the avatar side-on   and roughen the studs, and a result that moved something is redone._

- **The AI pass keeps the capture**: Image 1 is the raw capture; the prompt
  adds light, rim, a cleaner sky, and forbids adding or moving anything (the
  hair's shape, the studs and the models stay). Compare each result with its
  raw side by side (`compare-*.png`): the AI tends to turn the avatar side-on
  and roughen the studs, and a result that moved something is redone. So is a
  result that still reads as the raw capture: the pass visibly grades the
  light, the colour and the sky up to the top tiles beside it (Run a Dino
  Shop!, 2026-11-14: « pas assez retouché par IA »).

**7. Prompt recipes that were actually needed**, ajout (`G5-3`)

- **No Studio marker in the shot**: Studio draws Attachments as small green
  dots, in a capture and in a `get_model_icon` reference, and the AI pass keeps
  them (Run a Dino Shop!, 2026-11-14: « des petits points verts et en fait ça
  c'est les attachments »; two tiles of the next set still needed an edit to
  paint out the dots a T-Rex reference carried). Turn the Attachments' display
  off, or delete the ones the shot does not need, before the capture, and look
  at each raw capture and reference at full size.

**new: 13. The gameplay video**, nouvelle section (`G5-7`)

## 13. The gameplay video

Roblox auto-plays a game's video in its recommendations (`roblox-game-dna`
`references/dna.md` "Surfaces": authentic footage, no voice-over, no promo
overlays). What Romain asked for on the first one (Anime Aura Farming,
2026-10-01/02, cut with Remotion from his own recordings):

- **It tells the loop in order, and nothing else**: a hook on the HUD in the
  tutorial, the click, the first roll, the escalation, the chaos of the late
  game, ending on the best drop. A cut that does not move that story goes
  (« ok mais la il y a trop de cut qui ont aucun sens, aussi y'a pas mal de truc
  ou on s'en fous comme la fin du tutoriel », then « en gros ce qui est bien
  c'est un zoom sur le dee du HUD lors du tuto, ensuite je clique, ensuite ca
  ouvre le spin et ensuite on voie l'evolution des spin … et on fini sur le drop
  de gojo »; « essaie de laisser un moment ou c'est le bordel tellement y'a de
  row en pleinne ecran »).
- **Up to 45 to 50 s**, not rushed (« la ca va peut etre un peu vite tu peux
  aller jusqu'a 45 - 50 s »).
- **Slow zooms on the real UI being used**: gradually into a list as it
  scrolls, onto the button pressed, never following the mouse (« zoome petit a
  petit du scrool pour vraiment donner envie », « zoom menu rebirth au lieu de
  suivre la souris zoome sur le button rebirth »).
- **No explaining text on screen** (« aussi j'aime pas les text qui explique sur
  l'ecran »).
- **Watch every frame**: no developer console, no glitch (« ne met pas les
  premiere frame avec le console en bas la », « a 18s y'a un bug ou on voie le
  ciel pendant pas longtemps »).
- **The soundtrack is the game's own music** (« ok mais le sons de la
  presentation des auras doit etre la musique phonk de base »).
- **Check it against Roblox's video rules before handing it over**
  (https://create.roblox.com/docs/production/publishing/thumbnails; « check si
  la video passe les requirements roblox », « la video meet les standards
  roblox ? »).

### `map-builder` (6)

**4. Gameplay contracts in the world**, ajout (`G4-3`)

- **A spot not bought yet reads as finished: no gap, no hole, no stand-in.** Where a bought piece closes a gap on the route (a bridge), a broken version of it stands there until it is bought, and the player jumps across it (Stop the Eruption, 2026-10-13: « il faudrait qu'il y ai un pont casser pour lorsque le joeuur n'as pas de pont afin qu'il doivent faire le jump sur ce pont jusqu'a temps qu'il la'achete »). An opening in a wall with nothing bought behind it is closed: a wall where a stand is missing, glass Parts over a showcase not unlocked yet (Run a Dino Shop!, 2026-11-16: « si il n'y a pas de station remplacer par un mur »; 2026-11-18: « les endroits des vitrines de dino ne sont pas fermee (mettre des vitres en parts lorsque l'on a pas debloquer ca) »). A locked floor area shows only its unlock sign, no dark stand-in Parts (2026-11-16: « la partie pas unlocked ne doit pas avoir de part dutout meme des parts noires car c'est lairement moche ici juste ne rien mettre »).

**4. Gameplay contracts in the world**, ajout (`G4-4`)

- **Nothing looks usable unless it works.** A cue that means "put it here" (a grey drop slab) lies only under what the player fills, and an object that looks like one the player uses in this game (a bin, a machine) is a working one or is removed: no decorative copies (Run a Dino Shop!, 2026-11-13: « sur la map il doit y avoir des pads gris uniquement sous les choses où l'on met dedans dans le magasin sinon le reste il n'y a pas de part grise ou juste des parts de stockage comme le lait »; 2026-11-18: « les poubelles ne sont pas comme je t'ai dit hier y'a des poubelle encore pas fonctionelle »).

**4. Gameplay contracts in the world**, ajout (`G4-5`)

- **Furniture and machines are solid.** Shelves, counters, tills, machines and anything else a player walks up to collide (`CanCollide` on, the fidelity of `stud-models` §3: `Box`, `Hull` for round ones); only what the player must walk through and small decor do not. Check every placed copy on every plot after each model swap or new piece (Run a Dino Shop!, 2026-11-16: « les etageres / meubles doivent avoir des colision »; 2026-11-19, a machine counter built without collision: « la les machines sont en can collide false il faut de la colision »).

**5. Verify and hand over**, renforce une ligne existante (`G4-6`)

Remplace : _- Turntables wide + close of everything you built; check for the §2 symptoms (dark squares, blobs,   buried or floating models), and seams: nothing that should read as one shape (arrows, flows,   liquids, dressing) shows separate Parts up close (rule 7)._

- Turntables wide + close of everything you built; check for the §2 symptoms (dark squares, blobs,
  buried or floating models), and seams: nothing that should read as one shape (arrows, flows,
  liquids, dressing) shows separate Parts up close (rule 7).
- **Every placed model sits on its support and clear of the other models, measured over the whole
  map**, not only where you looked: a short ray from each prop's foot (down) or back (a wall torch, a
  sign) finds its support within 0.1 stud, and no placed model's parts sit inside another placed
  model (a parts-in-part pass, surprises confirmed by rays, §2; a rock sunk into the ground on purpose
  is not a defect) (MP5 Arena, 2026-11-02: « dans certaines map les torches volent »; Totally Normal
  Obby, 2026-11-02: « fait bien gaffe certain son mal placer ou dans d'atre models »).

**6. The user's taste calls for world building (respect them by default)**, renforce une ligne existante (`G4-1`)

Remplace : _| 2026-09-28 | The second map "volcanique comme le Lobby" | One art direction per game; a new area inherits the existing area's palette |_

| 2026-09-28, 10-08, 10-22 | The second map "volcanique comme le Lobby"; a redesign modelled on another game (Stop the Eruption, 2026-10-08): « ok mais la le style c'est pas dutout le bon enfaite j'aimerais garder le style des anciene build mais peut etre en plus claire, et le volcan etait grave cool juste trop haut quoi », « garde l'ancien style de build mais en plus claire quoi »; the Mario-like Thwomps of a fire stage (2026-10-22): « fait les dans la DA du jeu peut etre sans tete » | One art direction per game: a new area inherits the existing area's palette; a redesign keeps the game's build style and changes only what he names (lighter, lower), never a new style; an obstacle taken from another game keeps its mechanic and is drawn in this game's art direction (unlike "In the style of X", where X's look is the ask) |

**6. The user's taste calls for world building (respect them by default)**, ajout (`G4-7`)

| 2026-10-27 → 11-02 | Conveyors and guide lines (Totally Normal Obby): « c'est bizzare la c'est dans le bon sens mais ca se met par dessus la route a chaque turn », « les beams des tapis roulant sont a l'enver des models, sur les tapis il ne doit pas avoir de model 3d juste les beams », then « les beam sont toujours bug avec le truc en 3d » | A conveyor carries only its scrolling Beam arrows, on the belt, pointing the way it moves: no 3D arrow model on it (the Blender chevron of rule 7 is for static markings); a fix removes every leftover model. A guide line follows the route through every turn, never drawn across over it. Checked from the player's camera (§5) |

### `vfx-creator` (5)

**0b. What the user taught — general rules from their reviews (2026-10-01 → 11-02)**, ajout (`G2-20`)

16. **Every effect is its own, never stock or shared.** A signature is not a generic ring or half
    circle: find a special emitter in the AuraLibrary catalog (§9) and harvest it. Variants differ in
    silhouette and motion, not in colour or layer count, and each still reads as what it is; every
    zone and every event gets its own effect; a stronger tier earns its power with a new element,
    never by stacking the same explosion. Look at every variant close up for a blurred texture (Anime
    Aura Farming, 2026-10-02: « j'aime pas dutout ce VFX de cercle a moitier la va cherches des choses
    plus uniques tu a game.Workspace.AuraLibrary pour ca ! »; 2026-09-21: « y'a moyen que les VFX des
    zones changes car la c'est tous le meme »; 2026-10-12: « les particles des events c'est lele meme
    entre blood moon boreal etc.. donc pas ouf »; build-tests' black holes, 2026-11-04: « la ils sont
    trop resemblant fait en d'autres », « mtn ca fait plus trop trou noire ou naine banche ou etoile
    quoi... fait en plein », « c'est nul la c'est un peu juste les meme VFX qui explose pour rendre +
    epique », « certaines texture sont blurred »).

**0b. What the user taught — general rules from their reviews (2026-10-01 → 11-02)**, ajout (`G2-21`)

17. **What lives in an effect moves.** Flowers, a beast, a tail are animated (they sway, breathe,
    the tail swings), never static or rigid, and a group of them is never one model copied (rule 4)
    (Anime Aura Farming, 2026-10-12: « enfaite les fleures statique j'aime pas »; 2026-11-06: « j'aime
    pas trop le fit qu'il y ai 5 fois le meme lion en model »; 2026-11-09: « rendre le lion de Barou +
    organique (surtout la queue) »).

**11. Done checklist**, ajout (`G2-24`)

- [ ] A worn effect checked on several avatars (the Bacon Hair and others) and at the smallest and
      largest scale the game gives it: face art on the eyes, the ground layer on the ground (Anime
      Aura Farming, 2026-09-23: « l'oeil rouge devant les eye peut import le character car la ca
      fonctionne bien avec le bacon hair mais pas avec les autres skins »; 2026-09-28: « le ground est
      mal mis et est trop bas », « c'est un probleme uniquement lorsquelle sont a 0.5 fois leurs
      taille »).

**3. Archetype recipes (start values — then look, §7)**, ajout (`G2-22`)

**Repeated hit slashes** (Anime Aura Farming's Zoro attacks, 2026-09-17), on top of the slash
recipe: a stream of hits takes every angle (/ as well as \ and X), sometimes one stroke instead of
the X, and each slash lies in front of the player, not turned to the camera (« c'est soit X soit \ mais
jamais / », « defois faire que 1 sur les deux du X pour plus de variation », « y'a moyen que les
particles de slash ducoup soit pas en face camera mais juste devant le joueur »).

**8. Budget and runtime**, ajout (`G2-23`)

- **UI particles run from one loop**: a field of 2D sprites in a ScreenGui (clovers, sparkles)
  moves from one per-frame connection for the whole field, never one connection per particle; its
  sizes follow the screen like the rest of the UI (`roblox-game-conventions`, Phones and touch)
  (Anime Aura Farming, 2026-09-24: « sur telephone me les trefles plus petit (fait en sorte que ca
  soit comme sur la taille pc mais sur tous les devices) + faire une seule boucle par frame pour
  toutes les particules, au lieu d'une connexion par trèfle »).

### `roblox-agent-team` (5)

**10. Working with Romain**, renforce une ligne existante (`G6-1`)

Remplace : _3. **Show it.** Every visible or audible change is reported with a capture    you looked at (or the sound); never claim a visual fix from numbers ("donne    moi un screen qui le montre", Throw a Weapon, 2026-10-15)._

3. **Show it, in the game, without being asked.** Every visible or audible change is reported with a capture you took and looked at (or the sound); never claim a visual fix from numbers (« donne moi un screen qui le montre », Throw a Weapon, 2026-10-15). A capture counts only as the player meets it: in the real place once the work is in it (or a copy at its saved version), from the player's camera, in Play for anything the HUD or a menu shows, with the HUD and the state around it on. A render or an edit-mode shot is a preview (MP5 Arena: « refait le style, et aussi render avec le lvel up et le hud ingame pour bien etre dans les condition reel », 2026-11-03; « lance le jeu pour vraiment voir sinon ca ne compte pas », 2026-11-05; Totally Normal Obby, 2026-10-27: « mais pourquoi c'est pas mis sur le main ? sur la main place y'a que des part carre »). Before reporting a new build (not a fix: → `to-tasks` §7), start Play once and check what a player meets first: the camera mode, the HUD, the core action (Stop The Eruption, 2026-09-23: « deja c'est pas en first personne ensuite y'a rien qui ne fonctionnn c'est abberant ! »). A before/after he asks for is two captures of the same spot from the same camera, in the map itself (Stop The Eruption: « mettre les lumiere en blanche dans la ville (faire une test avant apres) », 2026-10-21; « fait moi des images avant apres mais dans la map directement stp », 2026-11-02).

**10. Working with Romain**, ajout (`G6-2`)

11. **Change only what was asked, and change it in place.** Assets, templates, the HUD and live things (an event, a product, a pass) outside the task are not touched. A published thing whose one field changes (an event's picture, a product's icon) is edited in place, never deleted and made again (Stop The Eruption, 2026-11-17, when an agent proposed deleting two Experience Events to change their picture, which `events.py thumb` swaps in place: « pourquoi delete il fallait juste changer la minniaa@!!!!!!!! »). After a merge, a branch switch or a Studio build, check that nothing outside the task moved or vanished (`git diff --stat` against the base, the place's instance counts before and after) and say so in the report (Anime Aura Farming: « euh par contre ca a changer les assets la ? piurquoi !!! en plus la template est bug ! », 2026-09-25; « check si rien n'a ete suppr », 2026-10-14).

**10. Working with Romain**, ajout (`G6-3`)

12. **A defect he wants gone for good gets a check, not only a sentence.** When he asks that a defect never come back, the fix lands with a check that would have caught it (a gate, an audit line, a script that refuses or repairs) in the skill or the game that produced it, and the report names that check (build-tests, 2026-10-01, z-fighting on a stud model: « y'a du Zfighting », then « fait en sorte que ca ne puisse plus arriver avec ce skill »; Anime Aura Farming, 2026-11-16, an event picture other players could not see: « fait en sorte que ca ne ce reproduise plus »).

**10. Working with Romain**, ajout (`G6-4`)

13. **A look he has not settled is shown as variants.** When the call is taste (a style, a colour, a timer, a button's border) and he has not decided it, or he turns a look down, build two or three labelled variants of the same thing, capture each from the same camera, and let him pick, rather than one more single try (MP5 Arena, 2026-11-03: « j'aime toujours pas le timer fait des variantes »; build-tests: « essaie de me faire une variante voir si j'aime mieux », 2026-10-02; « une variante sans bottom border des button + une variante avec l'ancienne texture de stud », 2026-11-10; « try a vraiante where the color is a bit lighter but more dissiped », 2026-11-11). Interfaces (`roblox-game-conventions`, Interfaces start in a Claude Design artifact) and effects (`vfx-creator` rule 11) say the same.

**8. Rules**, ajout (`G6-5`)

- **A publish is checked before and after.** Before asking for one, `check_place_version` answers ready (the saved version holds every script of the commit you ship and is newer than the published one); after it, check that the version marked published is the one you checked and that Studio, on the place, still shows your change, before you say it is live (MP5 Arena, 2026-11-05: « c'est toujours l'ancienne version, je crois que ca ne marche as », then « euhhh, pourquoi la version est plus bonne c'est une vieiile verion meme sur studio.... »).

### `sound-designer` (3)

**0b. What Romain taught — Romain's calls, as rules**, renforce une ligne existante (`G5-9`)

Remplace : _10. **Music comes from the genre's hits, low under the effects** — "reprends les musiques des jeux     comme Escape a Tsunami ou Grow a Garden … met-les toutes et assez basse" (2026-10-26): scout     them (§8) and find their licensed tracks or lookalikes. Lobby music is a mood the whole game     shares ("musique lobby beaucoup plus forte", Stop the Eruption, 2026-10-24: level it against     the SF…_

10. **Music sounds like the music of Roblox games, whatever the theme, low under the effects**:
    Romain first asked for tracks « roblox like et dans le theme », then « reprends les musique
    des jeux comme escaepe a tsunami ou alors grow a garden », « mais enfaite pas besoin que ca
    soit avec le theme juste que ca soit des musique de jeu roblox » and « ok met les toutes et
    asser basse quand meme » (Throw a Weapon, 2026-10-26). Totally Normal Obby's stage-1
    music-box nursery tune went the same way: the board wanted real obby music (2026-10-22). The
    kind of track the genre's top games play wins over one picked for the theme: scout them (§8)
    and find their licensed tracks or lookalikes. Lobby music is a mood the whole game shares
    ("musique lobby beaucoup plus forte", Stop the Eruption, 2026-10-24: level it against the
    SFX, not alone).

**0b. What Romain taught — Romain's calls, as rules**, ajout (`G5-10`)

13. **A milestone sound plays over the event's own sound, never instead of it**: « jouer ce
    sounds tout les 10kills de suite », then « le sounds de kill des que l'on a 10kills
    d'affiler doit ce jouer par dessus celui de kill de base » (MP5 Arena, 2026-11-02): a
    streak, a tenth kill or a record layers its sting on the base sound (each on its own copy,
    `sound-effects` §2), so the player hears both.

**0b. What Romain taught — Romain's calls, as rules**, ajout (`G5-12`)

14. **Every HUD notification plays a sound**: « rajouter un son pour les notifications du HUD »
    (Run a Dino Shop!, 2026-11-19): each line that comes into the HUD plays a short standard UI
    sound (§3.1), debounced like any UI sound (§2).

### `asset-kit` (2)

**1. The kit contract**, renforce une ligne existante (`G4-9`)

Remplace : _character skins taken from the Toolbox match the game's avatar style ("tous blocky … en mode R6 avatars")._

NPCs and character skins are Roblox avatars
(a Toolbox rig or a HumanoidDescription), dressed and animated, never modelled, and every one is blocky in the R6
look whatever its rig, an R15 rig too (Stop the Eruption, 2026-09-21: « mais les npc doivent etre plus clean et tous
blocky... », « nn mais je parlais de blocky en mode "R6" avatars »; 2026-10-14: « les PNJ sont des R15 de la toolbox
peut etre juste animer et habiller »; Run a Dino Shop!, 2026-11-16: « tout les NPC doivent etre blocky certain client
sont en R15 mais pas blocky »). Their light highlight and billboard follow `roblox-game-conventions`.

**6. Replacing an asset everywhere**, ajout (`G4-8`)

- every swapped copy faces where the player needs it, not where the old model's pivot or customer spot pointed: after the swap, look at each copy from the side the player arrives from, plot by plot (`map-builder` §5), and turn only those whose show face (sign, shelf front) is away (Run a Dino Shop!, 2026-11-20: « certain meubles et etagere sont rotate a 180 deg vers l'ere tout bizzare », then the same afternoon, on rows the first fix had turned toward the doors: « Les game.Workspace.Map.Plot1.Store.BerryShelf sont comme rotate a 180 deg les oeufs shelfs aussi »);

### `roblox-game-review` (2)

**3. The session — every loop, twice**, ajout (`G6-7`)

- **Passes**: Roblox gives a game's creator every one of its passes, so the owner's Studio and the board's own playtest play someone who bought everything. Play the new-player run owning no pass (on the copy only, a scenario `save` seed that sets every pass to false in `ownedProducts` keeps them unowned for the session, whatever Roblox says: `tests/playtests/README.md`), and when the board's list holds a behaviour only a pass explains (a helper there from the first second, stations that fill by themselves), say which pass causes it before anything is fixed (Run a Dino Shop!, 2026-11-16: « le raptoir aprivoiser est donner direct je comprends pas »; 2026-11-17: « j'ai compris pourquoi tout se remplis direct etc y'a un gamepass qui fait auto », then « okdonc ignore les bug qui vienne du fait que j'avais les gamepasse »).

**4. The conventions and the code**, ajout (`G6-6`)

**Performance on a low-end phone.** Romain asks it game after game, so the review answers it unasked: at the lowest graphics level, on a phone viewport, with several players' effects on (`roblox-game-dna` per-role, Feel · Reviewer 6), measure against `roblox-game-dna`'s low-end budget what the tools can read (mesh triangles, texture sizes, emitters and lights, the HUD's CanvasGroups and gradients), and put each optimisation worth making on the list as its own fix task with what it saves; what the tools cannot read, and the frame rate on a real phone, go under Not covered (MP5 Arena, 2026-11-02: « is the game optimized ? », then « ok create a subagent for each optimisation please »; 2026-11-06: « y'a moyen enore de faire des opti sur les effets HUD ? et sur le jeu en generale sur mobile low end device !!! »; build-tests, 2026-11-12: « les teture et model sont optimiser pour les low end device ? »; Anime Aura Farming, 2026-09-14: « can you make optimisation on low end edevice on the player aura draw distance and stuff like that please »).

### `roblox-localization` (1)

**new: Text fits in every language**, nouvelle section (`G1-26`)

## Text fits in every language

Every screen is checked in the game's main languages before it is handed over: English and French at
least, and every language its table or Roblox's automatic translation ships, German among them (its
words are the longest), each with its longest rendered string (Run a Dino Shop!, 2026-11-17: « le text
"retour a ma boutique" depasse du button (check les langues principales sur les buttons pour eviter
que ca depasses »).

- **Nothing is cut, overflows or slides under a button**: a button label stays inside its button,
  a title keeps the room of the ✕ beside it (MP5 Arena's French "Argent du match" title ran under
  its popup's ✕, 2026-11-05), a body text keeps its gap above its button.
- **Fix the layout**: `TextScaled` with a `UITextSizeConstraint`, `AutomaticSize`, a second line,
  padding reserved for the close button.
- **Look in Play, per locale** (Studio's Player Emulator, above), on PC and on a phone, and judge
  each screen on a capture.

### `roblox-experience-events` (1)

**0. Romain's calls**, ajout (`G3-33`)

| « cree un event pour la seamin prochaine avec le logo avec les ??? sur fond noir » (Anime Aura Farming, 2026-11-11), « en description tu met "???" » (2026-11-04) | An update announced before its reveal gets a teaser card: the game's logo with ??? on black, and "???" as the description. This is the exception to §4's recipe and to §2's description. |

### `stud-map` (1)

**8. Verify and hand over**, ajout (`G4-10`)

- **Inventory before hand-over: no object is left as stud Parts.** Walk the contract's prop list (§2)
  and the map itself: every building detail, machine, rack, tree and sign is a Blender stud prop
  (`stud-models`, `baked-stud-props`), not a block or a Part assembly standing in for it; Parts stay the
  §1 ground layers (ground, paths, pads, cliffs, walls). Every stall and shelf is dressed, and no world
  board covers a plot's name (Run a Dino Shop!, 2026-11-15: « Map pas finie et pas polie : les panneaux de
  livraison passent par-dessus le nom du shop du joueur, l'enclos à T-Rex est encore en studs bizarres,
  plusieurs échoppes et rayons manquent d'habillage. »; 2026-11-16: « la map est clairement pas fini de
  base plein de choses construites en studs sont ds placeholder »).

### `map-assembly` (1)

**3. Placing pieces**, ajout (`G4-12`)

- **A prop placed many times is built for its count** (trees, rocks, bushes across islands): the fewest
  parts and triangles per copy, one source model cloned, its detail in a shared texture or material
  rather than in geometry (`stud-models` §3 budgets), and its cost (parts, triangles, instances) stated
  per copy and for the whole map at hand-over (Chop Chop Island in build-tests, 2026-11-06, on its trees:
  « Les arbres doivent être retravaillés, surtout la texture. Il peut clairement utiliser des méthodes pour
  que l'arbre soit super opti et pas gourmand en ressources. »). Colours that vary per copy are set in game
  on one texture (`baked-stud-models` §7.6).

### `fps-weapon-blender` (1)

**8. Phase 7 — the lite variant (`delivery.py --lite`, `ship.sh --variant lite`)**, ajout (`G4-13`)

**New camos differ in kind, not in hue.** A new set adds camos unlike the existing ones (another pattern family, emissive, animated, a relief that reads 3D), and an animated camo is shown only once its motion is seen in game (two captures a moment apart, or a short clip) (MP5 Arena, 2026-11-03: « tu peux essayer de faires des camouflages plus beau / complexe et vraiment qui changent de ceux que l'on a deja ? », « y'a pas moyen d'en faire d'autre, genre des emisive, qui bougent, en 3d, etc etc... », then on the first animated one: « mais la le storm ne bouge pas ? »).

### `blender-image-to-3d` (1)

**Phase 6: articulation**, ajout (`G4-14`)

**A smooth character is one skinned mesh** (smooth, non-blocky styles only; stud and baked-stud characters stay rigid Motor6D parts, `stud-animations`): its limbs run on across the joints and every vertex is weighted to the skeleton, never one rigid piece per bone, whose joints show (build-tests, ToonPilot, 2026-11-17: « la on voie trop les parts » on the rigid 15-part version; rebuilt as one skinned MeshPart, the Open Cloud Model upload keeps the skin and the Bones).

### `roblox-thumbnail-variant` (1)

**7. Before handing a variant over**, ajout (`G5-8`)

- **A themed reskin comes in strengths.** When a set redoes the art for a
  season (a Halloween logo), include one that changes less, the original still
  recognisable, whose change still shows at tile size (Anime Aura Farming,
  2026-10-26: « ok elle sont tres cool essaie d'en faire une juste un peut
  moins full change stp », then « fait un truc qui se vois quand meme »).
- **Hand the round over in one folder of its own**, holding only its finals,
  and give its path, beside the sheet and the library filing (Throw a Weapon,
  2026-10-21: « ok range moi toutes les miniatures bien dans un dossier sto »;
  Anime Aura Farming, 2026-11-11: « met les mois dans un dossier stp »).

### `to-tasks` (1)

**2. The waves**, ajout (`G6-8`)

**Every placeholder has its swap task.** A code task that places a placeholder names it in its hand-off, and the plan holds one task, blocked on the models, that replaces every placeholder in every place with its real model, its anchors and tags included; a Part assembly standing in for a rack, a machine, a sign or a building's detail is a placeholder too (Run a Dino Shop!, 2026-11-16: « la map est clairement pas fini de base plein de choses construites en studs sont ds placeholder »; the plan had no swap task until one was added by hand on 2026-11-13, and it left the stud-Part stand-ins in place).

### `sandblock-game-boilerplate/CLAUDE.md` (1)

**Working with Romain**, ajout (`G6-11`)

- **A client quote lists what the player gets.** The screens and main menus by name under Interfaces and the features a player sees, in the client's words: no technical detail and no internal process line (milestones, acceptance tests); amounts in decreasing order; plain `-` lists and no em dash (→ `roblox-game-conventions`, Player-facing text); durations that assume our way of working, AI and tasks in parallel (Stop The Eruption, 2026-09-10: « ok mais la y'a trop de details techniques inutiles ! », « liste les menu principaux dans interfaces », « c'est quoi ca "rectte" je comprends rien », « met juste des - normales », « aussi essaie de mettres les montant en decroissant »; 2026-09-09: « comment ca 180 jours ! !!!! on fait tous avec l'ia + on parralelise les taches ! »).
