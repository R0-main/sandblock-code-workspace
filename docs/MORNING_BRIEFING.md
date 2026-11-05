# Briefing du matin

Proposition du 2026-11-04, discutée avec Claude.

**Monté le 2026-11-05** dans `~/sandblock/morning-briefing` (voir son README) :
- DM Discord à 8h00, par un timer systemd `--user` ;
- réveil par `sandblock-pi` à 7h50 ;
- un premier briefing réel envoyé le 2026-11-05 à 11h24, pour 0,31 $.

Ajouté le 2026-11-05 au soir :
- l'agenda : les événements Google Calendar du jour (le connecteur est maintenant autorisé) et les jalons de l'Agenda du dashboard sur 7 jours, par un nouvel outil MCP `agenda` du dashboard (branche `mcp-agenda`, pas encore déployée) ;
- seuls les messages qui répondent (« Répondre ») à un message du briefing comptent comme retours, car le DM sert aussi à l'assistant du bot (SB-044).

Reste à faire un test complet avec le PC éteint.

## Objectif

Un agent qui, chaque matin vers 8h, envoie un briefing en trois parties :

1. **Les news Roblox** : nouveautés du moteur, nouvelles features, nouvelles API.
2. **Le tri des mails** : uniquement ceux qui méritent de l'attention.
3. **Les tâches du jour.**

## Architecture

### Où ça tourne

Un **timer systemd `--user` dans WSL** sur « PC Travail », qui lance `claude -p` avec le prompt du briefing.

- Le PC tourne déjà en permanence : Remote Control, keepalive WSL, linger systemd.
- En local, l'agent a accès à tout : Gmail (connecteur claude.ai), Todoist, le dashboard Sandblock, Notion, le Conductor, le bot Discord et les fichiers.
- Une routine cloud (`/schedule`) marcherait aussi, mais elle ne pourrait joindre ni le Conductor ni rien de ce qui tourne sur le PC. Elle est donc écartée.
- Coût : une session Sonnet par jour, quelques centimes. Les news passent par des endpoints JSON, sans recherche web chère.

### Les trois parties

**1. News Roblox (dernières 24 h)**

On lit des sources fixes plutôt que de faire une recherche web vague :

- DevForum, *Announcements* : `https://devforum.roblox.com/c/updates/announcements.json`
- DevForum, *Release Notes* (même format `.json`)
- Blog Roblox et release notes du Creator Hub

L'agent résume chaque nouveauté et dit ce qu'elle change concrètement pour les jeux en cours (« nouvelle API X → utile pour Stop the Eruption »).

**2. Tri des mails**

- Il lit les mails non lus depuis la veille.
- **Il garde :** clients, candidats, Roblox (DevEx, modération, Creator Hub), factures, collègues Sandblock.
- **Il ignore :** newsletters, notifications automatiques, promos.
- Pour chaque mail gardé : une ligne de résumé, l'action attendue et le lien.
- En option, il pose un label Gmail `À traiter`.
- Boîte connectée à Claude : justromain.pro@gmail.com. Reste à vérifier que les mails de romain@sandblockstudios.fr y arrivent aussi.

**3. Tâches du jour**

| Source | Ce qu'on y lit |
|---|---|
| Todoist, projet **DAILY**, sections TODAY / TOMOROW | les tâches du jour |
| Dashboard Sandblock (romain@sandblockstudios.com) | les projets clients (Train Your Aura x BeOnePourcent, Stop the Erruption - Litsu, Recrutement) et l'agenda |
| Conductor | l'état des jeux qui tournent (en option) |

### Où arrive le briefing

Proposition : un **DM Discord** envoyé par le bot Sandblock existant, avec une page artifact privée pour le détail si le message est long. Le canal n'est pas encore confirmé.

## Faut-il un « second cerveau » ?

**Non pour la v1.** Un bon briefing dépend du contexte, et ce contexte tient dans trois éléments simples :

1. **Un fichier de profil** (`briefing/profil.md`, une page)
   - les jeux actifs et le moteur Roblox qu'ils utilisent ;
   - les contacts importants (clients comme Uzz, Litsu ou BeOnePourcent, Timothé, Adam, les candidats) ;
   - ce qu'il faut ignorer.

   C'est ce qui permet de relier une news à un jeu précis au lieu de faire une liste générique.
2. **Un fichier d'état** : les news déjà signalées et les mails déjà remontés, pour ne pas répéter la même chose deux matins de suite.
3. **Une boucle de retour** : on répond (« Répondre ») à un message du briefing (« ce mail n'était pas important », « plus de news sur X ») et l'agent met le profil à jour lui-même.

Le « second cerveau » existe déjà, réparti entre les outils : Gmail, Todoist, le dashboard Sandblock, Notion (les GDD), le Conductor et la mémoire de Claude.

**Un vrai second cerveau deviendra utile** si on veut poser des questions comme « on en est où avec Litsu ? » ou « qu'est-ce qu'on a décidé sur l'économie de Stop the Eruption ? ». Ce sera un projet séparé, que le briefing pourra alimenter petit à petit, par exemple avec un journal quotidien en markdown.

### Point à vérifier : un connecteur qui n'est pas à nous

Un connecteur de type « company brain » (`search_brain`, `remember`, zones…) est connecté sous le compte **« Claire Martin — CEO (Encore) »**, une entreprise de téléphones reconditionnés. Ce ne sont pas les données de Sandblock, c'est probablement une démo ou un compte de test. Il ne doit pas servir au briefing. S'il n'est pas reconnu, le déconnecter dans les réglages des connecteurs de claude.ai.

## Réveil du PC à 8h par le Raspberry Pi

### La chaîne

1. **7h50, sur `sandblock-pi`** : une ligne cron envoie le paquet Wake-on-LAN au PC (MAC `2C:F0:5D:A4:7F:8E`). Le Pi est sur le même réseau local (192.168.10.x), donc pas besoin de relais.
2. **Le PC démarre** : la tâche Windows « WSL keepalive (Claude Remote Control) » lance WSL au démarrage, sans qu'on se connecte. Ça a déjà été vérifié après un redémarrage.
3. **8h00, dans WSL** : le timer systemd (`OnCalendar=*-*-* 08:00`, `Persistent=true`) lance le briefing. Si le PC démarre en retard, le briefing part dès le démarrage au lieu d'être sauté.
4. **Le briefing arrive** sur Discord.

Si le PC est resté allumé la nuit (pas de veille sur secteur), le réveil ne sert à rien mais ne gêne pas.

### État vérifié le 2026-11-04

- **Démarrage rapide Windows désactivé** (`HiberbootEnabled = 0`). C'est indispensable : avec ce réglage activé, le PC sort d'une hibernation au lieu de démarrer vraiment, et la tâche keepalive ne se lance pas (incident du 2026-11-02).
- **Le Pi est joignable sur le tailnet** (`sandblock-pi`, 100.125.47.2). Tailscale SSH refuse l'utilisateur « romain », mais **`ssh sandblock@sandblock-pi` fonctionne** (vérifié le 2026-11-05).
  - Pi en aarch64, `eth0` en 192.168.10.109/24 : même réseau local que le PC.
  - `wakeonlan` est déjà installé (`/usr/bin/wakeonlan`).
  - Pas de sudo sans mot de passe, mais ce n'est pas nécessaire : la ligne cron va dans la crontab de l'utilisateur `sandblock`.
  - Cette crontab contient déjà le collecteur Power BI (`*/20 * * * *`, `partner-earnings/bin/powerbi_bot.py`). La ligne Wake-on-LAN doit être ajoutée à la suite, sans remplacer ce qui existe.

### Protection

À chaque briefing, le script relit `HiberbootEnabled`. Si une mise à jour Windows l'a réactivé, le briefing le signale, avant que le réveil du lendemain ne rate.

### Plan B sans le Pi

La carte mère MSI a probablement un réveil par horloge dans le BIOS (« Resume by RTC Alarm »), qui allume le PC à heure fixe sans aucun matériel. Il faut entrer dans le BIOS et ce n'est pas réglable à distance, donc le Pi reste la meilleure option.

## Ce qu'il reste à décider

- [x] **Canal du briefing** : DM Discord.
- [x] **Heure** : 8h.
- [ ] **Boîte mail** : les mails de romain@sandblockstudios.fr arrivent-ils dans justromain.pro@gmail.com ?
- [x] **Accès au Pi** : `ssh sandblock@sandblock-pi`.
- [x] **Accord de Timothé** pour ajouter une ligne cron sur son Pi : ligne ajoutée le 2026-11-05.

## Étapes de mise en place

1. Écrire `briefing/profil.md`, pré-rempli depuis Todoist, le dashboard et les mémoires de Claude, puis le faire relire.
2. Écrire le prompt du briefing, le script de lancement et le fichier d'état.
3. Envoyer sur Discord via le bot existant.
4. Créer le timer systemd `--user` (8h00, `Persistent=true`).
5. Ajouter la ligne cron Wake-on-LAN sur le Pi.
6. Faire un briefing à blanc, puis un test complet : PC éteint → réveil par le Pi → briefing reçu.
7. Mettre en place la boucle de retour : répondre au briefing met à jour le profil.
