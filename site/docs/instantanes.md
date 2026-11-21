# Instantanés

Un instantané fige le disque d'une VM ou de tout un lab, pour y revenir plus tard.

```bash
virtum snapshot create avant-test      # tout le lab
virtum snapshot create avant-test web db  # seulement web et db
virtum snapshot restore avant-test
virtum snapshot ls
virtum snapshot rm avant-test
```

Sans nom de VM, la commande porte sur tout le lab décrit par `./Virtumfile` (ou `-f`). Un nom d'instantané contient des lettres, des chiffres, `-` et `_`.

## Instantanés à froid

Les instantanés sont pris à froid : les VM en cours sont arrêtées le temps de l'opération, puis relancées. `--no-restart` les laisse arrêtées.

## Avec Ansible

Après le premier provisionnement, `virtum up` prend l'instantané de lab `provisioned` : `virtum snapshot restore provisioned` ramène le lab à l'état provisionné. Voir [Ansible](./ansible).

## Machines retirées

`virtum apply --prune` supprime une machine retirée du Virtumfile avec ses instantanés ; `virtum plan` indique combien seraient perdus.
