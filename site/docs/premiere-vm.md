# Première VM

Une commande suffit pour lancer une VM :

```bash
virtum run --os debian-12 --name web
```

La première utilisation d'un OS télécharge son image cloud officielle ; les suivantes repartent du cache. Pour télécharger une image à l'avance :

```bash
virtum pull ubuntu-24.04
```

Images disponibles : `debian-12` (par défaut), `ubuntu-24.04`, `ubuntu-26.04`.

## Choisir les ressources

```bash
virtum run --os ubuntu-24.04 --ram 4096 --cpu 2 --disk-size 20G
```

| Option | Rôle | Défaut |
| :--- | :--- | :--- |
| `--os` | Image d'OS | `debian-12` |
| `--name` | Nom court, unique, utilisé par les autres commandes | — |
| `--ram` | Mémoire en mégaoctets | `2048` |
| `--cpu` | Nombre de processeurs virtuels | `2` |
| `--disk-size` | Taille du disque (`10G`, `20G`…) | taille de l'image |
| `--user` | Utilisateur par défaut (cloud-init) | `virtum` |
| `--hostname` | Nom d'hôte de l'invité | `--name`, sinon l'identifiant `vm-…` |
| `--network` | `default` (NAT libvirt) ou `bridge` (réseau local) | `default` |

Les disques sont en copie sur écriture au-dessus de l'image de base. Toutes les options : [Commandes](./commandes#run).

## Utiliser la VM

```bash
virtum ps                     # VM en cours et leur IP ; -a pour toutes
virtum shell web              # session SSH
virtum stop web               # arrêt propre, forcé après 30 s
virtum start web              # relance la même instance
virtum destroy web            # supprime la VM et ses données locales
```

Les commandes acceptent le nom (`--name`) ou l'identifiant `vm-…` de la VM. `stop`, `start` et `destroy` en acceptent plusieurs.

## Ensuite

Pour plusieurs machines sur un réseau isolé, décrivez-les dans un Virtumfile : [Premier lab](./premier-lab).
