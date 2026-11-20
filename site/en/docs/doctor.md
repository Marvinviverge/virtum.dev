# virtum doctor

`virtum doctor` checks that the host is ready to run VMs. Run it after installing, and whenever a command fails for no clear reason.

```console
$ virtum doctor
Virtum doctor

  [ok]   qemu-img
  [ok]   virsh
  [ok]   cloud-localds
  [ok]   ssh
  [ok]   socat
  [ok]   virtiofsd (/usr/libexec/virtiofsd)
  [ok]   AppArmor virtiofs (Virtum) — …
  [ok]   KVM (/dev/kvm)
  [ok]   Groupes libvirt et kvm
  [ok]   Réseau libvirt « default »
  [ok]   Réseau bridge (LAN physique) — …
  [ok]   Stockage Virtum (libvirt système) — Répertoire actif : /var/lib/virtum
  [ok]   Images de base des VM — …
  [ok]   Restes orphelins — …
  [ok]   ansible-playbook — …

Toutes les vérifications ont réussi (15/15).
```

Every check must be `[ok]`. A failing line tells you what to fix, for example the package to install. Virtum's messages are in French.

## What is checked

| Check | What it verifies |
| :--- | :--- |
| `qemu-img`, `virsh`, `cloud-localds`, `ssh`, `socat` | The tools are installed (`qemu-utils`, `libvirt-clients`, `cloud-image-utils`, `openssh-client`, `socat`); `socat` is used by `ports:` |
| `virtiofsd` | Present, and able to enforce read-only shares |
| AppArmor virtiofs | AppArmor does not block virtiofsd sockets under `/var/lib/virtum` |
| KVM (`/dev/kvm`) | Hardware virtualization is available |
| Groupes libvirt et kvm | Your account is a member of the `libvirt` and `kvm` groups |
| Réseau libvirt « default » | The NAT network used by `virtum run` |
| Réseau bridge (LAN physique) | The recommended interface for bridging; warns if it is Wi-Fi |
| Stockage Virtum | The active directory (`/var/lib/virtum` or `~/.virtum`) |
| Images de base des VM | VM disks still find their base image |
| Restes orphelins | Leftover libvirt domains or instance folders with no known VM, with the commands to clean them up |
| `ansible-playbook` | Its version, or that it is missing; never blocking, it is only needed for the `ansible:` section |

The matching packages: [Installation](./installation). Common failures: [Troubleshooting](./troubleshooting).
