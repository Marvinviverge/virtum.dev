# Installation

Virtum s'installe sur Linux x86_64 avec KVM (virtualisation activée dans le BIOS/UEFI). Sur Debian et Ubuntu, le paquet `.deb` installe aussi libvirt, QEMU et les outils dont Virtum a besoin.

::: warning Systèmes pris en charge
Validé de bout en bout sur Ubuntu 24.04. Le binaire demande glibc 2.34 ou plus récente : sur Ubuntu 22.04 et Debian 12, le paquet s'installe, mais `virtiofsd` n'y existe pas en paquet séparé, et les dossiers partagés n'y sont pas pris en charge.
:::

Sur la [page de téléchargement](/telecharger) ou la [page des releases](https://github.com/Marvinviverge/virtum/releases), téléchargez `SHA256SUMS` et le paquet `.deb` (Debian, Ubuntu) ou l'archive `.tar.gz` (autres distributions).

## Paquet Debian / Ubuntu

### 1. Installer le paquet

```bash
sha256sum -c --ignore-missing SHA256SUMS    # le fichier n'a pas été altéré
sudo apt install ./virtum_*_amd64.deb       # installe aussi libvirt, QEMU, socat…
```

`apt` installe libvirt, QEMU, qemu-utils, cloud-image-utils, openssh-client et socat ; `virtiofsd` et `bubblewrap` (dossiers partagés) sont recommandés. Les scripts de préparation de l'hôte sont installés dans `/usr/share/virtum/`.

### 2. Préparer votre compte

Virtum pilote libvirt système (`qemu:///system`) sous votre compte : ajoutez-le aux groupes `libvirt` et `kvm`, puis reconnectez votre session. Préparez ensuite le stockage dans `/var/lib/virtum`.

```bash
sudo usermod -aG libvirt,kvm $USER          # puis reconnectez votre session
sudo /usr/share/virtum/setup-var-lib.sh     # prépare /var/lib/virtum
```

### 3. Vérifier l'hôte

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

Tous les contrôles doivent être `[ok]`. Sinon, la ligne en échec indique quoi corriger : voir [virtum doctor](./doctor).

## Archive (autres distributions)

```bash
sha256sum -c --ignore-missing SHA256SUMS
tar xzf virtum-*-x86_64-linux.tar.gz && cd virtum-*-x86_64-linux
sudo ./scripts/setup-host.sh                # une fois par machine : paquets, libvirt, groupes
install -D -m 755 virtum ~/.local/bin/virtum
sudo ./scripts/setup-var-lib.sh             # prépare /var/lib/virtum
virtum doctor
```

`~/.local/bin` doit être dans votre `PATH`. Après l'ajout aux groupes `libvirt` et `kvm`, reconnectez votre session.

`setup-host.sh` installe, sur Debian et Ubuntu : `qemu-kvm`, `libvirt-daemon-system`, `libvirt-clients`, `qemu-utils`, `cloud-image-utils`, `openssh-client`, `socat`, `virtiofsd`, `bubblewrap`. Sur une autre distribution, installez leurs équivalents et ajoutez votre compte aux groupes `libvirt` et `kvm`.

## Depuis les sources

Avec [Rust](https://rustup.rs) installé, depuis un clone du [dépôt](https://github.com/Marvinviverge/virtum) :

```bash
sudo ./scripts/setup-host.sh
make install                  # compile et installe dans ~/.cargo/bin
sudo ./scripts/setup-var-lib.sh
virtum doctor
```

## Vérifier la provenance

Chaque fichier de release est construit par la CI du dépôt, avec ses empreintes dans `SHA256SUMS` et une attestation de provenance. Pour vérifier qu'un fichier vient bien de cette CI (GitHub CLI 2.49 ou plus récent) :

```bash
gh attestation verify <fichier> -R Marvinviverge/virtum
```

## Stockage

Virtum utilise libvirt système (`qemu:///system`) et range images, instances, clés et état dans `/var/lib/virtum` (préparé par `setup-var-lib.sh`), sinon dans `~/.virtum`.
