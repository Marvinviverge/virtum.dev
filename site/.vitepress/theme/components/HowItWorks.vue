<script setup lang="ts">
// « Comment ça marche » : les étapes s'allument tour à tour, les VM apparaissent dans
// le réseau du lab, un test casse db, puis l'instantané ramène le lab à l'état connu.
// L'animation se joue une fois quand la section devient visible ; un bouton la rejoue.
// Si le système demande moins d'animations, l'état final est affiché directement.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  t: {
    eyebrow: string
    title: string
    steps: { tag: string; name: string }[]
    network: string
    planNote: string
    snapshot: { name: string; broken: string; back: string }
    replay: string
  }
}>()

const FINAL = 7
const STEP_START = [0, 1, 2, 4] // phase où chaque étape s'allume
const phase = ref(FINAL) // rendu serveur et mouvement réduit : état final
const animating = ref(false)
const root = ref<HTMLElement>()
let timer: ReturnType<typeof setInterval> | undefined
let observer: IntersectionObserver | undefined

const current = computed(() => {
  if (!animating.value) return -1
  let step = 0
  STEP_START.forEach((start, i) => {
    if (phase.value >= start) step = i
  })
  return step
})
const lit = (i: number) => phase.value >= STEP_START[i]
const dbBroken = computed(() => phase.value === 5)

function play() {
  clearInterval(timer)
  phase.value = 0
  animating.value = true
  timer = setInterval(() => {
    if (phase.value >= FINAL) {
      clearInterval(timer)
      animating.value = false
      return
    }
    phase.value++
  }, 1300)
}

const reducedMotion = ref(true)

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion.value || !root.value) return
  phase.value = 0
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer?.disconnect()
        play()
      }
    },
    { threshold: 0.4 },
  )
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  clearInterval(timer)
  observer?.disconnect()
})
</script>

<template>
  <section class="how" ref="root">
    <div class="vt-wrap inner">
      <div class="head">
        <p class="vt-eyebrow">{{ t.eyebrow }}</p>
        <h2 class="vt-h2">{{ t.title }}</h2>
      </div>

      <ol class="steps">
        <li v-for="(s, i) in t.steps" :key="s.tag" class="step" :class="{ lit: lit(i), active: current === i }">
          <p class="tag">{{ s.tag }}</p>
          <p class="name">{{ s.name }}</p>

          <pre v-if="i === 0" class="snippet">name: demo-lab
machines:
  web:
    os: debian-12
  db:
    os: ubuntu-24.04</pre>

          <pre v-else-if="i === 1" class="snippet">Machines :
  <span class="add">+ create</span>    db
  <span class="add">+ create</span>    web
<span class="dim"># {{ t.planNote }}</span></pre>

          <div v-else-if="i === 2" class="net">
            <p class="net-label">{{ t.network }} · virtum-lab-demo-lab</p>
            <div class="vms">
              <div class="vm" :class="{ on: phase >= 2 }">
                <span class="led" />web
              </div>
              <div class="vm" :class="{ on: phase >= 3, broken: dbBroken }">
                <span class="led" />db
              </div>
            </div>
          </div>

          <pre v-else class="snippet"><span :class="{ hide: phase < 4 }">create {{ t.snapshot.name }}</span>
<span class="dim" :class="{ hide: phase < 5 }">{{ t.snapshot.broken }}</span>
<span :class="{ hide: phase < 6 }">restore {{ t.snapshot.name }}</span>
<span class="add" :class="{ hide: phase < 6 }">{{ t.snapshot.back }}</span></pre>
        </li>
      </ol>

      <button v-if="!reducedMotion" type="button" class="replay" :disabled="animating" @click="play">
        {{ t.replay }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.how {
  background: var(--vt-soft);
  border-top: 1px solid var(--vt-border);
  border-bottom: 1px solid var(--vt-border);
}
.inner {
  padding-top: 88px;
  padding-bottom: 88px;
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
.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.step {
  margin: 0;
  background: #fff;
  border: 1px solid var(--vt-border);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0.45;
  transition: opacity 0.4s, border-color 0.4s, box-shadow 0.4s;
}
.step.lit {
  opacity: 1;
}
.step.active {
  border-color: var(--vt-accent);
  box-shadow: inset 3px 0 0 var(--vt-accent);
}
.tag {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vt-muted);
}
.name {
  margin: 0;
  font-weight: 600;
  font-size: 16px;
}
.snippet {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--vt-text-2);
  background: var(--vt-soft);
  border-radius: 6px;
  padding: 10px;
  overflow-x: auto;
}
.add {
  color: var(--vt-accent);
}
.dim {
  color: #9ca3af;
}
.hide {
  visibility: hidden;
}
.net {
  border: 1px dashed #9ca3af;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.net-label {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  color: var(--vt-muted);
}
.vms {
  display: flex;
  gap: 8px;
}
.vm {
  flex: 1 1 0;
  border-radius: 6px;
  background: var(--vt-term);
  color: var(--vt-term-text);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.4s, transform 0.4s;
}
.vm.on {
  opacity: 1;
  transform: none;
}
.led {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vt-term-green);
  transition: background 0.3s;
}
.vm.broken .led {
  background: var(--vt-term-red);
}
.replay {
  align-self: flex-start;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--vt-border-strong);
  border-radius: 8px;
  background: #fff;
  color: var(--vt-ink);
  font: 500 14px var(--vp-font-family-base);
  cursor: pointer;
}
.replay:disabled {
  color: var(--vt-muted);
  cursor: default;
}
@media (prefers-reduced-motion: reduce) {
  .step,
  .vm,
  .led {
    transition: none;
  }
}
</style>
