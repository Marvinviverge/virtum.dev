# Shared folders

A host folder can be shared with a VM, through virtiofs.

```yaml
machines:
  web:
    os: debian-12
    mounts:
      - ./src:~/src             # read-only (default)
      - ./out:~/out:rw          # the VM can write
```

The format is `<host folder>:<folder in the VM>`, followed by `:rw` to allow writes. `mounts:` is declared for a machine or for the whole lab (inherited by every machine).

::: warning Supported systems
Shared folders need `virtiofsd` and `bubblewrap`. On Ubuntu 22.04 and Debian 12, `virtiofsd` is not available as a separate package: shared folders are not supported there.
:::

## Rules

- **Read-only by default**, enforced on the host (`virtiofsd --readonly`, or virtiofsd under bubblewrap with the folder mounted read-only).
- The host folder is relative to the Virtumfile and must sit under it; the guest folder must sit under `/home/virtum`.
- A `rw` share cannot contain the Virtumfile, the Ansible playbook or its `requirements` file.
- Shares cannot be nested, including across labs.

## Deleting the folders

```bash
virtum down --destroy --purge     # also deletes the folders created for shares
virtum destroy web --purge        # for a single VM
```

::: warning Writable shares
The VM can write anything into a `rw` share. Do not run on the host what it drops there, and do not put a folder the host reads into it (a Git repository with hooks, a tool's configuration…). See [Security](./security#limits).
:::
