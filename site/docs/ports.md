# Ports et accès LAN

`ports:` redirige un port de l'hôte vers un port de la VM.

```yaml
machines:
  web:
    os: debian-12
    ports:
      - "18080:80"          # http://127.0.0.1:18080 → port 80 de la VM
```

Le format est `"<port hôte>:<port de la VM>"`. La redirection passe par `socat`.

## Local par défaut

Les ports n'écoutent que sur `127.0.0.1` : seul l'hôte y accède.

## Exposer au réseau local

Avec `bind: lan`, les ports écoutent sur le réseau local (`0.0.0.0`). `bind:` se déclare pour tout le lab ou pour une machine.

```yaml
name: demo
bind: lan

machines:
  web:
    os: debian-12
    ports:
      - "18080:80"
```

`virtum up` et `virtum apply` demandent confirmation avant d'exposer un port sur le réseau local. Dans un script ou une CI, `--yes-lan` confirme sans invite.

## Pare-feu de l'hôte

Si l'hôte utilise ufw, ouvrez les ports exposés :

```bash
virtum open                 # ouvre ufw pour les ports bind: lan du Virtumfile
virtum close                # retire les règles ajoutées par virtum open
```

`open` et `close` acceptent `-f` pour désigner un autre Virtumfile.
