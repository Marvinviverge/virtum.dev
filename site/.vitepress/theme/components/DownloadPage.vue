<script setup lang="ts">
// Page de téléchargement : onglets .deb / .tar.gz, commandes reprises des README.
import { computed, ref } from 'vue'
import { download, type Lang } from '../content'
import {
  VERSION, DEB, TARBALL, TARBALL_DIR, DEB_URL, TARBALL_URL, SUMS_URL, RELEASES, RELEASE_TAG, REPO,
} from '../release'

const props = defineProps<{ lang: Lang }>()
const t = computed(() => download[props.lang])
const method = ref<'deb' | 'tar'>('deb')

const debCommands = computed(() => [
  'sha256sum -c --ignore-missing SHA256SUMS',
  `sudo apt install ./${DEB}`,
  'sudo usermod -aG libvirt,kvm $USER',
  'sudo /usr/share/virtum/setup-var-lib.sh\nvirtum doctor',
])
const tarCommands = computed(() => [
  'sha256sum -c --ignore-missing SHA256SUMS',
  `tar xzf ${TARBALL} && cd ${TARBALL_DIR}`,
  'sudo ./scripts/setup-host.sh',
  'install -D -m 755 virtum ~/.local/bin/virtum',
  'sudo ./scripts/setup-var-lib.sh',
  'virtum doctor',
])

function onKey(e: KeyboardEvent) {
  if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
    e.preventDefault()
    method.value = method.value === 'deb' ? 'tar' : 'deb'
    document.getElementById(`tab-${method.value}`)?.focus()
  }
}
</script>

<template>
  <div class="vt-page">
    <div class="dl">
      <div class="intro">
        <h1>{{ t.title }}</h1>
        <p>
          {{ t.version }} <strong>{{ VERSION }}</strong> · Linux x86_64 ·
          <a :href="RELEASE_TAG">{{ t.notes }}</a> · <a :href="RELEASES">{{ t.all }}</a>
        </p>
      </div>

      <div class="method">
        <div role="tablist" :aria-label="t.tabsLabel" class="tabs" @keydown="onKey">
          <button
            id="tab-deb" type="button" role="tab" aria-controls="panel-deb"
            :aria-selected="method === 'deb'" :tabindex="method === 'deb' ? 0 : -1"
            :class="{ on: method === 'deb' }" @click="method = 'deb'"
          >{{ t.tabDeb }}</button>
          <button
            id="tab-tar" type="button" role="tab" aria-controls="panel-tar"
            :aria-selected="method === 'tar'" :tabindex="method === 'tar' ? 0 : -1"
            :class="{ on: method === 'tar' }" @click="method = 'tar'"
          >{{ t.tabTar }}</button>
        </div>

        <div v-show="method === 'deb'" id="panel-deb" role="tabpanel" aria-labelledby="tab-deb" class="card">
          <div class="card-head">
            <div class="file">
              <p class="name">{{ DEB }}</p>
              <p class="note">{{ t.debNote }}</p>
            </div>
            <div class="buttons">
              <a :href="DEB_URL" class="vt-btn vt-btn-dark">{{ t.getDeb }}</a>
              <a :href="SUMS_URL" class="vt-btn vt-btn-line">SHA256SUMS</a>
            </div>
          </div>
          <div class="vt-term flat">
            <pre tabindex="0"><template v-for="(cmd, i) in debCommands" :key="i"><span class="vt-c">{{ t.debSteps[i] }}</span>
{{ cmd }}
</template></pre>
          </div>
        </div>

        <div v-show="method === 'tar'" id="panel-tar" role="tabpanel" aria-labelledby="tab-tar" class="card">
          <div class="card-head">
            <div class="file">
              <p class="name">{{ TARBALL }}</p>
              <p class="note">{{ t.tarNote }}</p>
            </div>
            <div class="buttons">
              <a :href="TARBALL_URL" class="vt-btn vt-btn-dark">{{ t.getTar }}</a>
              <a :href="SUMS_URL" class="vt-btn vt-btn-line">SHA256SUMS</a>
            </div>
          </div>
          <div class="vt-term flat">
            <pre tabindex="0"><template v-for="(cmd, i) in tarCommands" :key="i">{{ cmd }}<span v-if="t.tarComments[i]" class="vt-c">    {{ t.tarComments[i] }}</span>
</template></pre>
          </div>
        </div>
      </div>

      <div class="cards">
        <div class="small">
          <h2>{{ t.req.title }}</h2>
          <p>{{ t.req.text }}</p>
        </div>
        <div class="small">
          <h2>{{ t.prov.title }}</h2>
          <p>{{ t.prov.text }}</p>
          <code class="cmd">{{ t.prov.cmd }}</code>
        </div>
        <div class="small">
          <h2>{{ t.src.title }}</h2>
          <p v-html="t.src.html" />
          <a :href="REPO">{{ t.src.link }}</a>
        </div>
      </div>

      <div class="next">
        <h2>{{ t.next.title }}</h2>
        <p v-html="t.next.html" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dl {
  max-width: 960px;
  margin: 0 auto;
  padding: 72px 24px 96px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}
.intro {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
h1 {
  margin: 0;
  font-size: 44px;
  line-height: 1.1;
  letter-spacing: -0.03em;
}
.intro p {
  margin: 0;
  font-size: 17px;
  line-height: 1.6;
  color: var(--vt-text-3);
}
.intro strong {
  color: var(--vt-ink);
}
.method {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  background: #f3f4f6;
  border-radius: 10px;
  align-self: flex-start;
}
.tabs button {
  min-height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--vt-text-3);
  font: 500 14px var(--vp-font-family-base);
  cursor: pointer;
}
.tabs button.on {
  background: #fff;
  color: var(--vt-ink);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(15, 17, 21, 0.12);
}
.card {
  border: 1px solid var(--vt-border);
  border-radius: 12px;
  overflow: hidden;
}
.card-head {
  padding: 20px 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--vt-border);
}
.file {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.name {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 15px;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.note {
  margin: 0;
  font-size: 13px;
  color: var(--vt-muted);
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.buttons .vt-btn {
  min-height: 44px;
  font-size: 14px;
}
.vt-term.flat {
  border-radius: 0;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.small {
  border: 1px solid var(--vt-border);
  border-radius: 10px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.small h2 {
  margin: 0;
  font-size: 16px;
}
.small p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vt-text-3);
}
.small a {
  font-size: 14px;
}
.cmd {
  font-size: 12px;
  background: var(--vt-soft);
  border-radius: 6px;
  padding: 8px 10px;
  overflow-x: auto;
  white-space: nowrap;
}
.next {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.next h2 {
  margin: 0;
  font-size: 22px;
}
.next p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--vt-text-3);
}
@media (max-width: 640px) {
  .dl {
    padding-top: 48px;
  }
  h1 {
    font-size: 34px;
  }
}
</style>
