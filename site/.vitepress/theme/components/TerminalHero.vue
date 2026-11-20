<script setup lang="ts">
// Terminal animé de l'accueil : les lignes apparaissent l'une après l'autre (CSS).
// La sortie reprend le format réel de `virtum run` (messages de la CLI, en français).
defineProps<{ path: string; label: string }>()

// Chaque ligne : [délai en secondes, html]
const lines: [number, string][] = [
  [0.2, '<span class="vt-ok">$</span> virtum run --os debian-12 --name web'],
  [1.0, 'VM démarrée: vm-3f9c2a1b7d04'],
  [1.25, '<span class="vt-c">  Name:     </span>web'],
  [1.45, '<span class="vt-c">  OS:       </span>debian-12'],
  [1.65, '<span class="vt-c">  IP:       </span>192.168.122.45'],
  [1.85, '<span class="vt-c">  SSH:      </span>virtum shell web'],
  [2.7, '<span class="vt-ok">$</span> virtum shell web'],
]
</script>

<template>
  <div class="hero-term vt-term">
    <div class="bar">
      <span class="dot" /><span class="dot" /><span class="dot" />
      <span class="path">{{ path }}</span>
    </div>
    <div class="body" role="img" :aria-label="label">
      <div
        v-for="([delay, html], i) in lines"
        :key="i"
        class="line"
        :class="{ gap: i === 6 }"
        :style="{ animationDelay: delay + 's' }"
        v-html="html"
      />
      <div class="line" :style="{ animationDelay: '3.3s' }">
        <span class="host">virtum@web</span>:~$ <span class="caret" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-term {
  box-shadow: 0 24px 48px -24px rgba(15, 17, 21, 0.45);
}
.bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vt-term-line);
}
.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #3a414c;
}
.path {
  margin-left: 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vt-term-dim);
}
.body {
  padding: 20px 22px 26px;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.75;
  white-space: pre;
  overflow-x: auto;
}
.line {
  opacity: 0;
  animation: line-in 0.35s ease-out forwards;
}
.line.gap {
  padding-top: 10px;
}
.host {
  color: var(--vt-term-blue);
}
.caret {
  display: inline-block;
  width: 8px;
  height: 17px;
  vertical-align: -3px;
  background: var(--vt-term-text);
  animation: caret 1s step-end infinite;
}
@keyframes line-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes caret {
  50% {
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .line {
    opacity: 1;
    animation: none;
  }
  .caret {
    animation: none;
  }
}
@media (max-width: 640px) {
  .body {
    font-size: 12.5px;
  }
}
</style>
