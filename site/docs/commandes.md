# Commandes

`virtum <commande> --help` détaille chaque option. Les commandes de lab lisent `./Virtumfile`, ou le fichier donné par `-f, --file`.

| Commande | Rôle |
| :--- | :--- |
| [`doctor`](#doctor) | Vérifie que l'hôte est prêt (KVM, libvirt, groupes, stockage, outils) |
| [`run`](#run), [`ps`](#ps), [`shell`](#shell), [`stop`](#stop), [`start`](#start), [`destroy`](#destroy) | Cycle de vie d'une VM |
| [`pull`](#pull) | Télécharge une image d'OS en cache |
| [`plan`](#plan), [`up`](#up), [`apply`](#apply), [`down`](#down) | Cycle de vie d'un lab décrit par un Virtumfile |
| [`snapshot`](#snapshot) `create\|restore\|ls\|rm` | Instantanés d'une VM ou d'un lab entier |
| [`inventory`](#inventory), [`provision`](#provision) | Inventaire et playbook Ansible du lab |
| [`open`](#open-close), [`close`](#open-close) | Pare-feu de l'hôte (ufw) pour les ports exposés au réseau local |

## VM seules

### doctor

Vérifie que l'hôte est prêt à lancer des VM. Voir [virtum doctor](./doctor).

### run

Lance une VM sans écran.

| Option | Rôle |
| :--- | :--- |
| `--os <OS>` | Image : `debian-12` (défaut), `ubuntu-24.04`, `ubuntu-26.04` |
| `--name <NAME>` | Nom court pour les autres commandes (`virtum shell db`) ; unique |
| `--ram <RAM>` | Mémoire en mégaoctets (défaut 2048) |
| `--cpu <CPU>` | Processeurs virtuels (défaut 2) |
| `--disk-size <SIZE>` | Taille du disque racine (`10G`, `20G`…) ; agrandi au premier démarrage par cloud-init |
| `--user <USER>` | Utilisateur par défaut, créé par cloud-init (défaut `virtum`) |
| `--hostname <HOSTNAME>` | Nom d'hôte de l'invité ; par défaut `--name`, sinon l'identifiant `vm-…` |
| `--network <NETWORK>` | `default` (NAT libvirt, `192.168.122.x`) ou `bridge` (réseau local, macvtap) |
| `--bridge-interface <IF>` | Interface hôte pour `--network bridge` (sinon celle de la route par défaut) |
| `--insecure-ssh` | Désactive la vérification de la clé SSH de la VM |

### ps

Liste les VM en cours (alias : `list`). `-a, --all` affiche aussi les VM arrêtées.

### shell

`virtum shell <VM>` ouvre une session SSH sur une VM en cours, désignée par son nom ou son identifiant `vm-…`. Option : `--insecure-ssh`.

### stop

`virtum stop <VM>...` arrête une ou plusieurs VM : arrêt propre, puis forcé après 30 secondes.

### start

`virtum start <VM>...` relance une ou plusieurs VM arrêtées : mêmes instances, sans nouveau provisionnement.

### destroy

`virtum destroy <VM>...` supprime une ou plusieurs VM et leurs données locales. `--purge` supprime aussi les dossiers `mounts:` de l'hôte.

### pull

`virtum pull <OS>` télécharge et met en cache une image cloud, sans lancer de VM.

## Labs

### plan

Montre ce que ferait `up` (création, reprise, mises à jour, avertissements), sans rien modifier. Voir [Lire un plan](./labs#lire-un-plan).

### up

Déploie toutes les machines du Virtumfile.

| Option | Rôle |
| :--- | :--- |
| `-f, --file <FILE>` | Chemin du Virtumfile |
| `--parallel <N>` | Machines créées ou reprises en même temps (défaut 4 ; 1 = l'une après l'autre) |
| `--yes-lan` | Confirme `bind: lan` sans invite (scripts, CI) |
| `--insecure-ssh` | Désactive la vérification des clés SSH |

### apply

Applique les changements du Virtumfile aux VM existantes du lab : RAM, CPU, `bind`, `ports`, `disk_size`, `mounts`, `ssh_port`, `restart`, `ip`.

| Option | Rôle |
| :--- | :--- |
| `-f, --file <FILE>` | Chemin du Virtumfile |
| `--prune` | Supprime aussi les machines du lab absentes du Virtumfile (VM, disque, instantanés) |
| `-y, --yes` | Avec `--prune` : pas de confirmation (scripts, CI) |
| `--yes-lan` | Confirme l'exposition `bind: lan` sans invite |
| `--insecure-ssh` | Désactive la vérification des clés SSH |

### down

Arrête toutes les VM du lab. `--destroy` les supprime avec leurs données ; avec `--destroy`, `--purge` supprime aussi les dossiers déclarés dans `mounts:`.

## Instantanés

### snapshot

| Commande | Rôle |
| :--- | :--- |
| `snapshot create <NOM> [VM]...` | Prend un instantané (les VM en cours sont arrêtées, puis relancées) |
| `snapshot restore <NOM> [VM]...` | Ramène les VM à l'instantané |
| `snapshot ls [VM]...` | Liste les instantanés |
| `snapshot rm <NOM> [VM]...` | Supprime un instantané |

Sans VM, la commande porte sur tout le lab. Options : `-f, --file`, et `--no-restart` (sauf `ls`) pour laisser les VM arrêtées. Voir [Instantanés](./instantanes).

## Ansible

### inventory

Affiche un inventaire Ansible des machines du lab en cours d'exécution.

| Option | Rôle |
| :--- | :--- |
| `--format <ini\|yaml>` | Format (défaut `ini`) |
| `-o, --output <FILE>` | Écrit dans un fichier au lieu de la sortie standard |
| `--insecure-ssh` | Inventaire sans vérification des clés SSH |

### provision

Rejoue le playbook de la section `ansible:`. Les arguments après `--` sont passés à `ansible-playbook` : `virtum provision -- --tags init --limit web`.

## Pare-feu

### open, close {#open-close}

`virtum open` ouvre le pare-feu de l'hôte (ufw) pour les ports `bind: lan` du Virtumfile ; `virtum close` retire les règles ajoutées par `open`. Voir [Ports et accès LAN](./ports).
