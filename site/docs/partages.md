# Dossiers partagés

Un dossier de l'hôte peut être partagé avec une VM, par virtiofs.

```yaml
machines:
  web:
    os: debian-12
    mounts:
      - ./src:~/src             # lecture seule (par défaut)
      - ./out:~/out:rw          # la VM peut écrire
```

Le format est `<dossier hôte>:<dossier dans la VM>`, suivi de `:rw` pour autoriser l'écriture. `mounts:` se déclare pour une machine ou pour tout le lab (hérité par toutes les machines).

::: warning Systèmes pris en charge
Les dossiers partagés demandent `virtiofsd` et `bubblewrap`. Sur Ubuntu 22.04 et Debian 12, `virtiofsd` n'existe pas en paquet séparé : les dossiers partagés n'y sont pas pris en charge.
:::

## Règles

- **Lecture seule par défaut**, imposée côté hôte (`virtiofsd --readonly`, ou virtiofsd sous bubblewrap avec le dossier monté en lecture seule).
- Le dossier hôte est relatif au Virtumfile et doit se trouver sous lui ; le dossier invité doit se trouver sous `/home/virtum`.
- Un partage `rw` ne peut contenir ni le Virtumfile, ni le playbook Ansible, ni son fichier `requirements`.
- Les partages ne s'imbriquent pas, y compris entre labs.

## Supprimer les dossiers

```bash
virtum down --destroy --purge     # supprime aussi les dossiers créés pour les partages
virtum destroy web --purge        # pour une VM seule
```

::: warning Partage en écriture
La VM peut écrire n'importe quoi dans un partage `rw`. N'exécutez pas sur l'hôte ce qu'elle y dépose, et n'y placez pas un dossier que l'hôte lit (dépôt Git avec hooks, configuration d'un outil…). Voir [Sécurité](./securite#limites).
:::
