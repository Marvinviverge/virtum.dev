# Champs du Virtumfile

Le Virtumfile est un fichier YAML. Exemple commenté : [`examples/Virtumfile`](https://github.com/Marvinviverge/virtum/blob/develop/examples/Virtumfile).

## Lab

| Champ | Rôle |
| :--- | :--- |
| `name` | Nom du lab (obligatoire) ; réseau `virtum-lab-<name>` |
| `machines` | Les machines, par nom (obligatoire) |
| `subnet` | Sous-réseau du lab, `a.b.c.0/24` ; sinon calculé depuis le nom. Voir [Réseau](./reseau) |
| `network` | `lab` (défaut) ou `bridge`, pour toutes les machines |
| `bridge_interface` | Interface hôte pour le bridge |
| `bind` | `local` (défaut, `127.0.0.1`) ou `lan` pour les `ports:`. Voir [Ports](./ports) |
| `mounts` | Dossiers partagés hérités par toutes les machines. Voir [Dossiers partagés](./partages) |
| `ssh_port` | Port SSH des machines si elles le déplacent (repli sur 22) |
| `restart` | `no`, `always` ou `unless-stopped` : démarrage au boot de l'hôte |
| `ansible` | Section Ansible, ci-dessous |

## Machine

| Champ | Rôle |
| :--- | :--- |
| `os` | Image : `debian-12`, `ubuntu-24.04`, `ubuntu-26.04` (obligatoire) |
| `ram` | Mémoire en Mo (défaut 2048) |
| `cpu` | Processeurs virtuels (défaut 2) |
| `disk_size` | Taille du disque (`20G`) |
| `ports` | Redirections `"<port hôte>:<port VM>"` |
| `bind` | `local` ou `lan`, surcharge celui du lab |
| `provision` | Commandes shell jouées au premier démarrage |
| `mounts` | Dossiers partagés : `<hôte>:<invité>`, suffixe `:rw` pour l'écriture |
| `network` | `lab` ou `bridge`, surcharge celui du lab |
| `bridge_interface` | Interface hôte pour le bridge |
| `ip` | Adresse fixe sur le réseau du lab |
| `ssh_port` | Port SSH, surcharge celui du lab |
| `restart` | Surcharge celui du lab |
| `groups` | Groupes de l'inventaire Ansible |

`apply` met à jour sur les VM existantes : `ram`, `cpu`, `bind`, `ports`, `disk_size`, `mounts`, `ssh_port`, `restart`, `ip`.

## Section `ansible`

| Champ | Rôle |
| :--- | :--- |
| `playbook` | Playbook, relatif au dossier du Virtumfile (obligatoire) |
| `requirements` | Collections et rôles à installer avec `ansible-galaxy` |
| `snapshot` | Instantané pris après le premier provisionnement : un nom, `true` (défaut, `provisioned`) ou `false` |

## Validation

Le Virtumfile est validé avant usage : noms (lab, machines, groupes, instantanés), chemins hôte relatifs et sous le Virtumfile, chemins invité sous `/home/virtum`, partages non imbriqués.

::: warning Un Virtumfile est du code
Lancer le Virtumfile ou le playbook d'un inconnu revient à exécuter son code sur votre machine.
:::
