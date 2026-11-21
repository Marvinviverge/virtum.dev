# Dépannage

Commencez toujours par `virtum doctor` : chaque contrôle en échec indique quoi corriger. Voir [virtum doctor](./doctor).

## `virtum doctor` signale KVM en échec

Virtum n'a pas accès en lecture et écriture à `/dev/kvm`. Vérifiez que la virtualisation KVM est activée dans le BIOS/UEFI, et que votre compte est dans le groupe `kvm` (voir ci-dessous), puis relancez `virtum doctor`.

## Groupes libvirt et kvm en échec

Votre compte doit être membre des groupes `libvirt` et `kvm` :

```bash
sudo usermod -aG libvirt,kvm $USER
```

L'ajout ne prend effet qu'à la session suivante : déconnectez-vous puis reconnectez-vous.

## Un outil est introuvable

`doctor` indique le paquet à installer pour chaque outil manquant (`qemu-utils`, `libvirt-clients`, `cloud-image-utils`, `openssh-client`, `socat`, `virtiofsd`). Avec l'archive, `sudo ./scripts/setup-host.sh` les installe sur Debian et Ubuntu.

## `virtum` : commande introuvable

Avec l'archive, le binaire est installé dans `~/.local/bin`, qui doit être dans votre `PATH`. Depuis les sources, `make install` l'installe dans `~/.cargo/bin`.

## Les dossiers partagés ne fonctionnent pas

- Sur Ubuntu 22.04 et Debian 12, `virtiofsd` n'existe pas en paquet séparé : les dossiers partagés n'y sont pas pris en charge.
- Si `doctor` signale « AppArmor virtiofs », AppArmor bloque les sockets virtiofsd sous `/var/lib/virtum` ; la ligne en échec indique la correction.
- Un partage `rw` ne peut contenir ni le Virtumfile ni les fichiers Ansible, et les partages ne s'imbriquent pas : `virtum plan` signale ces erreurs.

## `plan` ou `up` refuse le sous-réseau

Le sous-réseau du lab chevauche un réseau existant. Choisissez un autre `subnet:` dans le Virtumfile, ou changez le nom du lab si le sous-réseau est calculé. Voir [Réseau et bridge](./reseau).

## Le bridge ne marche pas

Le Wi-Fi est souvent incompatible avec le bridge : préférez une interface Ethernet, désignée par `--bridge-interface` ou `bridge_interface:`. `virtum doctor` affiche l'interface recommandée et avertit si c'est du Wi-Fi.

## Un port n'est pas joignable depuis une autre machine

Par défaut, les `ports:` n'écoutent que sur `127.0.0.1`. Pour le réseau local, déclarez `bind: lan`, puis `virtum open` si l'hôte utilise ufw. Voir [Ports et accès LAN](./ports).

## Restes de VM après un échec

`virtum doctor` liste, sous « Restes orphelins », les domaines libvirt et dossiers d'instance sans VM connue, avec les commandes pour les nettoyer. Vérifiez avant de supprimer.

## Une machine retirée du Virtumfile existe toujours

C'est voulu : `plan` la signale, `virtum apply --prune` la supprime.

## Signaler un bug

Ouvrez un ticket sur le [dépôt GitHub](https://github.com/Marvinviverge/virtum/issues) avec la version (`virtum --version`) et la sortie de `virtum doctor`. Pour une faille de sécurité, écrivez plutôt à **security@virtum.dev** (voir [Sécurité](./securite#signaler-une-faille)).
