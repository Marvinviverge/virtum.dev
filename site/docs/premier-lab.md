# Premier lab

Un `Virtumfile` décrit plusieurs machines sur un réseau isolé. Créez ce fichier dans un dossier vide :

```yaml
name: demo-lab

machines:
  web:
    os: debian-12
    ram: 2048
    cpu: 2
    ports:
      - "18080:80"          # http://127.0.0.1:18080 → port 80 de la VM
    provision:
      - apt-get update
      - apt-get install -y nginx

  db:
    os: ubuntu-24.04
    ram: 1024
```

## Prévoir, créer, utiliser

```bash
virtum plan                    # ce qui va être créé ou modifié, sans rien toucher
virtum up                      # crée ou relance le lab
virtum shell web
virtum down                    # arrête le lab ; --destroy pour le supprimer
```

`virtum up` crée les machines en parallèle (4 à la fois par défaut, `--parallel` pour changer). Les commandes de `provision:` sont jouées au premier démarrage.

Par défaut, les commandes de lab lisent `./Virtumfile` ; `-f` en désigne un autre :

```bash
virtum plan -f examples/Virtumfile
```

## Supprimer le lab

```bash
virtum down --destroy          # supprime les VM et leurs données
virtum down --destroy --purge  # supprime aussi les dossiers créés pour les partages
```

Exemple complet, avec les champs optionnels commentés : [`examples/Virtumfile`](https://github.com/Marvinviverge/virtum/blob/develop/examples/Virtumfile). Pour aller plus loin : [Labs et Virtumfile](./labs).
