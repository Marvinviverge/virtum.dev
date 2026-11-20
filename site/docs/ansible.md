# Ansible

Virtum peut jouer un playbook Ansible sur les machines d'un lab, depuis l'hôte. Il faut `ansible-playbook` installé sur l'hôte (`virtum doctor` l'indique).

```yaml
ansible:
  playbook: ansible/site.yml
  requirements: ansible/requirements.yml   # optionnel

machines:
  web:
    os: debian-12
    groups: [front]
  db:
    os: ubuntu-24.04
    groups: [data]
```

- `playbook:` est relatif au dossier du Virtumfile.
- `requirements:` (optionnel) liste les collections et rôles à installer avec `ansible-galaxy`.
- `groups:` place chaque machine dans des groupes de l'inventaire.

## Au premier `up`

`virtum up` joue le playbook au premier déploiement, puis prend l'instantané de lab `provisioned`. Pour revenir à cet état :

```bash
virtum snapshot restore provisioned
```

`snapshot:` dans la section `ansible:` change ce comportement : un autre nom d'instantané, ou `false` pour ne pas en prendre.

## Rejouer le playbook

```bash
virtum provision                              # rejoue le playbook
virtum provision -- --tags init --limit web   # arguments passés à ansible-playbook
```

## L'inventaire

```bash
virtum inventory                       # INI, sur la sortie standard
virtum inventory --format yaml         # YAML
virtum inventory -o inventory.ini      # écrit dans un fichier
```

L'inventaire couvre les machines du lab en cours d'exécution, avec la clé SSH de chaque VM.

## Isolation

Le playbook tourne sur une **copie privée** de son dossier, d'où les partages inscriptibles sont exclus : rien de ce qu'une VM peut écrire n'est exécuté sur l'hôte.

::: warning Limite
Seul le dossier du playbook est copié. Un fichier chargé par chemin absolu, ou par `../` hors de ce dossier, n'est pas protégé par la copie. Voir [Sécurité](./securite#limites).
:::
