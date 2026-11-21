<script setup lang="ts">
// Accueil (mise en page libre), en français ou en anglais selon `lang`.
import { computed } from 'vue'
import { home, type Lang } from '../content'
import { VERSION, DEB } from '../release'
import TerminalHero from './TerminalHero.vue'
import HowItWorks from './HowItWorks.vue'
import UseCases from './UseCases.vue'

const props = defineProps<{ lang: Lang }>()
const t = computed(() => home[props.lang])
const securityId = computed(() => (props.lang === 'fr' ? 'securite' : 'security'))
</script>

<template>
  <div class="vt-page">
    <!-- Hero -->
    <section class="vt-wrap hero">
      <div class="hero-text">
        <a :href="t.links.download" class="badge"><span class="pulse" />{{ t.badge(VERSION) }}</a>
        <h1>{{ t.title[0] }}<br />{{ t.title[1] }}</h1>
        <p class="lead">{{ t.lead }}</p>
        <div class="actions">
          <a :href="t.links.download" class="vt-btn vt-btn-dark">{{ t.install }}</a>
          <a :href="t.links.docs" class="vt-btn vt-btn-line">{{ t.readDocs }}</a>
        </div>
        <p class="meta">{{ t.meta }}</p>
      </div>
      <TerminalHero class="hero-term" :path="t.terminal.path" :label="t.terminal.label" />
    </section>

    <HowItWorks :t="t.how" />

    <!-- Fonctions -->
    <section class="vt-wrap block">
      <div class="head">
        <p class="vt-eyebrow">{{ t.features.eyebrow }}</p>
        <h2 class="vt-h2">{{ t.features.title }}</h2>
      </div>
      <div class="features">
        <div v-for="f in t.features.items" :key="f.title" class="feature">
          <h3>{{ f.title }}</h3>
          <p v-html="f.html" />
        </div>
      </div>
    </section>

    <!-- Sécurité -->
    <section :id="securityId" class="security">
      <div class="vt-wrap security-inner">
        <div class="security-text">
          <p class="vt-eyebrow green">{{ t.security.eyebrow }}</p>
          <h2 class="vt-h2">{{ t.security.title }}</h2>
          <p class="security-lead">{{ t.security.lead }}</p>
          <a :href="t.links.security" class="security-link">{{ t.security.link }}</a>
        </div>
        <div class="security-grid">
          <div v-for="s in t.security.items" :key="s.title" class="security-card">
            <h3>{{ s.title }}</h3>
            <p>{{ s.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <UseCases :t="t.cases" />

    <!-- FAQ -->
    <section class="vt-wrap faq">
      <h2 class="faq-title">{{ t.faq.title }}</h2>
      <div class="faq-list">
        <details v-for="f in t.faq.items" :key="f.q">
          <summary>{{ f.q }}</summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </section>

    <!-- Appel final -->
    <section class="vt-wrap cta-wrap">
      <div class="cta">
        <div class="cta-text">
          <h2>{{ t.cta.title }}</h2>
          <p>sudo apt install ./{{ DEB }}</p>
        </div>
        <a :href="t.links.download" class="vt-btn vt-btn-light">{{ t.cta.button }}</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding-top: 96px;
  padding-bottom: 88px;
  display: flex;
  flex-wrap: wrap;
  gap: 56px;
  align-items: center;
}
.hero-text {
  flex: 1 1 440px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.hero-term {
  flex: 1 1 520px;
  min-width: 0;
}
.vt-page a.badge {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--vt-border);
  border-radius: 999px;
  font-size: 13px;
  color: var(--vt-text-2);
  text-decoration: none;
}
.vt-page a.badge:hover {
  border-color: var(--vt-border-strong);
}
.pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vt-accent);
  animation: pulse 2.4s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 1;
  }
}
h1 {
  margin: 0;
  font-size: 60px;
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-weight: 700;
}
.lead {
  margin: 0;
  font-size: 19px;
  line-height: 1.6;
  color: var(--vt-text-3);
  max-width: 520px;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 8px;
}
.meta {
  margin: 0;
  font-size: 13px;
  color: var(--vt-muted);
  font-family: var(--vp-font-family-mono);
}

.block {
  padding-top: 96px;
  padding-bottom: 96px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}
.head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 640px;
}
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1px;
  background: var(--vt-border);
  border: 1px solid var(--vt-border);
  border-radius: 12px;
  overflow: hidden;
}
.feature {
  background: #fff;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.feature h3 {
  margin: 0;
  font-size: 17px;
}
.feature p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--vt-text-3);
}
.feature :deep(code) {
  font-size: 13px;
}

.security {
  background: var(--vt-term);
  color: var(--vt-term-text);
  scroll-margin-top: var(--vp-nav-height);
}
.security-inner {
  padding-top: 96px;
  padding-bottom: 96px;
  display: flex;
  flex-wrap: wrap;
  gap: 56px;
}
.security-text {
  flex: 1 1 360px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.vt-eyebrow.green {
  color: var(--vt-term-green);
}
.security-lead {
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: #b1bac4;
}
.vt-page a.security-link,
.vt-page a.security-link:hover {
  align-self: flex-start;
  color: var(--vt-term-blue);
  font-size: 15px;
}
.security-grid {
  flex: 2 1 560px;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.security-card {
  border: 1px solid #262d38;
  border-radius: 10px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.security-card h3 {
  margin: 0;
  font-size: 16px;
}
.security-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #b1bac4;
}

.faq {
  padding-top: 96px;
  padding-bottom: 96px;
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
}
.faq-title {
  flex: 1 1 320px;
  min-width: 0;
  margin: 0;
  font-size: 32px;
  letter-spacing: -0.025em;
}
.faq-list {
  flex: 2 1 560px;
  min-width: 0;
  border-top: 1px solid var(--vt-border);
}
details {
  border-bottom: 1px solid var(--vt-border);
  padding: 18px 0;
}
summary {
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  min-height: 28px;
}
details p {
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--vt-text-3);
}

.cta-wrap {
  padding-bottom: 96px;
}
.cta {
  border-radius: 14px;
  background: var(--vt-term);
  color: var(--vt-term-text);
  padding: 48px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.cta-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.cta h2 {
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.02em;
}
.cta p {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: #b1bac4;
  overflow-wrap: anywhere;
}

@media (max-width: 640px) {
  .hero {
    padding-top: 56px;
    padding-bottom: 56px;
  }
  h1 {
    font-size: 42px;
  }
  .lead {
    font-size: 17px;
  }
  .block,
  .security-inner,
  .faq {
    padding-top: 64px;
    padding-bottom: 64px;
  }
  .cta {
    padding: 28px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .pulse {
    animation: none;
    opacity: 1;
  }
}
</style>
