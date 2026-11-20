# Réseau et bridge

## Le réseau du lab

Chaque lab a son **réseau libvirt isolé**, `virtum-lab-<nom>`. Les machines d'un lab se joignent entre elles ; elles ne voient pas les machines d'un autre lab.

```yaml
name: exercice
subnet: 10.42.0.0/24           # sous-réseau du lab

machines:
  cible:
    os: debian-12
    ip: 10.42.0.10             # adresse fixe
  attaquant:
    os: ubuntu-24.04
    ip: 10.42.0.20
```

- `subnet:` fixe le sous-réseau du lab (`a.b.c.0/24`) ; sans lui, il est calculé depuis le nom du lab. `plan` et `up` refusent un sous-réseau qui chevauche un réseau existant.
- `ip:` donne une adresse fixe à une machine (réservation DHCP sur le réseau du lab) ; sans lui, l'adresse est attribuée par DHCP.

## Une VM seule

`virtum run` place la VM sur le réseau libvirt `default` (NAT, `192.168.122.x`). `virtum ps` affiche son adresse.

## Bridge : la VM sur le réseau local

En bridge (macvtap), la VM est directement sur le réseau local, avec sa propre adresse, comme une machine physique.

```bash
virtum run --os debian-12 --name web --network bridge
virtum run --network bridge --bridge-interface enp2s0   # choisir l'interface hôte
```

Dans un Virtumfile, `network: bridge` vaut pour tout le lab, ou pour une seule machine :

```yaml
name: hybride
machines:
  passerelle:
    os: debian-12
    network: bridge            # sur le réseau local
  interne:
    os: debian-12              # réseau privé du lab
```

Un lab peut mêler machines en bridge et machines privées. `bridge_interface:` choisit l'interface hôte ; sinon, Virtum prend celle de la route par défaut, que `virtum doctor` affiche.

::: warning Ethernet recommandé
Le Wi-Fi est souvent incompatible avec le bridge. `virtum doctor` signale quand l'interface recommandée est du Wi-Fi.
:::

::: warning Sécurité
Une VM en bridge est joignable par toutes les machines du réseau local. Virtum n'y filtre rien : le pare-feu et les services de la VM sont à la charge de l'invité. Quand la VM n'a pas à être vue du réseau local, préférez le réseau du lab avec des [ports locaux](./ports). Voir [Sécurité](./securite#limites).
:::
