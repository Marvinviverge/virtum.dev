# First VM

One command starts a VM:

```bash
virtum run --os debian-12 --name web
```

The first use of an OS downloads its official cloud image; later runs start from the cache. To download an image ahead of time:

```bash
virtum pull ubuntu-24.04
```

Available images: `debian-12` (default), `ubuntu-24.04`, `ubuntu-26.04`.

## Choose the resources

```bash
virtum run --os ubuntu-24.04 --ram 4096 --cpu 2 --disk-size 20G
```

| Option | Purpose | Default |
| :--- | :--- | :--- |
| `--os` | OS image | `debian-12` |
| `--name` | Short, unique name used by the other commands | — |
| `--ram` | Memory in megabytes | `2048` |
| `--cpu` | Number of virtual CPUs | `2` |
| `--disk-size` | Disk size (`10G`, `20G`…) | image size |
| `--user` | Default login user (cloud-init) | `virtum` |
| `--hostname` | Guest hostname | `--name`, else the `vm-…` id |
| `--network` | `default` (libvirt NAT) or `bridge` (local network) | `default` |

Disks are copy-on-write on top of the base image. All options: [Commands](./commands#run).

## Use the VM

```bash
virtum ps                     # running VMs and their IP; -a for all
virtum shell web              # SSH session
virtum stop web               # graceful shutdown, forced after 30 s
virtum start web              # starts the same instance again
virtum destroy web            # deletes the VM and its local data
```

Commands take the VM's name (`--name`) or its `vm-…` id. `stop`, `start` and `destroy` take several.

## Next

For several machines on an isolated network, describe them in a Virtumfile: [First lab](./first-lab).
