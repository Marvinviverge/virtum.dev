# Installation

Virtum installs on Linux x86_64 with KVM (virtualization enabled in the BIOS/UEFI). On Debian and Ubuntu, the `.deb` package also installs libvirt, QEMU and the tools Virtum needs.

::: warning Supported systems
Validated end to end on Ubuntu 24.04. The binary needs glibc 2.34 or newer: on Ubuntu 22.04 and Debian 12, the package installs, but `virtiofsd` is not available there as a separate package, so shared folders are not supported.
:::

From the [download page](/en/download) or the [releases page](https://github.com/Marvinviverge/virtum/releases), download `SHA256SUMS` and either the `.deb` package (Debian, Ubuntu) or the `.tar.gz` archive (other distributions).

## Debian / Ubuntu package

### 1. Install the package

```bash
sha256sum -c --ignore-missing SHA256SUMS    # the file has not been altered
sudo apt install ./virtum_*_amd64.deb       # also installs libvirt, QEMU, socat…
```

`apt` installs libvirt, QEMU, qemu-utils, cloud-image-utils, openssh-client and socat; `virtiofsd` and `bubblewrap` (shared folders) are recommended. The host setup scripts are installed in `/usr/share/virtum/`.

### 2. Prepare your account

Virtum drives the system libvirt (`qemu:///system`) under your own account: add it to the `libvirt` and `kvm` groups, then log in again. Then prepare the storage in `/var/lib/virtum`.

```bash
sudo usermod -aG libvirt,kvm $USER          # then log in again
sudo /usr/share/virtum/setup-var-lib.sh     # prepares /var/lib/virtum
```

### 3. Check the host

```console
$ virtum doctor
Virtum doctor

  [ok]   qemu-img
  [ok]   virsh
  [ok]   cloud-localds
  [ok]   ssh
  [ok]   socat
  [ok]   virtiofsd (/usr/libexec/virtiofsd)
  …
```

Every check must be `[ok]`. Otherwise, the failing line tells you what to fix: see [virtum doctor](./doctor). Virtum's messages are in French.

## Archive (other distributions)

```bash
sha256sum -c --ignore-missing SHA256SUMS
tar xzf virtum-*-x86_64-linux.tar.gz && cd virtum-*-x86_64-linux
sudo ./scripts/setup-host.sh                # once per machine: packages, libvirt, groups
install -D -m 755 virtum ~/.local/bin/virtum
sudo ./scripts/setup-var-lib.sh             # prepares /var/lib/virtum
virtum doctor
```

`~/.local/bin` must be in your `PATH`. After joining the `libvirt` and `kvm` groups, log in again.

On Debian and Ubuntu, `setup-host.sh` installs `qemu-kvm`, `libvirt-daemon-system`, `libvirt-clients`, `qemu-utils`, `cloud-image-utils`, `openssh-client`, `socat`, `virtiofsd`, `bubblewrap`. On another distribution, install their equivalents and add your account to the `libvirt` and `kvm` groups.

## From source

With [Rust](https://rustup.rs) installed, from a clone of the [repository](https://github.com/Marvinviverge/virtum):

```bash
sudo ./scripts/setup-host.sh
make install                  # builds and installs into ~/.cargo/bin
sudo ./scripts/setup-var-lib.sh
virtum doctor
```

## Verify provenance

Every release file is built by the repository's CI, with its checksums in `SHA256SUMS` and a provenance attestation. To check that a file really comes from that CI (GitHub CLI 2.49 or newer):

```bash
gh attestation verify <file> -R Marvinviverge/virtum
```

## Storage

Virtum uses the system libvirt (`qemu:///system`) and keeps images, instances, keys and state in `/var/lib/virtum` (prepared by `setup-var-lib.sh`), otherwise in `~/.virtum`.
