# Networking and bridge

## The lab network

Each lab has its own **isolated libvirt network**, `virtum-lab-<name>`. Machines in a lab can reach each other; they do not see the machines of another lab.

```yaml
name: exercise
subnet: 10.42.0.0/24           # lab subnet

machines:
  target:
    os: debian-12
    ip: 10.42.0.10             # fixed address
  attacker:
    os: ubuntu-24.04
    ip: 10.42.0.20
```

- `subnet:` sets the lab subnet (`a.b.c.0/24`); without it, the subnet is derived from the lab name. `plan` and `up` refuse a subnet that overlaps an existing network.
- `ip:` gives a machine a fixed address (DHCP reservation on the lab network); without it, the address comes from DHCP.

## A single VM

`virtum run` puts the VM on the libvirt `default` network (NAT, `192.168.122.x`). `virtum ps` shows its address.

## Bridge: the VM on the local network

In bridge mode (macvtap), the VM sits directly on the local network, with its own address, like a physical machine.

```bash
virtum run --os debian-12 --name web --network bridge
virtum run --network bridge --bridge-interface enp2s0   # pick the host interface
```

In a Virtumfile, `network: bridge` applies to the whole lab, or to a single machine:

```yaml
name: hybrid
machines:
  gateway:
    os: debian-12
    network: bridge            # on the local network
  internal:
    os: debian-12              # private lab network
```

A lab can mix bridged and private machines. `bridge_interface:` picks the host interface; otherwise, Virtum uses the one of the default route, shown by `virtum doctor`.

::: warning Ethernet recommended
Wi-Fi is often incompatible with bridging. `virtum doctor` warns when the recommended interface is Wi-Fi.
:::

::: warning Security
A bridged VM can be reached by every machine on the local network. Virtum filters nothing there: the VM's firewall and services are up to the guest. When the VM does not need to be seen from the local network, prefer the lab network with [local ports](./ports). See [Security](./security#limits).
:::
