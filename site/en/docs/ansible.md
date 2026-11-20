# Ansible

Virtum can run an Ansible playbook against the machines of a lab, from the host. `ansible-playbook` must be installed on the host (`virtum doctor` tells you).

```yaml
ansible:
  playbook: ansible/site.yml
  requirements: ansible/requirements.yml   # optional

machines:
  web:
    os: debian-12
    groups: [front]
  db:
    os: ubuntu-24.04
    groups: [data]
```

- `playbook:` is relative to the Virtumfile's folder.
- `requirements:` (optional) lists the collections and roles to install with `ansible-galaxy`.
- `groups:` puts each machine into inventory groups.

## On the first `up`

`virtum up` runs the playbook on the first deployment, then takes the `provisioned` lab snapshot. To return to that state:

```bash
virtum snapshot restore provisioned
```

`snapshot:` in the `ansible:` section changes this: another snapshot name, or `false` to take none.

## Running the playbook again

```bash
virtum provision                              # runs the playbook again
virtum provision -- --tags init --limit web   # arguments passed to ansible-playbook
```

## The inventory

```bash
virtum inventory                       # INI, on standard output
virtum inventory --format yaml         # YAML
virtum inventory -o inventory.ini      # writes to a file
```

The inventory covers the lab's running machines, with each VM's SSH key.

## Isolation

The playbook runs from a **private copy** of its folder, from which writable shares are excluded: nothing a VM can write is run on the host.

::: warning Limit
Only the playbook folder is copied. A file loaded by absolute path, or through `../` outside that folder, is not protected by the copy. See [Security](./security#limits).
:::
