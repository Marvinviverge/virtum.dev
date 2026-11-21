# Virtumfile fields

The Virtumfile is a YAML file. Commented example: [`examples/Virtumfile`](https://github.com/Marvinviverge/virtum/blob/develop/examples/Virtumfile).

## Lab

| Field | Purpose |
| :--- | :--- |
| `name` | Lab name (required); network `virtum-lab-<name>` |
| `machines` | The machines, by name (required) |
| `subnet` | Lab subnet, `a.b.c.0/24`; otherwise derived from the name. See [Networking](./networking) |
| `network` | `lab` (default) or `bridge`, for every machine |
| `bridge_interface` | Host interface for bridging |
| `bind` | `local` (default, `127.0.0.1`) or `lan` for `ports:`. See [Ports](./ports) |
| `mounts` | Shared folders inherited by every machine. See [Shared folders](./shared-folders) |
| `ssh_port` | SSH port of the machines if they move it (falls back to 22) |
| `restart` | `no`, `always` or `unless-stopped`: start at host boot |
| `ansible` | Ansible section, below |

## Machine

| Field | Purpose |
| :--- | :--- |
| `os` | Image: `debian-12`, `ubuntu-24.04`, `ubuntu-26.04` (required) |
| `ram` | Memory in MB (default 2048) |
| `cpu` | Virtual CPUs (default 2) |
| `disk_size` | Disk size (`20G`) |
| `ports` | Forwards `"<host port>:<VM port>"` |
| `bind` | `local` or `lan`, overrides the lab's |
| `provision` | Shell commands run at first boot |
| `mounts` | Shared folders: `<host>:<guest>`, `:rw` suffix for write access |
| `network` | `lab` or `bridge`, overrides the lab's |
| `bridge_interface` | Host interface for bridging |
| `ip` | Fixed address on the lab network |
| `ssh_port` | SSH port, overrides the lab's |
| `restart` | Overrides the lab's |
| `groups` | Ansible inventory groups |

`apply` updates on existing VMs: `ram`, `cpu`, `bind`, `ports`, `disk_size`, `mounts`, `ssh_port`, `restart`, `ip`.

## `ansible` section

| Field | Purpose |
| :--- | :--- |
| `playbook` | Playbook, relative to the Virtumfile's folder (required) |
| `requirements` | Collections and roles to install with `ansible-galaxy` |
| `snapshot` | Snapshot taken after the first provisioning: a name, `true` (default, `provisioned`) or `false` |

## Validation

The Virtumfile is validated before use: names (lab, machines, groups, snapshots), host paths relative to and under the Virtumfile, guest paths under `/home/virtum`, no nested shares.

::: warning A Virtumfile is code
Running a stranger's Virtumfile or playbook amounts to running their code on your machine.
:::
