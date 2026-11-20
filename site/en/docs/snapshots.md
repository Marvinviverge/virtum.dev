# Snapshots

A snapshot freezes the disk of a VM or of a whole lab, to return to it later.

```bash
virtum snapshot create before-test         # the whole lab
virtum snapshot create before-test web db  # only web and db
virtum snapshot restore before-test
virtum snapshot ls
virtum snapshot rm before-test
```

Without a VM name, the command applies to the whole lab described by `./Virtumfile` (or `-f`). A snapshot name contains letters, digits, `-` and `_`.

## Cold snapshots

Snapshots are taken cold: running VMs are stopped during the operation, then restarted. `--no-restart` leaves them stopped.

## With Ansible

After the first provisioning, `virtum up` takes the `provisioned` lab snapshot: `virtum snapshot restore provisioned` brings the lab back to the provisioned state. See [Ansible](./ansible).

## Removed machines

`virtum apply --prune` deletes a machine removed from the Virtumfile together with its snapshots; `virtum plan` shows how many would be lost.
