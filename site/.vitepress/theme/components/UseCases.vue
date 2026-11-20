<script setup lang="ts">
// « Exemples concrets » : quatre scénarios ; cliquer (ou flèches haut/bas) affiche
// le Virtumfile et les commandes du scénario choisi.
import { ref } from 'vue'

const props = defineProps<{
  t: {
    eyebrow: string
    title: string
    label: string
    items: { title: string; lead: string; file: string; tag: string; code: string; outcome: string }[]
  }
}>()

const picked = ref(0)
const tabs = ref<HTMLButtonElement[]>([])

function onKey(e: KeyboardEvent) {
  const n = props.t.items.length
  let next = picked.value
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (next + 1) % n
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (next - 1 + n) % n
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = n - 1
  else return
  e.preventDefault()
  picked.value = next
  tabs.value[next]?.focus()
}
</script>

<template>
  <section class="vt-wrap cases">
    <div class="head">
      <p class="vt-eyebrow">{{ t.eyebrow }}</p>
      <h2 class="vt-h2">{{ t.title }}</h2>
    </div>
    <div class="layout">
      <div role="tablist" :aria-label="t.label" aria-orientation="vertical" class="list" @keydown="onKey">
        <button
          v-for="(c, i) in t.items"
          :key="c.title"
          ref="tabs"
          type="button"
          role="tab"
          :id="`case-tab-${i}`"
          :aria-selected="i === picked"
          aria-controls="case-panel"
          :tabindex="i === picked ? 0 : -1"
          class="tab"
          :class="{ on: i === picked }"
          @click="picked = i"
        >
          <span class="tab-title">{{ c.title }}</span>
          <span class="tab-lead">{{ c.lead }}</span>
        </button>
      </div>
      <div id="case-panel" role="tabpanel" :aria-labelledby="`case-tab-${picked}`" class="panel vt-term">
        <div class="panel-bar">
          <span>{{ t.items[picked].file }}</span><span>{{ t.items[picked].tag }}</span>
        </div>
        <pre tabindex="0">{{ t.items[picked].code }}</pre>
        <p class="outcome">{{ t.items[picked].outcome }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cases {
  padding-top: 96px;
  padding-bottom: 96px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 680px;
}
.layout {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: stretch;
}
.list {
  flex: 1 1 320px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tab {
  text-align: left;
  width: 100%;
  min-height: 44px;
  padding: 16px 18px;
  border-radius: 10px;
  border: 1px solid var(--vt-border);
  background: #fff;
  cursor: pointer;
  font: inherit;
}
.tab:hover {
  border-color: var(--vt-border-strong);
}
.tab.on {
  border-color: var(--vt-accent);
  box-shadow: inset 3px 0 0 var(--vt-accent);
}
.tab-title {
  display: block;
  font-weight: 600;
  font-size: 16px;
  color: var(--vt-ink);
}
.tab-lead {
  display: block;
  margin-top: 4px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--vt-text-3);
}
.panel {
  flex: 2 1 560px;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.panel-bar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--vt-term-line);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vt-term-dim);
}
.panel pre {
  flex: 1 1 auto;
  white-space: pre;
}
.outcome {
  margin: 0;
  padding: 16px 22px;
  border-top: 1px solid var(--vt-term-line);
  font-size: 14px;
  line-height: 1.6;
  color: #b1bac4;
}
</style>
