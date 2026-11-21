# Ports and LAN access

`ports:` forwards a host port to a port of the VM.

```yaml
machines:
  web:
    os: debian-12
    ports:
      - "18080:80"          # http://127.0.0.1:18080 → port 80 of the VM
```

The format is `"<host port>:<VM port>"`. Forwarding goes through `socat`.

## Local by default

Ports only listen on `127.0.0.1`: only the host can reach them.

## Exposing to the local network

With `bind: lan`, ports listen on the local network (`0.0.0.0`). `bind:` is declared for the whole lab or for one machine.

```yaml
name: demo
bind: lan

machines:
  web:
    os: debian-12
    ports:
      - "18080:80"
```

`virtum up` and `virtum apply` ask for confirmation before exposing a port on the local network. In a script or CI, `--yes-lan` confirms without a prompt.

## Host firewall

If the host uses ufw, open the exposed ports:

```bash
virtum open                 # opens ufw for the Virtumfile's bind: lan ports
virtum close                # removes the rules added by virtum open
```

`open` and `close` take `-f` to point to another Virtumfile.
