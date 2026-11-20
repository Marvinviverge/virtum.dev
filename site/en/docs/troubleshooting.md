# Troubleshooting

Always start with `virtum doctor`: each failing check tells you what to fix. See [virtum doctor](./doctor). Virtum's messages are in French.

## `virtum doctor` reports KVM as failing

Virtum cannot read and write `/dev/kvm`. Check that KVM virtualization is enabled in the BIOS/UEFI, and that your account is in the `kvm` group (see below), then run `virtum doctor` again.

## The libvirt and kvm groups check fails

Your account must be a member of the `libvirt` and `kvm` groups:

```bash
sudo usermod -aG libvirt,kvm $USER
```

The change only applies to the next session: log out, then log in again.

## A tool is missing

`doctor` gives the package to install for each missing tool (`qemu-utils`, `libvirt-clients`, `cloud-image-utils`, `openssh-client`, `socat`, `virtiofsd`). With the archive, `sudo ./scripts/setup-host.sh` installs them on Debian and Ubuntu.

## `virtum`: command not found

With the archive, the binary is installed in `~/.local/bin`, which must be in your `PATH`. From source, `make install` installs it in `~/.cargo/bin`.

## Shared folders do not work

- On Ubuntu 22.04 and Debian 12, `virtiofsd` is not available as a separate package: shared folders are not supported there.
- If `doctor` reports "AppArmor virtiofs", AppArmor is blocking virtiofsd sockets under `/var/lib/virtum`; the failing line gives the fix.
- A `rw` share cannot contain the Virtumfile or the Ansible files, and shares cannot be nested: `virtum plan` reports these errors.

## `plan` or `up` refuses the subnet

The lab subnet overlaps an existing network. Pick another `subnet:` in the Virtumfile, or change the lab name if the subnet is derived from it. See [Networking and bridge](./networking).

## Bridging does not work

Wi-Fi is often incompatible with bridging: prefer an Ethernet interface, given with `--bridge-interface` or `bridge_interface:`. `virtum doctor` shows the recommended interface and warns if it is Wi-Fi.

## A port cannot be reached from another machine

By default, `ports:` only listen on `127.0.0.1`. For the local network, declare `bind: lan`, then run `virtum open` if the host uses ufw. See [Ports and LAN access](./ports).

## VM leftovers after a failure

`virtum doctor` lists, under "Restes orphelins" (orphaned leftovers), the libvirt domains and instance folders with no known VM, with the commands to clean them up. Check before deleting.

## A machine removed from the Virtumfile still exists

This is intended: `plan` reports it, `virtum apply --prune` deletes it.

## Reporting a bug

Open an issue on the [GitHub repository](https://github.com/Marvinviverge/virtum/issues) with the version (`virtum --version`) and the output of `virtum doctor`. For a security vulnerability, write to **security@virtum.dev** instead (see [Security](./security#reporting-a-vulnerability)).
