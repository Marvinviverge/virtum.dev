# First lab

A `Virtumfile` describes several machines on an isolated network. Create this file in an empty folder:

```yaml
name: demo-lab

machines:
  web:
    os: debian-12
    ram: 2048
    cpu: 2
    ports:
      - "18080:80"          # http://127.0.0.1:18080 → port 80 of the VM
    provision:
      - apt-get update
      - apt-get install -y nginx

  db:
    os: ubuntu-24.04
    ram: 1024
```

## Preview, create, use

```bash
virtum plan                    # what will be created or changed, without touching anything
virtum up                      # creates or restarts the lab
virtum shell web
virtum down                    # stops the lab; --destroy to delete it
```

`virtum up` creates machines in parallel (4 at a time by default, `--parallel` to change it). The `provision:` commands run at first boot.

Lab commands read `./Virtumfile` by default; `-f` points to another one:

```bash
virtum plan -f examples/Virtumfile
```

## Delete the lab

```bash
virtum down --destroy          # deletes the VMs and their data
virtum down --destroy --purge  # also deletes the folders created for shares
```

Full example, with the optional fields commented: [`examples/Virtumfile`](https://github.com/Marvinviverge/virtum/blob/develop/examples/Virtumfile). To go further: [Labs and the Virtumfile](./labs).
