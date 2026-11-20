// Thème par défaut de VitePress, sans ses polices : Inter et JetBrains Mono sont
// servies par le site lui-même (paquets Fontsource), aucune requête vers un tiers.
import DefaultTheme from 'vitepress/theme-without-fonts'
import type { Theme } from 'vitepress'

import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './style.css'

import HomePage from './components/HomePage.vue'
import DownloadPage from './components/DownloadPage.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('DownloadPage', DownloadPage)
  },
} satisfies Theme
