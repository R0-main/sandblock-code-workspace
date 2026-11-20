# Revue du Conductor (2026-11-20)

Romain, 2026-11-20 : « les résultats des jeux créés (en terme de quality) par le
conductor sont clairement moins bien que au début, de plus c'est plus que super
lent », « le conductor pose trop de questions qui auraient pu être répondues par
le PM, et il se bloque souvent pour rien ».

Sources : la base du Conductor (`~/.sandblock-conductor/conductor.db`, 2 979 runs
sur 5 jeux), les journaux des runs, l'historique git du Conductor, du boilerplate
et des skills, et les messages de Romain dans les sessions Claude Code de Throw a
Weapon, Run a Dino Shop!, Totally Normal Obby, Punch to Escape, Avalanche Smash,
Anime Aura Farming, Stop The Eruption, MP5 Arena et build-tests. Le détail :

| Fichier | Contenu |
| --- | --- |
| [`dino-shop.md`](dino-shop.md) | Les 156 retours du board sur Run a Dino Shop!, classés par métier et par l'étape qui aurait dû les attraper |
| [`totally-normal-obby-throw-a-weapon.md`](totally-normal-obby-throw-a-weapon.md) | Les premiers jeux : ce qu'il a fallu polir à la main, ce qui revenait |
| [`taste-anime-aura-farming-stop-the-eruption.md`](taste-anime-aura-farming-stop-the-eruption.md) | Le Taste de Romain, 107 remarques absentes des skills |
| [`taste-mp5-arena-build-tests.md`](taste-mp5-arena-build-tests.md) | Le Taste de Romain, 65 remarques absentes des skills |
| [`skill-lines.md`](skill-lines.md) | Les 138 lignes vérifiées à ajouter aux skills, et les contradictions tranchées |

## Les premiers jeux n'étaient pas prêts non plus

Throw a Weapon a demandé environ 370 messages de polish à la main (14 au 27/10)
avant sa bêta ; Totally Normal Obby, environ 63 retours du board en 19 jours.
Ce qui a changé n'est pas surtout le premier rendu : c'est la vitesse des
corrections, la relecture visuelle, et les corrections qui en cassent d'autres.

## Pourquoi c'est lent

| | Totally Normal Obby (10/2026) | Run a Dino Shop! (11/2026) |
| --- | --- | --- |
| Un lot de corrections du board | F19 : 24 tâches en 4,9 h, 0,3 h par tâche | B15 : 17 tâches en 40,6 h, 11,5 h par tâche ; B17 47,9 h ; B18 27,6 h |
| Temps des playtests rejoués | 0 % | 22 % du travail, 32 % des revues, 26 % des intégrations |
| Contexte au 1er tour d'un run | 34 à 38 k tokens | 42 à 56 k tokens |

1. **Les scénarios de test sont rejoués trois fois par tâche** (le worker, le
   relecteur, le lead dev), et les agents passent des heures sur un test
   instable (un seuil de 0,6 raté de 0,02). La règle de Romain (11/11) était
   la suite complète avant chaque publication ; le rejeu à chaque étape a été
   ajouté par-dessus.
2. **Les créneaux Studio** : 12 runs pour 4 copies. Dans la nuit du 13/11,
   une trentaine de tâches ont attendu 30 min chacune puis sont parties au PM
   puis au board (corrigé le 15/11).
3. **Les pannes du PC** (WSL qui refuse les sessions, copies de worktree
   désactivées) : chaque tâche s'arrêtait et escaladait de son côté, et
   personne ne les relançait au retour.
4. **La boucle du Retry** : après une revue qui demandait des corrections,
   Retry relançait le relecteur au lieu du codeur (corrigé le 19/11, pas
   commité ni redémarré jusqu'à aujourd'hui).
5. **Les instructions ont doublé le 02/11** (règles 5,3 → 11,3 Ko, rôles
   59 → 95 Ko, skill `roblox-game-conventions` 29 → 59 Ko), juste avant
   Avalanche Smash et Dino Shop.

À la main, Romain a corrigé 11 points en 52 min le 19/11 et 12 en une heure le
20/11.

## Pourquoi il bloque et pose trop de questions

- Dino Shop : 57 relances à la main, 84 escalades du PM, 4 réponses du PM
  seul. Presque toutes les escalades étaient des créneaux Studio, des pannes du
  PC ou la boucle du Retry, que le PM ne pouvait pas régler.
- Sur les quatre jeux, 52 questions hors points de validation sont arrivées au
  board : il a pris l'option recommandée 33 fois. Le PM n'avait le droit de
  répondre que si un document tranchait déjà.

## Pourquoi la qualité a baissé

1. **La relecture visuelle ne regarde pas ce que voit le joueur.** L'Art
   director tournait sur Sonnet et relit tout ce qui se voit, construit par des
   agents Opus : 118 validations sur 131, dont 63 sur le seul rapport du
   worker. Les vignettes ont été validées 4 minutes avant que Romain ne les
   refasse (« des petits points verts »).
2. **Les lots de corrections se cassent entre eux** : 12 à 17 tâches en
   parallèle sur les mêmes systèmes ; 31 des 156 retours sont des choses
   cassées ou à moitié défaites par une correction précédente.
3. **33 tâches validées d'un coup sans Studio le 13/11** (créneaux pleins) :
   13 sont revenues en retours du board, dont presque tous les écrans.
4. **Le plan oubliait des choses** : aucune tâche ne remplaçait les Parts
   provisoires de la carte par les vrais modèles.
5. **Des règles existantes non suivies** (11 retours), noyées dans la masse des
   instructions.

## Ce qui a changé

### `sandblock-conductor` (redémarré le 20/11 à 16:57, aucun agent ne tournait)

| Commit | Quoi |
| --- | --- |
| `9a89008` | Les corrections du 19/11 : Retry repart chez le worker ; une erreur de l'API Claude n'est plus un échec de la tâche |
| `6d21160` | Studio en panne : le Conductor met les tâches Studio en attente avec une seule alerte, puis les relance seul au retour, sans PM ni board |
| `52c288a` | Le PM tranche les détails de jeu réversibles (« Décision du PM (le board peut la changer) ») ; le label `no-review` pour les corrections du board (pas d'étape de revue, le lead dev vérifie) ; l'historique d'un prompt limité à 24 notes |

### `sandblock-game-boilerplate` (le modèle d'équipe de chaque nouveau jeu)

| Commit | Quoi |
| --- | --- |
| `d6eb197` | Art director sur Opus ; relectures sur captures prises soi-même depuis la caméra du joueur ; scénarios joués une fois par le worker et une fois par le lead dev, jamais par le relecteur ; 20 min max sur un test ; lots de corrections groupés par écran ou système, avec les mots du board ; chaque placeholder a sa tâche ; le PM tranche ; les réglages de Dino Shop (12 runs, créneaux, 2 lead devs) |
| `adf1b02` | « The board's eye » : les 12 points de ton Taste, en tes mots, en tête des rôles Art director et Reviewer |

### Revenir en arrière

Chaque changement s'annule seul, et un tag marque l'état d'avant :

```bash
git -C ~/sandblock/sandblock-code-workspace/sandblock-conductor revert 52c288a
```

```bash
git -C ~/sandblock/sandblock-code-workspace/sandblock-game-boilerplate revert adf1b02
```

Tout d'un coup : `git reset --hard before-2026-11-20-quality-pass` dans l'un ou
l'autre dépôt, puis `systemctl --user restart sandblock-conductor` pour le
Conductor.

## Ce qui reste

- **`dino-shop/conductor/` n'est pas mis à jour** : son dépôt est sur
  `b20-romain-playtest` avec du travail à la main en cours. Les jeux existants
  gardent leur `conductor/` ; il faut y recopier celui du boilerplate (sans
  les `tasks*.yaml`) avant de leur redonner des tâches.
- **Les skills ne sont pas modifiés** : les fichiers de Taste listent environ
  170 remarques à y ajouter, sur l'accord de Romain. Quatre contradictions à
  trancher : premier achat à 9 R$ (le skill dit 49 à 99), sons repris
  d'animes (le skill l'interdit, et AAF a eu des plaintes de droits d'auteur),
  dégradé de plusieurs teintes dans un titre (le skill dit une seule),
  récompense contre un like (contraire au skill, et risqué face aux règles de Roblox).
- **Pas encore vérifié sur un vrai jeu** : la pause Studio, le PM qui tranche
  et `no-review` sont testés (85 tests), mais n'ont pas encore tourné sur une
  vraie partie.
- Une capture noire parce que Studio est réduit ou la session verrouillée
  n'est pas détectée par le Conductor.
