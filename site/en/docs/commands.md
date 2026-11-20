# Commands

`virtum <command> --help` details every option. Lab commands read `./Virtumfile`, or the file given with `-f, --file`.

| Command | Purpose |
| :--- | :--- |
| [`doctor`](#doctor) | Checks that the host is ready (KVM, libvirt, groups, storage, tools) |
| [`run`](#run), [`ps`](#ps), [`shell`](#shell), [`stop`](#stop), [`start`](#start), [`destroy`](#destroy) | VM lifecycle |
| [`pull`](#pull) | Downloads an OS image into the cache |
| [`plan`](#plan), [`up`](#up), [`apply`](#apply), [`down`](#down) | Lifecycle of a lab described by a Virtumfile |
| [`snapshot`](#snapshot) `create\|restore\|ls\|rm` | Snapshots of a VM or a whole lab |
| [`inventory`](#inventory), [`provision`](#provision) | The lab's Ansible inventory and playbook |
| [`open`](#open-close), [`close`](#open-close) | Host firewall (ufw) for ports exposed to the local network |

## Single VMs

### doctor

Checks that the host is ready to run VMs. See [virtum doctor](./doctor).

### run

Launches a headless VM.

| Option | Purpose |
| :--- | :--- |
| `--os <OS>` | Image: `debian-12` (default), `ubuntu-24.04`, `ubuntu-26.04` |
| `--name <NAME>` | Short name for the other commands (`virtum shell db`); must be unique |
| `--ram <RAM>` | Memory in megabytes (default 2048) |
| `--cpu <CPU>` | Virtual CPUs (default 2) |
| `--disk-size <SIZE>` | Root disk size (`10G`, `20G`…); grown at first boot by cloud-init |
| `--user <USER>` | Default login user, created by cloud-init (default `virtum`) |
| `--hostname <HOSTNAME>` | Guest hostname; defaults to `--name`, else the `vm-…` id |
| `--network <NETWORK>` | `default` (libvirt NAT, `192.168.122.x`) or `bridge` (local network, macvtap) |
| `--bridge-interface <IF>` | Host interface for `--network bridge` (else the one of the default route) |
| `--insecure-ssh` | Disables the VM's SSH host key check |

### ps

Lists running VMs (alias: `list`). `-a, --all` also shows stopped VMs.

### shell

`virtum shell <VM>` opens an SSH session on a running VM, given by its name or its `vm-…` id. Option: `--insecure-ssh`.

### stop

`virtum stop <VM>...` shuts down one or more VMs: graceful shutdown, then forced after 30 seconds.

### start

`virtum start <VM>...` starts one or more stopped VMs: same instances, no re-provisioning.

### destroy

`virtum destroy <VM>...` removes one or more VMs and their local data. `--purge` also deletes the host `mounts:` folders.

### pull

`virtum pull <OS>` downloads and caches a cloud image, without starting a VM.

## Labs

### plan

Shows what `up` would do (create, resume, updates, warnings), without changing anything. See [Reading a plan](./labs#reading-a-plan).

### up

Deploys every machine of the Virtumfile.

| Option | Purpose |
| :--- | :--- |
| `-f, --file <FILE>` | Path to the Virtumfile |
| `--parallel <N>` | Machines created or resumed at the same time (default 4; 1 = one after the other) |
| `--yes-lan` | Confirms `bind: lan` without a prompt (scripts, CI) |
| `--insecure-ssh` | Disables SSH host key checks |

### apply

Applies Virtumfile changes to the lab's existing VMs: RAM, CPU, `bind`, `ports`, `disk_size`, `mounts`, `ssh_port`, `restart`, `ip`.

| Option | Purpose |
| :--- | :--- |
| `-f, --file <FILE>` | Path to the Virtumfile |
| `--prune` | Also deletes lab machines missing from the Virtumfile (VM, disk, snapshots) |
| `-y, --yes` | With `--prune`: no confirmation prompt (scripts, CI) |
| `--yes-lan` | Confirms the `bind: lan` exposure without a prompt |
| `--insecure-ssh` | Disables SSH host key checks |

### down

Stops every VM of the lab. `--destroy` deletes them with their data; with `--destroy`, `--purge` also deletes the folders declared in `mounts:`.

## Snapshots

### snapshot

| Command | Purpose |
| :--- | :--- |
| `snapshot create <NAME> [VM]...` | Takes a snapshot (running VMs are stopped, then restarted) |
| `snapshot restore <NAME> [VM]...` | Returns the VMs to the snapshot |
| `snapshot ls [VM]...` | Lists snapshots |
| `snapshot rm <NAME> [VM]...` | Deletes a snapshot |

Without a VM, the command applies to the whole lab. Options: `-f, --file`, and `--no-restart` (except `ls`) to leave the VMs stopped. See [Snapshots](./snapshots).

## Ansible

### inventory

Prints an Ansible inventory of the lab's running machines.

| Option | Purpose |
| :--- | :--- |
| `--format <ini\|yaml>` | Format (default `ini`) |
| `-o, --output <FILE>` | Writes to a file instead of standard output |
| `--insecure-ssh` | Inventory without SSH host key checks |

### provision

Runs the playbook of the `ansible:` section again. Arguments after `--` go to `ansible-playbook`: `virtum provision -- --tags init --limit web`.

## Firewall

### open, close {#open-close}

`virtum open` opens the host firewall (ufw) for the Virtumfile's `bind: lan` ports; `virtum close` removes the rules added by `open`. See [Ports and LAN access](./ports).
