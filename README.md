# virtum.dev

Le site de [Virtum](https://github.com/Marvinviverge/virtum) : https://virtum.dev

Site statique construit avec [VitePress](https://vitepress.dev) : accueil et page de téléchargement en composants Vue (`site/.vitepress/theme/components/`), documentation en Markdown, en français (`site/docs/`) et en anglais (`site/en/docs/`). Aucun traqueur, aucune requête vers un tiers : les polices sont servies par le site.

## Développer

Avec Node.js 22 :

```bash
npm ci --ignore-scripts
npm run dev        # http://localhost:5173
npm run build      # site/.vitepress/dist ; échoue sur un lien mort
```

`npm audit` signale des failles de Vite 5 et d'esbuild qui ne concernent que le serveur de développement (VitePress 1.6.4 n'a pas de version corrigée) : le site publié est du HTML statique. Garder `npm run dev` sur `localhost`, son réglage par défaut.

## Organisation

| Chemin | Contenu |
| :--- | :--- |
| `site/.vitepress/config.mts` | Navigation, sommaire, langues, recherche |
| `site/.vitepress/theme/release.ts` | Version affichée et liens de téléchargement : à mettre à jour à chaque release |
| `site/.vitepress/theme/content.ts` | Textes de l'accueil et du téléchargement (FR, EN) |
| `site/.vitepress/theme/components/` | Accueil, terminal animé, « Comment ça marche », exemples, téléchargement |
| `site/docs/`, `site/en/docs/` | Documentation |

La documentation reprend le README, `SECURITY.md`, `CHANGELOG.md` et `virtum --help` du dépôt de Virtum : quand ils changent, mettre le site à jour.

## Publication

`develop` reçoit les PR ; une PR `develop` → `main` publie le site sur GitHub Pages (`.github/workflows/deploy.yml`).

## Licence

[Apache 2.0](./LICENSE).
