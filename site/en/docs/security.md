---
outline: [2, 2]
---

# Security

This page describes who Virtum protects against, what it guarantees, and what it cannot guarantee. Each guarantee is tied to the code that enforces it and to the tests that check it: a regression must make a test fail.

::: info
Translated from [SECURITY.md](https://github.com/Marvinviverge/virtum/blob/develop/SECURITY.md), the reference version, in French.
:::

## Threat model

Virtum is a CLI run by a user of the host. It drives `qemu:///system` (the system libvirt), and runs `virtiofsd`, `socat`, `ssh` and `ansible-playbook` as that user.

| Actor | What they control | Trust |
| :--- | :--- | :--- |
| **A VM's guest** (main adversary) | Everything running in the VM, as root: its DHCP replies (hostname, client-id), the guest agent, ARP, its SSH key, the content of the shares it is given write access to | None |
| **Another VM on the lab network** | Traffic on the lab network, its own DHCP leases | None |
| **A machine on the local network** (bridged VM, or `ports:` with `bind: lan`) | LAN traffic: it reaches a bridged VM directly, and can answer in its place on the LAN | None |
| **Another Unix account on the host**, outside the `libvirt` and `kvm` groups | Its own files | None |
| **The Virtumfile and the playbook** | What Virtum creates, and the Ansible code run on the host | Full: this is the user's code |
| **The user, root, members of the `libvirt` and `kvm` groups, libvirt, QEMU, the kernel** | Everything | Full |

**Intended use: a single-user development workstation.** Accounts in the `libvirt` and `kvm` groups are trusted, because access to `qemu:///system` is almost root (see Limits). The network is not: guests, other VMs and, as soon as a VM is bridged or a port is opened on the LAN, the machines of the local network are adversaries.

Virtum still tells its objects apart from those of another Virtum on the same libvirt (G3), so as never to stop or delete one by mistake.

## Guarantees

| # | Guarantee | Where |
| :--- | :--- | :--- |
| **G1** | Nothing a guest can modify is run on the host. Shares are **read-only by default**, enforced on the host (`virtiofsd --readonly`, or virtiofsd under bubblewrap with the folder mounted read-only). `ansible-playbook` runs from a **private copy** of the playbook folder, from which writable (`rw`) shares are excluded; a link leading out of it to a folder containing a `rw` share is refused. A `rw` share cannot contain the Virtumfile, the playbook, the `requirements` file, or a local source it references. Shares cannot be nested, including between labs of the same state. | `mounts.rs` (`start_virtiofsd`), `ansible.rs` (`snapshot_project`), `virtumfile.rs` (`ensure_host_code_outside_shares`) |
| **G2** | What the guest provides is not used to identify it. DHCP leases are read by column (MAC, IP); hostname and client-id are ignored. The SSH host key is **pinned per VM** (`HostKeyAlias=<VM id>`, the instance's `known_hosts`): another VM that gets the IP presents a different key and the connection is refused. | `libvirt.rs` (`parse_dhcp_lease_line`), `ssh.rs` (`SshSessionOpts`) |
| **G3** | Virtum only touches its own resources. Domains and networks carry an owner marker (libvirt metadata); an object marked by another Virtum is never started, stopped, redefined or deleted. An object without a marker is only touched if it uses the instance's disk. A signal is only sent to a process of the user whose command line matches. | `ownership.rs`, `libvirt.rs` (`refuse_foreign_domain`), `lab_network.rs`, `procs.rs` |
| **G4** | State files do not follow symbolic links: atomic write (`O_EXCL \| O_NOFOLLOW` then `rename`), and reading back only a regular file owned by the user. Private key in 0600, key directory in 0700. The root of a share is closed to other accounts (a guest can create a setuid executable of the user there). | `fsutil.rs`, `ssh.rs`, `mounts.rs` (`restrict_share_root`) |
| **G5** | The Virtumfile is validated before use: names (lab, machines, volumes, groups, snapshots), host paths relative to and under the Virtumfile, guest paths under `/home/virtum`, no nested shares. Values passed to `virsh`, `ssh` and cloud-init are passed as separate arguments, without a shell. | `virtumfile.rs`, `mounts.rs`, `cloud_init.rs` |
| **G6** | Each lab has its own isolated libvirt network (`virtum-lab-<name>`). `ports:` only listen on `127.0.0.1`, unless `bind: lan` is explicit (and confirmed). | `lab_network.rs`, `port_forward.rs` |
| **G7** | No secret is displayed or written to logs: the private key is never read by Virtum, only passed to `ssh` by path. | `ssh.rs` |

## Limits

What Virtum does not protect against, and what to do instead:

- **Access to `qemu:///system` is almost root.** Membership of the `libvirt` group lets you create a VM that mounts any disk of the host. Only put trusted accounts in that group.
- **A Virtumfile is code.** Running a stranger's Virtumfile or playbook amounts to running their code on your machine.
- **`rw` share**: the VM can write anything into it. Do not run on the host what it drops there, and do not put a folder the host reads into a `rw` share (a Git repository with hooks, a tool's configuration…).
- **Ansible**: only the playbook folder is copied. A file loaded by absolute path, or through `../` outside that folder, is not protected by the copy (a `../` fails; an absolute path to a `rw` share would be read as is).
- **Shares created before read-only by default**: the virtiofsd already running stays writable until `virtum destroy` then `virtum up`.
- **Bridged VM**: it sits on the LAN like a physical machine, and every machine on the network can reach it. Virtum filters nothing there: the VM's firewall and services are up to the guest. Prefer a lab network with local `ports:` when the VM does not need to be seen from the LAN.
- **First SSH contact**: a new VM's host key is recorded on the first connection (trust on first use). Another VM of the lab, or a LAN machine for a bridged VM, that answered in its place at that exact moment would be pinned instead.
- **SSH keys pinned before `HostKeyAlias`**: the first connection to an existing VM after the update records its key (trust on first use).
- **`--insecure-ssh`** disables host key checking. Reserved for trusted scripts.
- **virtiofsd always runs with `--sandbox=none`**, with or without `uidmap`: it is not confined to the shared folder, and a virtiofsd flaw would give the user's rights. Read-only access is still enforced (`--readonly` or bubblewrap).
- **Flaws in QEMU, libvirt, virtiofsd, the kernel or the cloud images**: out of Virtum's reach. Keep the host and the images up to date (`virtum pull`).

## Reporting a vulnerability

Write to **security@virtum.dev**, or open a private report (security advisory) on the [GitHub repository](https://github.com/Marvinviverge/virtum/security/advisories/new), with the steps to reproduce and the affected version (`virtum --version`). Do not publish exploitation details before the fix.
