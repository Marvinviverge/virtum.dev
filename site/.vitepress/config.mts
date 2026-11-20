import { defineConfig, type DefaultTheme } from 'vitepress'

const REPO = 'https://github.com/Marvinviverge/virtum'
const SITE_REPO = 'https://github.com/Marvinviverge/virtum.dev'

// Sommaire de la documentation, dans l'ordre de la maquette.
function sidebarFr(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Démarrer',
      items: [
        { text: 'Installation', link: '/docs/installation' },
        { text: 'Première VM', link: '/docs/premiere-vm' },
        { text: 'Premier lab', link: '/docs/premier-lab' },
        { text: 'virtum doctor', link: '/docs/doctor' },
      ],
    },
    {
      text: 'Guides',
      items: [
        { text: 'Labs et Virtumfile', link: '/docs/labs' },
        { text: 'Réseau et bridge', link: '/docs/reseau' },
        { text: 'Ports et accès LAN', link: '/docs/ports' },
        { text: 'Dossiers partagés', link: '/docs/partages' },
        { text: 'Ansible', link: '/docs/ansible' },
        { text: 'Instantanés', link: '/docs/instantanes' },
      ],
    },
    {
      text: 'Référence',
      items: [
        { text: 'Commandes', link: '/docs/commandes' },
        { text: 'Champs du Virtumfile', link: '/docs/virtumfile' },
        { text: 'Sécurité', link: '/docs/securite' },
        { text: 'Dépannage', link: '/docs/depannage' },
        { text: 'Changelog', link: '/docs/changelog' },
      ],
    },
  ]
}

function sidebarEn(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Get started',
      items: [
        { text: 'Installation', link: '/en/docs/installation' },
        { text: 'First VM', link: '/en/docs/first-vm' },
        { text: 'First lab', link: '/en/docs/first-lab' },
        { text: 'virtum doctor', link: '/en/docs/doctor' },
      ],
    },
    {
      text: 'Guides',
      items: [
        { text: 'Labs and the Virtumfile', link: '/en/docs/labs' },
        { text: 'Networking and bridge', link: '/en/docs/networking' },
        { text: 'Ports and LAN access', link: '/en/docs/ports' },
        { text: 'Shared folders', link: '/en/docs/shared-folders' },
        { text: 'Ansible', link: '/en/docs/ansible' },
        { text: 'Snapshots', link: '/en/docs/snapshots' },
      ],
    },
    {
      text: 'Reference',
      items: [
        { text: 'Commands', link: '/en/docs/commands' },
        { text: 'Virtumfile fields', link: '/en/docs/virtumfile' },
        { text: 'Security', link: '/en/docs/security' },
        { text: 'Troubleshooting', link: '/en/docs/troubleshooting' },
        { text: 'Changelog', link: '/en/docs/changelog' },
      ],
    },
  ]
}

export default defineConfig({
  title: 'Virtum',
  cleanUrls: true,
  appearance: false, // la maquette est claire uniquement
  lastUpdated: false,
  sitemap: { hostname: 'https://virtum.dev' },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#0F766E' }],
  ],

  markdown: {
    // Blocs de code sombres, comme les terminaux de la maquette.
    theme: { light: 'github-dark', dark: 'github-dark' },
  },

  locales: {
    root: {
      label: 'Français',
      lang: 'fr-FR',
      description:
        'Virtum lance des machines virtuelles et des labs multi-VM sur Linux, avec une expérience proche de Docker. Open source, Apache-2.0.',
      themeConfig: {
        nav: [
          { text: 'Documentation', link: '/docs/installation', activeMatch: '^/docs/' },
          { text: 'Télécharger', link: '/telecharger' },
          { text: 'Sécurité', link: '/#securite' },
        ],
        sidebar: { '/docs/': sidebarFr() },
        editLink: {
          pattern: `${SITE_REPO}/edit/develop/site/:path`,
          text: 'Modifier cette page sur GitHub',
        },
        outline: { level: [2, 3], label: 'Sur cette page' },
        docFooter: { prev: 'Précédent', next: 'Suivant' },
        footer: {
          message:
            'Logiciel open source sous licence Apache-2.0 · <a href="mailto:security@virtum.dev">security@virtum.dev</a> · <a href="/mentions-legales">Mentions légales</a>',
        },
        langMenuLabel: 'Changer de langue',
        returnToTopLabel: 'Retour en haut',
        sidebarMenuLabel: 'Sommaire',
        darkModeSwitchLabel: 'Apparence',
        skipToContentLabel: 'Aller au contenu',
        notFound: {
          title: 'PAGE INTROUVABLE',
          quote: "Cette page n'existe pas, ou plus.",
          linkLabel: "Retour à l'accueil",
          linkText: "Retour à l'accueil",
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      description:
        'Virtum runs virtual machines and multi-VM labs on Linux, with a Docker-like experience. Open source, Apache-2.0.',
      themeConfig: {
        nav: [
          { text: 'Docs', link: '/en/docs/installation', activeMatch: '^/en/docs/' },
          { text: 'Download', link: '/en/download' },
          { text: 'Security', link: '/en/#security' },
        ],
        sidebar: { '/en/docs/': sidebarEn() },
        editLink: {
          pattern: `${SITE_REPO}/edit/develop/site/:path`,
          text: 'Edit this page on GitHub',
        },
        outline: { level: [2, 3], label: 'On this page' },
        footer: {
          message:
            'Open source software under the Apache-2.0 license · <a href="mailto:security@virtum.dev">security@virtum.dev</a> · <a href="/en/legal">Legal notice</a>',
        },
      },
    },
  },

  themeConfig: {
    logo: { src: '/logo.svg', alt: '' },
    siteTitle: 'virtum',
    socialLinks: [{ icon: 'github', link: REPO, ariaLabel: 'GitHub' }],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Rechercher', buttonAriaLabel: 'Rechercher dans la documentation' },
              modal: {
                displayDetails: 'Afficher le détail',
                resetButtonTitle: 'Effacer la recherche',
                backButtonTitle: 'Fermer la recherche',
                noResultsText: 'Aucun résultat pour',
                footer: {
                  selectText: 'choisir',
                  selectKeyAriaLabel: 'Entrée',
                  navigateText: 'naviguer',
                  navigateUpKeyAriaLabel: 'flèche haut',
                  navigateDownKeyAriaLabel: 'flèche bas',
                  closeText: 'fermer',
                  closeKeyAriaLabel: 'Échap',
                },
              },
            },
          },
        },
      },
    },
  },
})
