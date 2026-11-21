# Labs et Virtumfile

Un lab est un ensemble de machines décrit dans un fichier YAML, le `Virtumfile`. Chaque lab a son propre réseau libvirt isolé, `virtum-lab-<nom>` : les machines d'un lab se joignent entre elles.

```yaml
name: demo-lab

machines:
  web:
    os: debian-12
    ram: 2048
    cpu: 2
    disk_size: 20G
    ports:
      - "18098:80"         # 127.0.0.1:18098 de l'hôte → port 80 de la VM
    provision:
      - apt-get update
      - apt-get install -y nginx

  db:
    os: ubuntu-24.04
    ram: 1024
    cpu: 1
```

Tous les champs : [Champs du Virtumfile](./virtumfile).

## Le cycle de vie

| Commande | Rôle |
| :--- | :--- |
| `virtum plan` | Montre ce qui va être créé, relancé ou modifié, sans rien toucher |
| `virtum up` | Crée les machines absentes et relance celles qui sont arrêtées |
| `virtum apply` | Applique les changements du Virtumfile aux VM existantes |
| `virtum down` | Arrête le lab ; `--destroy` le supprime |

Chaque commande lit `./Virtumfile`, ou le fichier donné par `-f`.

## Lire un plan

`virtum plan` liste chaque machine avec l'action prévue :

| Symbole | Action |
| :--- | :--- |
| `+ create` | La machine sera créée |
| `~ resume` | La machine existe mais ne tourne pas : `up` la reprendra |
| `~ update` | Un champ a changé : `apply` mettra la VM à jour |
| `= unchanged` | Rien à faire |
| `- remove` | La machine n'est plus dans le Virtumfile : `apply --prune` la supprimera |

Le plan affiche aussi le réseau du lab, les avertissements, et les erreurs qui bloqueraient `virtum up` (par exemple un sous-réseau qui chevauche un réseau existant).

## Modifier un lab existant

`virtum apply` met à jour les VM existantes : RAM, CPU, `bind`, `ports`, `disk_size`, `mounts`, `ssh_port`, `restart`, `ip`.

Retirer une machine du Virtumfile ne la supprime pas : `plan` la signale, et `apply --prune` la supprime, avec son disque et ses instantanés (confirmation demandée, `-y` pour s'en passer dans un script).

## Création en parallèle

`virtum up` crée ou relance 4 machines à la fois par défaut. `--parallel 1` les traite l'une après l'autre.

## Arrêter et supprimer

```bash
virtum down                    # arrête toutes les VM du lab
virtum down --destroy          # supprime les VM et leurs données
virtum down --destroy --purge  # supprime aussi les dossiers créés pour les partages
```

## Démarrage avec l'hôte

`restart:` fixe le démarrage au boot de l'hôte, comme dans Docker Compose : `no`, `always` ou `unless-stopped`. Déclaré au niveau du lab, il vaut pour toutes les machines ; une machine peut le surcharger. Avec `unless-stopped`, une VM arrêtée par `virtum stop` n'est pas relancée au boot.
