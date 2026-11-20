# Labs and the Virtumfile

A lab is a set of machines described in a YAML file, the `Virtumfile`. Each lab has its own isolated libvirt network, `virtum-lab-<name>`: machines in a lab can reach each other.

```yaml
name: demo-lab

machines:
  web:
    os: debian-12
    ram: 2048
    cpu: 2
    disk_size: 20G
    ports:
      - "18098:80"         # host 127.0.0.1:18098 → port 80 of the VM
    provision:
      - apt-get update
      - apt-get install -y nginx

  db:
    os: ubuntu-24.04
    ram: 1024
    cpu: 1
```

All fields: [Virtumfile fields](./virtumfile).

## The lifecycle

| Command | Purpose |
| :--- | :--- |
| `virtum plan` | Shows what will be created, resumed or changed, without touching anything |
| `virtum up` | Creates missing machines and restarts stopped ones |
| `virtum apply` | Applies Virtumfile changes to existing VMs |
| `virtum down` | Stops the lab; `--destroy` deletes it |

Each command reads `./Virtumfile`, or the file given with `-f`.

## Reading a plan

`virtum plan` lists each machine with the planned action:

| Symbol | Action |
| :--- | :--- |
| `+ create` | The machine will be created |
| `~ resume` | The machine exists but is not running: `up` will resume it |
| `~ update` | A field changed: `apply` will update the VM |
| `= unchanged` | Nothing to do |
| `- remove` | The machine is no longer in the Virtumfile: `apply --prune` will delete it |

The plan also shows the lab network, warnings, and the errors that would block `virtum up` (for example a subnet that overlaps an existing network).

## Changing an existing lab

`virtum apply` updates existing VMs: RAM, CPU, `bind`, `ports`, `disk_size`, `mounts`, `ssh_port`, `restart`, `ip`.

Removing a machine from the Virtumfile does not delete it: `plan` reports it, and `apply --prune` deletes it, with its disk and snapshots (asks for confirmation, `-y` to skip it in a script).

## Parallel creation

`virtum up` creates or resumes 4 machines at a time by default. `--parallel 1` handles them one after the other.

## Stopping and deleting

```bash
virtum down                    # stops every VM of the lab
virtum down --destroy          # deletes the VMs and their data
virtum down --destroy --purge  # also deletes the folders created for shares
```

## Starting with the host

`restart:` sets whether VMs start when the host boots, as in Docker Compose: `no`, `always` or `unless-stopped`. Declared at lab level, it applies to every machine; a machine can override it. With `unless-stopped`, a VM stopped with `virtum stop` is not started at boot.
