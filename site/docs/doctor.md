# virtum doctor

`virtum doctor` vérifie que l'hôte est prêt à lancer des VM. Lancez-le après l'installation, et dès qu'une commande échoue sans raison claire.

```console
$ virtum doctor
Virtum doctor

  [ok]   qemu-img
  [ok]   virsh
  [ok]   cloud-localds
  [ok]   ssh
  [ok]   socat
  [ok]   virtiofsd (/usr/libexec/virtiofsd)
  [ok]   AppArmor virtiofs (Virtum) — …
  [ok]   KVM (/dev/kvm)
  [ok]   Groupes libvirt et kvm
  [ok]   Réseau libvirt « default »
  [ok]   Réseau bridge (LAN physique) — …
  [ok]   Stockage Virtum (libvirt système) — Répertoire actif : /var/lib/virtum
  [ok]   Images de base des VM — …
  [ok]   Restes orphelins — …
  [ok]   ansible-playbook — …

Toutes les vérifications ont réussi (15/15).
```

Tous les contrôles doivent être `[ok]`. Une ligne en échec indique quoi corriger, par exemple le paquet à installer.

## Ce qui est vérifié

| Contrôle | Ce qu'il vérifie |
| :--- | :--- |
| `qemu-img`, `virsh`, `cloud-localds`, `ssh`, `socat` | Les outils sont installés (`qemu-utils`, `libvirt-clients`, `cloud-image-utils`, `openssh-client`, `socat`) ; `socat` sert aux `ports:` |
| `virtiofsd` | Présent, et capable d'imposer la lecture seule des partages |
| AppArmor virtiofs | AppArmor ne bloque pas les sockets virtiofsd sous `/var/lib/virtum` |
| KVM (`/dev/kvm`) | La virtualisation matérielle est disponible |
| Groupes libvirt et kvm | Votre compte en est membre |
| Réseau libvirt « default » | Le réseau NAT utilisé par `virtum run` |
| Réseau bridge (LAN physique) | L'interface recommandée pour le bridge ; avertit si c'est du Wi-Fi |
| Stockage Virtum | Le répertoire actif (`/var/lib/virtum` ou `~/.virtum`) |
| Images de base des VM | Les disques des VM retrouvent leur image de base |
| Restes orphelins | Domaines libvirt ou dossiers d'instance sans VM connue, avec les commandes pour les nettoyer |
| `ansible-playbook` | Sa version, ou qu'il est absent ; jamais bloquant, il ne sert qu'à la section `ansible:` |

Les paquets correspondants : [Installation](./installation). Les échecs courants : [Dépannage](./depannage).
