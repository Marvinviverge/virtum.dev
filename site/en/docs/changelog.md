---
outline: [2, 2]
---

# Changelog

Versions follow [semantic versioning](https://semver.org/). Translated from [CHANGELOG.md](https://github.com/Marvinviverge/virtum/blob/develop/CHANGELOG.md), in French.

## [1.1.0] - 2026-11-20

### Added

- **Debian package** `virtum_<version>_amd64.deb` in every release, with its own checksum in `SHA256SUMS` and its provenance attestation. `apt` installs libvirt, QEMU, qemu-utils, cloud-image-utils, openssh-client and socat; `virtiofsd` and `bubblewrap` (shared folders) are recommended. The host setup scripts are installed in `/usr/share/virtum/`.
- README and contributing guide in English.

### Changed

- Release binary without debug symbols: about 8 MB.

### Platforms

Package installed and checked on Ubuntu 24.04. On Ubuntu 22.04 and Debian 12, its dependencies resolve, but `virtiofsd` is not available there as a separate package: shared folders are not supported there.

## [1.0.0] - 2026-11-17

First published version. Virtum runs local KVM VMs and multi-VM labs described in a `Virtumfile`, on libvirt (`qemu:///system`).

### Features

- Single VMs: `run`, `ps`, `shell`, `stop`, `start`, `destroy`, `pull`, `doctor`. Debian 12, Ubuntu 24.04 and Ubuntu 26.04 images, downloaded and verified by checksum.
- Labs: `up`, `down`, `plan`, `apply [--prune]`, parallel creation, isolated network per lab, declarable `subnet:` and `ip:`.
- Networking: local ports (`ports:`), confirmed LAN exposure (`bind: lan`, `open` / `close`), bridge NIC (macvtap) and hybrid labs.
- Host ↔ VM shared folders (virtiofs), **read-only by default** (explicit `rw`).
- Built-in Ansible: `groups:`, `virtum inventory`, `ansible:` section run by `up`, `virtum provision`.
- VM or lab snapshots (`snapshot`), `ssh_port`, restart at host boot (`restart:`).

### Security

Threat model, guarantees G1 to G7 and limits: [Security](./security). Four security audits were carried out before this version; every confirmed finding is fixed.

- Read-only shares enforced on the host; a `rw` share cannot contain the Virtumfile, the playbook or the `requirements` file, and shares cannot be nested.
- Ansible runs from a private copy of the playbook folder, without the writable shares.
- SSH host key pinned per VM (`HostKeyAlias`).
- Marked libvirt resources: Virtum does not touch the domains and networks of another Virtum.
- State files written without following symbolic links.
- Dependencies checked in CI (`cargo audit`, `cargo deny`), no unmaintained crate; release binary shipped with `SHA256SUMS` and a GitHub provenance attestation.

### Platforms

Linux x86_64 with KVM, libvirt, virtiofsd and bubblewrap. Tested on Ubuntu 24.04; the binary needs glibc 2.34 or newer (Debian 12, Ubuntu 22.04 and later, not yet validated end to end).

### License

Apache-2.0.
